import { React, useState, useEffect } from 'react';
import styled from 'styled-components';
import useAuth from '../hooks/useAuth';
import { useRouter } from 'next/router';
import saphira from '../services/saphira';
import { useForm } from "react-hook-form";

import Meta from '../src/infra/Meta';
import NavBar from '../src/patterns/base/Nav';
import Button from '../src/components/Button';

const Giveaway = () => {
    const router = useRouter();
    const { key } = useAuth();

    const placeholderMessage = "Seu nome aparecerá aqui !!";

    const [isKeyPresent, setIsKeyPresent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [lectures, setLectures] = useState([{ id: 2, title: "dois" }, { id: 3, title: "tres" }]);
    const [giveawayResultName, setGiveawayResultName] = useState(placeholderMessage);

    const { register, setError, formState: { errors }, handleSubmit, reset } = useForm();

    const checkKey = () => {
        if (key) {
            setIsKeyPresent(true);
        } else {
            setIsKeyPresent(false);
            router.push("/");
        }
    }

    const onSubmit = data => {
        getGivawayResult(data.lectureId);
    };

    const getGivawayResult = (lectureId) => {
        setIsLoading(true);

        setTimeout(() => {
            saphira.getGivawayResult(lectureId)
                .then((res) => {
                    setGiveawayResultName(res.data.nome)
                    setIsLoading(false);
                    reset();
                })
                .catch(err => {
                    console.log(err);
                    setIsLoading(false);
                    setError("lectureId", { type: "focus" }, { shouldFocus: true })
                })
        }, 2000);
    }

    const listLectures = () => {
        saphira.getLectures()
            .then((res) => {
                console.log(res)
                setLectures(lectures.concat(...res.data).sort((a, b) => a.id > b.id ? -1 : 1))
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        checkKey();
        listLectures();
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

            <Meta title='CO SSI 2022 | Sorteio' />
            <NavBar />
            <GiveawayWrapper>
                <h1>Sorteio</h1>

                {isKeyPresent &&
                    <>
                        <ResultSection>
                            {!isLoading &&
                                <>
                                    <h2>{giveawayResultName}</h2>

                                    <FormWrapper>
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <InputBox>
                                                <label htmlFor='lectureId'> Id da palestra: </label>
                                                <input id='lectureId' type='text' className={errors.lectureId && 'error-border'}
                                                    {...register("lectureId", { required: true, minLength: 1, })} />
                                                {errors.lectureId && <ErrorMessage> Id inválido. </ErrorMessage>}
                                            </InputBox>

                                            {giveawayResultName === placeholderMessage &&
                                                <Button > Sortear </Button>
                                            }
                                        </form>
                                        {giveawayResultName !== placeholderMessage &&
                                            <Button type="button" onClick={() => setGiveawayResultName(placeholderMessage)}> Limpar </Button>
                                        }
                                    </FormWrapper>
                                </>
                            }

                            {isLoading &&
                                <Loading>
                                    <img src='./loading.svg' alt='SSI 2022 - Loading' />
                                </Loading>
                            }
                        </ResultSection>

                        <LecturesList>
                            <ul>
                                {lectures.map((lecture, key) =>
                                    <li key={key}>
                                        id: {lecture.id} | Título: {lecture.title}
                                    </li>)}
                            </ul>
                        </LecturesList>
                    </>
                }
            </GiveawayWrapper>

        </>
    )
}

export default Giveaway;


const Loading = styled.figure`
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 50%;
        max-width: 250px;
    }
`

const GiveawayWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    padding: 70px 0;
`

const FormWrapper = styled.div`
    .error-border {
        border: .5px solid white;
    }
`
const ErrorMessage = styled.span`
    color: white;
    text-decoration: underline 0.5px;
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
        width: 90%;
        border-radius: 5px;
        padding: 8px 15px;
        color: var(--color-text);
        font-size: 1.6rem;
    }

    input {
        border: unset;
        background-color: #241D3C;
        filter: brightness(130%);

        width: 100px;
        border-radius: 5px;
        padding: 8px 15px;

        color: var(--color-text);
        font-size: 1.6rem;
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

    label {
        color: var(--color-text);
        font-size: 1.6rem;
        margin-bottom: 10px;
    }
`

const ResultSection = styled.section`
    height: 30vh;
    margin: 100px auto;

    text-align: center;

    h2 {
        margin-bottom: 50px;
    }
`

const LecturesList = styled.section`
    display: flex;
    align-items: center;
    justify-content: center;

    ul {
        color: var(--color-text)
    }
`