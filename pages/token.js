import { React, useState, useEffect } from 'react';
import styled from 'styled-components';
import useAuth from '../hooks/useAuth';
import { useRouter } from 'next/router';

import { useForm } from "react-hook-form";

import saphira from '../services/saphira';
import Meta from '../src/infra/Meta';
import NavBar from '../src/patterns/base/Nav';
import Button from '../src/components/Button';

const Token = () => {
    const router = useRouter();
    const { key } = useAuth();

    const placeholderMessage = "O token aparecerá aqui!";

    const [isKeyPresent, setIsKeyPresent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [tokenGenerated, setTokenGenerated] = useState(placeholderMessage);
    
    const { register, getValues, setError, formState: { errors }, handleSubmit, reset } = useForm();
    
    const onSubmit = data => {
        
    }

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

            <Meta title='CO SSI 2023 | Token' />
            <NavBar />
            <TokenWrapper>
                <h1>Token</h1>

                {isKeyPresent &&
                    <>
                        <ResultSection>
                            {!isLoading &&
                                <>
                                    <h2 className={tokenGenerated !== placeholderMessage ? 'neon' : ''}> {tokenGenerated} </h2>

                                    <FormWrapper>
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <InputBox>
                                                <label htmlFor='lectureId'> Id da palestra: </label>
                                                <input id='lectureId' type='text' className={errors.lectureId && 'error-border'}
                                                    {...register("lectureId", { required: true, minLength: 1, })} />
                                                {errors.lectureId && <ErrorMessage> Id inválido. </ErrorMessage>}
                                            </InputBox>

                                            {tokenGenerated === placeholderMessage &&
                                                <Button type="button" /* onClick={() => gerarToken()*/> Gerar Token </Button>
                                            }

                                            {tokenGenerated !== placeholderMessage &&
                                                <Button type="button" /*onClick={() => setTokenGenerated(placeholderMessage)}*/> Limpar Token </Button>
                                            }
                                        </form>
                                    </FormWrapper>
                                </>
                            }

                            {isLoading &&
                                <Loading>
                                    <img src='./loading.svg' alt='SSI 2023 - Loading' />
                                </Loading>
                            }
                        </ResultSection>
                    </>
                }
            </TokenWrapper>

        </>
    )
}

export default Token;

const Loading = styled.figure`
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 50%;
        max-width: 250px;
    }
`

const TokenWrapper = styled.div`
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
const ResultSection = styled.section`
    height: 50vh;
    margin: 100px auto;

    text-align: center;

    h2 {
        margin-bottom: 60px;
    }

    .show-list-btn {
        margin-top: 30px;
        font-size: 20px;
    }

    .neon {
        color: #fff;
        text-shadow:
        0 0 1px #fff,
        0 0 20px var(--color-secondary),
        0 0 60px var(--color-secondary),
        0 0 70px var(--color-secondary),
        0 0 80px var(--color-secondary);
    }
`