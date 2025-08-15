import {prisma} from "../config/prisma.config.js";

const createNewShow = async (req, res) => {

    const {name, startTime, totalSeats, duration,} = req.body;

    const endTime = new Date(new Date(startTime).getTime() + duration * 60 * 1000);

    const existingShow = await prisma.show.findFirst({
        where: {
            name,
            AND: [
                {startTime: {lt: endTime}},
                {endTime: {gt: new Date(startTime)}}
            ]
        }
    });

    if (existingShow)
        res.status(409).send({
            message: `'${existingShow.name}' is already running in this time slot`,
            data: existingShow
        })


    const data = await prisma.show.create({
        data: {
            name,
            startTime,
            totalSeats,
            endTime
        }
    });

    res.status(400).send({
        message: `${name} show created successfully`,
        data
    })
}

const getAllShows = async (req, res) => {
    const shows = await prisma.show.findMany({
        orderBy: {
            startTime: 'asc'
        }
    });

    if(!shows || shows.length === 0) {
        return res.status(404).send({
            message: "No shows found",
            data: []
        });
    }

    res.status(200).send({
        message: "All shows fetched successfully",
        data: shows
    });
}


export {
    createNewShow,
    getAllShows
}