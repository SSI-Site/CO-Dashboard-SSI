import React from 'react';
import styled, { css } from 'styled-components';
import Button from './Button';
import SecondaryButton from './SecondaryButton';

import saphira from '../../services/saphira';
import { useForm } from 'react-hook-form';
import Alert from './Alert';

export default function PalestrantePopUp ({isOpen, onClose}){
    if (!isOpen){
        return null;
    }

    const {register, handleSubmit, watch, formState: {erros}} = useForm()

    const postSpeaker = async (speaker) => {
        try{
            const { status } =  await saphira.postSpeaker(
                speaker.name,
                speaker.description,
                speaker.linkedin_link,
                speaker.instagram_link,
                speaker.pronouns,
                speaker.role,
            )
        }

        catch(err){
            console.log(err)
        }
        finally{
            onClose();
        }

    }

    return (
        <PopUpOverlay onClick={() => onClose()}>
            <PopUpContainer onClick={(e) => e.stopPropagation()}>
                <PopUpHeader>
                    <h5>Adicionar Palestrante</h5>
                    <div className = 'close' onClick={() => onClose()}>
                        <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z"/>
                        </svg>
                    </div>
                </PopUpHeader>
                <form action="" onSubmit={handleSubmit(postSpeaker)}>
                    <MainPopUp>
                        <FormContainer>
                            <FormRow $columns="1fr 1fr">
                                <FormGroup>
                                    <StyledLabel htmlFor="nome">Nome</StyledLabel>
                                    <StyledInput id="nome" type="text"
                                    {...register('name')}
                                    placeholder="Insira o nome do Palestrante"/>
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="cargo">Cargo</StyledLabel>
                                    <StyledInput id="cargo" type="text" 
                                    {...register('role')}
                                    placeholder="Insira o cargo do Palestrante"/>
                                </FormGroup>
                            </FormRow>
                            <FormRow $columns="auto 1fr 1fr">
                                <FormGroup>
                                    <StyledLabel htmlFor="pronomes">Pronomes</StyledLabel>
                                    <StyledInput id="pronomes" type="text" 
                                    {...register('pronouns')}
                                    placeholder="Elu/Delu"/>
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="instagram">Instagram</StyledLabel>
                                    <StyledInput id="instagram" type="text" 
                                    {...register('instagram_link')}
                                    placeholder="Insira o link do Instagram"/>
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="linkedin">Linkedin</StyledLabel>
                                    <StyledInput id="linkedin" type="text" 
                                    {...register('linkedin_link')}
                                    placeholder="Insira o link do Linkedin"/>
                                </FormGroup>
                            </FormRow>
                        </FormContainer>
                    
                        <FormGroup>
                            <StyledLabel>Sobre</StyledLabel>
                            <TextArea id="sobre" 
                            {...register('description')}
                            placeholder="Escreva sobre quem é o palestrante"/>
                        </FormGroup>
                    
                    </MainPopUp>
                    <PopUpFooter>
                        <SecondaryButton onClick={() => onClose()} type="button">Cancelar</SecondaryButton>
                        <Button type="submit">Adicionar</Button>
                    </PopUpFooter>
                </form>

            </PopUpContainer>
        </PopUpOverlay>
    );
}

const PopUpOverlay = styled.div`
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
`;

const PopUpContainer = styled.div`
    background-color: var(--background-neutrals-secondary);
    width: 90%;
    max-width: 62.5rem;

    padding: 2rem;
    border: 0.063rem solid #444;
    box-shadow: 0 0.313rem 1rem rgba(0,0,0,0.3);

    color: #ffffff;

`;

const PopUpHeader = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    align-self: stretch;
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
`;


const PopUpFooter = styled.footer`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1.5rem;
    width: 100%;
    margin-top: 1rem;

    button {
        max-width: none;
    }
`;

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
