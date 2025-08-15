import bookingRoutes from "./booking.route.js";
import adminRoutes from "./admin.route.js";
import showRoutes from "./show.route.js";
import { Router } from "express";

const router = Router();

router.use("/bookings", bookingRoutes);
router.use("/admin", adminRoutes);
router.use("/shows", showRoutes);

export default router;
