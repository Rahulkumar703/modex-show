import {Router} from "express";
import {bookSeat, getAvailableSeats, getBookings, getBookingStatus} from "../controllers/booking.controller.js";
import {asyncHandler} from "../middleware/async.middleware.js";
import {validate} from "../middleware/validator.middleware.js";
import {availableSeatsSchema, bookingSchema, bookingStatusSchema} from "../schema/booking.schema.js";
import {bookingRateLimiter} from "../middleware/rateLimmiter.middleware.js";

const router = Router();

router.get('/', asyncHandler(getBookings));
router.get('/:bookingId',validate('params', bookingStatusSchema), asyncHandler(getBookingStatus));
router.get('/seats/:showId', validate('params', availableSeatsSchema), asyncHandler(getAvailableSeats));
router.post('/new-booking',bookingRateLimiter, validate('body', bookingSchema), asyncHandler(bookSeat));


export default router;