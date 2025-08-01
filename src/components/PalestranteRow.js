import styled, { css } from "styled-components";

const PalestrantePopUp = ({id, name, pronouns, role, instagram, linkedin}) => {

    return (
        <PalestranteWrapper>
            <p>{id}</p>
            <p>{name}</p>
            <p>{pronouns}</p>
            <p>{role}</p>
            <p>{instagram}</p>
            <p>{linkedin}</p>
        </PalestranteWrapper>
    )
}

export default PalestrantePopUp;

const PalestranteWrapper = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 3fr repeat(4, 1fr); 
    grid-column-gap: 3rem;
    grid-row-gap: 0.75rem; 
    padding-inline: 0.75rem 0.5rem; 
    height: 4rem;
    align-items: center;

    ${props => props.$isEven && css`
        background-color: var(--background-neutrals-secondary);
    `}

    p {
        font: 700 1.125rem/1.5rem 'At Aero Bold';
    }
`