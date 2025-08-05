import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

// saphira
import saphira from "../../services/saphira";

// components
import Button from "./Button";

const TalkRow = ({id, title, speakers = [], start_time, end_time, activity_type, sponsor = {}, description, mode, isEven}) => {

    const [isUpdateOpen, setIsUpdateOpen] = useState(false)
    const {register, handleSubmit, watch, formState: {erros}} = useForm()
    const [presences, setPresences] = useState(0)
    const [speakersNames, setSpeakersNames] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const formatedTime = (isoDate) => {
        const date = new Date(isoDate)
        return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
    }

    const formatedDate = (isoDate) => {
        const date = new Date(isoDate)
        return date.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})
    }

    const getPresences = async() => {
        try{
            const { data } = await saphira.getPresences()
            let count = 0;
            data.forEach((palestra) => {
                if (palestra.talk == id) count++;
            })

            setPresences(count)
        }
        catch(err){
            console.log(err)
        }
    }

    const getSpeakerNames = async() => {
        const requests = speakers.map(id => saphira.getSpeaker(id))
        const response = await Promise.all(requests)
        const names = response.map(res => res.data.name)

        setSpeakersNames(names)
    }

    useEffect(() => {
        getPresences()
        getSpeakerNames()

        setIsLoading(false)
    }, [])

    return (
        <>
        {!isLoading &&
            <Talk>
                <p>{id}</p>
                <p>{title}</p>
                <p>{speakersNames.join(', ')}</p>
                <p>{presences}</p>
                <p>{formatedTime(start_time)}</p>
                <p>{formatedTime(end_time)}</p>
                <p>{formatedDate(end_time)}</p>
                <p>Não realizado</p>
            </Talk>
        }
        </>
    )
}

export default TalkRow;

const Talk = styled.div`
    width: 100%;
    cursor: pointer;
    display: grid;
    grid-template-columns: 1fr 3fr 3fr repeat(5, 1fr);
    grid-column-gap: 3rem;
    padding: 0.75rem 0.5rem; 
    height: 4rem;
    align-items: center;
    background-color: ${({$isEven}) => $isEven ? 'var(--background-neutrals-secondary)' : 'transparent'};
    transition: background-color 200ms ease-in-out;
    
    &:hover{
        background-color: var(--state-layers-neutrals-primary-008);
    }

    p {
        font: 700 1.125rem/1.5rem 'At Aero Bold';
    }
`