import { config } from "dotenv";
config();

export const configBrevo = {
  BREVO: {
    SMTP_SERVER: process.env.BREVO_SMTP_SERVER || "smtp-relay.brevo.com",
    PORT: parseInt(process.env.BREVO_PORT || "587", 10),
    LOGIN: process.env.BREVO_LOGIN || "898d12001@smtp-brevo.com",
    PASSWORD: process.env.BREVO_PASSWORD || "",
  },
  EMAIL_FROM: process.env.BREVO_EMAIL || "albindc007@gmail.com",
};

export const configJwt = {
  jwtSecret: process.env.ACCESS_TOKEN_SECRET || "a-very-secure-secret-key",
  jwtRefreshSecret:
    process.env.REFRESH_TOKEN_SECRET || "a-very-secure-refresh-key",
};

export const configFrontend = {
  frontendUrl:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL_PRODUCTION
      : process.env.FRONTEND_URL_DEVELOPMENT,
  frontendUrlProd: process.env.FRONTEND_URL_PRODUCTION,
  frontendUrlProdNew: process.env.FRONTEND_URL_PRODUCTION_NEW,
};
