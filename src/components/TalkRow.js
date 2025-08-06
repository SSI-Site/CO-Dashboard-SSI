import styled from "styled-components";
import { useEffect, useState } from "react";

// saphira
import saphira from "../../services/saphira";
import { useRouter } from "next/router";

const TalkRow = ({id, title, speakers = [], start_time, end_time, activity_type, sponsor_id = 0, description, mode, isEven}) => {

    const router = useRouter()
    const [presences, setPresences] = useState(0)
    const [speakersNames, setSpeakersNames] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const formatedTime = (isoDate) => {
        const date = new Date(isoDate)
        return date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit', hour12: false})
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

    const TalkStatus = () => {
        const clientTime = new Date().getTime()
        const end = new Date(end_time).getTime()

        if (end < clientTime) return(
            <p className="status done">Realizado</p>
        )
        else return(
            <p className="status undone">Não realizado</p>
        )
    }

    const getDate = (isoDate) => {
        const date = new Date(isoDate)
        return date.toISOString().split('T')[0]
    }

    const updateTalk = () => {
        router.push({pathname: '/talkForm',
            query: {
                id: id,
                title: title,
                speakersIds: speakers.join(','),
                start_time: formatedTime(start_time),
                end_time: formatedTime(end_time),
                date: getDate(end_time),
                activity_type: activity_type,
                sponsor_id: sponsor_id,
                mode:  mode,
                description: description,
            }
        })
    }

    useEffect(() => {
        getPresences()
        getSpeakerNames()

        setIsLoading(false)
    }, [])

    return (
        <>
        {!isLoading &&
            <Talk $isEven = {isEven} onClick={() => updateTalk()}>
                <p>{id}</p>
                <p>{title}</p>
                <p>{speakersNames.join(', ')}</p>
                <p>{presences}</p>
                <p>{formatedTime(start_time)}</p>
                <p>{formatedTime(end_time)}</p>
                <p>{formatedDate(end_time)}</p>
                {TalkStatus()}
            </Talk>
        }
        </>
    )
}

export default TalkRow;

const Talk = styled.div`
    width: 100%;
    align-items: center;
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

    .status{
        padding: 0.125rem 0.25rem;
        font: 400 0.875rem/1.5rem 'At Aero';
        text-align: center;
    }

    .done{
        color: var(--content-accent-green);
        background-color: var(--background-accent-green);
    }

    .undone{
        color: var(--content-accent-red);
        background-color: var(--background-accent-red);
    }
`