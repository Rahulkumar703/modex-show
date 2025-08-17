import bookingRoutes from "./booking.route.js";
import showRoutes from "./show.route.js";
import {Router} from "express";

const router = Router();

router.use("/bookings", bookingRoutes);
router.use("/shows", showRoutes);

export default router;
