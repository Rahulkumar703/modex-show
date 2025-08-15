import {Router} from "express";
import {bookSeat, getBookings, getBookingStatus} from "../controllers/booking.controller.js";
import {asyncHandler} from "../middleware/async.middleware.js";
import {validate} from "../middleware/validator.middleware.js";
import {bookingSchema, bookingStatusSchema} from "../schema/booking.schema.js";
import {bookingRateLimiter} from "../middleware/rateLimmiter.middleware.js";

const router = Router();

router.get('/', asyncHandler(getBookings));
router.get('/:bookingId', validate('params', bookingStatusSchema), asyncHandler(getBookingStatus));
router.post('/new', bookingRateLimiter, validate('body', bookingSchema), asyncHandler(bookSeat));


export default router;