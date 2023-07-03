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
        getTokenGenerated(data.lectureId);
    }

    const getTokenGenerated = (lectureId) => {
        setIsLoading(true);

        setTimeout(() => {
            saphira.getTokenGenerated(lectureId)
                .then((res) => {
                    setTokenGenerated(res.data.token); // ??? REVER COM INFRA
                    setIsLoading(false);
                    onClickReset();
                    reset();
                })
                .catch(err => {
                    console.log(err);
                    setIsLoading(false);
                    setError("lectureId", { type: "focus" }, { shouldFocus: true })
                })
        }, 2000);
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
                                                    <div className='form-input'>
                                                        <input id='lectureId' type='text' placeholder='Insira o ID' className={errors.lectureId && 'error-border'}
                                                            {...register("lectureId", { required: true, minLength: 1, })} />
                                                    </div>
                                                    {errors.lectureId && <ErrorMessage> ID inválido </ErrorMessage>}
                                                </InputBox>

                                                {tokenGenerated === placeholderMessage &&
                                                    <Button > Gerar token </Button>
                                                }

                                                {tokenGenerated !== placeholderMessage &&
                                                    <Button type="button" onClick={() => setTokenGenerated(placeholderMessage)}> Limpar Token </Button>
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
    background: url('./images/background_imgs/background3_mobile.svg') top fixed no-repeat;
    background-size: cover;
    min-height: calc(100vh - 3.75rem);

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
            /* margin-bottom: 2rem; */
        }

        h3 {
            text-align: center;
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
    }

    .form-input {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 15rem;
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