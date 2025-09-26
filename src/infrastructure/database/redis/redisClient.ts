import Redis from "ioredis";

export class RedisClient {
  #client: Redis | null;
  #isConnected: boolean;
  #connectionPromise: Promise<void> | null;

  constructor() {
    this.#client = null;
    this.#isConnected = false;
    this.#connectionPromise = null;
  }

  async connect() {
    if (this.#connectionPromise) {
      return this.#connectionPromise;
    }

    this.#connectionPromise = this.initializeConnection();

    return this.#connectionPromise;
  }

  private async initializeConnection(): Promise<void> {
    try {
      this.#client = new Redis({
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379", 10),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || "0", 10),

        enableReadyCheck: true,
        maxRetriesPerRequest: 3,

        connectTimeout: 10000,
        commandTimeout: 5000,
        lazyConnect: false,

        retryStrategy: (times: number) => {
          return Math.min(times * 50, 2000);
        },
      });

      this.setupEventListeners();
      await this.#client.connect();
      this.#isConnected = true;
    } catch (error) {
      console.error("Error connecting to Redis:", error);
      this.#isConnected = false;
    } finally {
      this.#connectionPromise = null;
    }
  }

  private setupEventListeners(): void {
    if (!this.#client) return;

    this.#client.on("connect", () => {
      console.log("Connected to Redis");
      this.#isConnected = true;
    });

    this.#client.on("ready", () => {
      console.log("Redis is ready");
      this.#isConnected = true;
    });

    this.#client.on("error", (error) => {
      console.error("Redis error:", error);
      this.#isConnected = false;
    });

    this.#client.on("close", () => {
      console.log("Redis connection closed");
      this.#isConnected = false;
    });

    this.#client.on("end", () => {
      console.log("Redis connection ended");
      this.#isConnected = false;
    });

    this.#client.on("reconnecting", () => {
      console.log("Redis is reconnecting");
      this.#isConnected = false;
    });

    this.#client.on("reconnect", () => {
      console.log("Redis has reconnected");
      this.#isConnected = true;
    });
  }

  async disconnect(): Promise<void> {
    if (this.#client) {
      await this.#client.quit();
      this.#isConnected = false;
      this.#client = null;
      this.#connectionPromise = null;
      console.log("Disconnected from Redis");
    }
  }

  async healthCheck(): Promise<boolean> {
    if (!this.#client || !this.#isConnected) return false;

    try {
      await this.#client.ping();
      return true;
    } catch (error) {
      this.#isConnected = false;
      console.error("Error pinging Redis:", error);
      return false;
    }
  }

  getClient(): Redis {
    if (!this.#client || !this.#isConnected) {
      throw new Error("Redis client is not initialized or not connected");
    }

    return this.#client;
  }

  getisConnected(): boolean {
    return this.#isConnected;
  }
}
