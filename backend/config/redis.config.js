import {ENV} from "./env.config.js";
import Redis from "ioredis";

// Redis connection using URL with db override

export const redisQueueConnection = new Redis(`${ENV.REDIS_URL}/0`, {
    maxRetriesPerRequest: null,
});