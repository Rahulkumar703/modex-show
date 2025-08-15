import {z} from 'zod';


export const bookingSchema = z.object({
    showId: z.string().min(1, "Show ID is required"),
    seatNumbers: z.array(
        z.number().int().positive({message: "Invalid seat number"})
    ).min(1, {message: "At least one seat number is required"}),
})


export const bookingStatusSchema = z.object({
    bookingId: z.string().min(1, "Booking Id is required")
})


export const availableSeatsSchema = z.object({
    showId: z.string().min(1, "Show Id is required")
})