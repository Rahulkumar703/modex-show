import {Router} from "express";
import {createNewShow, getAllShows} from "../controllers/admin.controller.js";
import {validate} from "../middleware/validator.middleware.js";
import {showSchema} from "../schema/show.schema.js";
import {asyncHandler} from "../middleware/async.middleware.js";

const router = Router();

router.post('/create-show', validate('body', showSchema), asyncHandler(createNewShow));

router.get('/shows', asyncHandler(getAllShows));

export default router;