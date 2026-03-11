import { createContext, useEffect, useState, type ReactNode } from "react";

interface AuthContextType {
    token: string | null;
    login: (jwt: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null> (null);

export const AuthProvider = ({children}: {children: ReactNode}) => {

    const [token, SetToken] = useState<string | null> (null)
    useEffect(() => {
        const stored = localStorage.getItem("token");
        if(stored) SetToken(stored);
    }, []);

    const login = (jwt: string) => {
        localStorage.setItem("token", jwt);
        SetToken(jwt);
    };
    
    const logout = () => {
        localStorage.removeItem("token");
        SetToken(null);
    }

    return(
        <AuthContext.Provider value = {{token, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};