import Page from "@/components/Page.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useAuth} from "@/context/authContext.tsx";
import {useNavigate} from "react-router-dom";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {User, UserStar} from "lucide-react";

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
            <Card className={'sm:min-w-md flex flex-col gap-2'}>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                        Please select your role to continue
                    </CardDescription>
                </CardHeader>
                <CardContent className={'flex flex-col gap-2 mt-4'}>
                    <Button variant={'outline'} onClick={() => loginAs('ADMIN')}>
                        <UserStar />
                        Login as Admin</Button>
                    <Button onClick={() => loginAs('USER')}>
                        <User/>
                        Login as User</Button>
                </CardContent>
            </Card>
        </Page>
    );
}

export default Login;