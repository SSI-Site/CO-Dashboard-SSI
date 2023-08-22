import { React, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useForm } from "react-hook-form";
import { cpf } from 'cpf-cnpj-validator';
import InputMask from 'react-input-mask';
import Swal from 'sweetalert2';

import useAuth from '../hooks/useAuth';
import saphira from '../services/saphira';
import Meta from '../src/infra/Meta';
import NavBar from '../src/patterns/base/Nav';
import Button from '../src/components/Button';

const Query = () => {

    const router = useRouter();
    const { key } = useAuth();
    const { register, getValues, setError, formState: { errors }, handleSubmit, reset } = useForm();

    const [isKeyPresent, setIsKeyPresent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isListingPresences, setIsListingPresences] = useState(false);
    const [userPresences, setUserPresences] = useState("");
    const [userDocument, setUserDocument] = useState("");

    const onSubmit = data => {
        setIsLoading(true);
        saphira.adminLogIn(user, password)
            .then((res) => {
                console.log("Deu bom o login: ", res);
                setIsLoading(false);
                
            }, (err) => {
                console.log("Deu ruim o login: ", res);
                setIsLoading(false);
            });

        listPresences(data.document);
        setIsListingPresences(false);

        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    };

    const checkKey = () => {
        if (key) {
            setIsKeyPresent(true);
        } else {
            setIsKeyPresent(false);
            router.push("/");
        }
    }

    const listPresences = (document) => {
        setIsLoading(true);
        setUserDocument(document);

        saphira.listPresences(document)
            .then((res) => {
                setUserPresences([...res.data.message]);
                setIsLoading(true);
            })
            .catch(() => {
                setUserPresences("");
                setIsLoading(true);
            })
    }

    const countTotalPresences = () => {
        if (!userPresences) return;
        let count = 0;

        userPresences.forEach((lecture) => {
            count++;
        });

        console.log(count);
        return count;
    }

    const countPresencialPresences = () => {
        if (!userPresences) return;
        let count = 0;

        userPresences.forEach((lecture) => {
            if (!lecture.online) count++;
        });

        return count;
    }


    const clearPresences = () => {
        setUserPresences([]);
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
                }} 
            />

            <Meta title='CO SSI 2023 | Consulta' />

            <NavBar />
            <QueryWrapper>
                <div className='section-container'>

                    <h3>Consulta</h3>

                    <h5 className='page-description'> Número de presenças nas palestras :)</h5>

                    {isKeyPresent &&
                        <FormWrapper>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {!isLoading &&
                                    <>
                                        <InputBox>
                                        <label htmlFor='document'> Documento do inscrito: </label>
                                            {/* <div className='form-input'>
                                                <InputMask id='cpf_value' type='text' placeholder='Insira o documento' className={errors.name && 'error-border'}
                                                    {...register("cpf_value", { minLength: 5, pattern: /^[0-9]*$/i })} />
                                            </div> */}
                                            <div className='form-input'>
                                                <input id='document' type='text' placeholder='Insira o documento' className={errors.name && 'error-border'}
                                                    {...register("document", { required: false, minLength: 5 })} />
                                            </div>
                                            {/* {errors.cpf_value && <ErrorMessage>{errors.cpf_value?.message}</ErrorMessage>} */}
                                            {/* VER AQUI COM INFRA */}
                                        </InputBox>

                                        {userPresences == "" ?
                                            <Button onClick={() => setIsListingPresences(true)}> Listar presenças </Button>
                                            :
                                            <PresencesList>
                                                <div className='user-info'>
                                                    <h6>Documento: <span>{userDocument}</span></h6>
                                                    <h6>{userPresences}</h6>
                                                    {/* <h6>Total de presenças: <span>{countTotalPresences()}</span></h6>
                                                    <h6>Presenças presenciais: <span>{countPresencialPresences()}</span></h6> */}
                                                </div>
                                                    
                                                <ul>
                                                    {/* {userPresences.map((lecture, key) => <li key={key}> * {lecture.talk_title} - <span>{lecture.online ? "Online" : "Presencial"}</span></li>)} */}
                                                </ul>

                                                <SecondaryButton type="button" onClick={() => clearPresences()}> Limpar </SecondaryButton>
                                            </PresencesList>
                                        }
                                        
                                    </>
                                }

                                {isLoading &&
                                    <Loading>
                                        <img src='./loading.svg' alt='SSI 2023 - Loading' />
                                    </Loading>
                                }
                            </form>
                        </FormWrapper>
                    }
                </div>
            </QueryWrapper>
        </>
    )
}

export default Query;


const Loading = styled.figure`
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 50%;
        max-width: 250px;
    }
`

const QueryWrapper = styled.section`
    background: url('./images/background_imgs/background5_mobile.svg') top fixed;
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
        background-image: url('./images/background_imgs/background5_desktop.svg');
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

const PresencesList = styled.div`
    width: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
    color: var(--color-text);

    .user-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 0.5rem;
        padding: 1rem 2rem;
        background-color: var(--color-neutral-800);
        border-radius: 8px;
    }

    span {
        font: inherit;
        color: var(--color-primary-500);
    }

    ul {
        margin-top: 1.5rem;

        li {
            margin-bottom: 10px;
        }
    }
`

const SecondaryButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 9.1875rem;
    height: 3rem;
    padding: 0.5625rem 1.3125rem;
    margin-bottom: 5px;
    border-radius: 9px;
    border: 3px solid var(--color-neutral-50);
    background-color: transparent;
    transition: 500ms;
    cursor: pointer;

    font: 400 1rem/1.25rem 'Space_Mono_Bold';

    &:hover {
        background-color: var(--color-neutral-50);
        
        color: var(--color-neutral-900);
    }

    &:active {
        background-color: var(--color-neutral-100);
        border-color: var(--color-neutral-100);
        color: var(--color-neutral-900);
    }
        
    @media (min-width:560px) {
        width: 9.6875rem;
        height: 3rem;

        span {
            font: 400 1.125rem/1.5rem 'Space_Mono_Bold';
        }
    }
`