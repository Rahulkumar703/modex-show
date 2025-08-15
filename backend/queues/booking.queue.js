import {Queue} from "bullmq";
import {redisQueueConnection} from "../config/redis.config.js";

export const bookingQueue = new Queue("bookingQueue", {connection: redisQueueConnection});
