import Page from "@/components/Page.tsx";
import {Link} from "react-router-dom";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Projector, Tickets} from "lucide-react";

export default function Admin() {


    return (
        <Page className="grid sm:grid-cols-2 grid-cols-1 items-center gap-6">
            <Link to="add-shows" className={'inline-block text-center flex-1'}>
                <Card className={'max-w-xl w-full h-full justify-center hover:bg-secondary'}>
                    <CardContent className={'flex items-center justify-center w-full'}>
                        <Projector className={'text-pink-500 size-20'}/>
                    </CardContent>
                    <CardHeader>
                        <CardTitle className={''}>Add New Show</CardTitle>
                    </CardHeader>
                </Card>
            </Link>
            <Link to="bookings" className={'inline-block text-center flex-1'}>
                <Card className={'max-w-xl w-full h-full justify-center hover:bg-secondary'}>
                    <CardContent className={'flex items-center justify-center w-full'}>
                        <Tickets className={'text-blue-500 size-20'}/>
                    </CardContent>
                    <CardHeader className={'flex items-center justify-center w-full'}>
                        <CardTitle>See All bookings</CardTitle>
                    </CardHeader>
                </Card>
            </Link>
        </Page>
    );
}
