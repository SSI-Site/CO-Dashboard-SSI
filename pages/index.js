import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import styled from 'styled-components';
import useAuth from '../hooks/useAuth';
import Meta from '../src/infra/Meta';

const Login = () => {

    const router = useRouter();
    const { key, signIn } = useAuth();

    useEffect( () => {
        signIn("user", "pass");
        console.log(key);
    }, [])

    return (
        <>
            <Meta title='SSI 2022 | Início' />
            <LoginWrapper>
                <h1>teste</h1>
            </LoginWrapper>

            <button onClick={() => router.push('/presence')}>logar</button>
        </>
    )
}

export default Login;

const LoginWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 70px 0;
`

