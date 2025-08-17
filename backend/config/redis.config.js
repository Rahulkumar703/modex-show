import {ENV} from "./env.config.js";
import Redis from "ioredis";

export const redisQueueConnection = new Redis(`${ENV.REDIS_URL}/0`, {
    maxRetriesPerRequest: null,
});