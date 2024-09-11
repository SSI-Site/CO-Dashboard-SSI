import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import styled from 'styled-components';

import useAuth from '../hooks/useAuth';
import Meta from '../src/infra/Meta';

// components
import Button from '../src/components/Button';

const Login = () => {

    const router = useRouter();
    const { isAuthenticated, signIn } = useAuth();
    const { register, setError, clearErrors, formState: { errors }, handleSubmit } = useForm();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/presential");
        }
    }, [isAuthenticated, router]);

    const onSubmit = data => {
        setIsLoading(true);
        const isSignInValid = signIn(data.user, data.password);

        console.log(isSignInValid);

        if (isSignInValid) {
            router.push("/presential");
        } else {
            setError("credentials" , { type: "focus" }, { shouldFocus: true });
        }

        setIsLoading(false);
    };


    return (
        <>
            <Meta title='CO SSI 2024 | Login' />

            <LoginWrapper>
                <div className='logo-container'>
                    <img src='./images/logos/logo_horizontal.svg' alt='SSI 2024 - Logo' />
                </div>
                <div className='section-container'>
                    <h5>Login</h5>
                    <FormWrapper>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <p> Acesso exclusivo para a Comissão Organizadora da SSI 2024</p>

                            {!isLoading &&
                                <>
                                    <InputBox>
                                        <label htmlFor='user'> Usuário </label>
                                        <div className='form-input'>
                                            <input id='user' type='text' placeholder='Insira o usuário' className={`${errors.user && 'error-border'}`}
                                                {...register("user", {required: true, minLength: 1 })} />
                                        </div>
                                        {errors.user && <ErrorMessage> Usuário inválido </ErrorMessage>}
                                    </InputBox>

                                    <InputBox>
                                        <label htmlFor='password'> Senha </label>
                                        <div className='form-input'>
                                            <input id='password' type='password' placeholder='Insira a senha' className={`${errors.password && 'error-border'}`}
                                                {...register("password", {required: true, minLength: 1 })} />
                                        </div>
                                        {errors.password && <ErrorMessage> Senha inválida </ErrorMessage>}
                                    </InputBox>

                                    <Button type='submit' onClick={() => {clearErrors("credentials")}}> Entrar </Button>

                                    {errors.credentials && <p className='error-message'> Credenciais inválidas </p> }
                                </>
                            }

                            {isLoading &&
                                <Loading>
                                    <img src='./loading.svg' alt='SSI 2024 - Loading' />
                                </Loading>
                            }
                        </form>
                    </FormWrapper>
                </div>
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

const LoginWrapper = styled.section`
    display: flex;
    align-items: center;
    justify-content: center;

    .logo-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding-block: 4rem;

        img {
            height: 4rem;
        }
    }

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

const ErrorMessage = styled.span`
    color: var(--color-invalid);
    text-decoration: underline;
    position: absolute;
    bottom: -1.1rem;
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

        button {
            margin-top: 0.5rem;
        }

        .error-message {
            color: var(--color-invalid);
            text-decoration: underline;
            bottom: 0;
        }
    }

    .form-input {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 4rem;
        background-color: var(--color-neutral-50);
        padding: 0.5rem;
        margin-left: -4px;

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
            height: 100%;
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
`