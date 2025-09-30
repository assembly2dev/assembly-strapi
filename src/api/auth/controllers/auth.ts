

export default ({ strapi }) => ({
  async login(ctx) {
    const validation = strapi.service('api::auth.validation') as any;
    try { await validation.schemas.loginSchema.validate(ctx.request.body); } catch { return ctx.badRequest('Invalid credentials'); }
    const { identifier, password } = ctx.request.body;
    const user = await strapi.query('plugin::users-permissions.user').findOne({ where: { $or: [{ email: identifier.toLowerCase() }, { username: identifier }] } });
    const genericError = () => ctx.badRequest('Invalid credentials');
    if (!user) return genericError();
    const isValid = await strapi.plugin('users-permissions').service('user').validatePassword(password, user.password);
    if (!isValid) {
      await strapi.query('plugin::users-permissions.user').update({ where: { id: user.id }, data: { failedLoginCount: (user.failedLoginCount || 0) + 1 } });
      return genericError();
    }
    if (user.confirmed === false) return ctx.send({ emailVerificationRequired: true });
    if (user.twoFactorEnabled) {
      const tokenService = strapi.service('api::auth.token') as any;
      const { token } = await tokenService.signOneTimeToken(user.id, 'twofa_challenge', 5);
      return ctx.send({ requires2fa: true, challengeId: token });
    }
    const jwt = await strapi.plugin('users-permissions').service('jwt').issue({ id: user.id });
    await strapi.query('plugin::users-permissions.user').update({ where: { id: user.id }, data: { lastLoginAt: new Date(), failedLoginCount: 0 } });
    const sanitized = await strapi.plugin('users-permissions').service('user').sanitizeOutput(user);
    return ctx.send({ jwt, user: sanitized });
  },

  async verify2fa(ctx) {
    const validation = strapi.service('api::auth.validation') as any;
    try { await validation.schemas.verify2FASchema.validate(ctx.request.body); } catch { return ctx.badRequest('Invalid request'); }
    const { challengeId, code } = ctx.request.body;
    const tokenService = strapi.service('api::auth.token') as any;
    const result = await tokenService.verifyOneTimeToken(challengeId, 'twofa_challenge');
    if (!result.valid) return ctx.badRequest('Invalid code');
    const user = await strapi.query('plugin::users-permissions.user').findOne({ where: { id: result.userId } });
    if (!user) return ctx.badRequest('Invalid code');
    if (user.twoFactorMethod === 'totp') {
      const twofa = strapi.service('api::auth.twofa') as any;
      const ok = await twofa.confirmTotp(user.id, code);
      if (!ok) return ctx.badRequest('Invalid code');
    }
    await tokenService.consumeToken(result.record.id);
    const jwt = await strapi.plugin('users-permissions').service('jwt').issue({ id: user.id });
    await strapi.query('plugin::users-permissions.user').update({ where: { id: user.id }, data: { lastLoginAt: new Date(), failedLoginCount: 0 } });
    const sanitized = await strapi.plugin('users-permissions').service('user').sanitizeOutput(user);
    return ctx.send({ jwt, user: sanitized });
  },

  async signUp(ctx) {
    const validation = strapi.service('api::auth.validation') as any;
    try { await validation.schemas.signUpSchema.validate(ctx.request.body); } catch { return ctx.badRequest('Invalid sign-up data'); }
    const { email, username, password } = ctx.request.body;
    const existing = await strapi.query('plugin::users-permissions.user').findOne({ where: { email: email.toLowerCase() } });
    if (existing) return ctx.badRequest('Invalid sign-up data');
    const user = await strapi.plugin('users-permissions').service('user').add({ email: email.toLowerCase(), username: username || email, password, confirmed: false });
    const tokenSvc = strapi.service('api::auth.token') as any;
    const emailSvc = strapi.service('api::auth.email') as any;
    const ttl = Number(process.env.EMAIL_VERIFICATION_TTL_MINUTES || 60);
    const { token } = await tokenSvc.signOneTimeToken(user.id, 'email_verification', ttl);
    await emailSvc.sendVerificationEmail(user.email, token, ttl);
    ctx.status = 201;
    return ctx.send({ emailVerificationSent: true });
  },

  async verifyEmail(ctx) {
    const validation = strapi.service('api::auth.validation') as any;
    try { await validation.schemas.verifyEmailSchema.validate(ctx.request.body); } catch { return ctx.badRequest('Invalid token'); }
    const { token } = ctx.request.body;
    const tokenSvc = strapi.service('api::auth.token') as any;
    const res = await tokenSvc.verifyOneTimeToken(token, 'email_verification');
    if (!res.valid) return ctx.badRequest('Invalid token');
    await strapi.query('plugin::users-permissions.user').update({ where: { id: res.userId }, data: { confirmed: true, emailConfirmedAt: new Date() } });
    await tokenSvc.consumeToken(res.record.id);
    if (process.env.AUTO_LOGIN_AFTER_VERIFY === 'true') {
      const jwt = await strapi.plugin('users-permissions').service('jwt').issue({ id: res.userId });
      const user = await strapi.query('plugin::users-permissions.user').findOne({ where: { id: res.userId } });
      const sanitized = await strapi.plugin('users-permissions').service('user').sanitizeOutput(user);
      return ctx.send({ jwt, user: sanitized });
    }
    return ctx.send({ ok: true });
  },

  async retrievePassword(ctx) {
    const validation = strapi.service('api::auth.validation') as any;
    try { await validation.schemas.retrievePasswordSchema.validate(ctx.request.body); } catch { return ctx.send({ ok: true }); }
    const { email } = ctx.request.body;
    const user = await strapi.query('plugin::users-permissions.user').findOne({ where: { email: email.toLowerCase() } });
    if (user) {
      const tokenSvc = strapi.service('api::auth.token') as any;
      const emailSvc = strapi.service('api::auth.email') as any;
      const ttl = Number(process.env.PASSWORD_RESET_TTL_MINUTES || 30);
      const { token } = await tokenSvc.signOneTimeToken(user.id, 'password_reset', ttl);
      await emailSvc.sendPasswordResetEmail(user.email, token, ttl);
    }
    return ctx.send({ ok: true });
  },

  async resetPassword(ctx) {
    const validation = strapi.service('api::auth.validation') as any;
    try { await validation.schemas.resetPasswordSchema.validate(ctx.request.body); } catch { return ctx.badRequest('Invalid request'); }
    const { token, password } = ctx.request.body;
    const tokenSvc = strapi.service('api::auth.token') as any;
    const res = await tokenSvc.verifyOneTimeToken(token, 'password_reset');
    if (!res.valid) return ctx.badRequest('Invalid token');
    await strapi.plugin('users-permissions').service('user').edit(res.userId, { password });
    await tokenSvc.consumeToken(res.record.id);
    try { await strapi.service('api::auth.session').deactivateAllUserSessions(res.userId); } catch {}
    return ctx.send({ ok: true });
  },

  async twofaInit(ctx) {
    const userId = ctx.state.user.id;
    const twofa = strapi.service('api::auth.twofa') as any;
    const data = await twofa.initTotp(userId);
    return ctx.send(data);
  },

  async twofaConfirm(ctx) {
    const userId = ctx.state.user.id;
    const { code } = ctx.request.body;
    const twofa = strapi.service('api::auth.twofa') as any;
    const ok = await twofa.confirmTotp(userId, code);
    if (!ok) return ctx.badRequest('Invalid code');
    return ctx.send({ ok: true });
  },

  async twofaDisable(ctx) {
    const userId = ctx.state.user.id;
    await (strapi.service('api::auth.twofa') as any).disable(userId);
    return ctx.send({ ok: true });
  },

  async logout(ctx) {
    try {
      const { sessionToken } = ctx.request.body;
      const userId = ctx.state.user.id;

      if (sessionToken) {
        // Deactivate session
        await strapi.query('user-session').update({
          where: { sessionToken, userId },
          data: { isActive: false }
        });
      }

      // Log logout
      await strapi.query('auth-log').create({
        data: {
          userId,
          action: 'logout',
          ipAddress: ctx.request.ip,
          userAgent: ctx.request.headers['user-agent'],
          success: true
        }
      });

      return ctx.send({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      strapi.log.error('Error during logout:', error);
      return ctx.internalServerError('Failed to logout');
    }
  },

  async getProfile(ctx) {
    try {
      const userId = ctx.state.user.id;
      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { id: userId }
      });

      if (!user) {
        return ctx.notFound('User not found');
      }

      const sanitizedUser = strapi.plugins['users-permissions'].services.user.sanitizeUser(user);

      return ctx.send({
        success: true,
        user: sanitizedUser
      });
    } catch (error) {
      strapi.log.error('Error getting profile:', error);
      return ctx.internalServerError('Failed to get profile');
    }
  }
});
