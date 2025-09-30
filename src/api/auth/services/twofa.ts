import speakeasy from 'speakeasy';

export default ({ strapi }) => ({
  async initTotp(userId: number) {
    const secret = speakeasy.generateSecret({ length: 20, name: 'Assembly' });
    await strapi.query('plugin::users-permissions.user').update({
      where: { id: userId },
      data: { twoFactorSecret: secret.base32 }
    });
    return { secret: secret.base32, otpauthUrl: secret.otpauth_url };
  },

  async confirmTotp(userId: number, code: string) {
    const user = await strapi.query('plugin::users-permissions.user').findOne({ where: { id: userId } });
    if (!user?.twoFactorSecret) return false;
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 1
    });
    if (verified) {
      await strapi.query('plugin::users-permissions.user').update({
        where: { id: userId },
        data: { twoFactorEnabled: true, twoFactorMethod: 'totp' }
      });
    }
    return verified;
  },

  async disable(userId: number) {
    await strapi.query('plugin::users-permissions.user').update({
      where: { id: userId },
      data: { twoFactorEnabled: false, twoFactorMethod: null, twoFactorSecret: null }
    });
  }
});


