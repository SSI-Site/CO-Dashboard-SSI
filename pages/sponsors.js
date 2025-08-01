import NavBar from "../src/patterns/base/Nav";
import Meta from "../src/infra/Meta";
import styled from "styled-components";

// Components
import Button from "../src/components/Button";
import SecondaryButton from "../src/components/SecondaryButton";

const Sponsors = () => {
    return (
        <>
            <Meta title = "COSSI 2025 | Empresas"/>
            <NavBar name = {"Empresas"}/>

            <SponsorsContainer>
                <SponsorsTitle>
                    <h5>Empresas</h5>

                    <SponsorsInteractions>
                        <SponsorsFilter>
                            <input 
                                placeholder = "Buscar por nome, id, código...">
                            </input>
                            <Button>Consultar</Button>
                            <span/>
                            <SecondaryButton onClick = {() => setisOpen(true)}>
                                + Adicionar
                            </SecondaryButton> 
                        </SponsorsFilter>
                    </SponsorsInteractions>
                </SponsorsTitle>

                <SponsorsGrid>
                    <label>Nome</label>
                    <label>URL do site</label>
                </SponsorsGrid>
                <SponsorsWrapper>
                    <Sponsor>
                        <p>A</p><p>A</p>
                    </Sponsor>
                </SponsorsWrapper>   
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
    grid-template-rows: repeat(11, 1fr);
    grid-column-gap: 3rem;
    grid-row-gap: 0.75rem; 
`

const Sponsor = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-column-gap: 3rem;
    grid-row-gap: 0.75rem; 
    padding-inline: 0.75rem 0.5rem; 
    height: 4rem;
    align-items: center;
`

export default Sponsors