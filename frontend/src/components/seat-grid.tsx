import type {BookedShow} from "../../types";
import {Button} from "@/components/ui/button.tsx";

export function SeatGrid({totalSeats, bookings}: { totalSeats: number; bookings: BookedShow["bookings"] }) {
    const bookingColorMap = new Map<string, string>();
    const colorPalette = [
        "bg-red-500",
        "bg-green-500",
        "bg-blue-500",
        "bg-yellow-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-orange-500",
        "bg-teal-500",
        "bg-indigo-500",
        "bg-rose-500",
    ];

    let colorIndex = 0;
    for (const booking of bookings) {
        if (!bookingColorMap.has(booking.bookingRequestId)) {
            bookingColorMap.set(booking.bookingRequestId, colorPalette[colorIndex % colorPalette.length]);
            colorIndex++;
        }
    }

    const seatToBookingMap = new Map<number, string>();
    for (const booking of bookings) {
        for (const seat of booking.seats) {
            seatToBookingMap.set(seat, booking.bookingRequestId);
        }
    }

    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(50px,1fr))] gap-2">
            {Array.from({length: totalSeats}).map((_, index) => {
                const seatNo = index + 1;
                const bookingId = seatToBookingMap.get(seatNo);
                const isBooked = !!bookingId;
                const colorClass = bookingId ? bookingColorMap.get(bookingId) : "";

                return (
                    <Button
                        key={seatNo}
                        disabled={true}
                        className={`w-12 h-12 rounded-lg shadow-sm font-semibold ${
                            isBooked ? `${colorClass} cursor-not-allowed opacity-80 text-white` : "bg-card hover:bg-primary hover:text-card text-foreground"
                        }`}
                    >
                        {seatNo}
                    </Button>
                );
            })}
        </div>
    );
}
