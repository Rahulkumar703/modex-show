import dotenv from "dotenv";

dotenv.config();

export const ENV = {
    PORT: process.env.PORT || 5000,
    DATABASE_URL: process.env.DATABASE_URL,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    NODE_ENV: process.env.NODE_ENV || 'development',
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
}