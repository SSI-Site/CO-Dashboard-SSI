import { createContext, useState, useEffect } from 'react';
import Router from 'next/router';
import cookie from 'js-cookie';
import saphira from '../services/saphira';

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const savedKey = cookie.get('co-auth');
        if (savedKey) {
            setIsAuthenticated(true);
        }
    }, []);

    const signIn = async (username, password) => {
        try {
            const res = await saphira.adminLogIn(username, password);

            if (res.status === 200) {
                setSession(true);
                setIsAuthenticated(true);
                Router.push('/presential');
                return true;
            }
            return false
        } catch (error) {
            console.log("Erro ao fazer login", error);
            return false;
        }
    }

    const signOut = async () => {
        try {
            const res = await saphira.adminLogOut();

            if (res.status === 200) {
                setSession(false);
                setIsAuthenticated(false);
                Router.push('/');
            }
        } catch (error) {
            console.log("Erro ao fazer logout", error);
        }
    }

    const setSession = (session) => {
        if (session) {
            cookie.set('co-auth', session, {
                expires: 1,
            });
        } else {
            cookie.remove('co-auth');
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