import { Router } from "express";
import { createNewShow } from "../controllers/show.controller.js";
import { validate } from "../middleware/validator.middleware.js";
import { showSchema } from "../schema/show.schema.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import {getBookings} from "../controllers/booking.controller.js";

const router = Router();



export default router;
