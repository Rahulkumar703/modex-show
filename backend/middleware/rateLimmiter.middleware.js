import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
    windowMs: 60 * 1000, max: 50, message: {message: "Too many booking requests. Please wait."}
});

export const bookingRateLimiter = rateLimit({
    windowMs: 30 * 1000, max: 3, message: {message: "Too many booking requests. Please wait."}
});

