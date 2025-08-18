import NavBar from "../src/patterns/base/Nav";
import Meta from "../src/infra/Meta";
import styled from "styled-components";
import { useState, useEffect } from "react";

// Components
import Button from "../src/components/Button";

//saphira
import saphira from "../services/saphira";

// Assets
import LoadingSVG from '../public/loading.svg'

const Winners = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [winners, setWinners] = useState([])
    const [student, setStudent] = useState({})
    const [talk, setTalk] = useState({})

    const getWinners = async() => {
        setIsLoading(true);

        try{
            const { data } = await saphira.getWinners()
            if (data) setWinners(data)
        }
        catch(err){
            console.log("Houve um erro na hora de pegar os ganhadores!", err)
        }
        finally{
            setIsLoading(false)
        }
    }

    const getStudent = async(studentId) => {
        try{
            const { data } = await saphira.getStudentInfo(studentId)
        }
        catch(err){
            console.log("Erro ao obter os dados do estudante!")
        }
    }

    const getTalk = async() => {
        try{

        }
        catch(err){
            console.log("Erro ao boter os dados da pelstra")
        }
    }

    useEffect(() => {
        getWinners()
    }, [])

    return (
        <>
            <NavBar name = {"Realizar Sorteio > Lista de ganhadores"}/>
            <Meta title = "COSSI 2025 | Ganhadores dos sorteios"/>

            <WinnersContainer>
                <WinnersTitle>
                    <h5>Ganhadores dos sorteios</h5>

                    <WinnersInteractions> 
                        <WinnersFilter>
                            <input 
                                placeholder = "Buscar por nome, id, código...">
                            </input>
                            <Button>Consultar</Button>
                        </WinnersFilter>
                    </WinnersInteractions>
                </WinnersTitle>

                <WinnersGrid>
                    <label>Código SSI</label>
                    <label>Nome</label>
                    <label>Email</label>
                    <label>Palestra</label>
                </WinnersGrid>
                <WinnersWrapper>
                    {
                        !isLoading &&
                        winners.map((winner, index) => {

                            return (
                                <Winner $isEven = {index % 2}>
                                    <p>{winner.id}</p>
                                    <p>{winner.name}</p>
                                    <p>{winner.email}</p>
                                </Winner>
                            )
                        })
                    }
                    {
                        !isLoading && winners.length === 0 &&
                        <p className="allRow">Sem vencedores, ainda!</p>
                    }
                    
                </WinnersWrapper>   
            </WinnersContainer>
        </>

    )
}

export default Winners

const WinnersContainer = styled.div`
    padding: 1.5rem;
    width: 100%;
    height: 100%;
    margin: auto;
    max-width: 1920px;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const WinnersTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 1.5rem;
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

`


const WinnersGrid = styled.div`
    width: 100%;
    border-block: 1px solid var(--outline-neutrals-secondary);
    padding: 1.5rem 0.5rem;
    display: grid;
    grid-template-columns: 1fr 2fr 2fr 2fr;
    grid-column-gap: 3rem;
    grid-row-gap: 0.75rem; 
    margin-bottom: 0.75rem;

    label {
        font: 700 1.125rem/1.5rem 'At Aero Bold';
    }
`

const WinnersWrapper = styled.div`
    width: 100%;
    display: grid;
    grid-column-gap: 3rem;
    padding-bottom: 0.75rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--outline-neutrals-secondary);

    .allRow{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 5rem;
    }
`

const Winner = styled.div`
    width: 100%;
    align-items: center;
    cursor: pointer;
    display: grid;
    grid-template-columns: 1fr 2fr 2fr 2fr; 
    grid-column-gap: 3rem;
    padding: 0.75rem 0.5rem; 
    min-height: 4rem;
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