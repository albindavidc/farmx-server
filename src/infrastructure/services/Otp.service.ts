import { injectable } from "inversify";
import nodemailer, { Transporter } from "nodemailer";
import winston from "winston";
import { EmailService } from "../../domain/interfaces/repositories/email.service";
import { configBrevo } from "../config/ConfigSetup";

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
}

@injectable()
export class EmailServiceImpl implements EmailService {
  private transporter: Transporter;
  private logger: winston.Logger;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: configBrevo.BREVO.SMTP_SERVER, // Use Brevo SMTP server
      port: configBrevo.BREVO.PORT, // Use Brevo port (587)
      secure: false, // Non-secure for port 587 (TLS will be handled by Nodemailer)   // Non-secure connection (adjust based on Gmail requirements)
      auth: {
        user: configBrevo.BREVO.LOGIN,
        pass: configBrevo.BREVO.PASSWORD, // Use APP_PASSWORD from .env, fallback to Brevo password
      },
    });

    this.logger = winston.createLogger({
      level: "error",
      format: winston.format.json(),
      transports: [new winston.transports.File({ filename: "error.log" })],
    });
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    const mailOptions: MailOptions = {
      from: configBrevo.EMAIL_FROM,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
      html: `
        <html>
          <body>
            <h2>Hi there!</h2>
            <p>We received a request to verify your account. To complete the verification, your OTP is provided below.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <h1>OTP: ${otp}</h1>
            <p style="margin-top: 20px; font-size: 12px; color: #777;">This email was sent from your account at <strong>code-sphere</strong>.</p>
          </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`OTP email sent to ${email} ${otp}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${email}:`, { error: error instanceof Error ? error.message : error });
      throw new Error(`Failed to send OTP email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default EmailServiceImpl;