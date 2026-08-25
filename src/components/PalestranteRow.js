import styled, { css } from "styled-components";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Swal from 'sweetalert2'; 

// saphira
import saphira from "../../services/saphira";

// componenets
import Button from "./Button";
import SecondaryButton from "./SecondaryButton";

const PalestranteRow = ({id, name, pronouns, role, instagram, linkedin, description, isEven, update}) => {
    const {register, handleSubmit, formState: {errors}} = useForm()
    const [isModalOpen, setisModalOpen] = useState(false)

    const updateSpeaker = async (updatedSpeaker) => {
        try {
            Swal.fire({
                title: 'Atualizando...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            await saphira.updateSpeaker(
                id,
                updatedSpeaker.name,
                updatedSpeaker.description,
                updatedSpeaker.linkedin_link,
                updatedSpeaker.instagram_link,
                updatedSpeaker.pronouns,
                updatedSpeaker.role
            );

            await Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Palestrante atualizado.',
                timer: 1500,
                showConfirmButton: false
            });

            await update(); // Chama a função do pai para recarregar a tabela
            setisModalOpen(false);
            
        } catch(err) {
            console.error("Erro ao atualizar", err);
            Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Houve um problema ao atualizar o palestrante.',
            });
        }
    }

    const deleteSpeaker = async (id) => {
        // Alerta de Confirmação com SweetAlert2
        const result = await Swal.fire({
            title: 'Apagar Palestrante?',
            text: "Você não poderá desfazer essa ação!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#F82122',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sim, remover!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                Swal.fire({ title: 'Deletando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                
                await saphira.deleteSpeaker(id);
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Deletado!',
                    text: 'O palestrante foi removido.',
                    timer: 1500,
                    showConfirmButton: false
                });

                await update();
                setisModalOpen(false);

            } catch (err) {
                console.error("Erro ao deletar palestrante", err);
                
                if(err?.response?.status === 400 || err?.response?.status === 409) {
                     Swal.fire({
                        icon: 'error',
                        title: 'Não é possível apagar',
                        text: 'Este palestrante está associado a uma ou mais palestras. Remova-o das palestras primeiro.',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro!',
                        text: 'Houve um erro no servidor ao tentar excluir.',
                    });
                }
            }
        }
    }

    return (
        <>
        {isModalOpen &&
            <ModalOverlay onClick={() => setisModalOpen(false)}>
                <ModalContainer onClick={(e) => e.stopPropagation()}>
                    <ModalHeader>
                        <h5>Editar Palestrante</h5>
                        <div className='close' onClick={() => setisModalOpen(false)}>
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
                                    <StyledInput id="nome" type="text" defaultValue={name || ''}
                                    $hasError={!!errors.name}
                                    {...register('name', { required: true, maxLength: 64 })}
                                    placeholder="Insira o nome do Palestrante"/>
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="cargo">Cargo</StyledLabel>
                                    <StyledInput id="cargo" type="text" defaultValue={role || ''}
                                    $hasError={!!errors.role}
                                    {...register('role', { required: true, maxLength: 64 })}
                                    placeholder="Insira o cargo do Palestrante"/>
                                </FormGroup>
                            </FormRow>
                            <FormRow $columns="auto 1fr 1fr">
                                <FormGroup>
                                    <StyledLabel htmlFor="pronomes">Pronomes</StyledLabel>
                                    <StyledInput id="pronomes" type="text" defaultValue={pronouns || ''}
                                    $hasError={!!errors.pronouns}
                                    {...register('pronouns', { maxLength: 16 })}
                                    placeholder="Elu/Delu"/>
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="instagram">Instagram</StyledLabel>
                                    <StyledInput id="instagram" type="url" defaultValue={instagram || ''}
                                    $hasError={!!errors.instagram_link}
                                    {...register('instagram_link', { maxLength: 64 })}
                                    placeholder="https://instagram.com/..."/>
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="linkedin">Linkedin</StyledLabel>
                                    <StyledInput id="linkedin" type="url" defaultValue={linkedin || ''}
                                    $hasError={!!errors.linkedin_link}
                                    {...register('linkedin_link', { maxLength: 64 })}
                                    placeholder="https://linkedin.com/..."/>
                                </FormGroup>
                            </FormRow>
                        </FormContainer>
                    
                        <FormGroup>
                            <StyledLabel htmlFor="sobre">Sobre</StyledLabel>
                            <TextArea id="sobre" defaultValue={description || ''}
                            maxLength={512}
                            $hasError={!!errors.description}
                            {...register('description', { maxLength: 512 })}
                            placeholder="Escreva sobre quem é o palestrante (no máximo 512 caracteres)"/>
                        </FormGroup>
                    
                    </MainPopUp>
                    <PopUpFooter>
                        <DeleteWrapper>
                             <Button onClick={() => deleteSpeaker(id)} type="button">Remover</Button>
                        </DeleteWrapper>
                        
                        <ButtonsWrapper>
                             <Button type="button" onClick={() => setisModalOpen(false)} style={{ backgroundColor: 'transparent', border: '1px solid var(--content-neutrals-primary)' }}>Cancelar</Button>
                             <Button type="submit">Salvar Alterações</Button>
                        </ButtonsWrapper>
                    </PopUpFooter>
                </form>
                </ModalContainer>
            </ModalOverlay>
        }

        <PalestranteWrapper onClick={() => setisModalOpen(true)} $isEven={isEven}>
            <p>{id.slice(0,3).toUpperCase()}</p>
            <p>{name}</p>
            <p>{pronouns}</p>
            <p>{role.slice(0, 20)}</p>
            <p>{instagram.slice(0, 20)}</p>
            <p>{linkedin.slice(0, 20)}</p>
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

// Lógica condicional para a cor da borda de erro adicionada aqui!
const InputStyle = css`
    background-color: var(--background-neutrals-secondary);
    border: 0.125rem solid ${({ $hasError }) => $hasError ? '#F82122' : 'var(--background-neutrals-inverse)'} !important;
    padding: 0.75rem 1rem;
    color: var(--content-neutrals-primary);
    font-size: 1rem;
    width: 100%;
    transition: border 0.2s ease-in-out;

    &:focus {
        outline: none;
        border-color: ${({ $hasError }) => $hasError ? '#F82122' : 'var(--brand-primary)'} !important;
    }
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
    justify-content: space-between; // Mudado para separar o deletar dos demais botoes
    gap: 1.5rem;
    width: 100%;
    margin-top: 1rem;
`;

// Adicionado wrappers para organizar o rodapé
const DeleteWrapper = styled.div`
    button {
        max-width: none;
        background-color: #F82122;
        color: white;
    }
`;

const ButtonsWrapper = styled.div`
    display: flex;
    gap: 1.5rem;
    button {
         max-width: none;
    }
`;

const PalestranteWrapper = styled.div`
    width: 100%;
    cursor: pointer;
    display: grid;
    min-width: 60rem;
    grid-template-columns: 1fr 3fr repeat(4, 1fr); 
    grid-column-gap: 3rem;
    grid-row-gap: 0.75rem; 
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
        text-overflow: ellipsis;
       // white-space: nowrap;
    }
`