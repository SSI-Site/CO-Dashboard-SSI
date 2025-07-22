import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import styled from 'styled-components';
import Image from 'next/image';
import useAuth from '../hooks/useAuth';
import Meta from '../src/infra/Meta';

// components
import Button from '../src/components/Button';

const Login = () => {

    const router = useRouter();
    const { isAuthenticated, signIn } = useAuth();
    const { register, setError, clearErrors, formState: { errors }, handleSubmit } = useForm();

    const [isLoading, setIsLoading] = useState(false);

    
    const onSubmit = data => {
        setIsLoading(true);
        
        const isSignInValid = signIn(data.user, data.password);
        // console.log(isSignInValid);
        
        if (!isSignInValid) {
            setError("credentials" , { type: "focus" }, { shouldFocus: true });
        }

        setIsLoading(false);
    };

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/presential");
        }
    }, [isAuthenticated, router]);

    return (
        <>
            <Meta title='COSSI 2025 | Login' />

            <LoginWrapper>
                <div className='logo-container'>
                    <Image 
                    src='./images/logos/logo_horizontal.svg' 
                    alt='SSI 2025 - Logo' 
                    width = {198}
                    height = {48}
                    />
                </div>
                <div className='section-container'>
                    <div className = 'section-header'>  
                        <h2>Login</h2>
                        <p>Acesso exclusivo para a Comissão Organizadora da SSI 2025</p>
                    </div>
                    <FormWrapper>
                        <form onSubmit={handleSubmit(onSubmit)}>

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
                                    <img src='./loading.svg' alt='SSI 2025 - Loading' />
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
    background-color: var(--background-neutrals-primary);
    border: 1px solid green;
    padding-inline: 1rem;
    gap: 3rem;

    .logo-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        border: 1px solid yellow;

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
        align-items: flex-start;
        background-color: var(--color-neutral-800); 
        gap: 1rem;
        //border: 1px solid red;

        .section-header{
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
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
            font: 400 0.875rem/1.5rem 'AT Hauss Aero';
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
        padding: 0.75rem 1rem;

        border: 2px solid;
        border-color: var(--background-neutrals-inverse);
        background: transparent;
        background-clip: padding-box;
        color: var(--background-neutrals-inverse);

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
        font: 700 0.875rem/1.5rem 'AT Aero Bold';
        width: 100%;
        margin-bottom: .5rem;
    }
`