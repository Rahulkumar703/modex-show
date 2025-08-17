import {useEffect, useState} from "react";
import type {APIResponse, ShowWithSeats} from "../../types";
import Skeleton from "../components/skeleton.tsx";
import Page from "../components/Page.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {Armchair, Calendar, Clock, Loader2} from "lucide-react";
import {format} from "date-fns";
import {Button} from "@/components/ui/button.tsx";
import {toast} from "sonner";

type BookingStatus = "PENDING" | "CONFIRMED" | "FAILED";

export default function Show() {
    const [show, setShow] = useState<ShowWithSeats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [bookingStatus, setBookingStatus] = useState<BookingStatus | null>(null);

    const {showId} = useParams<{ showId: string }>();
    const navigate = useNavigate();
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

    useEffect(() => {
        const controller = new AbortController();
        const fetchShow = async () => {
            try {
                if (!showId) return navigate("/shows");

                const response = await fetch(`http://localhost:5000/api/shows/${showId}`, {
                    signal: controller.signal,
                });
                if (!response.ok) {
                    const err = await response.json();
                    toast.error(err.message || "Network error");
                    return;
                }
                const data: APIResponse<ShowWithSeats> = await response.json();
                setShow(data.data);

            } catch (error) {
                if (error instanceof Error) {
                    if (error.name === "AbortError") return;
                    toast.error(error.message);
                }
                console.error("Error fetching show:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchShow();
        return () => controller.abort();
    }, [showId, navigate]);

    const addSeat = (seat: number) => {
        if (selectedSeats.includes(seat)) {
            setSelectedSeats(selectedSeats.filter((s) => s !== seat));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
        setBookingStatus(null);
    };

    const bookSeats = async () => {
        try {
            setBookingStatus("PENDING");
            const response = await fetch(`http://localhost:5000/api/bookings/new`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({showId, seatNumbers: selectedSeats}),
            });
            if (!response.ok) {
                const err = await response.json();
                toast.error(err.message || "Network error");
                return;
            }

            const data: { message: string; requestId: string } = await response.json();
            toast.info(`waiting for confirmation for booking id : ${data.requestId}`);

            const interval = setInterval(async () => {
                const statusRes = await fetch(`http://localhost:5000/api/bookings/${data.requestId}`);
                if (!statusRes.ok) return;

                const statusData: {
                    message: string;
                    data: { status: BookingStatus; id: string };
                } = await statusRes.json();

                setBookingStatus(statusData.data.status);

                if (statusData.data.status !== "PENDING") {
                    clearInterval(interval);
                    // Update booked seats in the grid
                    if (show) {
                        setShow({
                            ...show,
                            bookedSeats: [...show.bookedSeats, ...selectedSeats],
                        });
                    }
                    if (statusData.data.status === "CONFIRMED") {
                        toast.success(statusData.message);
                    } else
                        toast.error(statusData.message);
                    setSelectedSeats([]); // Reset selection
                }
            }, 1000);
        } catch (error) {
            setBookingStatus("FAILED");
            if (error instanceof Error) {
                if (error.name === "AbortError") return;
                toast.error(error.message);
            }
            console.error("Error booking seats:", error);
        }
    };

    if (loading || !show) return <Loading totalSeats={show?.totalSeats || 100}/>;

    const start = new Date(show.startTime);
    const end = new Date(show.endTime);

    const date = format(start, "MMM dd");
    const startFormatted = format(start, "h:mm a");
    const endFormatted = format(end, "h:mm a");

    const statusColor = {
        PENDING: "bg-card/70 text-blue-700 border-blue-500",
        CONFIRMED: "bg-card/70 text-green-700 border-green-500",
        FAILED: "bg-card/70 text-red-700 border-red-500",
    } as const;

    return (
        <Page className="gap-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold text-foreground/80">Booking for {show?.name}</h1>
                <div className="flex gap-4">
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                        <Calendar className="w-5 h-5 text-blue-500"/>
                        <span className="font-medium">{date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                        <Clock className="w-5 h-5 text-red-500"/>
                        <span className="font-medium">{startFormatted}</span>
                        <span className="mx-1">-</span>
                        <span className="font-medium">{endFormatted}</span>
                    </div>
                </div>
            </div>

            <div
                className="w-full h-8 bg-card/80 border border-primary rounded-t-lg flex items-center justify-center text-white font-semibold">
                SCREEN
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(50px,1fr))] gap-2">
                {Array.from({length: show.totalSeats}).map((_, index) => {
                    const isBooked = show.bookedSeats.includes(index + 1);
                    const isSelected = selectedSeats.includes(index + 1);
                    return (
                        <button
                            key={index}
                            disabled={isBooked || bookingStatus === "PENDING"}
                            onClick={() => addSeat(index + 1)}
                            className={`w-12 h-12 border-card rounded-lg shadow-md flex items-center justify-center transition-colors ${
                                isBooked
                                    ? "bg-card/30 border  text-foreground/20"
                                    : isSelected
                                        ? "bg-primary cursor-pointer text-card"
                                        : "bg-card hover:bg-primary hover:text-card cursor-pointer text-foreground/70"
                            }`}
                        >
                            <span className="font-medium">{index + 1}</span>
                        </button>
                    );
                })}
            </div>

            {selectedSeats.length > 0 && bookingStatus !== "PENDING" && (
                <Button disabled={loading} onClick={bookSeats}>
                    <Armchair className="w-5 h-5"/>
                    Book {selectedSeats.length} Seats
                </Button>
            )}

            {bookingStatus && (
                <div
                    className={`mt-4 p-3 border-l-4 rounded shadow flex items-center gap-2 ${
                        statusColor[bookingStatus]
                    }`}
                >
                    {bookingStatus === "PENDING" && <Loader2 className="animate-spin w-5 h-5"/>}
                    <span className="font-medium">{bookingStatus}</span>
                </div>
            )}
        </Page>
    );
}

// Loading skeleton
const Loading = ({totalSeats}: { totalSeats: number }) => (
    <Page className="gap-10">
        <Skeleton className="w-64 h-8"/>
        <Skeleton className="w-32 h-6"/>
        <Skeleton className="w-full h-8"/>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(50px,1fr))] gap-2">
            {Array.from({length: totalSeats}).map((_, index) => (
                <Skeleton key={index} className="w-12 h-12"/>
            ))}
        </div>
    </Page>
);
