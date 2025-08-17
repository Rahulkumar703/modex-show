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

const getBooking = async (req, res) => {
    const {showId} = req.params;
    const show = await prisma.show.findUnique({
        where: {
            id: showId
        }, select: {
            id: true,
            name: true,
            startTime: true,
            endTime: true,
            totalSeats: true,
            createdAt: true,
            updatedAt: true,
            bookings: {
                select: {
                    id: true, seatNo: true, bookingRequest: true
                },
            },
        },
    });

    const grouped = {};

    for (const booking of show.bookings) {
        const reqId = booking.bookingRequest.id;
        const seatNo = booking.seatNo;

        if (!grouped[reqId]) {
            grouped[reqId] = {
                id: booking.id, bookingRequestId: reqId, seats: [],
            };
        }

        grouped[reqId].seats.push(seatNo);
    }

    const formatedShow = {
        ...show,
        bookings: Object.values(grouped),
    };


    res.status(200).json({
        message: "All booking requests retrieved successfully", data: formatedShow,
    });
};

const bookSeat = async (req, res) => {
    const {seatNumbers, showId} = req.body;

    const requestId = uuidv4();

    const show = await prisma.show.findUnique({
        where: {id: showId}, select: {id: true}
    });

    if (!show) {
        return res.status(404).json({
            message: "Show not found"
        });
    }

    const existingBooking = await prisma.bookingRequest.findFirst({
        where: {
            showId, status: {in: ["PENDING", "CONFIRMED"]}, seats: {
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
            id: requestId, showId, status: "PENDING"
        }
    });

    await bookingQueue.add("bookSeats", {
        requestId, seatNumbers, showId
    });

    return res.status(202).json({
        message: "Booking request queued", requestId
    });
}

const getBookingStatus = async (req, res) => {
    const {bookingId} = req.params;


    const booking = await prisma.bookingRequest.findUnique({
        where: {id: bookingId}, select: {
            id: true, status: true, createdAt: true, updatedAt: true
        }
    });

    if (!booking) {
        return res.status(404).json({
            message: "Booking not found"
        });
    }

    return res.status(200).json({
        message: "Booking status retrieved successfully", data: booking
    })
}


export {
    getBooking, getBookings, bookSeat, getBookingStatus
}
