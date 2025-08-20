import NavBar from "../src/patterns/base/Nav";
import Meta from "../src/infra/Meta";
import styled from "styled-components";
import { useState, useEffect } from "react";

// Components
import Button from "../src/components/Button";
import Image from "next/image";
import StudentRow from "../src/components/StudentRow";
import Pagination from "../src/components/Paginantion";

// Assets
import LoadingSVG from '../public/loading.svg'

// Saphira
import saphira from "../services/saphira";

const Students = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [students, setStudents] = useState([])
    const [filteredStudents, setFilteredStudents] = useState([])
    const [maxRows, setMaxRows] = useState(11)

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [query, setQuery] = useState('')

    const getStudents = async() => {
        setIsLoading(true)
        try {
            const { data } = await saphira.getStudents()
            if (data) {
                setStudents(data)
                setFilteredStudents(data)
            }
        }

        catch(err){
            console.log("Houve um erro na requisição dos estudantes", err)
        }

        finally{
            setIsLoading(false)
        }
    }

    const totalPages = Math.ceil(filteredStudents.length / maxRows)
    const currentStudents = filteredStudents.slice(
        (currentPage - 1) * maxRows,
        currentPage * maxRows
    )

    const handleSearch = (e) => {
        
        const query = e.toLowerCase()
        const filtered = students.filter(student => 
            student.name.toLowerCase().includes(query)
            || student.code.toLowerCase().includes(query)
            || student.email.toLowerCase().includes(query)
        )
        setFilteredStudents(filtered)
        setCurrentPage(1)
    }

    useEffect(() => {
        getStudents()

    }, [])

    return (
        <>
            <Meta title = "COSSI 2025 | Inscritos"/>
            <NavBar name = {"Inscritos"}/> 

            <StudentsContainer>
                <StudentsTitle>
                    <h5>Inscritos</h5>

                    <StudentsInteractions>
                        <StudentsFilter>
                            <input 
                                type = "text"
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder = "Buscar por nome, email, código SSI...">
                            </input>
                            <Button onClick = {() => handleSearch(query)}>Consultar</Button>
                        </StudentsFilter>
                    </StudentsInteractions>
                </StudentsTitle>

                <StudentsGrid>
                    <label>Código SSI</label>
                    <label>Nome</label>
                    <label>Email</label>
                </StudentsGrid>
                <StudentsWrapper $maxRows = {maxRows}>
                    {!isLoading && 
                        currentStudents.map((student, index) => {
                     
                            return(
                                <StudentRow
                                    isEven={index % 2}
                                    key = {student.id}
                                    id = {student.code}
                                    name = {student.name}
                                    email = {student.email}
                                />
                            )
                        })
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
                </StudentsWrapper> 
                <StudentsFooter>
                    <p>{students.length} usuários encontrados</p>
                        {!isLoading &&
                            !students.length == 0 &&
                            <Pagination
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={totalPages}
                            />
                        }
                </StudentsFooter>  
            </StudentsContainer>
        </>
    )
}

export default Students

const StudentsContainer = styled.div`
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
`

const StudentsTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 1.5rem;
`

const StudentsFilter = styled.div`
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

const StudentsInteractions = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    height: 100%;

`


const StudentsGrid = styled.div`
    width: 100%;
    border-block: 1px solid var(--outline-neutrals-secondary);
    padding: 1.5rem 0.5rem;
    display: grid;
    grid-template-columns: 1fr 3fr 3fr; 
    grid-column-gap: 3rem;
    grid-row-gap: 0.75rem; 
    margin-bottom: 0.75rem;

    label {
        font: 700 1.125rem/1.5rem 'At Aero Bold';
    }
`

const StudentsWrapper = styled.div`
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

const StudentsFooter = styled.footer`
    width: 100%;
    display: flex;
    justify-content: space-between;
    
    p {
        font: 700 1rem/1.5rem 'At Aero Bold';
    }
`
