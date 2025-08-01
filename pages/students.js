import NavBar from "../src/patterns/base/Nav";
import Meta from "../src/infra/Meta";
import styled from "styled-components";

// Components
import Button from "../src/components/Button";

// Saphira
import saphira from "../services/saphira";

const Students = () => {


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
                                placeholder = "Buscar por nome, id, código...">
                            </input>
                            <Button>Consultar</Button>
                        </StudentsFilter>
                    </StudentsInteractions>
                </StudentsTitle>

                <StudentsGrid>
                    <label>Código SSI</label>
                    <label>Nome</label>
                    <label>Email</label>
                </StudentsGrid>
                <StudentsWrapper>
                    <Student>
                        <p>A</p><p>A</p><p>A</p>
                    </Student>
                </StudentsWrapper>   
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
    grid-template-rows: repeat(11, 1fr);
    grid-column-gap: 3rem;
    grid-row-gap: 0.75rem; 
`

const Student = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 3fr 3fr; 
    grid-column-gap: 3rem;
    grid-row-gap: 0.75rem; 
    padding-inline: 0.75rem 0.5rem; 
    height: 4rem;
    align-items: center;
`