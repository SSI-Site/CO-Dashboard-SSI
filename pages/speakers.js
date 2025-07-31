import NavBar from "../src/patterns/base/Nav";
import Meta from "../src/infra/Meta";
import styled, {css} from "styled-components";

// Componenets
import SecondaryButton from "../src/components/SecondaryButton";
import Button from '../src/components/Button'

const Speakers = () => {
    return (
        <>
            <Meta title = "COSSI 2025 | Palestrantes"/>
            <NavBar name = {"Palestrantes"}/>
            <PalestrantesContainer>
                <PalestrantesTitle>
                    <h5>Palestrantes</h5>

                    <PalestrantesInteractions>
                        <PalestrantesFilter>
                            <input 
                            placeholder = "Buscar por nome, id, palestrante...">
                            </input>
                            <Button>Consultar</Button>
                        </PalestrantesFilter>
                        <span/>
                        <SecondaryButton>
                            + Adicionar
                        </SecondaryButton> 
                    </PalestrantesInteractions>

                </PalestrantesTitle>

                <PalestrantesGrid>

                </PalestrantesGrid>
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
    border: 1px solid red;
`

const PalestrantesTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`

const PalestrantesFilter = styled.div`
    display: flex;
    gap: 0.5rem;
    width: 100%;
    align-items: center;
    justify-content: flex-end;

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
`