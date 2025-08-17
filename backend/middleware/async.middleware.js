import {ENV} from "../config/env.config.js";

export const asyncHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: ENV.NODE_ENV === 'production' ? "Internal Server Error" : err.message,
            })
        }
    };
};
