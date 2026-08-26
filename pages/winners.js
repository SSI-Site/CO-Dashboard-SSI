import NavBar from "../src/patterns/base/Nav";
import Meta from "../src/infra/Meta";
import styled from "styled-components";
import { useState, useEffect } from "react";

// Components
import Button from "../src/components/Button";
import Pagination from "../src/components/Pagination";
import MainTable from "../src/components/MainTable";

// saphira
import saphira from "../services/saphira";

const Winners = () => {
    const [isLoading, setIsLoading] = useState(false)
    
    const [fullData, setFullData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [query, setQuery] = useState('')

    const [currentPage, setCurrentPage] = useState(1)
    const [maxRows, setMaxRows] = useState(6)

    const getWinners = async () => { 
        setIsLoading(true);

        try {
            const { data } = await saphira.getWinners()
            
            if (data) {
                // Busca os alunos
                const studentsRes = await Promise.all(
                    data.map(async (item) => {
                        const res = await saphira.getStudentInfo(item.student);
                        return res ? res.data : {};
                    })
                )

                // Busca as palestras
                const talksRes = await Promise.all(
                    data.map(async item => {
                        const res = await saphira.getTalk(item.talk)
                        return res ? res.data : {};
                    })
                )

                // Unifica tudo em um único array de objetos para facilitar o filtro e a renderização
                const combinedData = data.map((item, index) => ({
                    id: item.id || index, // Usa o id do winner ou o index como fallback para a key
                    code: studentsRes[index]?.code || 'N/A',
                    name: studentsRes[index]?.name || 'N/A',
                    email: studentsRes[index]?.email || 'N/A',
                    talkTitle: talksRes[index]?.title || 'N/A'
                }));

                setFullData(combinedData);
                setFilteredData(combinedData);
            }
        }
        catch(err){
            console.log("Houve um erro na hora de pegar os ganhadores!", err)
        }
        finally{
            setIsLoading(false)
        }
    }

    // Dimensionamento automatico
    useEffect(() => {
        const calculateMaxRows = () => {
            if (typeof window === "undefined") return;

            const offsetHeight = 350; 
            const rowHeight = 104; 
            const availableHeight = window.innerHeight - offsetHeight;
            const calculatedRows = Math.floor(availableHeight / rowHeight);
            
            setMaxRows(Math.max(3, calculatedRows));
        };

        calculateMaxRows();
        window.addEventListener('resize', calculateMaxRows);

        return () => window.removeEventListener('resize', calculateMaxRows);
    }, [])

    // Função responsável por executar o filtro
    const handleSearch = (searchValue) => {
        const q = searchValue.toLowerCase();
        
        const filtered = fullData.filter(item => 
            item.name.toLowerCase().includes(q) ||
            item.code.toLowerCase().includes(q) ||
            item.email.toLowerCase().includes(q) ||
            item.talkTitle.toLowerCase().includes(q)
        );

        setFilteredData(filtered);
        setCurrentPage(1);
    }

    useEffect(() => {
        getWinners()
    }, [])

    // Fatiamento dos dados para a página atual
    const totalPages = Math.ceil(filteredData.length / maxRows);
    const currentWinners = filteredData.slice(
        (currentPage - 1) * maxRows,
        currentPage * maxRows
    );

    const columns = [
        {
            key: "code",
            label: "Código SSI",
            width: "12rem",
        },
        {
            key: "name",
            label: "Nome",
            width: "18rem",
        },
        {
            key: "email",
            label: "Email",
            width: "22rem",
        },
        {
            key: "talkTitle",
            label: "Palestra",
            width: "22rem",
        },
    ];

    return (
        <>
            <NavBar name={"Realizar Sorteio > Lista de ganhadores"} />
            <Meta title="COSSI 2026 | Ganhadores dos sorteios" />

            <WinnersContainer>
                <WinnersTitle>
                    <h5>Ganhadores dos sorteios</h5>

                    <WinnersInteractions> 
                        <WinnersFilter>
                            <input
                                type="text"
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    if (e.target.value === '') {
                                        setFilteredData(fullData);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch(query);
                                    }
                                }} 
                                placeholder="Buscar por nome, e-mail, código ou palestra..."
                            />
                            <Button onClick={() => handleSearch(query)}>Consultar</Button>
                        </WinnersFilter>
                    </WinnersInteractions>
                </WinnersTitle>

                <MainTable
                    data={currentWinners}
                    columns={columns}
                    loading={isLoading}
                    emptyState={fullData.length === 0 ? "Sem vencedores, ainda!" : "Nenhum vencedor encontrado para esta busca."}
                    rowKey="id"
                />

                <WinnersFooter>
                    <p>{filteredData.length} ganhadores encontrados</p>
                    {!isLoading && filteredData.length !== 0 && (
                        <Pagination 
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                        />
                    )}
                </WinnersFooter>
            </WinnersContainer>
        </>
    )
}

export default Winners;

const WinnersContainer = styled.div`
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

const WinnersTitle = styled.div`
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

const WinnersFilter = styled.div`
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

const WinnersInteractions = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    height: 100%;
    
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

const WinnersFooter = styled.footer`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    
    p {
        font: 700 1rem/1.5rem 'At Aero Bold';
        margin-bottom: 1rem;
    }
`