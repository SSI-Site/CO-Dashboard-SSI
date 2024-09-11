import { useRouter } from 'next/router';
import { React, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import styled from 'styled-components';

import useAuth from '../hooks/useAuth';
import saphira from '../services/saphira';
import Meta from '../src/infra/Meta';
import NavBar from '../src/patterns/base/Nav';

// components
import Button from '../src/components/Button';
import SecondaryButton from '../src/components/SecondaryButton';
import UserGiftCard from '../src/components/UserGiftCard';

// assets
import gifts from '../data/gifts';

const Query = () => {

    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { register, getValues, setError, formState: { errors }, handleSubmit, reset } = useForm();

    const [accessAllowed, setAccessAllowed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState();
    const [userDocument, setUserDocument] = useState("");

    const onSubmit = data => {
        setIsLoading(true);

        getStudentInfo(data.document);

        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    const checkAuthentication = () => {
        if (isAuthenticated) {
            setAccessAllowed(true);
        } else {
            setAccessAllowed(false);
            router.push("/");
        }
    }

    const getStudentInfo = (document) => {
        setIsLoading(true);
        setUserDocument(document);

        saphira.getStudentInfo(document)
            .then((res) => {
                setUser(res.data);
                setIsLoading(true);
            })
            .catch((err) => {
                console.log("Erro ao buscar informações do estudante", err);
                setUser();
                setIsLoading(true);
            })
    }

    const clearUserInfo = () => {
        setUser();
    }

    useEffect(() => {
        checkAuthentication();
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
                }} 
            />

            <Meta title='CO SSI 2024 | Consultar presença' />

            <NavBar />
            <QueryWrapper>
                <div className='section-container'>

                    <h5>Consultar presença</h5>

                    {accessAllowed &&
                        <FormWrapper>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <p> Número de presenças nas palestras :)</p>
                                {!isLoading &&
                                    <>
                                        <InputBox>
                                            <label htmlFor='document'> Documento do inscrito: </label>
                                            <div className='input-btn'>
                                                <div className='form-input'>
                                                    <input id='document' type='text' placeholder='Insira o documento' className={errors.name && 'error-border'}
                                                        {...register("document", { required: false, minLength: 5 })} />
                                                </div>
                                                {!user ?
                                                    <Button> Consultar </Button>
                                                    :
                                                    <SecondaryButton type="button" onClick={() => clearUserInfo()}> Limpar consulta </SecondaryButton>
                                                }
                                            </div>
                                            {user &&
                                                <div className='lectures-count'>
                                                    <div className='total-lectures'>
                                                        <p>Total de registros:</p>
                                                        <h4>{user.total_presences_count}</h4>
                                                    </div>
                                                    <div className='in-person-lectures'>
                                                        <p>Registros presenciais:</p>
                                                        <h4>{user.in_person_presences_count}</h4>
                                                    </div>
                                                </div>
                                            }
                                        </InputBox>
                                    </>
                                }

                                {isLoading &&
                                    <Loading>
                                        <img src='./loading.svg' alt='SSI 2024 - Loading' />
                                    </Loading>
                                }
                            </form>
                        </FormWrapper>
                    }
                </div>

                {user && !isLoading &&
                    <GiftsProgressSection id='meus-brindes'>
                        <div className='user-gifts-wrapper'>
                            {Object.entries(gifts).map(([key, gift]) => {
                                return (
                                    <UserGiftCard key={key} index={key} gift={gift} totalPres={user.total_presences_count} presentialPres={user.in_person_presences_count}></UserGiftCard>
                                )
                            })}
                        </div>
                    </GiftsProgressSection>
                }
            </QueryWrapper>
        </>
    )
}

export default Query;


const Loading = styled.figure`
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 50%;
        max-width: 250px;
    }
`

const QueryWrapper = styled.section`
    margin-top: 3.75rem;
    display: flex;
    align-items: center;
    justify-content: center;

    .section-container {
        width: fit-content;
        height: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: var(--color-background-neutrals-secondary); 
        padding: 2rem 3.5rem;
        gap: 1.5rem;

        h5 {
            width: 100%;
        }

        @media (min-width: 480px) {
            width: 41rem;
        }
    }
`

const FormWrapper = styled.div`
    --color-invalid: #F24822;
    --color-valid: #14AE5C;
    width: 100%;

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 1rem;

        p {
            font: 700 1rem/1.5rem 'AT Aero Bold';
            text-align: left;
            width: 100%;
        }

        .input-btn {
            display: flex;
            width: 100%;
            gap: .5rem;
        }

        button {
            padding-inline: 1.5rem;
            width: fit-content;
        }
    }

    .form-input {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        background-color: var(--color-neutral-50);
        padding: 0.5rem;

        border: 2px solid white;
        background: transparent;
        background-clip: padding-box;
        color: white;

        &:has(input[type=text]:focus):not(:has(.error-border)):not(:has(.token-registered)) {
            border-color: var(--color-primary);
        }

        &:has(input[type=password]:focus):not(:has(.error-border)):not(:has(.token-registered)) {
            border-color: var(--color-primary);
        }

        &:has(.error-border) {
            border-color: var(--color-invalid);
        }

        &:has(.token-registered) {
            border-color: var(--color-valid);
        }

        input[type=text], input[type=password],  select {
            width: 95%;
            border: none;
            background-color: transparent;
            color: white;
            font: 400 1rem/1.5rem 'AT Aero';
        }

        select {
            color: var(--color-neutral-400);
        }

        ::placeholder {
            color: white;
            font: 400 1rem/1.5rem 'AT Aero';
        }

        ::-ms-input-placeholder {
            color: white;
            font: 400 1rem/1.5rem 'AT Aero';
        }
    }

    /* Firefox */
    input[type=number] {
        -moz-appearance: textfield;
    }

    span {
        font: 400 0.875rem/1rem 'AT Aero Bold';
        color: var(--color-invalid);
    }
`

const InputBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;

    label {
        font: 700 1.125rem/1.5rem 'AT Aero Bold';
        width: 100%;
        margin-bottom: .5rem;
    }

    .lectures-count {
        display: flex;
        justify-content: space-between;
        width: 100%;
        gap: 1rem;
        margin-top: 1rem;

        .total-lectures, .in-person-lectures {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            gap: .5rem;
            width: 100%;
            padding: 0.75rem;
        }

        .total-lectures {
            background-color: var(--color-primary); 
        }

        .in-person-lectures {
            background-color: white;

            p, h4 {
                color: var(--color-primary);
            }
        }
    }
`

const GiftsProgressSection = styled.section`
    padding-block: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;

    .user-gifts-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;

        @media(min-width: 800px) {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 2rem;
            justify-content: center;
        }
    }
`
