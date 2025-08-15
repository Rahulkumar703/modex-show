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

export interface  ShowFormValues {
    name: string;
    startTime: string;
    totalSeats: string;
    duration?: string;
};
