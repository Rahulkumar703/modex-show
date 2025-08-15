import {Link, useNavigate} from "react-router-dom";
import {LogIn, LogOut} from "lucide-react";
import {useAuth} from "../context/authContext.tsx";
import Button from "./button.tsx";

function Header() {
    const {role, logout} = useAuth();
    const navigate = useNavigate();
    return (
        <header className={'fixed top-0 left-0 z-50 h-20 p-4 flex items-center bg-card w-full'}>
            <div className={'max-w-7xl mx-auto w-full flex items-center justify-between'}>
                <Link to="/">
                    <img src="/logo.png" alt="Modex" className={'w-12 h-12 object-center'}/>
                </Link>

                {
                    !role ?
                        <Link to="/login" className={'font-bold flex items-center gap-2'}>
                            <LogIn className={'w-4 h-4'}/>
                            Login</Link>
                        :
                        <Button className={'bg-red-500 hover:bg-red-500/80'} onClick={() => {
                            navigate('/');
                            logout();
                        }}>
                            <LogOut className={'w-4 h-4'}/>
                        </Button>
                }
            </div>
        </header>
    );
}

export default Header;