import NavBar from "../src/patterns/base/Nav";
import Meta from "../src/infra/Meta";
import styled, { css } from "styled-components";
import { useState, useEffect } from "react";
import Image from "next/image";
import {useRouter} from "next/router";

// saphira
import saphira from "../services/saphira";

// components
import Button from "../src/components/Button";
import SecondaryButton from "../src/components/SecondaryButton";
import LoadingSVG from '../public/loading.svg'
import TalkPopUp from "../src/components/TalkPopUp";
import TalkRow from "../src/components/TalkRow";

const Talks = () => {
    const router = useRouter()
    const [isOpen, setisOpen] = useState(false);
    const [isLoading, setisLoading] = useState(true)
    const [talks, setTalks] = useState([])

    const getTalks =  async()=> {
        setisLoading(true)

        try{
            const { data } = await saphira.getTalks()
            if (data) setTalks(data)
        }
        catch(err){
            console.log(err)
        }
        finally{
            setisLoading(false)
        }
    }

    const OnClosePopUp = async() => {
        setisOpen(false)
        await getTalks()
    }

    useEffect(() => {
        getTalks()
    }, [])

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

            <Meta title = "COSSI 2025 | Palestras"/>
            <NavBar name = "Palestras"/>

            <TalksContainer>
                <TalksTitle>
                    <h5>Palestras</h5>

                    <TalksInteractions>
                        <TalksFilter>
                            <input 
                                placeholder = "Buscar por nome, id, palestrante...">
                            </input>
                            <Button>Consultar</Button>
                        </TalksFilter>
                        <span/>
                        <SecondaryButton onClick = {() => router.push({
                            pathname: '/talkForm',
                            query: {
                                data: "Eduardo"
                            }
                        })}>
                            + Adicionar
                        </SecondaryButton> 

                        <TalkPopUp isOpen={isOpen} onClose={OnClosePopUp}/>
                    </TalksInteractions>

                </TalksTitle>

                <TalksGrid>
                    <label>ID</label>
                    <label>Palestra</label>
                    <label>Palestrantes</label>
                    <label>Presentes</label>
                    <label>Início</label>
                    <label>Fim</label>
                    <label>Data</label>
                    <label>Status</label>
                </TalksGrid>

                <TalksWrapper>
                    {!isLoading &&
                        talks.map((talk) => {
                            return (
                                <TalkRow
                                    key = {talk.id}
                                    id = {talk.id}
                                    title = {talk.title}
                                    start_time={talk.start_time}
                                    end_time={talk.end_time}
                                    mode={talk.mode}
                                    speakers={talk.speakers}
                                    sponsor={talk.sponsor}
                                    activity_type={talk.activity_type}
                                    description = {talk.description}
                                /> 
                            )
                        })
                    }

                    {!isLoading &&
                        talks.length == 0 &&
                            <p className = 'allRow noSpeakers'>Sem palestras cadastradas :(</p>
                    }

                    {isLoading &&
                        <Image
                            src = {LoadingSVG}
                            width={120}
                            height={50}
                            className = "allRow"
                        />
                    }

                </TalksWrapper>

                <TalksFooter>
                    <p>{talks.length} palestras encontradas</p>
                    <Pagination></Pagination>
                </TalksFooter>
            </TalksContainer>
        </>    
    )
}

export default Talks

const TalksContainer = styled.div`
    padding: 1.5rem;
    width: 100%;
    height: 100%;
    margin: auto;
    max-width: 1920px;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const TalksTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 1.5rem;
`

const TalksFilter = styled.div`
    display: flex;
    gap: 0.5rem;
    width: 100%;
    align-items: center;
    justify-content: flex-end;
    margin-left: 1.5rem;

    input {
        font: 400 1rem/1.5rem 'At Aero';
        width: 100%;
        max-width: 30rem;
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

    button {
        max-width: 8rem;
    }
`

const TalksInteractions = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    height: 100%;

    span {
        height: 3rem;
        border-left: 1px solid var(--outline-neutrals-secondary);
    }

    button {
        max-width: 8rem;
    }
`


const TalksGrid = styled.div`
    width: 100%;
    border-block: 1px solid var(--outline-neutrals-secondary);
    padding: 1.5rem 0.5rem;
    display: grid;
    grid-template-columns: 1fr 3fr 3fr repeat(5, 1fr); 
    grid-column-gap: 3rem;
    grid-row-gap: 0.75rem; 
    margin-bottom: 0.75rem;

    label {
        font: 700 1.125rem/1.5rem 'At Aero Bold';
    }
`

const TalksWrapper = styled.div`
    width: 100%;
    display: grid;
    grid-column-gap: 3rem;
    grid-row-gap: 0.75rem; 
    padding-bottom: 0.75rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--outline-neutrals-secondary);

    .noSpeakers{
        text-align: center;
        font: 700 1.125rem/1.5rem 'At Aero Bold';
    }

    .allRow{
        grid-row-start: 1;
        grid-row-end: 11;
        align-self: center;
        width: 100%;
    }
`

const TalksFooter = styled.footer`
    width: 100%;
    display: flex;
    justify-content: space-between;
    
    p {
        font: 700 1rem/1.5rem 'At Aero Bold';
    }
`

const Pagination = styled.div`
`