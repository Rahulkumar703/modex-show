import {useEffect, useState} from "react";
import type {APIResponse, Show} from "../../types";
import Skeleton from "../components/skeleton.tsx";
import ShowCard from "../components/show-card.tsx";
import Page from "../components/Page.tsx";

export default function Shows() {
    const [shows, setShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const date = new Date();

    useEffect(() => {
        const controller = new AbortController();

        const fetchShows = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/shows', {signal: controller.signal});
                if (!response.ok) throw new Error('Network response was not ok');

                const data: APIResponse<Show[]> = await response.json();
                setShows(data.data);
            } catch (error: any) {
                if (error.name === 'AbortError') return;
                console.error('Error fetching shows:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchShows();

        return () => controller.abort();
    }, []);

    if (loading) return <Loading/>

    return (
        <Page className={'gap-10'}>
            {
                shows.filter(show => new Date(show.endTime) < date).length !== 0 &&
                <div className={'flex flex-col gap-6'}>
                    <h1 className={'text-4xl font-bold text-foreground/50'}>Past Shows</h1>
                    <div className={'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-2'}>
                        {shows.filter(show => new Date(show.endTime) < date).map(show => (
                            <ShowCard show={show} key={show.id} disabled/>
                        ))}
                    </div>
                </div>
            }
            {
                shows.filter(show => new Date(show.startTime) <= date && new Date(show.endTime) >= date).length !== 0 &&
                <div className={'flex flex-col gap-6'}>
                    <h1 className={'text-4xl font-bold text-foreground/50'}>Running Shows</h1>
                    <div className={'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-2'}>
                        {shows.filter(show => new Date(show.startTime) <= date && new Date(show.endTime) >= date).map(show => (
                            <ShowCard show={show} key={show.id}/>
                        ))}
                    </div>
                </div>
            }
            {
                shows.filter(show => new Date(show.startTime) > date).length !== 0 &&
                <div className={'flex flex-col gap-6'}>
                    <h1 className={'text-4xl font-bold text-foreground/50'}>Upcoming Shows</h1>
                    <div className={'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-2'}>
                        {shows.filter(show => new Date(show.startTime) > date).map(show => (
                            <ShowCard show={show} key={show.id}/>
                        ))}
                    </div>
                </div>
            }
        </Page>
    );
};

const Loading = () => {
    return (
        <div className={'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4:'}>
            <Skeleton className="w-full h-20"></Skeleton>
        </div>
    );
}
