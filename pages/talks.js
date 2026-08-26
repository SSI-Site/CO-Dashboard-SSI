import NavBar from "../src/patterns/base/Nav";
import Meta from "../src/infra/Meta";
import styled from "styled-components";
import { useState, useEffect } from "react";
import {useRouter} from "next/router";
import useAuth from '../hooks/useAuth';

// saphira
import saphira from "../services/saphira";

// components
import Button from "../src/components/Button";
import SecondaryButton from "../src/components/SecondaryButton";
import Pagination from "../src/components/Pagination";
import MainTable from "../src/components/MainTable";

const Talks = () => {
    const router = useRouter()
    const { isAuthenticated } = useAuth();
    const [isLoading, setisLoading] = useState(true)
    const [talks, setTalks] = useState([])

    // Funcionalidades
    const [currentPage, setCurrentPage] = useState(1)
    const [query, setQuery] = useState('')
    const [filteredTalks, setFilteredTalks] = useState([])
    const [maxRows, setMaxRows] = useState(11)

    const formatTime = (isoDate) => {
        const date = new Date(isoDate)
        return date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit', hour12: false})
    }

    const formatDate = (isoDate) => {
        const date = new Date(isoDate)
        return date.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})
    }

    const getTalks =  async()=> {
        setisLoading(true)

        try{
            const { data } = await saphira.getTalks()
            
            const clientTime = Date.now()
            
            if (data) {
                const talksBase = data.map((talk) => {
                    const endTime = new Date(talk.end_time).getTime()
                    return ({
                      ...talk,
                      speakersNames: 'Carregando',
                      presences: 0,
                      status: endTime < clientTime ? 'Realizado' : 'Não realizado'
                  })
                })

                setTalks(talksBase)
                setFilteredTalks(talksBase)
                setisLoading(false)

                const [presencesRes, talksWithSpeakers] = await Promise.all([
                    saphira.getPresences(),
                    Promise.all(
                        data.map(async (talk) => {
                            const speakerResponses = await Promise.all(
                                (talk.speakers || []).map((speakerId) => saphira.getSpeaker(speakerId))
                            )

                            return {
                                id: talk.id,
                                speakersNames: speakerResponses
                                    .map((response) => response?.data?.name)
                                    .filter(Boolean)
                                    .join(', '),
                            }
                        })
                    ),
                ])

                const presencesByTalk = presencesRes.data.reduce((acc, presence) => {
                    const talkId = String(presence.talk)
                    acc[talkId] = (acc[talkId] || 0) + 1
                    return acc
                }, {})

                const speakersByTalk = talksWithSpeakers.reduce((acc, item) => {
                    acc[String(item.id)] = item.speakersNames
                    return acc
                }, {})

                const talksWithDetails = talksBase.map((talk) => ({
                    ...talk,
                    presences: presencesByTalk[String(talk.id)] || 0,
                    speakersNames: speakersByTalk[String(talk.id)] || '',
                }))

                setTalks(talksWithDetails)
                setFilteredTalks((currentFiltered) =>
                    currentFiltered.map((talk) => ({
                        ...talk,
                        presences: presencesByTalk[String(talk.id)] || 0,
                        speakersNames: speakersByTalk[String(talk.id)] || '',
                    }))
                )
            }
        }
        catch(err){
            console.log(err)
        }
        finally{
            setisLoading(false)
        }
    }

    // Logica de dimensionamento dinâmico
    useEffect(() => {
        const calculateMaxRows = () => {
            // Se estiver rodando no servidor (Next.js SSR), ignora.
            if (typeof window === "undefined") return;

            // Estimativa de altura fixa (NavBar + Título + Search + Headers + Footer + Margens)
            const offsetHeight = 350;
            
            // Altura estimada de cada StudentRow (4rem = 64px)
            const rowHeight = 72; 
            
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
            getTalks();
        }

        if (isAuthenticated === false) {
            router.push('/');
        }
    }, [isAuthenticated, router])

    if (isAuthenticated === null) {
        return null;
    }

    const totalPages = Math.ceil(filteredTalks.length / maxRows)
    const currentTalks = filteredTalks.slice(
        (currentPage - 1) * maxRows,
        currentPage * maxRows
    )

    const columns = [
        {
            key: 'id',
            label: 'ID',
            width: '8rem',
        },
        {
            key: 'title',
            label: 'Palestra',
            width: '25rem',
        },
        {
            key: 'speakersNames',
            label: 'Palestrantes',
            width: '22rem',
        },
        {
            key: 'presences',
            label: 'Presentes',
            width: '10rem',
        },
        {
            key: 'start_time',
            label: 'Início',
            width: '9rem',
            render: (value) => formatTime(value),
        },
        {
            key: 'end_time',
            label: 'Fim',
            width: '9rem',
            render: (value) => formatTime(value),
        },
        {
            key: 'end_time',
            label: 'Data',
            width: '9rem',
            render: (value) => formatDate(value),
        },
        {
            key: 'status',
            label: 'Status',
            width: '11rem',
            render: (value) => value == 'Realizado' ? <span className="status done">{value}</span> : <span className="status undone">{value}</span>,
        },
    ]

    const handleRowClick = (talk) => {
        router.push({
            pathname: '/talkForm',
            query: { id: talk.id },
        })
    }

    const handleSearch = (e) => {
        const query = e.toLowerCase()
        const filtered = talks.filter(talk => 
            talk.title.toLowerCase().includes(query)
        )
        setFilteredTalks(filtered)
        setCurrentPage(1)
    }

    return (
        <>
            <Meta title = "COSSI 2026 | Palestras"/>
            <NavBar name = "Palestras"/>

            <TalksContainer>
                <TalksTitle>
                    <h5>Palestras</h5>

                    <TalksInteractions>
                        <TalksFilter>
                            <input 
                                type="text"
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    if (e.target.value === '') {
                                        setFilteredTalks(talks);
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
                        </TalksFilter>
                        <span/>
                        <SecondaryButton onClick = {() => router.push({pathname: '/talkForm',})}>
                            + Adicionar
                        </SecondaryButton> 
                    </TalksInteractions>

                </TalksTitle>

                <MainTable
                    data={currentTalks}
                    columns={columns}
                    loading={isLoading}
                    onRowClick={handleRowClick}
                    emptyState="Sem palestras cadastradas :("
                />

                <TalksFooter>
                    <p>{filteredTalks.length} palestras encontradas</p>
                    {!isLoading && talks.length !== 0 && (
                        // Chamada limpa do novo componente de paginação
                        <Pagination 
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                        />
                    )}
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

    * {
        color: var(--content-neutrals-primary);
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


const TalksFooter = styled.footer`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
    
    p {
        font: 700 1rem/1.5rem 'At Aero Bold';
    }
`
