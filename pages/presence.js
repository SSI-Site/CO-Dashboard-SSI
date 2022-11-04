import { React, useState, useEffect } from 'react';
import styled from 'styled-components';
import useAuth from '../hooks/useAuth';
import { useRouter } from 'next/router';

import Meta from '../src/infra/Meta';
import NavBar from '../src/patterns/base/Nav';

const Presence = () => {
    const router = useRouter();
    const { key, signIn } = useAuth();

    useEffect( () => {
        if(key === "key") console.log("key valida");
        else console.log("sem key");
    })

    return (
        <>
            <Meta title='SSI 2022 | Presença' />
            <NavBar />
            <PresenceWrapper>
                <h1>Presença</h1>

                {key === "key" &&
                    <h1>KEY VALIDA</h1>
                }

                <br/>

                {key !== "key" &&
                    <h1>KEY INVALIDA</h1>
                }
            </PresenceWrapper>
        </>
    )
}

export default Presence;

const PresenceWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    padding: 70px 0;
`
