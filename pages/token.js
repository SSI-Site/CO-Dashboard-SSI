import { React, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useForm } from "react-hook-form";

import useAuth from '../hooks/useAuth';
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

            <Meta title='CO SSI 2023 | Token' />

            <NavBar />
            <TokenWrapper>
                <div className='section-container'>

                    <h3>Token</h3>

                    <h5 className='page-description'> Geração de tokens do online :)</h5>

                    {/* {isKeyPresent && */}
                        <>
                            <ResultSection>
                                {!isLoading &&
                                    <>
                                        <h3 className={tokenGenerated !== placeholderMessage ? 'neon' : ''}> {tokenGenerated} </h3>

                                        <FormWrapper>
                                            <form onSubmit={handleSubmit(onSubmit)}>
                                                <InputBox>
                                                    <label htmlFor='lectureId'> ID da palestra: </label>
                                                    <input id='lectureId' type='text' className={errors.lectureId && 'error-border'}
                                                        {...register("lectureId", { required: true, minLength: 1, })} />
                                                    {errors.lectureId && <ErrorMessage> ID inválido. </ErrorMessage>}
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
                    {/* } */}
                </div>
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

const TokenWrapper = styled.section`
    background: url('./images/background_imgs/background3_mobile.svg') no-repeat;
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

        h5 {
            margin-bottom: 2rem;
        }
    }

    @media (min-width:1000px) {
        background-image: url('./images/background_imgs/background3_desktop.svg');
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
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }

    input {
        border: 4px solid transparent;
    }

    label {
        color: var(--color-text);
        margin-bottom: 10px;
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

const ResultSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3rem;

    .show-list-btn {
        margin-top: 2rem;
    }

    h3 {
        color: var(--color-primary-500);
    }

    .neon {
        color: #fff;
        text-shadow:
            0 0 1px #fff,
            0 0 20px var(--color-primary-500),
            0 0 60px var(--color-primary-500),
            0 0 70px var(--color-primary-500),
            0 0 80px var(--color-primary-500);
    }
`