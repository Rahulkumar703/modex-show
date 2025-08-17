export interface APIResponse<T> {
    message: string;
    data: T;
}

export interface Show {
    id: string
    name: string
    endTime: string
    startTime: string
    totalSeats: number
    createdAt: string
    updatedAt: string
}

export interface ShowWithSeats extends Show {
    bookedSeats: number[]
}

export interface Booking {
    id: string;
    bookingRequestId: string;
    seats: number[];
}

export interface BookedShow {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    totalSeats: number;
    createdAt: string;
    updatedAt: string;
    bookings: Booking[];
}