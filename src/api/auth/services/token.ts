import jwt from 'jsonwebtoken';

type TokenType = 'email_verification' | 'password_reset' | 'twofa_challenge';

interface SignedTokenPayload {
  userId: number;
  type: TokenType;
  jti: string;
}

export default ({ strapi }) => ({
  async signOneTimeToken(userId: number, type: TokenType, ttlMinutes: number, metadata?: Record<string, unknown>) {
    const secret = process.env.APP_KEYS?.split(',')[0] || 'changeme';
    const jti = `${type}_${userId}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const payload: SignedTokenPayload = { userId, type, jti };
    const token = jwt.sign(payload, secret, { expiresIn: `${ttlMinutes}m` });

    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
    await strapi.query('api::auth-token.auth-token').create({
      data: { userId, type, token, expiresAt, metadata }
    });

    return { token, jti, expiresAt };
  },

  async verifyOneTimeToken(token: string, expectedType: TokenType) {
    const secret = process.env.APP_KEYS?.split(',')[0] || 'changeme';
    try {
      const decoded = jwt.verify(token, secret) as SignedTokenPayload;
      if (decoded.type !== expectedType) {
        return { valid: false };
      }

      const record = await strapi.query('api::auth-token.auth-token').findOne({
        where: { token, type: expectedType }
      });
      if (!record || record.usedAt) return { valid: false };
      if (new Date(record.expiresAt) < new Date()) return { valid: false };

      return { valid: true, userId: record.userId, jti: decoded.jti, record };
    } catch {
      return { valid: false };
    }
  },

  async consumeToken(recordId: number) {
    await strapi.query('api::auth-token.auth-token').update({
      where: { id: recordId },
      data: { usedAt: new Date() }
    });
  }
});


