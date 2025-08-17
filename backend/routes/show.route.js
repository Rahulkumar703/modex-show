import {Router} from "express";
import {asyncHandler} from "../middleware/async.middleware.js";
import {createNewShow, getAllShows, getShowBookings} from "../controllers/show.controller.js";
import {validate} from "../middleware/validator.middleware.js";
import {availableSeatsSchema, showSchema} from "../schema/show.schema.js";

const router = Router();

router.get("/", asyncHandler(getAllShows));

router.post("/new", validate("body", showSchema), asyncHandler(createNewShow));

router.get('/:showId', validate('params', availableSeatsSchema), asyncHandler(getShowBookings));


export default router;
