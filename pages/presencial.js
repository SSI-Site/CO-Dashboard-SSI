import { React, useState, useEffect } from 'react';
import styled from 'styled-components';
import useAuth from '../hooks/useAuth';
import { useRouter } from 'next/router';

import { useForm } from "react-hook-form";
import Swal from 'sweetalert2'

import saphira from '../services/saphira';
import Meta from '../src/infra/Meta';
import NavBar from '../src/patterns/base/Nav';
import Button from '../src/components/Button';

const Presencial = () => {
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

        // setTimeout(() => {
        //     reset();
        //     setIsLoading(false);

        //     Swal.fire({
        //         icon: 'info',
        //         title: 'Presença Registrada para:',
        //         text: data.email,
        //         showConfirmButton: true,
        //         confirmButtonText: "Ok!",
        //         confirmButtonColor: "#151023"
        //     })
        // }, 2000);
    };

    const checkKey = () => {
        if (key) {
            setIsKeyPresent(true);
        } else {
            setIsKeyPresent(false);
            router.push("/");
        }
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

            <Meta title='CO SSI 2023 | Presencial' />
            <NavBar />
            <PresenceWrapper>
                <h1>Presencial</h1>

                <h3 className='page-description'> Registro de presenças presenciais :)</h3>

                {isKeyPresent &&
                    <FormWrapper>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {!isLoading &&
                                <>
                                    <InputBox1>
                                        <label htmlFor='lectureId'> ID da palestra: </label>
                                        <input id='lectureId' type='text' className={errors.lectureId && 'error-border'}
                                            {...register("lectureId", { required: true, minLength: 1, })} />
                                        {errors.lectureId && <ErrorMessage> ID inválido. </ErrorMessage>}
                                    </InputBox1>

                                    <InputBox2>
                                        <label htmlFor='email'> Documento do inscrito <br/>(NUSP ou CPF): </label>
                                        <input id='email' type='text' className={errors.email && 'error-border'}
                                            {...register("email", {
                                                required: true,
                                                minLength: 2,
                                                maxLength: 60,
                                            })
                                            } />
                                        {errors.email && <ErrorMessage> E-mail inválido </ErrorMessage>}
                                    </InputBox2>

                                    <Button> Registrar </Button>
                                </>
                            }

                            {isLoading &&
                                <Loading>
                                    <img src='./loading.svg' alt='SSI 2023 - Loading' />
                                </Loading>
                            }
                        </form>
                    </FormWrapper>
                }

            </PresenceWrapper>
        </>
    )
}

export default Presencial;

const Loading = styled.figure`
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 50%;
        max-width: 250px;
    }
`

const PresenceWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    padding: 100px 30px;

    .page-description {
        text-align: center;
        margin: 90px 0 30px 0;
        max-width: 1200px;
    }
`

const ErrorMessage = styled.span`
    color: white;
    text-decoration: underline 0.5px;
    position: absolute;
    bottom: 0;
`

const FormWrapper = styled.section`
    width: 100%;
    margin-top: 2rem;

    form {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        text-align: center;
    }

    h3 {
        margin: 2rem 0;
    }

    label {
        color: var(--color-text);
        font-size: 1.6rem;
        margin-bottom: 10px;
    }

    button {
        margin-top: 2rem;
    }

    .error-border {
        border: .5px solid white;
    }
`

const InputBox1 = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    max-width: 450px;
    padding: 1.5rem 20px;

    input {
        border: unset;
        background-color: #241D3C;
        filter: brightness(130%);

        width: 100px;
        border-radius: 5px;
        padding: 8px 15px;

        color: var(--color-text);
        font-size: 1.6rem;
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

const InputBox2 = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    max-width: 450px;
    padding: 1.5rem 20px;

    input {
        border: unset;
        background-color: #241D3C;
        filter: brightness(130%);

        width: 90%;
        border-radius: 5px;
        padding: 8px 15px;
        color: var(--color-text);
        font-size: 1.6rem;
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
            font-size: 16px;
        }
    }

`