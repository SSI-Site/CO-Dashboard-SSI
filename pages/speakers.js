import NavBar from "../src/patterns/base/Nav";
import Meta from "../src/infra/Meta";
import styled, {css} from "styled-components";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";

// saphira
import saphira from "../services/saphira";
import LoadingSVG from '../public/loading.svg'
 
// Componenets
import SecondaryButton from "../src/components/SecondaryButton";
import Button from '../src/components/Button';
import PalestrantePopUp from '../src/components/PalestrantePopUp'
import PalestranteRow from '../src/components/PalestranteRow'

const Speakers = () => {

    const [speakers, setSpeakers] = useState([])
    const [filteredSpeakers, setFilteredSpeakers] = useState([])
    const [isOpen, setisOpen] = useState(false)
    const [isLoading, setisLoading] = useState(true)

    // Funcionalidades
    const [currentPage, setCurrentPage] = useState(1)
    const [query, setQuery] = useState('')
    const maxRows = 11;

    const getPalestrantes = async() => {
        if (!isLoading) setisLoading(true);

        try{
            const { data } = await saphira.getSpeakers()
            if (data) {
                setSpeakers(data);
                setFilteredSpeakers(data)
            }
        }

        catch(error){
            console.log(error)
        }

        finally{
            setisLoading(false)
        }
    }

    const OnClosePopUp = async(event) => {
        setisOpen(false)
        if (event) await getPalestrantes()
    }

    useEffect(() => {
        getPalestrantes()
    }, [])

    const totalPages = Math.ceil(filteredSpeakers.length / maxRows)
    const currentSpeakers = filteredSpeakers.slice(
        (currentPage - 1) * maxRows,
        currentPage * maxRows
    )

    const handleSearch = (e) => {
        
        const query = e.toLowerCase()
        const filtered = speakers.filter(speaker => 
            speaker.name.toLowerCase().includes(query)
            || speaker.id.toLowerCase().includes(query)
        )
        setFilteredSpeakers(filtered)
        setCurrentPage(1)
    }


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

            <Meta title = "COSSI 2025 | Palestrantes"/>
            <NavBar name = {"Palestrantes"}/>

            <PalestrantesContainer>
                <PalestrantesTitle>
                    <h5>Palestrantes</h5>

                    <PalestrantesInteractions>
                        <PalestrantesFilter>
                            <input 
                                type = "text"
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder = "Buscar por nome, id, palestrante...">
                            </input>
                            <Button onClick = {() => handleSearch(query)}>Consultar</Button>
                        </PalestrantesFilter>
                        <span/>
                        <SecondaryButton onClick = {() => setisOpen(true)}>
                            + Adicionar
                        </SecondaryButton> 

                        <PalestrantePopUp isOpen={isOpen} onClose={OnClosePopUp}/>
                    </PalestrantesInteractions>

                </PalestrantesTitle>

                <PalestrantesGrid>
                    <label>Código SSI</label>
                    <label>Nome</label>
                    <label>Pronomes</label>
                    <label>Cargo</label>
                    <label>Instagram</label>
                    <label>Linkedin</label>
                </PalestrantesGrid>

                <PalestrantesWrapper>
                    {!isLoading &&
                        currentSpeakers.map((speaker, index) => {
                            return (
                                <PalestranteRow
                                    update = {getPalestrantes}
                                    isEven = {index % 2}
                                    key = {speaker.id}
                                    id = {speaker.id}
                                    name = {speaker.name}
                                    pronouns = {speaker.pronouns}
                                    role = {speaker.role}
                                    instagram = {speaker.instagram_link}
                                    linkedin = {speaker.linkedin_link}
                                    description = {speaker.description}
                                /> 
                            )
                        })
                    }

                    {!isLoading &&
                        speakers.length == 0 &&
                            <p className = 'allRow noSpeakers'>Sem palestrantes cadastrados :(</p>     
                    }

                    {isLoading &&
                        <Image
                            src = {LoadingSVG}
                            width={120}
                            height={50}
                            alt = "Loading"
                            className = "allRow"
                        />
                    }

                </PalestrantesWrapper>

                <PalestrantesFooter>
                    <p>{speakers.length} palestrantes encontrados</p>
                    <Pagination>
                        <Button 
                        className = {currentPage == 1 ? 'noInteraction' : ''}
                        onClick={() => setCurrentPage(currentPage == 1 ? 1 : currentPage - 1)}>{"<"}</Button>
                        {Array.from({length: totalPages}, (_, i) => 
                            <Button 
                            className = {currentPage == i + 1 ? '': 'disabled'}
                            key = {i + 1} 
                            onClick={() => setCurrentPage(i + 1)}>{i + 1}</Button>
                        )}
                        <Button 
                        className = {currentPage == totalPages? 'noInteraction' : ''}
                        onClick = {() => setCurrentPage(currentPage == totalPages ? currentPage : currentPage + 1)}>{">"}</Button>
                    </Pagination>
                </PalestrantesFooter>
            </PalestrantesContainer>
        </>
    )   
}

export default Speakers;

const PalestrantesContainer = styled.div`
    padding: 1.5rem;
    width: 100%;
    height: 100%;
    margin: auto;
    max-width: 1920px;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const PalestrantesTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 1.5rem;
`

const PalestrantesFilter = styled.div`
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

const PalestrantesInteractions = styled.div`
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


const PalestrantesGrid = styled.div`
    width: 100%;
    border-block: 1px solid var(--outline-neutrals-secondary);
    padding: 1.5rem 0.5rem;
    display: grid;
    grid-template-columns: 1fr 3fr repeat(4, 1fr); 
    grid-column-gap: 3rem;
    grid-row-gap: 0.75rem; 
    margin-bottom: 0.75rem;

    label {
        font: 700 1.125rem/1.5rem 'At Aero Bold';
    }
`

const PalestrantesWrapper = styled.div`
    width: 100%;
    display: grid;
    grid-column-gap: 3rem;
    padding-bottom: 0.75rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--outline-neutrals-secondary);

    .noSpeakers{
        text-align: center;
        font: 700 1.125rem/1.5rem 'At Aero Bold';
    }

    .allRow{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 5rem;
    }
`

const PalestrantesFooter = styled.footer`
    width: 100%;
    display: flex;
    justify-content: space-between;
    
    p {
        font: 700 1rem/1.5rem 'At Aero Bold';
    }
`

const Pagination = styled.div`
    display: flex;
    gap: 0.75rem;

    button{
        width: 2rem;
        height: 2rem;
        padding: 1.5rem;
    }
    .noInteraction{
        color: var(--content-neutrals-primary);
        background-color: var(--background-neutrals-tertiary);
        pointer-events: none;
    }

    .disabled{
        background-color: transparent;
        border: 1px solid var(--content-neutrals-primary);
    }
`