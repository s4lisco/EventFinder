// backend/src/mail/mail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: Number(process.env.SMTP_PORT) || 1025,
      secure: process.env.SMTP_SECURE === 'true',
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASSWORD
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD,
            }
          : undefined,
    });
  }

  async sendVerificationEmail(
    to: string,
    name: string,
    token: string,
  ): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verifyUrl = `${frontendUrl}/organizers/verify?token=${token}`;
    const from = process.env.SMTP_FROM || 'noreply@regivo.de';

    const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>E-Mail-Adresse bestätigen</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px 32px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }
    .body { padding: 40px 32px; }
    .body p { color: #374151; line-height: 1.6; margin: 0 0 16px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 8px 0 24px; }
    .footer { padding: 24px 32px; border-top: 1px solid #e5e7eb; text-align: center; }
    .footer p { color: #9ca3af; font-size: 12px; margin: 0; }
    .link { color: #6366f1; word-break: break-all; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Regivo</h1>
      <p>Regionale Events entdecken &amp; bewerben</p>
    </div>
    <div class="body">
      <p>Hallo <strong>${name}</strong>,</p>
      <p>vielen Dank für Ihre Registrierung als Veranstalter bei Regivo! Bitte bestätigen Sie Ihre E-Mail-Adresse, um Ihr Konto zu aktivieren.</p>
      <p style="text-align:center;">
        <a href="${verifyUrl}" class="btn">E-Mail-Adresse bestätigen</a>
      </p>
      <p>Falls der Button nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:</p>
      <p><a href="${verifyUrl}" class="link">${verifyUrl}</a></p>
      <p>Der Link ist <strong>24 Stunden</strong> gültig.</p>
    </div>
    <div class="footer">
      <p>Falls Sie sich nicht bei Regivo registriert haben, können Sie diese E-Mail ignorieren.</p>
    </div>
  </div>
</body>
</html>`;

    try {
      await this.transporter.sendMail({
        from,
        to,
        subject: 'Bitte bestätigen Sie Ihre E-Mail-Adresse – Regivo',
        html,
      });
      this.logger.log(`Verification email sent to ${to}`);
    } catch (err) {
      this.logger.error(`Failed to send verification email to ${to}`, err);
      throw err;
    }
  }
}
