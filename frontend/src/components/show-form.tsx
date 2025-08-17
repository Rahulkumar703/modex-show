import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {DateTimePicker} from "@/components/ui/date-time-picker";
import {toast} from "sonner";
import type {APIResponse, Show} from "../../types";

const showSchema = z.object({
    name: z.string().min(1, "Title is required"),
    startTime: z.string().refine((val) => {
        console.log(val);
        return new Date(val).getTime() > Date.now()
    }, "Start time must be in the future"),
    totalSeats: z.number().min(1, "Total seats must be at least 1"),
    duration: z.number().min(1, "Duration must be at least 1 minute"),
});

export default function ShowForm() {
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState<Date | undefined>();
    const [time, setTime] = useState("");

    const createDate = (date?: Date | undefined, time?: string) => {
        if (!date || !time) {
            return;
        }
        const [hours, minutes, seconds = "00"] = time.split(":");
        const localDate = new Date(date);
        localDate.setHours(+hours);
        localDate.setMinutes(+minutes);
        localDate.setSeconds(+seconds);

        return localDate;
    }

    useEffect(() => {
        const now = new Date(Date.now() + 5 * 60 * 1000);
        setDate(now);

        const formattedTime = now.toLocaleTimeString("en-IN", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });

        setTime(formattedTime);
    }, []);

    const form = useForm<z.infer<typeof showSchema>>({
        resolver: zodResolver(showSchema),
        defaultValues: {
            name: "",
            startTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
            totalSeats: 1,
            duration: 40,
        },
    });


    const onSubmit = async (data: z.infer<typeof showSchema>) => {
        try {
            setLoading(true);
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
                toast.error(err.message || "Network error");
                return;
            }

            const result: APIResponse<Show> = await response.json();
            toast.success(result.message);
            form.reset();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to create show");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem className={'flex flex-col gap-3'}>
                            <FormLabel>Show Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Avengers" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="duration"
                    render={({field}) => (
                        <FormItem className={'flex flex-col gap-3'}>
                            <FormLabel>Duration (in minutes)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="120" {...field}
                                       onChange={(e) => field.onChange(Number(e.target.value))}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="totalSeats"
                    render={({field}) => (
                        <FormItem className={'flex flex-col gap-3'}>
                            <FormLabel>Total Seats</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="100" {...field}
                                       onChange={(e) => field.onChange(Number(e.target.value))}/>

                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="startTime"
                    render={({field}) => (
                        <FormItem className={'flex flex-col gap-3'}>
                            <FormLabel>Start Date & Time</FormLabel>
                            <FormControl>
                                <DateTimePicker
                                    date={date}
                                    time={time}
                                    onDateChange={(d) => {
                                        setDate(d);
                                        const result = createDate(d, time);
                                        if (result) field.onChange(result.toISOString());
                                    }}
                                    onTimeChange={(t) => {
                                        setTime(t);
                                        const result = createDate(date, t);
                                        if (result) field.onChange(result.toISOString());
                                    }}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Show"}
                </Button>
            </form>
        </Form>
    );
}
