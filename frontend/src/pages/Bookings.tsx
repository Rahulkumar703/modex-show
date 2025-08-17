import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Page from "../components/Page";
import Skeleton from "../components/skeleton";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import type { APIResponse, BookedShow } from "../../types";
import {SeatGrid} from "@/components/seat-grid.tsx";

export default function BookedShowPage() {
    const { showId } = useParams<{ showId: string }>();
    const [show, setShow] = useState<BookedShow | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const fetchShow = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/bookings/show/${showId}`, {
                    signal: controller.signal,
                });
                if (!response.ok) {
                    const err = await response.json();
                    toast.error(err.message || "Failed to fetch booked show");
                    return;
                }
                const data: APIResponse<BookedShow> = await response.json();
                setShow(data.data);
            } catch (error) {
                if (error instanceof Error && error.name !== "AbortError") {
                    toast.error(error.message);
                }
                console.error("Error fetching booked show:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchShow();
        return () => controller.abort();
    }, [showId]);

    if (loading || !show) return <Loading totalSeats={show?.totalSeats || 60} />;

    const start = new Date(show.startTime);
    const end = new Date(show.endTime);
    const date = format(start, "MMM dd");
    const startFormatted = format(start, "h:mm a");
    const endFormatted = format(end, "h:mm a");

    return (
        <Page className="gap-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold text-foreground/80">Booked Show: {show.name}</h1>
                <div className="flex gap-4">
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <span className="font-medium">{date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                        <Clock className="w-5 h-5 text-red-500" />
                        <span className="font-medium">{startFormatted}</span>
                        <span className="mx-1">-</span>
                        <span className="font-medium">{endFormatted}</span>
                    </div>
                </div>
            </div>

            <SeatGrid totalSeats={show.totalSeats} bookings={show.bookings} />
        </Page>
    );
}

const Loading = ({ totalSeats }: { totalSeats: number }) => (
    <Page className="gap-10">
        <Skeleton className="w-64 h-8" />
        <Skeleton className="w-32 h-6" />
        <Skeleton className="w-full h-8" />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(50px,1fr))] gap-2">
            {Array.from({ length: totalSeats }).map((_, index) => (
                <Skeleton key={index} className="w-12 h-12" />
            ))}
        </div>
    </Page>
);
