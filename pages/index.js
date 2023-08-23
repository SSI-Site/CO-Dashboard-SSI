import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useForm } from "react-hook-form";
import saphira from '../services/saphira';

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
        loginAdmin(data.user, data.password);

        if (isSignInValid) {
            router.push("/presential");
        } else {
            setError("credentials" , { type: "focus" }, { shouldFocus: true });
        }

        setIsLoading(false);
    };

    const loginAdmin = (user, password) => {
        setIsLoading(true);

        setTimeout(() => {
            saphira.adminLogIn(user, password)
                .then((res) => {
                    console.log("Deu bom o login: ", res.headers.set-cookie);
                    setIsLoading(false);
                    
                }, (err) => {
                    console.log("Deu ruim o login: ", res);
                    setIsLoading(false);
                });
        }, 2000);
    }

    const checkKey = () => {
        if (key) {
            router.push("/presential");
        }
    }

    useEffect(() => {
        checkKey();
    }, []);

    return (
        <>
            <Meta title='CO SSI 2023 | Login' />

            <LoginWrapper>
                <div className='section-container'>
                    <h3>Login</h3>
                    <FormWrapper>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <h5> Entrada exclusiva para a Comissão Organizadora da SSI de 2023</h5>

                            {!isLoading &&
                                <>
                                    <InputBox>
                                        <label htmlFor='user'> Usuário </label>
                                        <div className='form-input'>
                                            <input id='user' type='text' placeholder='Insira o usuário' className={errors.user && 'error-border'}
                                                {...register("user", {required: true, minLength: 1 })} />
                                        </div>
                                        {errors.user && <ErrorMessage> Usuário inválido </ErrorMessage>}
                                    </InputBox>

                                    <InputBox>
                                        <label htmlFor='password'> Senha </label>
                                        <div className='form-input'>
                                            <input id='password' type='password' placeholder='Insira a senha' className={errors.password && 'error-border'}
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
                                    <img src='./loading.svg' alt='SSI 2023 - Loading' />
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
    background: url('./images/background_imgs/background1_mobile.svg') no-repeat;
    background-size: cover;
    min-height: 100vh;

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

        h5 {
            margin-bottom: 2rem;
        }
    }

    @media (min-width:1000px) {
        background-image: url('./images/background_imgs/background1_desktop.svg');
    }
`

const ErrorMessage = styled.span`
    color: var(--color-invalid);
    text-decoration: underline;
    position: absolute;
    bottom: 0;
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
        border-radius: 5px;
        gap: 1rem;

        button {
            width: fit-content;
            max-width: 450px;
            margin-top: 1rem;
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
        border-radius: 16px;
        padding: 0.5rem;
        margin-left: -4px;

        border: 4px solid transparent;
        background-clip: padding-box;

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
        }

        select {
            color: var(--color-neutral-400);
        }
    }

    /* Firefox */
    input[type=number] {
        -moz-appearance: textfield;
    }

    span {
        font: 400 0.875rem/1rem 'Space_Mono_Bold';
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
    max-width: 450px;
    padding: 0 0 1.2rem 0;

    label {
        margin-bottom: .5rem;
    }
`