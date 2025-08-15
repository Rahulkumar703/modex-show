import {prisma} from "../config/prisma.config.js";
import {bookingQueue} from "../queues/booking.queue.js";
import {v4 as uuidv4} from "uuid";

const getBookings = async (req, res) => {

    const bookings = await prisma.booking.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });

    res.status(200).json({
        message: "Booking route is working",
        data: bookings
    });
}

const bookSeat = async (req, res) => {
    const {seatNumbers, showId} = req.body;

    const requestId = uuidv4();

    const show = await prisma.show.findUnique({
        where: {id: showId},
        select: {id: true}
    });

    if (!show) {
        return res.status(404).json({
            message: "Show not found"
        });
    }

    const existingBooking = await prisma.bookingRequest.findFirst({
        where: {
            showId,
            status: {in: ["PENDING", "CONFIRMED"]},
            seats: {
                some: {
                    seatNo: {in: seatNumbers}
                }
            }
        }
    });

    if (existingBooking) {
        return res.status(409).json({
            message: "Seat(s) are already booked",
        });
    }

    await prisma.bookingRequest.create({
        data: {
            id: requestId,
            showId,
            status: "PENDING"
        }
    });

    await bookingQueue.add("bookSeats", {
        requestId,
        seatNumbers,
        showId
    });

    return res.status(202).json({
        message: "Booking request queued",
        requestId
    });
}

const getBookingStatus = async (req, res) => {
    const {bookingId} = req.params;


    const booking = await prisma.bookingRequest.findUnique({
        where: {id: bookingId},
        select: {
            id: true,
            status: true,
            createdAt: true,
            updatedAt: true
        }
    });

    if (!booking) {
        return res.status(404).json({
            message: "Booking not found"
        });
    }

    return res.status(200).json({
        message: "Booking status retrieved successfully",
        data: booking
    })
}

const getAvailableSeats = async (req,res) => {

    const {showId} = req.params;
    // Step 1: Find all booked seats for this show
    const bookedSeats = await prisma.booking.findMany({
        where: {
            showId,
            bookingRequest: {
                status: {in: ["PENDING", "CONFIRMED"]}
            }
        },
        select: {seatNo: true}
    });

    const show = await prisma.show.findUnique({
        where: {id: showId},
        select: {totalSeats: true}
    });

    const bookedSeatNumbers = bookedSeats.map(seat => seat.seatNo);

    // Step 2: Get total seat numbers (example: 1 to 100)
    const totalSeats = Array.from({length: show.totalSeats}, (_, i) => i + 1);

    // Step 3: Filter out booked seats
    const availableSeats = totalSeats.filter(seat => !bookedSeatNumbers.includes(seat));

    return res.status(200).json({
        message: "Available seats retrieved successfully",
        data: availableSeats
    });
}


export {
    getBookings,
    bookSeat,
    getBookingStatus,
    getAvailableSeats
}