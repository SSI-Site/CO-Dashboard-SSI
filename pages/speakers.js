import NavBar from "../src/patterns/base/Nav";
import Meta from "../src/infra/Meta";
import styled from "styled-components";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import useAuth from '../hooks/useAuth';

// saphira
import saphira from "../services/saphira";

// Components
import SecondaryButton from "../src/components/SecondaryButton";
import Button from "../src/components/Button"
import PalestrantePopUp from "../src/components/PalestrantePopUp"
import Pagination from "../src/components/Pagination"
import MainTable from "../src/components/MainTable";
import { truncateText } from "../utils/strings";
import getSocialUsername from "../utils/getSocialUsername";

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
        const totalPages = Math.max(1, Math.ceil(filteredSpeakers.length / maxRows));

        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, filteredSpeakers.length, maxRows]);

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

    const totalPages = Math.max(1, Math.ceil(filteredSpeakers.length / maxRows))
    const currentSpeakers = filteredSpeakers.slice(
        (currentPage - 1) * maxRows,
        currentPage * maxRows
    )

    const handleSearch = (value) => {
        const query = value.toLowerCase();
        const filtered = speakers.filter(
            (speaker) =>
                speaker.name.toLowerCase().includes(query) ||
                speaker.id.toLowerCase().includes(query)
        );
        setFilteredSpeakers(filtered);
        setCurrentPage(1);
    };

    const columns = [
      {
        key: "id",
        label: "Código SSI",
        width: "10rem",
        render: (value) => (value ? value.slice(0, 3).toUpperCase() : ""),
      },
      {
        key: "name",
        label: "Nome",
        width: "18rem",
      },
      {
        key: "pronouns",
        label: "Pronomes",
        width: "10rem",
      },
      {
        key: "role",
        label: "Cargo",
        width: "16rem",
        render: (value) => truncateText(value, 20),
        title: (value) => value || "",
      },
      {
        key: "instagram_link",
        label: "Instagram",
        width: "16rem",
        render: (value) => <a href={value} target="_blank" rel="noopener noreferrer">{getSocialUsername(value, "instagram")}</a>,
        title: (value) => value || "",
      },
      {
        key: "linkedin_link",
        label: "Linkedin",
        width: "16rem",
        render: (value) => <a href={value} target="_blank" rel="noopener noreferrer">{getSocialUsername(value, "linkedin")}</a>,
        title: (value) => value || "",
      },
    ];

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

                <MainTable
                  data={currentSpeakers}
                  columns={columns}
                  loading={isLoading}
                  emptyState="Sem palestrantes cadastrados :("
                  rowKey="id"
                />

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

const PalestrantesFooter = styled.footer`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;

    p {
        font: 700 1rem/1.5rem 'At Aero Bold';
    }
`
