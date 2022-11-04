import { React, useState, useEffect } from 'react';
import styled from 'styled-components';
import useAuth from '../hooks/useAuth';
import { useRouter } from 'next/router';

import Meta from '../src/infra/Meta';
import NavBar from '../src/patterns/base/Nav';
import Button from '../src/components/Button';

const Giveaway = () => {
    const router = useRouter();
    const { key } = useAuth();
    const [isKeyPresent, setIsKeyPresent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [giveawayResultName, setGiveawayResultName] = useState("Seu nome aparecerá aqui !!");

    const checkKey = () => {
        if (key) {
            setIsKeyPresent(true);
        } else {
            setIsKeyPresent(false);
            router.push("/");
        }
    }

    const getGivawayResult = () => {
        setIsLoading(true);

        setTimeout(() => {
            setGiveawayResultName("Lucas M. Sales")
            setIsLoading(false);
        }, 1000);
    }

    useEffect(() => {
        checkKey();
    }, []);

    return (
        <>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                    if (!document.cookie || !document.cookie.includes('co-auth')) {
                        window.location.href = "/"
                    }
                `
                }} />

            <Meta title='SSI 2022 | Sorteio' />
            <NavBar />
            <GiveawayWrapper>
                <h1>Sorteio</h1>

                {isKeyPresent &&
                    <ResultSection>

                        {!isLoading &&
                            <>
                                <h2>{giveawayResultName}</h2>

                                {giveawayResultName === "Seu nome aparecerá aqui !!" ?
                                    <Button onClick={() => getGivawayResult()}> Sortear </Button>
                                    :
                                    <Button onClick={() => setGiveawayResultName("Seu nome aparecerá aqui !!")}> Limpar </Button>
                                }
                            </>
                        }

                        {isLoading &&
                            <Loading>
                                <img src='./loading.svg' alt='SSI 2022 - Loading' />
                            </Loading>
                        }
                    </ResultSection>
                }
            </GiveawayWrapper>

        </>
    )
}

export default Giveaway;


const Loading = styled.figure`
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 50%;
        max-width: 250px;
    }
`

const GiveawayWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    padding: 70px 0;
`
const ResultSection = styled.section`
    margin: 100px auto;

    text-align: center;

    h2 {
        margin-bottom: 50px;
    }
`