import { Worker } from "bullmq";
import { prisma } from "../config/prisma.config.js";
import { redisQueueConnection } from "../config/redis.config.js";

const bookingWorker = new Worker(
    "bookingQueue",
    async job => {
        const { requestId, seatNumbers, showId } = job.data;

        return await prisma.$transaction(async tx => {
            const bookingRequest = await tx.bookingRequest.findUnique({
                where: { id: requestId },
                select: { id: true, status: true }
            });

            if (!bookingRequest || bookingRequest.status !== "PENDING") {
                throw new Error("Invalid or already processed booking request");
            }
            const conflicts = await tx.booking.findMany({
                where: {
                    seatNo: { in: seatNumbers },
                    status: "CONFIRMED",
                    bookingRequest: { showId }
                },
                select: { seatNo: true }
            });

            if (conflicts.length > 0) {
                await tx.bookingRequest.update({
                    where: { id: requestId },
                    data: { status: "FAILED" }
                });

                return { status: "FAILED", conflicts };
            }
            await tx.booking.createMany({
                data: seatNumbers.map(seatNo => ({
                    bookingRequestId: requestId,
                    seatNo,
                    status: "CONFIRMED",
                    showId
                }))
            });

            await tx.bookingRequest.update({
                where: { id: requestId },
                data: { status: "CONFIRMED" }
            });

            return { status: "CONFIRMED" };
        });
    },
    { connection: redisQueueConnection, concurrency: 10 }
);

bookingWorker.on("completed", job => {
    console.log(`Booking job ${job.id} completed successfully`);
});

bookingWorker.on("failed", (job, err) => {
    console.error(`Booking job ${job?.id} failed: ${err.message}`);
});
