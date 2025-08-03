import styled, { css } from "styled-components";
import { useForm } from "react-hook-form";
import { useState } from "react";

// saphira
import saphira from "../../services/saphira";

// componenets
import Button from "./Button";

const PalestranteRow = ({id, name, pronouns, role, instagram, linkedin, description}) => {

    const [isModalOpen, setisModalOpen] = useState(false)
    const {register, handleSubmit, watch, formState: {erros}} = useForm()

    const updateSpeaker = async () => {
        await saphira.updateSpeaker()
    }

    const deleteSpeaker = async (id) => {
        setisModalOpen(false);
        await saphira.deleteSpeaker(id);
        /// NAO DEIXAR REMOVER SE ESTIVER EM UMA PALESTRA!!!!!
    }

    return (
        <>
        {isModalOpen &&
            <ModalOverlay onClick={() => setisModalOpen(false)}>
                <ModalContainer onClick={(e) => e.stopPropagation()}>
                    <ModalHeader>
                        <h5>Adicionar Palestrante</h5>
                        <div className = 'close' onClick={() => setisModalOpen(false)}>
                            <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z"/>
                            </svg>
                        </div>
                    </ModalHeader>
                    <form action="" onSubmit={handleSubmit(updateSpeaker)}>
                    <MainPopUp>
                        <FormContainer>
                            <FormRow $columns="1fr 1fr">
                                <FormGroup>
                                    <StyledLabel htmlFor="nome">Nome</StyledLabel>
                                    <StyledInput id="nome" type="text" value = {name}
                                    {...register('name')}
                                    placeholder="Insira o nome do Palestrante"/>
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="cargo">Cargo</StyledLabel>
                                    <StyledInput id="cargo" type="text" value = {role}
                                    {...register('role')}
                                    placeholder="Insira o cargo do Palestrante"/>
                                </FormGroup>
                            </FormRow>
                            <FormRow $columns="auto 1fr 1fr">
                                <FormGroup>
                                    <StyledLabel htmlFor="pronomes">Pronomes</StyledLabel>
                                    <StyledInput id="pronomes" type="text" value = {pronouns}
                                    {...register('pronouns')}
                                    placeholder="Elu/Delu"/>
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="instagram">Instagram</StyledLabel>
                                    <StyledInput id="instagram" type="text" value = {instagram}
                                    {...register('instagram_link')}
                                    placeholder="Insira o link do Instagram"/>
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="linkedin">Linkedin</StyledLabel>
                                    <StyledInput id="linkedin" type="text" value = {linkedin}
                                    {...register('linkedin_link')}
                                    placeholder="Insira o link do Linkedin"/>
                                </FormGroup>
                            </FormRow>
                        </FormContainer>
                    
                        <FormGroup>
                            <StyledLabel>Sobre</StyledLabel>
                            <TextArea id="sobre" value = {description}
                            {...register('description')}
                            placeholder="Escreva sobre quem é o palestrante"/>
                        </FormGroup>
                    
                    </MainPopUp>
                    <PopUpFooter>
                        <Button onClick={() => deleteSpeaker(id)} type="button">Remover</Button>
                        <Button type="submit">Salvar Alterações</Button>
                    </PopUpFooter>
                </form>
                </ModalContainer>
            </ModalOverlay>
        }

        <PalestranteWrapper onClick = {() => setisModalOpen(true)}>
            <p>{id.slice(0,3).toUpperCase()}</p>
            <p>{name}</p>
            <p>{pronouns}</p>
            <p>{role}</p>
            <p>{instagram}</p>
            <p>{linkedin}</p>
        </PalestranteWrapper>
        </>
    )
}

export default PalestranteRow;

const ModalOverlay = styled.div`
 position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background-color: rgba(0, 0, 0, 0.7);

    display: flex;
    justify-content: center;
    align-items: center;

    z-index: 1000;
`

const ModalContainer = styled.div`
    background-color: var(--background-neutrals-secondary);
    width: 90%;
    max-width: 62.5rem;
    padding: 2rem;
    border: 0.063rem;
    box-shadow: 0 0.313rem 1rem rgba(0,0,0,0.3);

    color: var(--content-neutrals-primary);
`

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding-bottom: 1rem;
    border-bottom: 0.063rem solid var(--outline-neutrals-secondary);

    h5{
        color: var(--content-neutrals-primary, #FFF);
        font-size: 2rem;
        font-style: normal;
        font-weight: 700;
        line-height: 2.5rem;
        flex: 1 0 0;
    }

    .close {
        padding: 1rem 1rem 0.65rem 1rem;
        cursor: pointer;   
        background-image: linear-gradient(to right, transparent 50%, var(--background-neutrals-inverse) 50%);
        background-size: 200%;
        background-position-x: 200%;

        svg path{
            fill: var(--content-neutrals-primary)
        }
        transition: all 150ms ease-in-out;
        
        &:hover {
            background-position-x: 100%;
            
            svg path{
                fill: var(--content-neutrals-inverse);
            }
        }
    }
`

const MainPopUp = styled.main`
    padding-bottom: 1rem;
    border-bottom: 0.063rem solid var(--outline-neutrals-secondary);
`;

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 1rem;
    margin-top: 1rem;
`;

const FormRow = styled.div`
  display: grid;
  gap: 1rem; 
  grid-template-columns: ${(props) => props.$columns || '1fr'};
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column; 
`;

const StyledLabel = styled.label`
    font: 700 1rem/1.5rem 'AT Aero Bold';
    color: var(--content-neutrals-primary, #FFF);
`;

const InputStyle = css`
    background-color: var(--background-neutrals-secondary);
    border: 0.125rem solid var(--background-neutrals-inverse) !important; //no figma a cor ta como var(--outline-neutrals-inverse), porém não tem essa cor no style
    padding: 0.75rem 1rem;
    color: var(--content-neutrals-primary);
    font-size: 1rem;
    width: 100%;
`;

const StyledInput = styled.input`
  ${InputStyle}
`;

const TextArea = styled.textarea`
    ${InputStyle}
    resize: vertical;
    min-height: 18.75rem;
    max-width: 58.5rem;

    @media (max-width: 48rem){
        min-height: 6.25rem;
    }
`;

const PopUpFooter = styled.footer`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1.5rem;
    width: 100%;
    margin-top: 1rem;
    
    button{
        max-width: none;

        &:first-of-type{
            background-color: #F82122;
        }
    }
`;

const PalestranteWrapper = styled.div`
    width: 100%;
    cursor: pointer;
    display: grid;
    grid-template-columns: 1fr 3fr repeat(4, 1fr); 
    grid-column-gap: 3rem;
    grid-row-gap: 0.75rem; 
    padding-inline: 0.75rem 0.5rem; 
    height: 4rem;
    align-items: center;

    p {
        font: 700 1.125rem/1.5rem 'At Aero Bold';
    }
`