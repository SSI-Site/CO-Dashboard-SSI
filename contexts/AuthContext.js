import { createContext, useState, useEffect } from 'react';
import Router from 'next/router';
import cookie from 'js-cookie';

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const USER_KEY = process.env.NEXT_PUBLIC_AUTH_USERNAME;
    const PASS_KEY = process.env.NEXT_PUBLIC_AUTH_PASSWORD;
    const [key, setKey] = useState("");

    const signIn = (username, password) => {
        console.log("sining in")

        if(username === USER_KEY && password === PASS_KEY) {
            console.log("valid credentials")
            setKey(process.env.NEXT_PUBLIC_AUTH_TOKEN);
            setSession(true);
        }
    }

    const signOut = () => {
        setKey("");
        setSession(false);
        Router.push('/');
    }

    const setSession = (session) => {
        if (session) {
            cookie.set('co-auth', session, {
                expires: 1,
            });
        } else {
            cookie.remove('ssi-co-auth');
        }
    }

    return <AuthContext.Provider value={{
        key,
        signIn,
        signOut
    }}>{children}</AuthContext.Provider>;
}

export const AuthConsumer = AuthContext.Consumer;
export default AuthContext;