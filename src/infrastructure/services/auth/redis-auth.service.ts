import { inject, injectable } from "inversify";
import { TYPES } from "@presentation/container/types.js";
import { RedisClient } from "@infrastructure/database/redis/redisClient.js";

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
  userId?: string;
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

export interface IRedisAuthConfig {
  SESSION_PREFIX: string;
  REFRESH_PREFIX: string;
  RATE_LIMIT_PREFIX: string;
  SESSION_TTL: number;
  REFRESH_TTL: number;
  RATE_LIMIT_TTL: number;
  MAX_LOGIN_ATTEMPTS: number;
}

@injectable()
export class RedisAuthService {
  #config: IRedisAuthConfig;

  constructor(
    @inject(TYPES.RedisClient) private redisClient: RedisClient,
    @inject(TYPES.RedisAuthConfig) config: IRedisAuthConfig
  ) {
    this.#config = config;
  }

  //* ========== Session Management ========== *//
  async createSession(userId: string, sessionData: Partial<ISessionData>): Promise<void> {
    const redis = this.redisClient.client;
    if (!redis) throw new Error("Redis client is not initialized");

    const key = `${this.#config.SESSION_PREFIX}${userId}`;
    const dataToStore: ISessionData = {
      userId,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      ...sessionData,
    };

    await redis.setex(key, this.#config.SESSION_TTL, JSON.stringify(dataToStore));
  }

  async getSession(userId: string | undefined): Promise<ISessionData | null> {
    const redis = this.redisClient.client;
    if (!redis) throw new Error("Redis client is not initialized");

    const sessionData = await redis.get(`${this.#config.SESSION_PREFIX}${userId}`);
    if (!sessionData) return null;

    const parsedData: ISessionData = JSON.parse(sessionData);
    parsedData.lastActivity = new Date().toISOString();

    await redis.setex(
      `${this.#config.SESSION_PREFIX}${userId}`,
      this.#config.SESSION_TTL,
      JSON.stringify(parsedData)
    );

    return parsedData;
  }

  async deleteSession(userId: string): Promise<void> {
    const redis = this.redisClient.client;
    if (!redis) throw new Error("Redis client is not initialized");

    await redis.del(`${this.#config.SESSION_PREFIX}${userId}`);
  }

  async extendSession(userId: string | undefined): Promise<boolean> {
    const redis = this.redisClient.client;
    if (!redis) throw new Error("Redis client is not initialized");

    const sessionData = await redis.get(`${this.#config.SESSION_PREFIX}${userId}`);
    if (!sessionData) return false;

    await redis.expire(`${this.#config.SESSION_PREFIX}${userId}`, this.#config.SESSION_TTL);
    return true;
  }

  //* ========== Refresh Token Management ========== *//
  async storeRefreshToken(
    tokenId: string,
    refreshTokenData: Omit<IRefreshTokenData, "createdAt">
  ): Promise<boolean> {
    const redis = this.redisClient.client;
    if (!redis) throw new Error("Redis client is not initialized");

    const key = `${this.#config.REFRESH_PREFIX}${tokenId}`;
    const dataToStore: IRefreshTokenData = {
      ...refreshTokenData,
      createdAt: new Date().toISOString(),
    };

    await redis.setex(key, this.#config.REFRESH_TTL, JSON.stringify(dataToStore));
    return true;
  }

  async getRefreshToken(tokenId: string): Promise<IRefreshTokenData | null> {
    const redis = this.redisClient.client;
    if (!redis) throw new Error("Redis client is not initialized");

    const refreshTokenData = await redis.get(`${this.#config.REFRESH_PREFIX}${tokenId}`);
    return refreshTokenData ? JSON.parse(refreshTokenData) : null;
  }

  async deleteRefreshToken(tokenId: string): Promise<boolean> {
    const redis = this.redisClient.client;
    if (!redis) throw new Error("Redis client is not initialized");

    await redis.del(`${this.#config.REFRESH_PREFIX}${tokenId}`);
    return true;
  }

  async deleteAllUserRefreshTokens(userId: string): Promise<number> {
    const redis = this.redisClient.client;
    if (!redis) throw new Error("Redis client is not initialized");

    const keys = await redis.keys(`${this.#config.REFRESH_PREFIX}*`);
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
    const redis = this.redisClient.client;
    if (!redis) throw new Error("Redis client is not initialized");

    const key = `${this.#config.RATE_LIMIT_PREFIX}${identifier}`;
    const attempts = await redis.get(key);
    const attemptCount = attempts ? parseInt(attempts, 10) : 0;

    return {
      attempts: attemptCount,
      isBlocked: attemptCount >= this.#config.MAX_LOGIN_ATTEMPTS,
    };
  }

  async incrementLoginAttempts(identifier: string): Promise<IRateLimitResult> {
    const redis = this.redisClient.client;
    if (!redis) throw new Error("Redis client is not initialized");

    const key = `${this.#config.RATE_LIMIT_PREFIX}${identifier}`;
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, this.#config.RATE_LIMIT_TTL);
    }

    const ttl = await redis.ttl(key);

    return {
      attempts: current,
      isBlocked: current >= this.#config.MAX_LOGIN_ATTEMPTS,
      ttl,
    };
  }

  async resetLoginAttempts(identifier: string): Promise<boolean> {
    const redis = this.redisClient.client;
    if (!redis) throw new Error("Redis client is not initialized");

    const key = `${this.#config.RATE_LIMIT_PREFIX}${identifier}`;
    await redis.del(key);
    return true;
  }

  //* ========== Utility Methods ========== *//
  async getAllActiveSessions(): Promise<ISessionData[]> {
    const redis = this.redisClient.client;
    if (!redis) throw new Error("Redis client is not initialized");

    const keys = await redis.keys(`${this.#config.SESSION_PREFIX}*`);
    const sessions: ISessionData[] = [];

    for (const key of keys) {
      const sessionData = await redis.get(key);
      if (sessionData) {
        const userId = key.replace(this.#config.SESSION_PREFIX, "");
        sessions.push({ userId, ...JSON.parse(sessionData) });
      }
    }

    return sessions;
  }

  async getUserSessions(userId: string): Promise<ISessionData[]> {
    const sessions = await this.getAllActiveSessions();
    return sessions.filter((s) => s.userId === userId);
  }

  async cleanupExpiredTokens(): Promise<number> {
    const redis = this.redisClient.client;
    if (!redis) throw new Error("Redis client is not initialized");

    const keys = await redis.keys(`${this.#config.REFRESH_PREFIX}*`);
    let cleanedCount = 0;

    for (const key of keys) {
      const ttl = await redis.ttl(key);
      if (ttl === -1) {
        await redis.del(key);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }
}
