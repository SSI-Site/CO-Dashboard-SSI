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
    const [talks, setTalks] = useState([])
    const [talkId, setTalkId] = useState(undefined)

    const { register, setError, formState: { errors }, handleSubmit, reset } = useForm();

    const getGiveaway = async(lectureId) => {
        setTalkId(lectureId)
        setIsLoading(true)
        try{
            const { data } = await saphira.getGivawayResult(lectureId)
            if (data) {
                setGotResult(data)
                setGiveawayResultName(data.name)
            }
        }
        catch(err){
            console.log("Houve um erro na hora de gerar o vencedor!", err)
        }
        finally{
            setIsLoading(false)
        }
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

    const onSubmit = (formData) => {
        const lectureId = formData.lectureId
        getGiveaway(lectureId)
    }

    const getTalks = async () => {
        setIsLoading(true)
        try{
            const { data } = await saphira.getLectures()
            // FAZER FILTRO BASEADO NAS QUE JÁ OCORRERAM?
            if (data) setTalks(data)
        }
        catch(err){
            console.log("Houve um erro:", err)
        }
        finally{
            setIsLoading(false)
        }
    }

    const createWinner = async() => {
        try{
            const { data } = await saphira.postWinner(talkId, gotResult.id)
            if (data) alert("Usuário registrado!")
        }
        catch(err){
            console.log("Houve um erro ao registrar o aluno!", err)
        }
    }

    useEffect(() => {
        checkAuthentication();
        getTalks()
    }, []);

    return (
        <>

            <Meta title='CO SSI 2025 | Sorteio' />

            <NavBar name = {"Sorteio"}/>
            <GiveawayWrapper>
                <div className='section-container'>
                    <h5>Sorteio</h5>

                    {accessAllowed &&
                        <FormWrapper>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <label>ID da palestra</label>
                                    <div className = "form-input">
                                        <select 
                                        id='lectureId' 
                                        className={`${errors.lectureId && 'error-border'}`}
                                        {...register("lectureId", { required: true, minLength: 1, })}>
                                            {
                                                talks
                                                .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
                                                .map(talk => {
                                                    const today = new Date().toDateString()
                                                    const lowerLimit = new Date(talk.start_time).toDateString()
                                                    const upperLimit = new Date(talk.end_time).toDateString()

                                                    const formattedStart = new Date(talk.start_time).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit', hour12: false})
                                                    if (today >= lowerLimit && today <= upperLimit){
                                                        return(
                                                            <option key = {talk.id} value = {talk.id}>{talk.id} - {talk.title} - {formattedStart.toString()}</option>
                                                        )}
                                                    }
                                                )
                                            }
                                        </select>
                                    </div>
                                <Button type = "submit" disabled = {talkId == undefined ? false : true}>Sortear</Button>
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
                                <h6>{giveawayResultName}</h6>
                            </ResultSection>
                            <ButtonsOptions>
                                <SecondaryButton disabled = {talkId == undefined ? true : false} onClick={() => {setGiveawayResultName(placeholderMessage); setTalkId(undefined); setGotResult(false)}}>Limpar</SecondaryButton>
                                <Button disabled = {talkId == undefined ? true : false} onClick={() => createWinner()}>Sorteado(a) presente</Button>
                            </ButtonsOptions>
                        </>
                    }
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
    margin-top: 3.75rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;

    label {
        font: 700 1.125rem/1.5rem 'AT Aero Bold';
        width: 100%;   
    }

    input, select {
        font: 400 1rem/1.5rem 'At Aero';
        width: 100%;
        height: 3rem;
        //max-width: 30rem;
        padding: 0.75rem 1rem;
        background-color: transparent;
        transition: all 200ms ease-in-out;
        border: 1px solid var(--content-neutrals-primary);

        &:hover, &:focus-visible{
            background-color: var(--background-neutrals-secondary);
        }

        &:focus-visible{
            border: 1px solid var(--brand-primary);
        }
    }

    .section-container {
        width: fit-content;
        height: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: var(--background-neutrals-secondary); 
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
        gap: 1.5rem;


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
        background-color: var(--background-neutrals-primary);
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
    background-color: var(--background-neutrals-inverse);
    padding: 1rem 1.5rem;

    .show-list-btn {
        margin-top: 2rem;
    }

    h6 {
        color: var(--brand-primary);
    }
`

const ButtonsOptions = styled.div`
    display: flex;
    width: 100%;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
`
