import { React, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useForm } from "react-hook-form";
import { cpf } from 'cpf-cnpj-validator';
import InputMask from 'react-input-mask';
import Swal from 'sweetalert2'

import useAuth from '../hooks/useAuth';
import saphira from '../services/saphira';
import Meta from '../src/infra/Meta';
import NavBar from '../src/patterns/base/Nav';
import Button from '../src/components/Button';

const Presential = () => {
    const router = useRouter();
    const { key } = useAuth();
    const { register, getValues, setError, formState: { errors }, handleSubmit, reset } = useForm();

    const [isKeyPresent, setIsKeyPresent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isListingPresences, setIsListingPresences] = useState(false);
    const [userPresences, setUserPresences] = useState([]);
    const [userEmail, setUserEmail] = useState("");

    const onSubmit = data => {
        setIsLoading(true);

        // setTimeout(() => {
        //     reset();
        //     setIsLoading(false);

        //     Swal.fire({
        //         icon: 'info',
        //         title: 'Presença Registrada para:',
        //         text: data.email,
        //         showConfirmButton: true,
        //         confirmButtonText: "Ok!",
        //         confirmButtonColor: "#151023"
        //     })
        // }, 2000);
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

            <Meta title='CO SSI 2023 | Presencial' />

            <NavBar />
            <PresenceWrapper>
                <div className='section-container'>
                    
                    <h3>Presencial</h3>

                    <h5 className='page-description'> Registro de presenças presenciais :)</h5>

                    {/* {isKeyPresent && */}
                        <FormWrapper>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {!isLoading &&
                                    <>
                                        <InputBox1>
                                            <label htmlFor='lectureId'> ID da palestra: </label>
                                            <div className='form-input'>
                                                <input id='lectureId' type='text' placeholder='Insira o ID' className={errors.lectureId && 'error-border'}
                                                    {...register("lectureId", { required: true, minLength: 1, })} />
                                            </div>
                                            {errors.lectureId && <ErrorMessage> ID inválido </ErrorMessage>}
                                        </InputBox1>

                                        <InputBox2>
                                            <label htmlFor='email'> CPF do inscrito: </label>
                                            <div className='form-input'>
                                                <InputMask id='cpf_value' type='text' mask='999.999.999-99' placeholder='Insira o CPF' className={errors.cpf_value && 'error-border'}
                                                    {...register("cpf_value", { validate: value => cpf.isValid(value) || "CPF inválido" })} />
                                            </div>
                                            {errors.cpf_value && <ErrorMessage>{errors.cpf_value?.message}</ErrorMessage>}
                                        </InputBox2>

                                        <Button> Registrar </Button>
                                    </>
                                }

                                {isLoading &&
                                    <Loading>
                                        <img src='./loading.svg' alt='SSI 2023 - Loading' />
                                    </Loading>
                                }
                            </form>
                        </FormWrapper>
                    {/* } */}

                </div>
            </PresenceWrapper>
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
    background: url('./images/background_imgs/background2_mobile.svg') bottom fixed no-repeat;
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
    }

    @media (min-width:1000px) {
        background-image: url('./images/background_imgs/background2_desktop.svg');
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

const InputBox1 = styled.div`
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

const InputBox2 = styled.div`
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

const PresencesList = styled.div`
    text-align: center;

    margin-top: 1rem;
    color: var(--color-text);

    ul {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        text-align: center;

        width: 100%;
        padding: 0 5%;

        li {
            margin-bottom: 10px;
        }
    }
`