import { React, useState, useEffect } from 'react';
import styled from 'styled-components';
import useAuth from '../hooks/useAuth';
import { useRouter } from 'next/router';

import { useForm } from "react-hook-form";
import Swal from 'sweetalert2'

import Meta from '../src/infra/Meta';
import NavBar from '../src/patterns/base/Nav';
import Button from '../src/components/Button';

const Presence = () => {
    const router = useRouter();
    const { key } = useAuth();
    const { register, setError, formState: { errors }, handleSubmit, reset } = useForm();

    const [isKeyPresent, setIsKeyPresent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = data => {
        setIsLoading(true);

        console.log(Swal);

        setTimeout(() => {
            reset();
            setIsLoading(false);

            Swal.fire({
                icon: 'info',
                title: 'Presença Registrada para:',
                text: data.email,
                showConfirmButton: true,
                confirmButtonText: "Ok!",
                confirmButtonColor: "#151023"
            })
        }, 2000);
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

            <Meta title='SSI 2022 | Presença' />
            <NavBar />
            <PresenceWrapper>
                <h1>Presença</h1>

                {isKeyPresent &&
                    <FormWrapper>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <h3> Registrar presença de participante: </h3>

                            {!isLoading &&
                                <>
                                    <InputBox>
                                        <label htmlFor='email'> Email </label>
                                        <input id='email' type='text' className={errors.email && 'error-border'}
                                            {...register("email", {
                                                required: true,
                                                minLength: 2,
                                                maxLength: 30,
                                                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Formato de email inválido" }
                                            })
                                            } />
                                        {errors.email && <ErrorMessage> {errors.email?.message} </ErrorMessage>}
                                    </InputBox>

                                    <Button> Enviar </Button>
                                </>
                            }

                            {isLoading &&
                                <Loading>
                                    <img src='./loading.svg' alt='SSI 2022 - Loading' />
                                </Loading>
                            }
                        </form>
                    </FormWrapper>
                }


            </PresenceWrapper>
        </>
    )
}

export default Presence;

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

const InputBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    max-width: 450px;
    padding: 1.5rem 20px;
    input {
        width: 90%;
        border-radius: 5px;
        padding: 8px 15px;
        color: var(--color-text);
        font-size: 1.6rem;
    }

    input {
        border: unset;
        background-color: #241D3C;
        filter: brightness(130%);

        width: 90%;
        border-radius: 5px;
        padding: 8px 15px;
        color: var(--color-text);
        font-size: 1.6rem;
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
