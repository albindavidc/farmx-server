import nodemailer from "nodemailer";
import { configBrevo } from "../../shared/config/ConfigSetup";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: configBrevo.BREVO.LOGIN,
    pass: process.env.BREVO_SMTP_KEY_VALUE,
  },
});

export const sendOtpEmail = async (
  email: string,
  otp: string
): Promise<void> => {
  const mailOptions = {
    from: configBrevo.EMAIL_FROM,
    name: "FarmX",
    to: email,
    subject: "Your Otp code to signup",
    html: `
        <html>
            <body>
                <h2>Welcome!</h2>
                <p>We have recieved a request to verify your account. Inorder to view your otp kindly press on the button.<p>
                <p>If you haven't requested this email. Kindly avoid this email<p>

                <!-- CTA Button to Reveal OTP -->
                <h1>OTP: ${otp}</h1>

                <p style="margin-top: 20px; font-size:12px; color: #777;">This email was generated from your account <strong>FarmX<strong>.<p>
            </body>
        </html>
            
        `,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending OTP email", error);
    throw new Error("unable to send OTP email");
  }
};
