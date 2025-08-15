import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import Page from "../components/Page.tsx";
import Button from "../components/button.tsx";
import {useState} from "react";
import {Calendar, Clock, Armchair} from "lucide-react";
import type {ShowFormValues} from "../../types";

const showSchema = z.object({
    name: z.string().min(1, "Title is required"),
    startTime: z
        .string()
        .refine((val) => new Date(val) > new Date(), "Start time must be in the future")
        .transform((val) => new Date(val).toISOString()), // convert to ISO string for backend
    totalSeats: z
        .string()
        .refine((val) => Number(val) > 0, "Total seats must be at least 1")
        .transform(Number),
    duration: z
        .string()
        .refine((val) => Number(val) > 0, "Duration must be at least 1 minute")
        .transform(Number)
        .default(1),
});



export default function Admin() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const {register, handleSubmit, reset, formState: {errors}} = useForm<ShowFormValues>({
        resolver: zodResolver(showSchema),
    });

    const onSubmit = async (data: z.infer<typeof showSchema>) => {
        try {
            setLoading(true);
            setMessage(null);

            const response = await fetch("http://localhost:5000/api/shows/new", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    ...data,
                    startTime: new Date(data.startTime).toISOString(),
                }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || "Failed to create show");
            }

            setMessage("Show created successfully!");
            reset();
        } catch (err: any) {
            setMessage(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Page className="flex items-center justify-center min-h-[80vh]">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md p-6 border rounded-xl shadow-md bg-card border-card flex flex-col gap-4 bg-background"
            >
                <h2 className="text-2xl font-bold text-center text-foreground/70">
                    Add New Show
                </h2>

                {/* Name */}
                <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-1 font-medium text-gray-700">
                        <Clock className="w-5 h-5 text-primary"/> Show Title
                    </label>
                    <input
                        type="text"
                        {...register("name")}
                        className="w-full p-2 border bg-white/10 border-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter show title"
                    />
                    {errors.name && (
                        <span className="text-red-500 text-sm">{errors.name.message}</span>
                    )}
                </div>

                {/* Start Time */}
                <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-1 font-medium text-gray-700">
                        <Calendar className="w-5 h-5 text-blue-500"/> Start Time
                    </label>
                    <input
                        type="datetime-local"
                        {...register("startTime")}
                        className="w-full p-2 border bg-white/10 border-card rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.startTime && (
                        <span className="text-red-500 text-sm">{errors.startTime.message}</span>
                    )}
                </div>

                {/* Total Seats */}
                <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-1 font-medium text-gray-700">
                        <Armchair className="w-5 h-5 text-purple-500"/> Total Seats
                    </label>
                    <input
                        type="number"
                        {...register("totalSeats")}
                        className="w-full p-2 border bg-white/10 border-card rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter total seats"
                    />
                    {errors.totalSeats && (
                        <span className="text-red-500 text-sm">{errors.totalSeats.message}</span>
                    )}
                </div>

                {/* Duration */}
                <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-1 font-medium text-gray-700">
                        <Clock className="w-5 h-5 text-red-500"/> Duration (minutes)
                    </label>
                    <input
                        type="number"
                        {...register("duration")}
                        className="w-full p-2 border bg-white/10 border-card rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter duration"
                    />
                    {errors.duration && (
                        <span className="text-red-500 text-sm">{errors.duration.message}</span>
                    )}
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Show"}
                </Button>

                {message && (
                    <div className="mt-2 p-2 text-center text-primary/70 bg-card/20 rounded">
                        {message}
                    </div>
                )}
            </form>
        </Page>
    );
}
