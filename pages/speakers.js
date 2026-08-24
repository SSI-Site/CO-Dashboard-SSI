import NavBar from "../src/patterns/base/Nav";
import Meta from "../src/infra/Meta";
import styled, {css} from "styled-components";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import useAuth from '../hooks/useAuth';

// saphira
import saphira from "../services/saphira";
import LoadingSVG from '../public/loading.svg'
 
// Components
import SecondaryButton from "../src/components/SecondaryButton";
import Button from '../src/components/Button';
import PalestrantePopUp from '../src/components/PalestrantePopUp';
import PalestranteRow from '../src/components/PalestranteRow';
import Pagination from "../src/components/Pagination"; // <-- Importando o novo componente!

const Speakers = () => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [speakers, setSpeakers] = useState([])
    const [filteredSpeakers, setFilteredSpeakers] = useState([])
    const [isOpen, setisOpen] = useState(false)
    const [isLoading, setisLoading] = useState(true)

    // Funcionalidades
    const [currentPage, setCurrentPage] = useState(1)
    const [query, setQuery] = useState('')
    const [maxRows, setMaxRows] = useState(11)

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
            console.error(error)
        }
        finally{
            setisLoading(false)
        }
    }

    const OnClosePopUp = async(event) => {
        setisOpen(false)
        if (event) await getPalestrantes()
    }

    // Logica de dimensionamento dinâmico
    useEffect(() => {
        const calculateMaxRows = () => {
            // Se estiver rodando no servidor (Next.js SSR), ignora.
            if (typeof window === "undefined") return;

            // Estimativa de altura fixa (NavBar + Título + Search + Headers + Footer + Margens)
            const offsetHeight = 350;
            
            // Altura estimada de cada StudentRow (4rem = 64px)
            const rowHeight = 80; 
            
            // Calcula o espaço restante na tela
            const availableHeight = window.innerHeight - offsetHeight;
            
            // Descobre quantas linhas cabem (arredondando para baixo)
            const calculatedRows = Math.floor(availableHeight / rowHeight);
            
            // Atualiza o estado garantindo que sempre mostre pelo menos 3 linhas, 
            // mesmo em monitores muito pequenos.
            setMaxRows(Math.max(3, calculatedRows));
        };

        // Faz o cálculo assim que o componente é montado
        calculateMaxRows();

        // Adiciona um listener para recalcular sempre que a janela mudar de tamanho
        window.addEventListener('resize', calculateMaxRows);

        // Função de limpeza: remove um listener quando o componente for desmontado
        return () => window.removeEventListener('resize', calculateMaxRows);
    }, [])

    useEffect(() => {
        if (isAuthenticated === true) {
            getPalestrantes();
        }

        if (isAuthenticated === false) {
            router.push('/');
        }
    }, [isAuthenticated, router])

    if (isAuthenticated === null) {
        return null;
    }

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
            <Meta title = "COSSI 2026 | Palestrantes"/>
            <NavBar name = {"Palestrantes"}/>

            <PalestrantesContainer>
                <PalestrantesTitle>
                    <h5>Palestrantes</h5>

                    <PalestrantesInteractions>
                        <PalestrantesFilter>
                            <input 
                                type="text"
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    if (e.target.value === '') {
                                        setFilteredSpeakers(speakers);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch(query);
                                    }
                                }}
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
                            try{
                                return (
                                    <PalestranteRow
                                        update = {getPalestrantes}
                                        isEven = {index % 2}
                                        key = {speaker.id}
                                        id = {speaker.id}
                                        name = {speaker.name}
                                        pronouns = {speaker.pronouns}
                                        role = {speaker.role}
                                        instagram = {speaker.instagram_link != null ? speaker.instagram_link : ''}
                                        linkedin = {speaker.linkedin_link != null ? speaker.linkedin_link : ''}
                                        description = {speaker.description}
                                    /> 
                                )
                            }
                            catch(err){
                                alert(`Ocorreu um erro no cliente ao renderizar: ${speaker.name}. Erro: ${err}`)
                            }
                        })
                    }

                    {!isLoading &&
                        speakers.length === 0 &&
                            <p className = 'allRow noSpeakers'>Sem palestrantes cadastrados :(</p>     
                    }

                    {isLoading &&
                        <div className="allRow">
                            <Image
                                src = {LoadingSVG}
                                width={120}
                                height={50}
                                alt = "Loading"
                            />
                        </div>
                    }

                </PalestrantesWrapper>

                <PalestrantesFooter>
                    <p>{filteredSpeakers.length} palestrantes encontrados</p>
                    {!isLoading && speakers.length !== 0 && (
                        // Chamada limpa do novo componente de paginação
                        <Pagination 
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                        />
                    )}
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

    *{
        color: var(--content-neutrals-primary);
    }
`

const PalestrantesTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 1.5rem;

    h5 {
        margin-bottom: 1rem;
    }

    @media (max-width: 800px) {
        flex-direction: column;
    }
`

const PalestrantesFilter = styled.div`
    display: flex;
    gap: 0.5rem;
    width: 100%;
    align-items: center;
    justify-content: flex-end;
    margin-left: 1.5rem;

    @media (max-width: 800px) {
        margin-left: 0;
    }

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
    justify-content: flex-end;
    gap: 1rem;
    height: 100%;

    span {
        height: 3rem;
        border-left: 1px solid var(--outline-neutrals-secondary);
    }

    button {
        max-width: 8rem;
    }

    @media (max-width: 800px) {
        flex-wrap: wrap;

        span {
            display: none;
        }

        &>button {
            max-width: 100%;
        }
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
    overflow: auto;

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
    overflow: auto;

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
    flex-wrap: wrap;
    
    p {
        font: 700 1rem/1.5rem 'At Aero Bold';
        margin-bottom: 1rem;
    }
`