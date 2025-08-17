import Page from "@/components/Page.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Ticket} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "@/context/authContext.tsx";

function Home() {
    const {role} = useAuth();
    const navigate = useNavigate();

    const redirect = () => {
        if (!role) {
            navigate('/login');
        } else {
            navigate('/shows');
        }
    };

    return (
        <Page className="p-0! max-w-full">
            <div
                className="flex flex-col gap-2 text-center bg-card flex-1 shadow-xl bg-[url('/hero.jpg')] bg-cover"
            >
                <div
                    className="bg-muted/10 flex items-center justify-center backdrop-blur w-full flex-1"
                >
                    <div className={'max-w-md flex items-center justify-center flex-col gap-6'}>

                        <h1 className="text-4xl font-bold text-accent">
                            Welcome to <span className="text-secondary-foreground">MODEX</span> Shows
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Experience the thrill of 4K movies with premium seating and immersive sound.
                            Grab your tickets now and enjoy the show!
                        </p>
                        <Button onClick={redirect}>
                            <Ticket className="w-5 h-5"/>
                            Book Your Seats
                        </Button>
                    </div>
                </div>
            </div>
        </Page>
    );
}

export default Home;
