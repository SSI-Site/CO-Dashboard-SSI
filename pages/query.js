import { React, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';

import useAuth from '../hooks/useAuth';
import saphira from '../services/saphira';
import Meta from '../src/infra/Meta';
import NavBar from '../src/patterns/base/Nav';
import Button from '../src/components/Button';

const Query = () => {

    const router = useRouter();
    const { key } = useAuth();
    const { register, getValues, setError, formState: { errors }, handleSubmit, reset } = useForm();

    const [isKeyPresent, setIsKeyPresent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isListingPresences, setIsListingPresences] = useState(false);
    const [userPresences, setUserPresences] = useState([]);
    const [userEmail, setUserEmail] = useState("");

    const onSubmit = data => {
        setIsLoading(true);

        listPresences(data.email);
        setIsListingPresences(false);

        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    };

    const checkKey = () => {
        if (key) {
            setIsKeyPresent(true);
        } else {
            setIsKeyPresent(false);
            router.push("/");
        }
    }

    const listPresences = (email) => {
        setIsLoading(true);
        setUserEmail(email);

        saphira.listPresences(email)
            .then((res) => {
                setUserPresences([...res.data]);
                setIsLoading(true);
            })
            .catch(() => {
                setUserPresences([]);
                setIsLoading(true);
            })
    }

    const countOnlinePresences = () => {
        if (!userPresences) return;
        let count = 0;

        userPresences.forEach((lecture) => {
            if (lecture.online) count++;
        });

        console.log(count);
        return count;
    }

    const countPresencialPresences = () => {
        if (!userPresences) return;
        let count = 0;

        userPresences.forEach((lecture) => {
            if (!lecture.online) count++;
        });

        return count;
    }


    const clearPresences = () => {
        setUserPresences([]);
    }

    useEffect(() => {
        // checkKey();
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

            <Meta title='CO SSI 2023 | Consulta' />

            <NavBar />
            <QueryWrapper>
                <div className='section-container'>

                    <h3>Consulta</h3>

                    <h5 className='page-description'> Número de presenças nas palestras :)</h5>

                    {/* {isKeyPresent && */}
                        <FormWrapper>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {!isLoading &&
                                    <>
                                        <InputBox>
                                            <label htmlFor='email'> E-mail do inscrito: </label>
                                            <input id='email' type='text' className={errors.email && 'error-border'}
                                                {...register("email", {
                                                    required: true,
                                                    minLength: 2,
                                                    maxLength: 60,
                                                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Formato de email inválido" }
                                                })
                                                } />
                                            {errors.email && <ErrorMessage> E-mail inválido </ErrorMessage>}
                                        </InputBox>

                                        {/* <Button> Registrar </Button> */}

                                        {userPresences.length === 0 ?
                                            <Button onClick={() => setIsListingPresences(true)}> Listar presenças </Button>
                                            :

                                            <PresencesList>
                                                <h3>E-mail: {userEmail}</h3>
                                                <h3>Presenças online: {countOnlinePresences()}</h3>
                                                <h3>Presenças presenciais: {countPresencialPresences()}</h3>
                                                <ul>
                                                    {userPresences.map((lecture, key) => <li key={key}> * {lecture.talk_title} - {lecture.online ? "Online" : "Presencial"}</li>)}
                                                </ul>

                                                <Button type="button" onClick={() => clearPresences()}> Limpar </Button>
                                            </PresencesList>
                                        }
                                    </>
                                }

                                {isLoading &&
                                    <Loading>
                                        <img src='./loading.svg' alt='SSI 2023 - Loading' />
                                    </Loading>
                                }
                            </form>
                        </FormWrapper>
                    {/* } */}
                </div>
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
    background: url('./images/background_imgs/background5_mobile.svg') no-repeat;
    background-size: cover;

    .page-description {
        text-align: center;
    }

    .section-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-block: 3.5rem;
        margin-block: 3.75rem; /* match navbar height */
        gap: 3rem;
    }

    @media (min-width:1000px) {
        background-image: url('./images/background_imgs/background5_desktop.svg');
    }
`

const ErrorMessage = styled.span`
    color: var(--color-invalid);
    text-decoration: underline;
    position: absolute;
    bottom: 0;
`

const FormWrapper = styled.section`
    width: 100%;

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    input {
        border: 4px solid transparent;
    }


    label {
        color: var(--color-text);
        margin-bottom: 10px;
    }

    button {
        margin-top: 2rem;
    }

    .error-border {
        border: 4px solid var(--color-invalid);
    }
`

const InputBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    padding: 1.5rem 20px;

    input {
        border: unset;
        background-color: #241D3C;
        filter: brightness(130%);

        width: 90%;
        border-radius: 5px;
        padding: 8px 15px;
        color: var(--color-text);
        text-align: center;
    }

    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px #241D3C inset;
        -webkit-text-fill-color: var(--color-text);
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    /* Firefox */
    input[type=number] {
        -moz-appearance: textfield;
    }
`

const PresencesList = styled.div`
    text-align: center;
    margin-top: 1rem;
    color: var(--color-text);

    ul {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        text-align: center;

        width: 100%;
        padding: 0 5%;

        li {
            margin-bottom: 10px;
        }
    }
`