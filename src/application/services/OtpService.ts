import nodemailer, { Transporter } from "nodemailer";
import { configBrevo } from "../../infrastructure/config/ConfigSetup";
import winston from "winston";
import path from "path";
import ejs from "ejs";

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export class OtpService {
  private transporter: Transporter;
  private logger: winston.Logger;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: configBrevo.BREVO.SMTP_SERVER,
      port: configBrevo.BREVO.PORT,
      auth: {
        user: configBrevo.BREVO.LOGIN,
        pass: configBrevo.BREVO.PASSWORD,
      },
    });

    this.logger = winston.createLogger({
      level: "error",
      format: winston.format.json(),
      transports: [new winston.transports.File({ filename: "error.log" })],
    });
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    const templatePath = path.join(__dirname, "../templates/OtpEmail.ejs");
    const html = await ejs.renderFile(templatePath, {
      otp,
      validity: "10 minutes",
    });

    const mailOptions: MailOptions = {
      from: configBrevo.EMAIL_FROM,
      to: email,
      subject: "Your Otp Code",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`OTP email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${email}: `, error);
      throw new Error("Failed to send OTP email");
    }
  }
}

export default new OtpService();
