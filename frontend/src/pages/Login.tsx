import Page from "../components/Page.tsx";
import Button from "../components/button.tsx";
import {useAuth} from "../context/authContext.tsx";
import {useNavigate} from "react-router-dom";

function Login() {
    const {login} = useAuth();
    const navigate = useNavigate();

    const loginAs = (role: 'ADMIN' | 'USER') => {
        login(role);
        // Redirect to the appropriate page based on the role
        if (role === 'ADMIN') {
            navigate('/admin');
        } else {
            navigate('/shows');
        }
    }

    return (
        <Page className={'items-center justify-center'}>
            <div className={'sm:min-w-md flex flex-col gap-2 text-center bg-card p-6 rounded-lg shadow-xl'}>
                <h1 className={'text-2xl font-bold'}>Login</h1>
                <p className={'text-muted-foreground'}>Please select your role to continue</p>
                <div className={'flex flex-col gap-2 mt-4'}>
                    <Button onClick={() => loginAs('ADMIN')}>Login as Admin</Button>
                    <Button onClick={() => loginAs('USER')}>Login as User</Button>
                </div>
            </div>
        </Page>
    );
}

export default Login;