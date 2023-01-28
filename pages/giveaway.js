import { React, useState, useRef, useEffect } from 'react';
import { useCountdown, CountdownCircleTimer } from 'react-countdown-circle-timer'
import styled from 'styled-components';
import useAuth from '../hooks/useAuth';
import { useRouter } from 'next/router';
import saphira from '../services/saphira';
import { useForm } from "react-hook-form";

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
        if(data.isPresencialOnly) {
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
                    setGiveawayResultName(res.data.nome)
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
                    setGiveawayResultName(res.data.nome)
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

    // Timer 1
    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / 1000 / 60 / 60) % 24);
        return {
            total, hours, minutes, seconds
        };
    }
  
    const startTimer = (e) => {
        // setTimeout(3);
        let { total, hours, minutes, seconds } 
                    = getTimeRemaining(e);
        if (total >= 0) {
  
            setTimer(
                // (hours > 9 ? hours : '0' + hours) + ':' +
                (minutes > 9 ? minutes : '0' + minutes) + ':'
                + (seconds > 9 ? seconds : '0' + seconds)
            )
        }
    }
  
    const clearTimer = (e) => {
  
        // Se alterar o tempo, deve-se alterar esse placeholder também 
        setTimer('00:40');
  
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000)
        Ref.current = id;
    }
  
    const getDeadTime = () => {
        let deadline = new Date();
  
        // Ajustar aqui para adicionar mais tempo
        deadline.setSeconds(deadline.getSeconds() + 40);
        return deadline;
    }
  
    const onClickReset = () => {
        clearTimer(getDeadTime());
    }

    // Timer 2
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
        checkKey();
        listLectures();
        
        setTimer('00:40'); // Timer 1: Se alterar o tempo, deve-se alterar esse placeholder também 
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

            <Meta title='CO SSI 2023 | Sorteio' />
            <NavBar />
            <GiveawayWrapper>
                <h1>Sorteio</h1>

                {isKeyPresent &&
                    <>
                        <ResultSection>
                            {!isLoading &&
                                <>
                                    <h2 className={giveawayResultName !== placeholderMessage ? 'neon' : ''}> {giveawayResultName} </h2>

                                    <FormWrapper>

                                        {/* Timer 1 */}
                                        {!isLoading && gotResult &&
                                            <h1 className='timer'>{timer}</h1>                 
                                        }

                                        {/* Timer 2 */}
                                        {!isLoading && gotResult &&
                                            <TimerWrapper>
                                                <div className="timer-wrapper">
                                                    <CountdownCircleTimer
                                                        isPlaying
                                                        duration={40}
                                                        colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                                                        colorsTime={[40, 30, 20, 10]}
                                                        >
                                                        {renderTime}
                                                    </CountdownCircleTimer>
                                                </div>
                                            </TimerWrapper>                                           
                                        }

                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <InputBox>
                                                <label htmlFor='lectureId'> Id da palestra: </label>
                                                <input id='lectureId' type='text' className={errors.lectureId && 'error-border'}
                                                    {...register("lectureId", { required: true, minLength: 1, })} />
                                                {errors.lectureId && <ErrorMessage> Id inválido. </ErrorMessage>}
                                            </InputBox>

                                            <CheckboxBox>
                                                <input id='isPresencialOnly' type='checkbox' defaultChecked={false}
                                                    {...register('isPresencialOnly')} />
                                                <label htmlFor='isPresencialOnly'> Apenas Presencial? </label>
                                            </CheckboxBox>

                                            {giveawayResultName === placeholderMessage &&
                                                <Button > Sortear </Button>
                                            }

                                            {giveawayResultName !== placeholderMessage &&
                                                <Button type="button" onClick={() => setGiveawayResultName(placeholderMessage)}> Limpar Vencedor </Button>
                                            }
                                        </form>

                                        <Button className="show-list-btn" type="button" onClick={() => setShowList(!showList)}>
                                            {showList ? "Esconder palestras" : "Mostrar palestras"} </Button>

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
                                <ul>
                                    {lectures.map((lecture, key) =>
                                        <li key={key}>
                                            id: {lecture.id} | Título: {lecture.title}
                                        </li>)}
                                </ul>
                            </LecturesList>
                        }

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

    padding: 70px 30px;
`

const FormWrapper = styled.div`
    .error-border {
        border: .5px solid white;
    }

    // Timer 1:
    .timer { 
        margin-top: 3rem;
        margin-bottom: 3rem;
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
    max-width: 500px;
    padding: 1.5rem 20px;


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

const CheckboxBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;

    margin-bottom: 3rem;

    label {
        margin-left: 15px;
        color: var(--color-text);
        font-size: 1.2rem;

        cursor: pointer;
    }

    input[type=checkbox]{
        transform: scale(1.5);
        padding: 20px;
        cursor: pointer;
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

const LecturesList = styled.section`
    display: flex;
    align-items: center;
    justify-content: center;

    ul {
        color: var(--color-text);

        li {
            font-size: 16px;
        }
    }
`

// Timer 2:
const TimerWrapper = styled.section`
    margin-bottom: 3rem;

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
        font-size: 48px;
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
        font-size: 3.6rem;
        font-weight: 700;
        font-family: 'Plaza';
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