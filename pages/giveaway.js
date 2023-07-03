import { React, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useForm } from "react-hook-form";
import { useCountdown, CountdownCircleTimer } from 'react-countdown-circle-timer';

import useAuth from '../hooks/useAuth';
import saphira from '../services/saphira';
import Meta from '../src/infra/Meta';
import NavBar from '../src/patterns/base/Nav';
import Button from '../src/components/Button';

const Giveaway = () => {

    const Ref = useRef(null);
    const router = useRouter();
    const { key } = useAuth();

    const placeholderMessage = "Seu nome aparecerá aqui!";

    const [isKeyPresent, setIsKeyPresent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [gotResult, setGotResult] = useState(false);
    const [timer, setTimer] = useState('00:00');
    const [lectures, setLectures] = useState([]);
    const [giveawayResultName, setGiveawayResultName] = useState(placeholderMessage);
    const [showList, setShowList] = useState(placeholderMessage);

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
                    setGiveawayResultName(res.data.nome);
                    setIsLoading(false);
                    setGotResult(true);
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

    const getPresencialOnlyGivawayResult = (lectureId) => {
        setIsLoading(true);

        setTimeout(() => {
            saphira.getPresencialOnlyGivawayResult(lectureId)
                .then((res) => {
                    setGiveawayResultName(res.data.nome);
                    setIsLoading(false);
                    setGotResult(true);
                    onClickReset();
                    reset();
                })
                .catch(err => {
                    console.log(err);
                    setIsLoading(false);
                    setError("lectureId", { type: "focus" }, { shouldFocus: true });
                })
        }, 2000);
    }

    const listLectures = () => {
        saphira.getLectures()
            .then((res) => {
                console.log(res);
                setLectures(lectures.concat(...res.data).sort((a, b) => a.id > b.id ? -1 : 1));
            })
            .catch((err) => {
                console.log(err);
            })
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

    useEffect(() => {
        // checkKey();
        // listLectures();
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

            <Meta title='CO SSI 2023 | Sorteio' />

            <NavBar />
            <GiveawayWrapper>
                <div className='section-container'>
                    <h3>Sorteio</h3>

                    {/* {isKeyPresent && */}
                        <>
                            <ResultSection>
                                {!isLoading &&
                                    <>
                                        <h3 className={giveawayResultName !== placeholderMessage ? 'neon' : ''}> {giveawayResultName} </h3>

                                        <FormWrapper>

                                            {!isLoading && gotResult &&
                                                <TimerWrapper>
                                                    <div className="timer-wrapper">
                                                        <CountdownCircleTimer
                                                            isPlaying
                                                            duration={40}
                                                            colors={["#3A006E", "#A86BDA", "#F7B801", "#A30000"]}
                                                            colorsTime={[40, 30, 20, 0]}
                                                            >
                                                            {renderTime}
                                                        </CountdownCircleTimer>
                                                    </div>
                                                </TimerWrapper>                                           
                                            }

                                            <form onSubmit={handleSubmit(onSubmit)}>
                                                <InputBox>
                                                    <label htmlFor='lectureId'> ID da palestra: </label>
                                                    <div className='form-input'>
                                                        <input id='lectureId' type='text' placeholder='Insira o ID' className={errors.lectureId && 'error-border'}
                                                            {...register("lectureId", { required: true, minLength: 1, })} />
                                                    </div>
                                                    {errors.lectureId && <ErrorMessage> ID inválido </ErrorMessage>}
                                                </InputBox>

                                                <CheckboxBox>
                                                    <input id='isPresencialOnly' type='checkbox' defaultChecked={false}
                                                        {...register('isPresencialOnly')} />
                                                    <label htmlFor='isPresencialOnly'> Apenas presencial? </label>
                                                </CheckboxBox>

                                                {giveawayResultName === placeholderMessage &&
                                                    <Button > Sortear </Button>
                                                }

                                                {giveawayResultName !== placeholderMessage &&
                                                    <Button className='secondary-btn' type="button" onClick={() => setGiveawayResultName(placeholderMessage)}> Limpar Vencedor </Button>
                                                }
                                            </form>

                                            <SecondaryButton className="show-list-btn" type="button" onClick={() => setShowList(!showList)}>
                                                {showList ? "Esconder palestras" : "Mostrar palestras"} </SecondaryButton>

                                        </FormWrapper>
                                    </>
                                }

                                {isLoading &&
                                    <Loading>
                                        <img src='./loading.svg' alt='SSI 2023 - Loading' />
                                    </Loading>
                                }
                            </ResultSection>

                            {showList &&
                                <LecturesList>
                                    <div className='lecture-list-container'>
                                        <ul>
                                            {lectures.map((lecture, key) =>
                                                <li key={key}>
                                                    ID: <span>{lecture.id}</span> | Título: {lecture.title}
                                                </li>)}
                                        </ul>
                                    </div>
                                </LecturesList>
                            }
                            
                                
                                
                        </>
                    {/* } */}
                </div>
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

const GiveawayWrapper = styled.section`
    background: url('./images/background_imgs/background4_mobile.svg') top fixed no-repeat;
    background-position: top;
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

        h3 {
            text-align: center;
        }
    }

    button {
        width: fit-content;
        max-width: 450px;
        margin-top: 1rem;
    }

    @media (min-width:1000px) {
        background-image: url('./images/background_imgs/background4_desktop.svg');
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        border-radius: 5px;
        gap: 1rem;
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

const CheckboxBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 450px;
    padding-block: 1.5rem;
    background-color: var(--color-neutral-800);
    border-radius: 8px;

    label {
        margin-left: 15px;
        color: var(--color-text);
        font: 700 0.875rem/1rem 'Space_Mono';

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
            0 0 20px var(--color-secondary),
            0 0 60px var(--color-secondary),
            0 0 70px var(--color-secondary),
            0 0 80px var(--color-secondary);
    }
`

const LecturesList = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -1rem;

    .lecture-list-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    span {
        font: inherit;
        color: var(--color-primary-500);
        font-family: 'Space_Mono_Bold';
        font-weight: 400;
    }

    ul {

        li {
            margin-bottom: 10px;
        }
    }
`

// Timer:
const TimerWrapper = styled.section`
    margin-block: 2rem 3rem;

    h1 {
        text-align: center;
        margin-bottom: 40px;
    }

    .timer-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .time-wrapper {
        position: relative;
        width: 80px;
        height: 60px;
        font: 400 3.5rem/4.25rem 'Space_Mono_Bold';
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
        color: var(--color-text);
    }

    .time-wrapper .time.up {
        opacity: 0;
        transform: translateY(-100%);
    }

    .time-wrapper .time.down {
        opacity: 0;
        transform: translateY(100%);
    }
`