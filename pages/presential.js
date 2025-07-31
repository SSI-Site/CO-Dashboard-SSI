import { useRouter } from 'next/router';
import { React, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import styled from 'styled-components';
import Swal from 'sweetalert2';

import useAuth from '../hooks/useAuth';
import saphira from '../services/saphira';
import Meta from '../src/infra/Meta';
import Nav from '../src/patterns/base/Nav';

// components
import Button from '../src/components/Button';
import LectureList from '../src/components/LectureList';

const Presential = () => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { register, getValues, setError, formState: { errors }, handleSubmit, reset } = useForm();

    const [accessAllowed, setAccessAllowed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = data => {
        setIsLoading(true);
    
        // setTimeout(() => {
            saphira.addPresenceToUser(data.lectureId, data.document, data.onlinePresence)
                .then((res) => {
                    setIsLoading(false);
                    Swal.fire({
                        icon: 'info',
                        title: `Presença ${data.onlinePresence ? 'online' : 'presencial'} registrada para ${data.document}`,
                        showConfirmButton: true,
                        confirmButtonText: "Ok!",
                        confirmButtonColor: "#151023"
                    });
                }, (err) => {
                    setIsLoading(false);
                    console.error(err);
                    Swal.fire({
                        icon: 'info',
                        title: 'Falha no registro!',
                        text: err.response.data.talk ? `Palestra não encontrada` : err.response.data,
                        showConfirmButton: true,
                        confirmButtonText: "Ok",
                        confirmButtonColor: "#151023"
                    });
                });
        // }, 1000);
    };

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

            <Meta title='CO SSI 2025 | Registrar presença' />

            <NavBar name = {"Registrar Presença"}/>

            <PresenceWrapper>
                <div className='section-container'>
                    
                    <h5>Registrar presença</h5>

                    {accessAllowed &&
                        <FormWrapper>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <p> Registro de presenças presenciais :)</p>
                                {!isLoading &&
                                    <>
                                        <InputBox>
                                            <label htmlFor='lectureId'> ID da palestra: </label>
                                            <div className='form-input'>
                                                <input id='lectureId' type='text' placeholder='Insira o ID' className={`${errors.lectureId && 'error-border'}`}
                                                    {...register("lectureId", { required: true, minLength: 1, })} />
                                            </div>
                                            {errors.lectureId && <ErrorMessage> ID inválido </ErrorMessage>}
                                        </InputBox>

                                        <InputBox>
                                            <label htmlFor='document'> Documento do inscrito:</label>
                                            <div className='form-input'>
                                                <input id='document' type='text' placeholder='Insira o documento' className={`${errors.document && 'error-border'}`}
                                                    {...register("document", { required: true, minLength: 3 })} />
                                            </div>
                                            {errors.document && <ErrorMessage>Documento inválido</ErrorMessage>}
                                        </InputBox>

                                        <CheckboxBox>
                                            <input id='onlinePresence' type='checkbox' defaultChecked={false}
                                                {...register('onlinePresence')} />
                                            <label htmlFor='onlinePresence'> Presença online? </label>
                                        </CheckboxBox>

                                        <Button> Registrar </Button>
                                    </>
                                }

                                {isLoading &&
                                    <Loading>
                                        <img src='./loading.svg' alt='SSI 2025 - Loading' />
                                    </Loading>
                                }
                            </form>
                        </FormWrapper>
                    }

                </div>
            </PresenceWrapper>
            <LectureList />
        </>
    )
}

export default Presential;


const Loading = styled.figure`
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 50%;
        max-width: 250px;
    }
`

const PresenceWrapper = styled.section`
    margin-top: 3.75rem;
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

        button {
            margin-top: .5rem;
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

const CheckboxBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding: .5rem;
    background-color: var(--color-neutral-800);

    label {
        margin-left: 15px;
        color: var(--color-text);
        font: 700 0.875rem/1rem 'AT Aero';

        cursor: pointer;
    }

    input[type=checkbox] {
        transform: scale(1.5);
        padding: 20px;
        cursor: pointer;
    }
`