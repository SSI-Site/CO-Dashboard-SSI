import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";

// saphira
import saphira from "../../services/saphira";

// components
import Button from "./Button";
import SecondaryButton from "./SecondaryButton";
import LoadingSVG from '../../public/loading.svg'

const TalkPopUp = ({isOpen, onClose}) => {

    if (!isOpen) return null
    
    const [sponsors, setSponsors] = useState([])
    const [speakers, setSpeakers] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const postTalk = async(talk) => {
        console.log(talk.date)
        const start_time = new Date()
        start_time.setHours(talk.start_time.split(':')[0], talk.start_time.split(':')[1])
        start_time.setFullYear(2025, talk.date.split('-')[1], talk.date.split('-')[2])

        const end_time = new Date()
        end_time.setHours(talk.end_time.split(':')[0], talk.end_time.split(':')[1])
        start_time.setFullYear(2025, talk.date.split('-')[1], talk.date.split('-')[2])

        await saphira.postTalk(
            start_time,
            end_time,
            [talk.speaker],
            talk.activity_type,
            "PR",
            talk.sponsor,
            talk.title,
            talk.description
        )   
    }

    const fetchData = async() => {
        const [speakerRes, sponsorRes] = await Promise.all([
            saphira.getSpeakers(),
            saphira.getSponsors()
        ])

        setSpeakers(speakerRes.data)
        setSponsors(sponsorRes.data)
    }

    const speakersOptions = useMemo(() => {
        return speakers.map((speaker)  => {
            return(
                <option key = {speaker.id} value = {speaker.id}>{speaker.name}</option>
            )
        })
    }, [speakers])

    useEffect(() => {
        try{
            fetchData()
        }
        catch(err){
            console.log(err)
        }
        finally{
            setIsLoading(false)
        }
    }, [])

    const {register, handleSubmit, watch, formState: {erros}} = useForm()

    return (
        <PopUpOverlay onClick = {onClose}>
            <PopUpContainer onClick={(e) => e.stopPropagation()}>
                <PopUpHeader>
                    <h5>Adicionar Palestra</h5>
                    <div className = 'close' onClick={onClose}>
                        <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z"/>
                        </svg>
                    </div>
                </PopUpHeader>

                {!isLoading &&
                    <>
                        <form action = "" onSubmit={handleSubmit(postTalk)}>
                            <MainPopUp>
                                <FormGroup>
                                    <label htmlFor="title">Nome da palestra</label>
                                    <input id = "title" type = "text"
                                    {...register('title')}
                                    placeholder = "Nome da palestra..."/>
                                </FormGroup>

                                <FormGroup>
                                    <label>Tipo de atividade</label>
                                    <select id = "activity_type" {...register('activity_type')}>
                                        <option value = "WS">Workshop</option>
                                        <option selected value = "PR">Palestra</option>
                                    </select>
                                    
                                </FormGroup>

                                <FormGroup>
                                    <label>Empresa</label>
                                    <select id = "sponsor" {...register('sponsor')}>
                                        {
                                            sponsors.map((sponsor) => {
                                                return(
                                                    <option value = {sponsor.id}>{sponsor.name}</option>
                                                )
                                            })
                                        }
                                        <option selected value = {null}>Nenhuma</option>

                                    </select>
                                </FormGroup>

                                <FormGroup>
                                    <label>Palestrantes</label>
                                    <select id = "speakers"  
                                    {...register('speakers')}>
                                        {speakersOptions}
                                    </select>
                                </FormGroup>

                                <FormColumn>
                                    <FormGroup>
                                        <label html = "start_time">Início</label>
                                        <input id = "start_time" type = "time"
                                        {...register('start_time')}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <label html = "end_time">Fim</label>
                                        <input id = "end_time" type = "time"
                                        {...register('end_time')}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <label html = "date">Data</label>
                                        <input id = "date" type = "date"
                                        {...register('date')}
                                        />
                                    </FormGroup>

                                </FormColumn>
                            </MainPopUp>

                            <PopUpFooter>
                                <SecondaryButton onClick={onClose} type = "button">Cancelar</SecondaryButton>
                                <Button type = "submit">Confirmar</Button>
                            </PopUpFooter>
                        </form>
                    </>
                }

                {isLoading &&
                    <Image
                        src = {LoadingSVG}
                        width={120}
                        height={50}
                        className = "loading"
                    />
                }
            </PopUpContainer>
        </PopUpOverlay>
    )
}

export default TalkPopUp;

const PopUpOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background-color: rgba(0, 0, 0, 0.7);

    display: flex;
    justify-content: center;
    align-items: center;

    z-index: 1000;
`;

const PopUpContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: var(--background-neutrals-secondary);
    width: 100%;
    max-width: 62.5rem;
    padding: 2rem;
    color: var(--content-neutrals-primary);

    .loading{
        width: 100%;
    }
`;

const PopUpHeader = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--outline-neutrals-secondary);

    h5{
        color: var(--content-neutrals-primary, #FFF);
        font: 700 2rem/2.5rem 'At aero Bold';
    }

    .close {
        padding: 1rem 1rem 0.65rem 1rem;
        cursor: pointer;   
        background-image: linear-gradient(to right, transparent 50%, var(--background-neutrals-inverse) 50%);
        background-size: 200%;
        background-position-x: 200%;

        svg path{
            fill: var(--content-neutrals-primary)
        }
        transition: all 150ms ease-in-out;
        
        &:hover {
            background-position-x: 100%;
            
            svg path{
                fill: var(--content-neutrals-inverse);
            }
        }
    }
`;

const MainPopUp = styled.main`
    display: flex;
    flex-direction: column;
    padding-block: 1rem;
    gap: 1.5rem;
    border-bottom: 1px solid var(--outline-neutrals-secondary);
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
        font: 700 1rem/1.5rem 'At Aero Bold';
    }

    input, select {
        font: 400 1rem/1.5rem 'At Aero';
        width: 100%;
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
`;

const FormColumn = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 2fr;
    width: 100%;
    grid-column-gap: 1rem;
`


const PopUpFooter = styled.div`
    margin-top: 1rem;
    gap: 1.5rem;
    display: flex;
    justify-content: space-between;

    button{
        max-width: none;
    }
`