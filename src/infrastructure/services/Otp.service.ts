import { inject, injectable } from "inversify";
import nodemailer, { Transporter } from "nodemailer";
import { Logger } from "winston";
import { IEmailRepository } from "@domain/interfaces/email-repository.interface.js";
import { TYPES } from "@presentation/container/types.js";

interface IMailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
}

interface IEmailConfig {
  smtpServer: string;
  port: number;
  secure: boolean;
  login: string;
  password: string;
  fromAddress: string;
}

@injectable()
export class EmailServiceImpl implements IEmailRepository {
  private transporter: Transporter;

  constructor(
    @inject(TYPES.EmailConfig) private config: IEmailConfig,
    @inject(TYPES.Logger) private logger: Logger
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.config.smtpServer,
      port: this.config.port,
      secure: this.config.secure,
      auth: {
        user: this.config.login,
        pass: this.config.password,
      },
    });
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    const mailOptions: IMailOptions = {
      from: this.config.fromAddress,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
      html: this.buildOtpEmailTemplate(otp),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.info(`OTP email sent successfully`, { recipient: email });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      this.logger.error(`Failed to send OTP email`, {
        recipient: email,
        error: errorMessage,
      });

      // Don't expose internal details to caller
      throw new Error("Failed to send verification email. Please try again later.");
    }
  }

  private buildOtpEmailTemplate(otp: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2c3e50;">Verify Your Account</h2>
            <p>We received a request to verify your account. Use the OTP below to complete verification:</p>
            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
              <h1 style="color: #3498db; margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
            </div>
            <p style="color: #e74c3c; font-weight: bold;">This OTP is valid for 10 minutes only.</p>
            <p>If you didn't request this verification, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #777;">
              This is an automated message from FarmX. Please do not reply to this email.
            </p>
          </div>
        </body>
      </html>
    `;
  }
}
