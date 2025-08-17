import cron from "node-cron";
import {prisma} from "../config/prisma.config.js";

// Run every minute
cron.schedule("* * * * *", async () => {
    const now = new Date();
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);

    await prisma.bookingRequest.updateMany({
        where: {
            status: "PENDING", createdAt: {lte: twoMinutesAgo}
        }, data: {status: "FAILED"}
    });

    console.log("Expired bookings marked as FAILED");
});
