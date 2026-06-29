import { createContext, useState, useEffect } from 'react';
import Router from 'next/router';
import saphira from '../services/saphira';

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const validateSession = async () => {
            try {
                const res = await saphira.getLectures();
                setIsAuthenticated(res?.status === 200);
            } catch (error) {
                setIsAuthenticated(false);
            }
        };

        validateSession();
    }, []);

    const signIn = async (username, password) => {
        try {
            const res = await saphira.adminLogIn(username, password);

            if (res.status === 200) {
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            console.log("Erro ao fazer login", error);
            return false;
        }
    }

    const signOut = async () => {
        try {
            const res = await saphira.adminLogOut();

            if (res.status === 200) {
                setIsAuthenticated(false);
                Router.push('/');
            }
        } catch (error) {
            console.log("Erro ao fazer logout", error);
        }
    }

    return <AuthContext.Provider value={{
        isAuthenticated,
        signIn,
        signOut
    }}>{children}</AuthContext.Provider>;
}

export const AuthConsumer = AuthContext.Consumer;
export default AuthContext;