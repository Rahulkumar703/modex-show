import {Link, useNavigate} from "react-router-dom";
import {LogIn, LogOut, UserRoundCog} from "lucide-react";
import {useAuth} from "../context/authContext.tsx";
import {Button} from "@/components/ui/button.tsx";

function Header() {
    const {role, logout} = useAuth();
    const navigate = useNavigate();
    return (
        <header className={'fixed top-0 left-0 z-50 h-20 p-4 bg-background shadow-2xl flex items-center w-full'}>
            <div className={'max-w-7xl mx-auto w-full flex items-center justify-between'}>
                <Link to="/">
                    <img src="/logo.png" alt="Modex" className={'w-12 h-12 object-center'}/>
                </Link>
                <div className={'flex items-center gap-4'}>
                    {
                        role && role === "ADMIN" ? (
                            <Link to="/admin" className={'font-bold flex items-center gap-2'}>
                                <Button variant={'secondary'}>
                                    <UserRoundCog className={'w-4 h-4'}/>
                                    Admin
                                </Button>
                            </Link>
                        ) : null
                    }
                    {
                        !role ?
                            <Link to="/login" className={'font-bold flex items-center gap-2'}>
                                <Button variant={'ghost'}>
                                    <LogIn className={'w-4 h-4'}/>
                                    Login
                                </Button>
                            </Link>
                            :
                            <Button variant={'destructive'} onClick={() => {
                                navigate('/');
                                logout();
                            }}>
                                <LogOut className={'w-4 h-4'}/>
                            </Button>
                    }
                </div>
            </div>
        </header>
    );
}

export default Header;