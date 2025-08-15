import type {Show} from "../../types";
import {format} from "date-fns";
import {Armchair, Calendar, Clock} from "lucide-react";
import {Link} from "react-router-dom";

function ShowCard({show, disabled}: { show: Show; disabled?: boolean }) {
    const start = new Date(show.startTime);
    const end = new Date(show.endTime);

    const date = format(start, "MMM dd");
    const startFormatted = format(start, "h:mm a");
    const endFormatted = format(end, "h:mm a");

    const cardContent = (
        <div
            className="w-full h-full bg-card rounded-xl p-5 shadow-lg flex flex-col gap-3 hover:scale-105 transition-transform group">
            <h2 className="text-2xl font-bold text-foreground group-hover:text-primary">
                {show.name}
            </h2>

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
        </div>
    );

    if (disabled) return cardContent;

    return <Link to={`/show/${show.id}`}>{cardContent}</Link>;
}

export default ShowCard;
