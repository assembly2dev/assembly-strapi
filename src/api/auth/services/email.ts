import * as sendgrid from '@sendgrid/mail';

export default ({ strapi }) => ({
  async sendVerificationEmail(email: string, token: string, ttlMinutes: number) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const link = `${frontendUrl}/verify-email?token=${encodeURIComponent(token)}`;
    const html = await this.renderTemplate('verification.html', { link, ttlMinutes });
    await this.sendMail({ to: email, subject: 'Verify your email', html });
  },

  async sendPasswordResetEmail(email: string, token: string, ttlMinutes: number) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const link = `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;
    const html = await this.renderTemplate('reset-password.html', { link, ttlMinutes });
    await this.sendMail({ to: email, subject: 'Reset your password', html });
  },

  async sendMail(opts: { to: string; subject: string; html: string }) {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) throw new Error('Missing SENDGRID_API_KEY');
    sendgrid.setApiKey(apiKey);
    await sendgrid.send({
      to: opts.to,
      from: process.env.EMAIL_FROM || 'no-reply@example.com',
      subject: opts.subject,
      html: opts.html,
      replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM || 'no-reply@example.com',
    });
  },

  async renderTemplate(name: string, vars: Record<string, unknown>) {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    const filePath = path.join(process.cwd(), 'src', 'emails', name);
    const raw = await fs.readFile(filePath, 'utf8');
    return raw.replace(/\{\{(\w+)\}\}/g, (_, key) => String(vars[key] ?? ''));
  }
});


