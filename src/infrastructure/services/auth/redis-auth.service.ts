import { RedisClient } from "@infrastructure/database/redis/redisClient";

export interface ISessionData {
  userId: string;
  email?: string;
  name?: string;
  role?: string;
  isVerified?: boolean;
  
  userAgent?: string;
  ipAddress?: string;
  createdAt: string;
  lastActivity: string;
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

  //* ========== Session Management ========== *//
  async createSession(userId: string, sessionData: Partial<ISessionData>): Promise<void> {
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

  async getSession(userId: string | undefined): Promise<ISessionData | null> {
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

  async extendSession(userId: string | undefined): Promise<boolean> {
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

  //* ========== Refresh Token Management ========== *//
  async storeRefreshToken(
    tokenId: string,
    refreshTokenData: Omit<IRefreshTokenData, "createdAt">
  ): Promise<boolean> {
    const redisClient = new RedisClient();
    const redis = redisClient.client;

    if (!redis) {
      throw new Error("Redis client is not initialized");
    }

    const key = `${this.#REFRESH_PREFIX}${tokenId}`;

    const dataToStore: IRefreshTokenData = {
      ...refreshTokenData,
      createdAt: new Date().toISOString(),
    };

    await redis.setex(key, this.#REFRESH_TTL, JSON.stringify(dataToStore));

    return true;
  }

  async getRefreshToken(tokenId: string): Promise<IRefreshTokenData | null> {
    const redisClient = new RedisClient();
    const redis = redisClient.client;

    if (!redis) {
      throw new Error("Redis client is not initialized");
    }

    const refreshTokenData = await redis.get(`${this.#REFRESH_PREFIX}${tokenId}`);

    if (!refreshTokenData) {
      return null;
    }

    return JSON.parse(refreshTokenData);
  }

  async deleteRefreshToken(tokenId: string): Promise<boolean> {
    const redisClient = new RedisClient();
    const redis = redisClient.client;

    if (!redis) {
      throw new Error("Redis client is not initialized");
    }

    await redis.del(`${this.#REFRESH_PREFIX}${tokenId}`);

    return true;
  }

  async deleteAllUserRefreshTokens(userId: string): Promise<number> {
    const redisClient = new RedisClient();
    const redis = redisClient.client;

    if (!redis) {
      throw new Error("Redis client is not initialized");
    }

    const keys = await redis.keys(`${this.#REFRESH_PREFIX}*`); // Get all keys starting with the prefix

    let deleteCount = 0;
    for (const key of keys) {
      const refreshTokenData = await redis.get(key);

      if (refreshTokenData) {
        const data = JSON.parse(refreshTokenData);
        if (data.userId === userId) {
          await redis.del(key);
          deleteCount++;
        }
      }
    }

    return deleteCount;
  }

  //* ========== Rate Limiting ========== *//
  async checkLoginAttempts(identifier: string): Promise<ILoginAttempts> {
    const redisClient = new RedisClient();
    const redis = redisClient.client;

    if (!redis) {
      throw new Error("Redis client is not initialized");
    }

    const key = `${this.#RATE_LIMIT_PREFIX}${identifier}`;
    const attempts = await redis.get(key);
    const attemptCount = attempts ? parseInt(attempts, 10) : 0;

    return { attempts: attemptCount, isBlocked: attemptCount >= this.#MAX_LOGIN_ATTEMPTS };
  }

  async incrementLoginAttempts(identifier: string): Promise<IRateLimitResult> {
    const redisClient = new RedisClient();
    const redis = redisClient.client;
    if (!redis) {
      throw new Error("Redis client is not initialized");
    }

    const key = `${this.#RATE_LIMIT_PREFIX}${identifier}`;
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, this.#RATE_LIMIT_TTL);
    }
    const ttl = await redis.ttl(key);

    return { attempts: current, isBlocked: current >= this.#MAX_LOGIN_ATTEMPTS, ttl };
  }

  async resetLoginAttempts(identifier: string): Promise<boolean> {
    const redisClient = new RedisClient();
    const redis = redisClient.client;

    if (!redis) {
      throw new Error("Redis client is not initialized");
    }

    const key = `${this.#RATE_LIMIT_PREFIX}${identifier}`;
    await redis.del(key);

    return true;
  }

  //* ========== Utility Methods ========== *//
  async getAllActiveSessions(): Promise<ISessionData[]> {
    const redisClient = new RedisClient();
    const redis = redisClient.client;

    if (!redis) {
      throw new Error("Redis client is not initialized");
    }

    const keys = await redis.keys(`${this.#SESSION_PREFIX}*`);

    const sessions: ISessionData[] = [];

    for (const key of keys) {
      const sessionData = await redis.get(key);
      if (sessionData) {
        const userId = key.replace(this.#SESSION_PREFIX, "");
        sessions.push({ userId, ...JSON.parse(sessionData) });
      }
    }

    return sessions;
  }

  async getUserSessions(userId: string): Promise<ISessionData[]> {
    const session = await this.getAllActiveSessions();

    return session.filter((s) => s.userId === userId);
  }

  async cleanupExpiredTokens(): Promise<number> {
    const redisClient = new RedisClient();
    const redis = redisClient.client;

    if (!redis) {
      throw new Error("Redis client is not initialized");
    }

    const keys = await redis.keys(`${this.#REFRESH_PREFIX}*`);

    let clearnedCount = 0;
    for (const key of keys) {
      const ttl = await redis.ttl(key);
      if (ttl === -1) {
        await redis.del(key);
        clearnedCount++;
      }
    }

    return clearnedCount;
  }
}
