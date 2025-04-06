import { config } from "dotenv";
import { randomBytes } from "crypto";
import { writeFileSync } from "fs";
config();

export function generateTokenSecret(length: number = 64): string {
  return randomBytes(length).toString("hex");
}

function updateEnvSecrets() {
  const accessTokenSecret = generateTokenSecret(32);
  const refreshTokenSecret = generateTokenSecret(64);

  const envConstant = `
    ACCESS_TOKEN_SECRET=${accessTokenSecret}
    REFRESH_TOKEN_SECRET=${refreshTokenSecret}
     `.trim();

  writeFileSync(".env", envConstant);
}

updateEnvSecrets();
