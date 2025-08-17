import {Button} from "@/components/ui/button.tsx";
import {Home} from "lucide-react";
import Page from "@/components/Page.tsx";
import {useNavigate} from "react-router-dom";

function NotFound() {

    const navigate = useNavigate();
    const goHome = () => {
        navigate('/');
    }

    return (
        <Page className={'items-center justify-center'}>
            <div className={'flex flex-col gap-2 text-center bg-card p-6 rounded-lg shadow-xl'}>
                <h1 className={'text-4xl font-bold'}>404 - Page Not Found</h1>
                <p className={'text-lg text-neutral-500'}>The page you are looking for does not exist.</p>

                <Button className={'mt-10'} onClick={goHome}>
                    <Home/>
                    Home
                </Button>
            </div>
        </Page>
    );
}

export default NotFound;