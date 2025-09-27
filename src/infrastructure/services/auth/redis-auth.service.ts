import { RedisClient } from "@infrastructure/database/redis/redisClient";

export interface ISessionData {
  userId: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt: string;
  lastActivity: string;
  [key: string]: string | number | boolean | undefined;
}

export interface IRefreshTokenData {
  userId: string;
  tokenId: string;
  createdAt: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface IRateLimitResult {
  attempts: number;
  isBlocked: boolean;
  ttl: number;
}

export interface ILoginAttempts {
  attempts: number;
  isBlocked: boolean;
}

export class RedisAuthService {
  #SESSION_PREFIX: string;
  #SESSION_TTL: number;
  #REFRESH_PREFIX: string;
  #RATE_LIMIT_PREFIX: string;
  #REFRESH_TTL: number;
  #RATE_LIMIT_TTL: number;
  #MAX_LOGIN_ATTEMPTS: number;

  constructor(
    SESSION_PREFIX?: string,
    REFRESH_PREFIX?: string,
    RATE_LIMIT_PREFIX?: string,
    SESSION_TTL?: number,
    REFRESH_TTL?: number,
    RATE_LIMIT_TTL?: number,
    MAX_LOGIN_ATTEMPTS?: number
  ) {
    this.#SESSION_PREFIX = SESSION_PREFIX || "auth:session:";
    this.#REFRESH_PREFIX = REFRESH_PREFIX || "auth:refresh:";
    this.#RATE_LIMIT_PREFIX = RATE_LIMIT_PREFIX || "auth:ratelimit:";
    this.#SESSION_TTL = SESSION_TTL || 60 * 60 * 24 * 7;
    this.#REFRESH_TTL = REFRESH_TTL || 60 * 60 * 24 * 7;
    this.#RATE_LIMIT_TTL = RATE_LIMIT_TTL || 60 * 60 * 24 * 7;
    this.#MAX_LOGIN_ATTEMPTS = MAX_LOGIN_ATTEMPTS || 5;
  }

  async storeSession(userId: string, sessionData: Partial<ISessionData>): Promise<void> {
    const redisClient = new RedisClient();
    const redis = redisClient.client;

    if (!redis) {
      throw new Error("Redis client is not initialized");
    }

    const key = `${this.#SESSION_PREFIX}${userId}`;

    const dataToStore: ISessionData = {
      userId: userId,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      ...sessionData,
    };

    await redis.setex(key, this.#SESSION_TTL, JSON.stringify(dataToStore));
  }

  async getSession(userId: string): Promise<ISessionData | null> {
    const redisClient = new RedisClient();
    const redis = redisClient.client;

    if (!redis) {
      throw new Error("Redis client is not initialized");
    }

    const sessionData = await redis.get(`${this.#SESSION_PREFIX}${userId}`);

    if (!sessionData) {
      return null;
    }

    const parsedData: ISessionData = JSON.parse(sessionData);
    parsedData.lastActivity = new Date().toISOString();
    await redis.setex(
      `${this.#SESSION_PREFIX}${userId}`,
      this.#SESSION_TTL,
      JSON.stringify(parsedData)
    );

    return parsedData;
  }

  async deleteSession(userId: string): Promise<void> {
    const redisClient = new RedisClient();
    const redis = redisClient.client;

    if (!redis) {
      throw new Error("Redis client is not initialized");
    }

    await redis.del(`${this.#SESSION_PREFIX}${userId}`);
  }

  async extendSession(userId: string): Promise<boolean> {
    const redisClient = new RedisClient();
    const redis = redisClient.client;

    if (!redis) {
      throw new Error("Redis client is not initialized");
    }

    const sessionData = await redis.get(`${this.#SESSION_PREFIX}${userId}`);

    if (!sessionData) {
      return false;
    }

    await redis.expire(`${this.#SESSION_PREFIX}${userId}`, this.#SESSION_TTL);

    return true;
  }
}
