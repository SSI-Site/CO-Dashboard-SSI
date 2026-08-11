import NavBar from "../src/patterns/base/Nav";
import Meta from "../src/infra/Meta";
import styled from "styled-components";
import Image from "next/image";
import { useState, useEffect } from "react";

// Saphira
import saphira from "../services/saphira";

// Components
import Button from "../src/components/Button";
import SecondaryButton from "../src/components/SecondaryButton";
import Pagination from "../src/components/Pagination";
import LoadingSVG from '../public/loading.svg'
import SponsorRow from "../src/components/sponsorRow";
import SponsorPopUp from "../src/components/SponsorPopUp";

const Sponsors = () => {

    const [isOpen, setisOpen] = useState(false)
    const [sponsors, setSponsors] = useState([])
    const [isLoading, setisLoading] = useState(true)

    // Funcionalidades
    const [currentPage, setCurrentPage] = useState(1)
    const [query, setQuery] = useState('')
    const [filteredSponsors, setFilteredSponsors] = useState([])
    const [maxRows, setMaxRows] = useState(11)

    const getSponsors = async() => {
        if (!isLoading) setisLoading(true)

        try{
            const { data } = await saphira.getSponsors()
            if (data) {
                setSponsors(data)
                setFilteredSponsors(data)
            }
        }
        catch(err){
            console.log(err)
        }
        finally{
            setisLoading(false)
        }

    }

    const OnClosePopUp = async(render) => {
        setisOpen(false)
        if (render) await getSponsors()
    }

    const totalPages = Math.ceil(filteredSponsors.length / maxRows)
    const currentSponsors = filteredSponsors.slice(
        (currentPage - 1) * maxRows,
        currentPage * maxRows
    )

    const handleSearch = (e) => {
        
        const query = e.toLowerCase()
        const filtered = sponsors.filter(sponsor => 
            sponsor.name.toLowerCase().includes(query)
        )
        setFilteredSponsors(filtered)
        setCurrentPage(1)
    }

        // Logica de dimensionamento dinâmico
    useEffect(() => {
        const calculateMaxRows = () => {
            // Se estiver rodando no servidor (Next.js SSR), ignora.
            if (typeof window === "undefined") return;

            // Estimativa de altura fixa (NavBar + Título + Search + Headers + Footer + Margens)
            const offsetHeight = 350;
            
            // Altura estimada de cada StudentRow (4rem = 64px)
            const rowHeight = 64; 
            
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

        // Chamdada da API
        getSponsors();

        // Função de limpeza: remove um listener quando o componente for desmontado
        return () => window.removeEventListener('resize', calculateMaxRows);
    }, [])

    return (
        <>
            <Meta title = "COSSI 2026 | Empresas"/>
            <NavBar name = {"Empresas"}/>

            <SponsorsContainer>
                <SponsorsTitle>
                    <h5>Empresas</h5>

                    <SponsorsInteractions>
                        <SponsorsFilter>
                            <input 
                                type="text"
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    if (e.target.value === '') {
                                        setFilteredSponsors(sponsors);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch(query);
                                    }
                                }}
                                placeholder = "Buscar por nome...">
                            </input>
                            <Button onClick={() => handleSearch(query)}>Consultar</Button>
                            <span/>
                            <SecondaryButton onClick = {() => setisOpen(true)}>
                                + Adicionar
                            </SecondaryButton> 

                            <SponsorPopUp isOpen = {isOpen} onClose={OnClosePopUp}/>
                        </SponsorsFilter>
                    </SponsorsInteractions>
                </SponsorsTitle>

                <SponsorsGrid>
                    <label>Nome</label>
                    <label>URL do site</label>
                </SponsorsGrid>
                <SponsorsWrapper>
                    {!isLoading && currentSponsors.map((sponsor, index) => {
                        return(
                            <SponsorRow
                            key = {index}
                            update = {getSponsors}
                            isEven = {index % 2}
                            id = {sponsor.id}
                            name={sponsor.name}
                            url={sponsor.url}
                            />
                        )
                        })
                    }

                    {!isLoading &&
                        sponsors.length == 0 &&
                            <p className = 'allRow noSpeakers'>Sem empresas cadastradas :(</p> 
                    }

                    {isLoading &&
                    <div className = "allRow">
                        <Image
                            src = {LoadingSVG}
                            width={120}
                            height={50}
                            alt = "Loading..."
                        />
                    </div>
                    }
                </SponsorsWrapper>   
                <SponsorsFooter>
                    <p>{filteredSponsors.length} Parceiro/Apoiador encontrado</p>
                    {!isLoading && sponsors.length !== 0 && (
                        <Pagination 
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                        />
                    )}
                </SponsorsFooter>
            </SponsorsContainer>
        </>
    )
}

const SponsorsContainer = styled.div`
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

const SponsorsTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 1.5rem;
`

const SponsorsFilter = styled.div`
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

const SponsorsInteractions = styled.div`
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


const SponsorsGrid = styled.div`
    width: 100%;
    border-block: 1px solid var(--outline-neutrals-secondary);
    padding: 1.5rem 0.5rem;
    display: grid;
    grid-template-columns: 1fr 3fr; 
    grid-column-gap: 3rem;
    grid-row-gap: 0.75rem; 
    margin-bottom: 0.75rem;

    label {
        font: 700 1.125rem/1.5rem 'At Aero Bold';
    }
`

const SponsorsWrapper = styled.div`
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

const SponsorsFooter = styled.footer`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    p {
        font: 700 1rem/1.5rem 'At Aero Bold';
    }
`

export default Sponsors