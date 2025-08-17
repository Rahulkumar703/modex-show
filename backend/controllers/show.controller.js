import {prisma} from "../config/prisma.config.js";

const createNewShow = async (req, res) => {

    const {name, startTime, totalSeats, duration,} = req.body;

    const endTime = new Date(new Date(startTime).getTime() + duration * 60 * 1000);

    const existingShow = await prisma.show.findFirst({
        where: {
            name, AND: [{startTime: {lt: endTime}}, {endTime: {gt: new Date(startTime)}}]
        }
    });

    if (existingShow) res.status(409).send({
        message: `'${existingShow.name}' is already running in this time slot`, data: existingShow
    })


    const data = await prisma.show.create({
        data: {
            name, startTime, totalSeats, endTime
        }
    });

    res.status(201).send({
        message: `${name} show created successfully`, data
    })
}

const getAllShows = async (req, res) => {
    const shows = await prisma.show.findMany({
        orderBy: {
            startTime: 'asc'
        }
    });

    if (!shows || shows.length === 0) {
        return res.status(404).send({
            message: "No shows found", data: []
        });
    }

    res.status(200).send({
        message: "All shows fetched successfully", data: shows
    });
}


const getShowBookings = async (req, res) => {

    const {showId} = req.params;

    const bookedSeats = await prisma.booking.findMany({
        where: {
            showId, bookingRequest: {
                status: {in: ["PENDING", "CONFIRMED"]}
            }
        }, select: {seatNo: true}
    });

    const show = await prisma.show.findUnique({
        where: {id: showId},
    });

    const bookedSeatNumbers = bookedSeats.map(seat => seat.seatNo);

    return res.status(200).json({
        message: "Show retrieved successfully", data: {
            ...show, bookedSeats: bookedSeatNumbers
        }
    });
}

export {
    createNewShow, getAllShows, getShowBookings
}