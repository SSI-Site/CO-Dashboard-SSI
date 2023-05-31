import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useForm } from "react-hook-form";

import useAuth from '../hooks/useAuth';
import Meta from '../src/infra/Meta';
import Button from '../src/components/Button';

const Login = () => {

    const router = useRouter();
    const { key, signIn } = useAuth();
    const { register, setError, clearErrors, formState: { errors }, handleSubmit } = useForm();

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = data => {
        setIsLoading(true);
        const isSignInValid = signIn(data.user, data.password);

        if (isSignInValid) {
            router.push("/presential");
        } else {
            setError("credentials" , { type: "focus" }, { shouldFocus: true });
        }

        setIsLoading(false);
    };

    const checkKey = () => {
        if (key) {
            router.push("/presential");
        }
    }

    useEffect(() => {
        // checkKey();
    }, []);

    return (
        <>
            <Meta title='CO SSI 2023 | Login' />

            <LoginWrapper>
                <h1>Login</h1>
                <FormWrapper>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h3> Entrada exclusiva para a Comissão Organizadora da SSI de 2023</h3>

                        {!isLoading &&
                            <>
                                <InputBox>
                                    <label htmlFor='user'> Usuário </label>
                                    <input id='user' type='text' className={errors.user && 'error-border'}
                                        {...register("user", {required: true, minLength: 1 })} />
                                    {errors.user && <ErrorMessage> Usuário inválido </ErrorMessage>}
                                </InputBox>

                                <InputBox>
                                    <label htmlFor='password'> Senha </label>
                                    <input id='password' type='password' className={errors.password && 'error-border'}
                                        {...register("password", {required: true, minLength: 1 })} />
                                    {errors.password && <ErrorMessage> Senha inválida </ErrorMessage>}
                                </InputBox>

                                <Button onClick={() => {clearErrors("credentials")}}> Entrar </Button>

                                {errors.credentials && <p> Credenciais inválidas </p> }
                            </>
                        }

                        {isLoading &&
                            <Loading>
                                <img src='./loading.svg' alt='SSI 2023 - Loading' />
                            </Loading>
                        }
                    </form>
                </FormWrapper>
            </LoginWrapper>
        </>
    )
}

export default Login;


const Loading = styled.figure`
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 50%;
        max-width: 250px;
    }
`

const LoginWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    h3 {
        margin: 2rem 0;
    }

    p {
        margin-top: 1rem;
    }

    label {
        color: var(--color-text);
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
    }

    input {
        border: unset;
        background-color: #241D3C;
        filter: brightness(130%);

        width: 90%;
        border-radius: 5px;
        padding: 8px 15px;
        color: var(--color-text);
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