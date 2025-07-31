import { useRouter } from 'next/router';
import { React, useEffect, useRef, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
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

// assets
import SleepEmoji from '../public/images/emojis/sleep.png';
import TimerEmoji from '../public/images/emojis/timer.png';

const Giveaway = () => {

    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const placeholderMessage = "Seu nome aparecerá aqui!";

    const [accessAllowed, setAccessAllowed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [gotResult, setGotResult] = useState(false);
    const [giveawayResultName, setGiveawayResultName] = useState(placeholderMessage);
    const [isLastSeconds, setIsLastSeconds] = useState(false);
    const [key, setKey] = useState(0);

    const { register, setError, formState: { errors }, handleSubmit, reset } = useForm();

    const onSubmit = data => {
        setGiveawayResultName(placeholderMessage);
        setGotResult(false);
        setIsLastSeconds(false);

        if (data.isPresencialOnly) {
            getPresencialOnlyGivawayResult(data.lectureId);
        } else {
            getGivawayResult(data.lectureId);
        }
    }

    const getGivawayResult = (lectureId) => {
        setIsLoading(true);

        setTimeout(() => {
            saphira.getGivawayResult(lectureId)
                .then((res) => {
                    setKey(prevKey => prevKey + 1);
                    setGiveawayResultName(res.data.student_name);
                    setIsLoading(false);
                    setGotResult(true);
                    reset();
                })
                .catch(err => {
                    console.error(err);
                    setIsLoading(false);
                    setError("lectureId", { type: "focus" }, { shouldFocus: true })
                })
        }, 2000);
    }

    const getPresencialOnlyGivawayResult = (lectureId) => {
        setIsLoading(true);

        setTimeout(() => {
            saphira.getPresencialOnlyGivawayResult(lectureId)
                .then((res) => {
                    setKey(prevKey => prevKey + 1);
                    setGiveawayResultName(res.data.student_name);
                    setIsLoading(false);
                    setGotResult(true);
                    reset();
                })
                .catch(err => {
                    console.error(err);
                    setIsLoading(false);
                    setError("lectureId", { type: "focus" }, { shouldFocus: true });
                })
        }, 2000);
    }

    // Timer
    const renderTime = ({ remainingTime }) => {
        const currentTime = useRef(remainingTime);
        const prevTime = useRef(null);
        const isNewTimeFirstTick = useRef(false);
        const [, setOneLastRerender] = useState(0);
        
        if (currentTime.current !== remainingTime) {
            isNewTimeFirstTick.current = true;
            prevTime.current = currentTime.current;
            currentTime.current = remainingTime;
        } else {
            isNewTimeFirstTick.current = false;
        }
        
        // force one last re-render when the time is over to trigger the last animation
        if (remainingTime === 0) {
            setTimeout(() => {
                setOneLastRerender((val) => val + 1);
            }, 20);
        }
        
        const isTimeUp = isNewTimeFirstTick.current;
        
        return (
            <div className="time-wrapper">
                <div key={remainingTime} className={`time ${isTimeUp ? "up" : ""}`}>
                    {remainingTime}
                </div>
                {prevTime.current !== null && (
                    <div
                        key={prevTime.current}
                        className={`time ${!isTimeUp ? "down" : ""}`}
                    >
                        {prevTime.current}
                    </div>
                )}
            </div>
        );
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

            <Meta title='CO SSI 2025 | Sorteio' />

            <NavBar name = {""}/>
            <GiveawayWrapper>
                <div className='section-container'>
                    <h5>Sorteio</h5>

                    {accessAllowed &&
                        <FormWrapper>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <p> Realização do sorteio :)</p>
                                <InputBox>
                                    <label htmlFor='lectureId'> ID da palestra: </label>

                                    <div className='input-btn'>
                                        <div className='form-input'>
                                            <input id='lectureId' type='text' placeholder='Insira o ID' className={`${errors.lectureId && 'error-border'}`}
                                                {...register("lectureId", { required: true, minLength: 1 })} />
                                        </div>
                                        {errors.lectureId && <ErrorMessage> ID inválido </ErrorMessage>}

                                        {giveawayResultName === placeholderMessage ?
                                            <Button> Sortear </Button>
                                            :
                                            <SecondaryButton type="button" onClick={() => {setGiveawayResultName(placeholderMessage); setKey(prev => prev+1); setGotResult(false); setIsLastSeconds(false)}}> Limpar </SecondaryButton>
                                        }
                                    </div>
                                </InputBox>

                                <CheckboxBox>
                                    <input id='isPresencialOnly' type='checkbox' defaultChecked={false}
                                        {...register('isPresencialOnly')} />
                                    <label htmlFor='isPresencialOnly'> Apenas presencial? </label>
                                </CheckboxBox>
                            </form>
                        </FormWrapper>
                    }
                </div>

                <div className='section-container'>
                    {isLoading ?
                        <Loading>
                            <img src='./loading.svg' alt='SSI 2025 - Loading' />
                        </Loading>
                        :
                        <>
                            <ResultSection>
                                <h6> {giveawayResultName} </h6>
                            </ResultSection>
                            <TimerWrapper>
                                {isLastSeconds ? 
                                    <img src={SleepEmoji} alt="sleep emoji" /> 
                                    :
                                    <img src={TimerEmoji} alt="timer emoji" />
                                }
                                <div className="timer-wrapper">
                                    <CountdownCircleTimer
                                        key={key}
                                        isPlaying={gotResult}
                                        duration={40}
                                        colors={["#9638FF", "#A86BDA", "#F7B801", "#A30000"]}
                                        colorsTime={[40, 30, 20, 0]}
                                        onUpdate={(remainingTime) => {
                                            if (remainingTime === 10) {
                                                setIsLastSeconds(true);
                                            }
                                            if (remainingTime === 0) {
                                                setGiveawayResultName('Dormiu no ponto...');
                                                setGotResult(false);
                                            }
                                        }}
                                        >
                                        {renderTime}
                                    </CountdownCircleTimer>
                                </div>
                                {isLastSeconds ? 
                                    <img src={SleepEmoji} alt="sleep emoji" /> 
                                    :
                                    <img src={TimerEmoji} alt="timer emoji" />
                                }
                            </TimerWrapper>
                        </>
                    }
                </div>
            </GiveawayWrapper>
            <LectureList />
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

const GiveawayWrapper = styled.section`
    margin-top: 7.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    .section-container {
        width: fit-content;
        height: 18.5rem;
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

    @media (min-width: 960px) {
        flex-direction: row;
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
            width: fit-content;
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
        gap: 1rem;

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

const ResultSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    width: 100%;
    background-color: white;
    padding: 1rem 1.5rem;

    .show-list-btn {
        margin-top: 2rem;
    }

    h6 {
        color: var(--color-primary-500);
    }
`

const TimerWrapper = styled.section`
    display: flex;
    gap: 1.5rem;
    flex-direction: row;
    max-height: 60%;
    
    .timer-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 7.25rem;
        height: 7.25rem;
        font: 700 2.5rem/3.5rem 'AT Aero Bold';

        svg {
            width: 100%;
        }
    }

    .time-wrapper .time {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: translateY(0);
        opacity: 1;
        transition: all 0.2s;
    }

    .time-wrapper .time.up {
        opacity: 0;
        transform: translateY(-30%);
    }

    .time-wrapper .time.down {
        opacity: 0;
        transform: translateY(30%);
    }
`