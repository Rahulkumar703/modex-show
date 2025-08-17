import type {Show} from "../../types";
import {format} from "date-fns";
import {Armchair, Calendar, Clock} from "lucide-react";
import {Link} from "react-router-dom";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";

function ShowCard({show, disabled, admin}: { show: Show; disabled?: boolean, admin: boolean }) {
    const start = new Date(show.startTime);
    const end = new Date(show.endTime);

    const date = format(start, "MMM dd");
    const startFormatted = format(start, "h:mm a");
    const endFormatted = format(end, "h:mm a");

    const cardContent = (
        <Card
            className="w-full h-full hover:scale-105 transition-transform group">
            <CardHeader>
                <CardTitle>{show.name}</CardTitle>
            </CardHeader>
            <CardContent className={'flex gap-2 flex-col'}>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Calendar className="w-5 h-5 text-blue-500"/>
                    <span className="font-medium">{date}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Clock className="w-5 h-5 text-red-500"/>
                    <span className="font-medium">{startFormatted}</span>
                    <span className="mx-1">-</span>
                    <span className="font-medium">{endFormatted}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Armchair className="w-5 h-5 text-purple-500"/>
                    <span className="font-medium">{show.totalSeats} seats</span>
                </div>
            </CardContent>
        </Card>
    );

    if (disabled && !admin) return cardContent;

    return <Link to={`${admin ? `/admin/bookings/${show.id}` : `/show/${show.id}`}`}>{cardContent}</Link>;
}

export default ShowCard;
