import styled from "styled-components";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Components
import NavBar from "../src/patterns/base/Nav";
import Meta from "../src/infra/Meta";

// Saphira
import saphira from "../services/saphira";

const StudentView = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState({})
    const [gifts, setGifts] = useState([])
    
    const router = useRouter()
    const { id } = router.query

    const redeemGift = async() => {

    }

    const getUserPresences = async() => {
        setIsLoading(true)
        try{   
            const { data } = await saphira.getUserPresences(id)
            if (data) setUserData(data)
        }
        catch(err){
            console.log("Houve um erro na hora de obter os dados do inscrito", err)
        }
        finally{
            setIsLoading(false)
        }
    }

    const getGifts = async() => {
        try{
            const { data } = await saphira.getGifts()
            if (data) setGifts(data)
        }
        catch(err){
            console.log("Erro ao obter os brindes", err)
        }
    }

    useEffect(() => {
        getUserPresences()
        getGifts()
    }, [])

    return(
        <>
        <NavBar name = {`Lista de Inscritos > ${userData.name}`}/>
        <Meta title = {`${userData.name} | COSSI 2025 Dashboard`}/>
        <StudentContainer>
            <StudentHeader>
                <StudentData>
                    <h5>{userData.name}</h5>
                    <p>Código: {userData.code}</p>
                    <p>Email: {userData.email}</p>
                </StudentData>
                <StudentPresences>
                    <p>Total de registros:</p>
                    <h4>{userData.total_presences_count}</h4>
                </StudentPresences>
            </StudentHeader>
            <StudentsGrid>
                <label>Brinde</label>
                <label>Progresso</label>
                <label>Já retirou?</label>
            </StudentsGrid>
            <StudentGiftsWrapper>
                {gifts.map((gift, index) => 
                    <GiftRow $isEven = {index % 2}>
                        <p>{gift.name}</p>
                        <p>A</p>
                        <div className = "checkboxWrapper">
                            <input type="checkbox"/>
                        </div>
                    </GiftRow>
                )}

            </StudentGiftsWrapper>
        </StudentContainer>

        </>
    )
}

const ProgressBar = ({current, required}) => {
    const percentage = Math.min((current / required) * 100, 100)

    return (
        <div className="progress-wrapper">
            <div className="progress-bar" style={{ width: `${percentage}%` }}>
            {current >= required ? (
                <span className="progress-text success">Brinde retirado!</span>
            ) : (
                <span className="progress-text">
                {current} / {required}
                </span>
            )}
            </div>
        </div>
    )
}

const StudentContainer = styled.div`
    padding: 1.5rem;
    width: 100%;
    height: 100%;
    margin: auto;
    max-width: 1920px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
`

const StudentHeader = styled.div`
    max-width: 1920px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const StudentData = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;


    p {
        font: 700 1rem/1.5rem 'At Aero Bold';
        color: var(--content-neutrals-primary);
    }
`

const StudentPresences = styled.div`
    display: flex;
    height: 100%;
    padding: 0.75rem 1.5rem;
    flex-direction: column;
    gap: 0.5rem;
    background-color: var(--brand-primary);
    width: fit-content;

    p {
        font: 700 1rem/1.5rem 'At Aero Bold';
        color: var(--content-neutrals-primary);
    }

    h4 {
        color: var(--content-neutrals-primary);
    }

`

const StudentsGrid = styled.div`
    width: 100%;
    border-block: 1px solid var(--outline-neutrals-secondary);
    padding: 1.5rem 0.5rem;
    display: grid;
    grid-template-columns: 1fr 4fr 1fr; 
    grid-column-gap: 3rem;
    grid-row-gap: 0.75rem; 
    margin-bottom: 0.75rem;

    label {
        font: 700 1.125rem/1.5rem 'At Aero Bold';
    }
`

const StudentGiftsWrapper = styled.div`
    width: 100%;
    display: grid;
    grid-column-gap: 3rem;
    padding-bottom: 0.75rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--outline-neutrals-secondary);
`

const GiftRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 4fr 1fr; 
    grid-column-gap: 3rem;
    min-height: 4rem;
    padding: 0.75rem 0.5rem; 
    background-color: ${({$isEven}) => $isEven ? 'var(--background-neutrals-secondary)' : 'transparent'};

    .checkboxWrapper{
        padding: 0.5rem;
        display: flex;
        justify-content: center;
        width: 15%;
    }

    p {
        font: 700 1.125rem/1.5rem 'At Aero Bold';
    }

    input[type="checkbox"]{
        width: 1.5rem;
        outline: none;

        &:checked{
            accent-color: var(--brand-primary);
        }
        border: unset;
    }
`

export default StudentView