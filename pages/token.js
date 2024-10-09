import { useRouter } from 'next/router';
import { React, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import styled from 'styled-components';

import useAuth from '../hooks/useAuth';
import saphira from '../services/saphira';
import Meta from '../src/infra/Meta';
import NavBar from '../src/patterns/base/Nav';

// components
import Button from '../src/components/Button';
import LectureList from '../src/components/LectureList';
import SecondaryButton from '../src/components/SecondaryButton';

const Token = () => {

    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const placeholderMessage = "O token aparecerá aqui!";

    const [accessAllowed, setAccessAllowed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [textCopied, setTextCopied] = useState(false);
    const [tokenGenerated, setTokenGenerated] = useState(placeholderMessage);
    
    const { register, getValues, setError, formState: { errors }, handleSubmit, reset } = useForm();

    const currentDateTime = () => {
        const now = new Date();
        
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
      
        const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
        return formattedDateTime;
    }
    // console.log("Data atual",currentDateTime());
      
    const onSubmit = data => {
        getTokenGenerated(data);
    }

    const getTokenGenerated = (data) => {
        setIsLoading(true);
        const dateTime = data.dateTime && data.dateTime.trim() !== "" ? data.dateTime : currentDateTime()

        setTimeout(() => {
            saphira.generateOnlineToken(data.lectureId, dateTime)
                .then((res) => {
                    setTokenGenerated(res.data.token.code);
                    setIsLoading(false);
                }, (err) => {
                    console.error(err);
                    setIsLoading(false);
                    setError("lectureId", { type: "focus" }, { shouldFocus: true })
                })
        }, 500);
    }

    // Para permitir copiar token ao clicar sobre ele
    const copyContent = async () => {
        try {
            await navigator.clipboard.writeText(tokenGenerated);
            console.log('Content copied to clipboard');
        } catch (err) {
          console.error('Failed to copy: ', err);
        }
        setTextCopied(true);

        setTimeout(() => {
            setTextCopied(false);
        }, 2000);
    }

    const checkAuthentication = () => {
        if (isAuthenticated === null) {
            return;
        }
        
        if (isAuthenticated) {
            setAccessAllowed(true);
        } else {
            setAccessAllowed(false);
            router.push("/");
        }
    }

    useEffect(() => {
        checkAuthentication();
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

            <Meta title='CO SSI 2024 | Token' />

            <NavBar />
            <TokenWrapper>
                <div className='section-container'>

                    <h5>Token</h5>

                    {accessAllowed &&
                        <FormWrapper>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <p> Geração de tokens do online :)</p>
                                <InputBox>
                                    <label htmlFor='lectureId'> ID da palestra: </label>

                                    <div className='input-btn'>
                                        <div className='form-input'>
                                            <input id='lectureId' type='text' placeholder='Insira o ID' className={`${errors.lectureId && 'error-border'}`}
                                                {...register("lectureId", { required: true, minLength: 1, })} />
                                        </div>
                                        {errors.lectureId && <ErrorMessage> ID inválido </ErrorMessage>}
                                    </div>
                                </InputBox>
                                <InputBox>
                                    <label htmlFor='dateTime'> Data/hora de início do token (Opcional): </label>

                                    <div className='input-btn'>
                                        <div className='form-input'>
                                            <input id='dateTime' type='datetime-local' className={`${errors.dateTime && 'error-border'}`}
                                                {...register("dateTime")} />
                                        </div>
                                    </div>
                                </InputBox>
                                {tokenGenerated === placeholderMessage ?
                                    <Button> Gerar token </Button>
                                    :
                                    <SecondaryButton type="button" onClick={() => setTokenGenerated(placeholderMessage)}> Limpar token </SecondaryButton>
                                }
                            </form>
                        </FormWrapper>
                    }
                    <ResultSection className='tooltip'>
                        {!isLoading &&
                            <>
                                <div className={tokenGenerated !== placeholderMessage ? 'token-wrapper tooltip' : ''}>
                                    <h6 
                                        onClick={tokenGenerated !== placeholderMessage ? 
                                        copyContent : null}
                                    >
                                        {tokenGenerated}
                                    </h6>
                                    {tokenGenerated !== placeholderMessage &&
                                        <div 
                                            className='copy-btn'
                                            onClick={tokenGenerated !== placeholderMessage ? copyContent : null}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                                <path d="M17.375 6.375V2.625H3.125V16.875H6.875M7.625 7.125V21.375H21.875V7.125H7.625Z" stroke="#9638FF" stroke-width="2.25" stroke-linecap="square"/>
                                            </svg>
                                        </div>
                                    }
                                    {textCopied &&
                                        <span className='tooltiptext'>Token copiado!</span>
                                    }
                                </div>
                            </>
                        }

                        {isLoading &&
                            <Loading>
                                <img src='./loading.svg' alt='SSI 2024 - Loading' />
                            </Loading>
                        }
                    </ResultSection>
                </div>
            </TokenWrapper>
            <LectureList />
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
    margin-top: 7.5rem;
    display: flex;
    align-items: center;
    justify-content: center;

    .section-container {
        width: fit-content;
        height: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: var(--color-neutral-800); 
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

        .input-btn {
            display: flex;
            width: 100%;
            gap: .5rem;
        }

        button {
            padding-inline: 1.5rem;
        }
    }

    .form-input {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        background-color: var(--color-neutral-50);
        padding: 0.5rem;

        border: 2px solid white;
        background: transparent;
        background-clip: padding-box;
        color: white;

        &:has(input:focus):not(:has(.error-border)) {
            border-color: var(--color-primary);
        }

        &:has(.error-border) {
            border-color: var(--color-invalid);
        }

        input {
            color-scheme: dark;
        }

        input, select {
            width: 95%;
            border: none;
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
    width: 100%;

    label {
        font: 700 1.125rem/1.5rem 'AT Aero Bold';
        width: 100%;
        margin-bottom: .5rem;
    }
`

const ResultSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    width: 100%;
    background-color: white;
    padding: 1rem 1.5rem;

    > div {
        display: flex;
    }

    .show-list-btn {
        margin-top: 2rem;
    }

    h6 {
        color: var(--color-primary);
    }

    .token-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 0.5em;             
        padding: 0 5rem;
        border-radius: 8px;
        border: 2px solid transparent;
        transition: 0.3s all ease-in-out;
    }

    .tooltip {
        position: relative;

        h6:hover {
            cursor: copy;
        }
    }
    /* Tooltip text */
    .tooltip .tooltiptext {
        visibility: visible;
        background-color: var(--color-primary);
        text-align: center;
        padding: 7px 15px;
        font: 400 1rem/1.5rem 'AT Aero';

        /* Position the tooltip text */
        position: absolute;
        z-index: 1;
        bottom: -120%;
        right: 30%;

        /* Fade in tooltip */
        opacity: 1;
        transition: opacity 0.3s;
    }

    /* Tooltip arrow */
    .tooltip .tooltiptext::after {
        content: "";
        position: absolute;
        bottom: 100%;
        right: 50%;
        margin-right: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: transparent transparent var(--color-primary) transparent;
    }
    
    .copy-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
        width: 2.25rem;
        height: 2.25rem;

        &:hover {
            cursor: copy;
        }
    }
`