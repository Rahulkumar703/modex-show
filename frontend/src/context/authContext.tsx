import {createContext, type ReactNode, useContext, useEffect, useState} from "react";

type Role = 'ADMIN' | 'USER' | null;

type AuthContextType = {
    role: Role;
    login: (role: 'USER' | 'ADMIN') => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [role, setRole] = useState<Role>(null);

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role === 'ADMIN' || role === 'USER') {
            setRole(role as Role);
        } else {
            setRole(null);
        }
    }, [])

    const login = (role: 'USER' | 'ADMIN') => {
        setRole(role);
        localStorage.setItem('role', role);
    }

    const logout = () => {
        setRole(null);
        localStorage.removeItem('role');
    }

    return (
        <AuthContext.Provider value={{role, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
