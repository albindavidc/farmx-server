import { config } from "dotenv";
config();

export const configBrevo = {
  BREVO: {
    SMTP_SERVER: "smtp.gmail.com",
    LOGIN: process.env.BREVO_SMTP_USER_EMAIL || "",
    PASSWORD: process.env.BREVO_SMTP_KEY_VALUE || "",
  },
  EMAIL_FROM:
    process.env.BREVO_SMTP_USER_EMAIL || "no-reply@gmail.com",
};

export const configJwt = {
  jwtSecret: process.env.JWT_SECRET || "secret",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "refreshSecret",
};

export const configFrontend = {
  frontendUrl:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL_PRODUCTION
      : process.env.FRONTEND_URL_DEVELOPMENT,
  frontendUrlProd: process.env.FRONTEND_URL_PRODUCTION,
  frontendUrlProdNew: process.env.FRONTEND_URL_PRODUCTION_NEW,
};
