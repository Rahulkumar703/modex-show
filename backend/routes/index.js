import bookingRoutes from "./booking.route.js";
import adminRoutes from "./admin.route.js";
import {Router} from "express";


const router = Router();

router.use('/booking', bookingRoutes);
router.use('/admin', adminRoutes);


export default router;