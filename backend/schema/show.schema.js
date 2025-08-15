import {z} from "zod";

export const showSchema = z.object({
    name: z.string().min(1, "Title is required"),
    startTime: z.coerce
        .date("Invalid date format")
        .refine(
            (startTime) => startTime > new Date(),
            {message: "Start time must be in the future"}
        ),
    totalSeats: z.coerce.number().min(1, "Total seats must be at least 1"),
    duration: z.coerce.number().min(1, "Duration must be at least 1 minute").default(1),
});



export const availableSeatsSchema = z.object({
    showId: z.string().min(1, "Show Id is required")
})