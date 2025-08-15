import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from "./pages/Home.tsx";
import NotFound from "./pages/NotFound.tsx";
import Admin from "./pages/Admin.tsx";
import Header from "./components/header.tsx";
import Login from "./pages/Login.tsx";
import {useAuth} from "./context/authContext.tsx";
import Show from "./pages/Show.tsx";
import Shows from "./pages/Shows.tsx";

function App() {

    const {role} = useAuth();

    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/" index element={<Home/>}/>

                {/* Admin route */}
                {role === 'ADMIN' && <Route path="/admin" element={<Admin/>}/>}

                {/* User route */}
                {role ?
                    <>
                        <Route path="/shows" element={<Shows/>}/>
                        <Route path="/show/:showId" element={<Show/>}/>
                    </>
                    :
                    <Route path="/login" element={<Login/>}/>
                }

                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;