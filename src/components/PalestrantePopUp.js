import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2'; 

// components
import Button from './Button';
import SecondaryButton from './SecondaryButton';

// saphira
import saphira from '../../services/saphira';

export default function PalestrantePopUp ({isOpen, onClose, speaker = null, mode = 'add'}) {
    const {register, handleSubmit, reset, formState: {errors}} = useForm({
        defaultValues: {
            name: speaker?.name || '',
            role: speaker?.role || '',
            pronouns: speaker?.pronouns || '',
            instagram_link: speaker?.instagram_link || '',
            linkedin_link: speaker?.linkedin_link || '',
            description: speaker?.description || '',
        }
    });

    useEffect(() => {
        if (!isOpen) return;

        reset({
            name: speaker?.name || '',
            role: speaker?.role || '',
            pronouns: speaker?.pronouns || '',
            instagram_link: speaker?.instagram_link || '',
            linkedin_link: speaker?.linkedin_link || '',
            description: speaker?.description || '',
        });
    }, [isOpen, speaker, reset]);

    if (!isOpen) {
        return null;
    }

    const isEditMode = mode === 'edit' && Boolean(speaker?.id);

    const postSpeaker = async (formData) => {
        try {
            Swal.fire({
                title: 'Processando...',
                text: isEditMode ? 'Atualizando palestrante...' : 'Adicionando palestrante...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            });

            if (isEditMode) {
                await saphira.updateSpeaker(
                    speaker.id,
                    formData.name,
                    formData.description,
                    formData.linkedin_link,
                    formData.instagram_link,
                    formData.pronouns,
                    formData.role
                );
            } else {
                await saphira.postSpeaker(
                    formData.name,
                    formData.description,
                    formData.linkedin_link,
                    formData.instagram_link,
                    formData.pronouns,
                    formData.role,
                );
            }

            await Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: isEditMode ? 'Palestrante atualizado com sucesso.' : 'Palestrante adicionado com sucesso.',
                timer: 1000,
                showConfirmButton: false
            });

            reset();
            onClose(true); // O true avisa o componente pai para recarregar a lista

        } catch(err) {
            console.error("Erro ao adicionar palestrante:", err);
            
            Swal.fire({
                icon: 'error',
                title: 'Falha na operação',
                text: 'Houve um problema de comunicação com o servidor. Verifique os dados e tente novamente.',
            });
        }
    }

    const deleteSpeaker = async () => {
        if (!isEditMode) return;

        const result = await Swal.fire({
            title: 'Apagar Palestrante?',
            text: 'Você não poderá desfazer essa ação!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#F82122',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sim, remover!',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        try {
            Swal.fire({
                title: 'Deletando...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            await saphira.deleteSpeaker(speaker.id);

            await Swal.fire({
                icon: 'success',
                title: 'Deletado!',
                text: 'O palestrante foi removido.',
                timer: 1500,
                showConfirmButton: false
            });

            reset();
            onClose(true);
        } catch (err) {
            console.error("Erro ao deletar palestrante", err);

            if (err?.response?.status === 400 || err?.response?.status === 409) {
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
    };

    const handleClose = () => {
        reset();
        onClose();
    }

    return (
        <PopUpOverlay onClick={handleClose}>
            <PopUpContainer onClick={(e) => e.stopPropagation()}>
                <PopUpHeader>
                    <h5>{isEditMode ? 'Editar Palestrante' : 'Adicionar Palestrante'}</h5>
                    <div className='close' onClick={handleClose}>
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
                                    $hasError={!!errors.name}
                                    {...register('name', { required: true, maxLength: 64 })}
                                    placeholder="Insira o nome do Palestrante"/>
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="cargo">Cargo</StyledLabel>
                                    <StyledInput id="cargo" type="text" 
                                    $hasError={!!errors.role}
                                    {...register('role', { required: true, maxLength: 64 })}
                                    placeholder="Insira o cargo do Palestrante"/>
                                </FormGroup>
                            </FormRow>
                            
                            <FormRow $columns="auto 1fr 1fr">
                                <FormGroup>
                                    <StyledLabel htmlFor="pronomes">Pronomes</StyledLabel>
                                    <StyledInput id="pronomes" type="text" 
                                    $hasError={!!errors.pronouns}
                                    {...register('pronouns', { maxLength: 16 })}
                                    placeholder="Elu/Delu"/>
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="instagram">Instagram</StyledLabel>
                                    <StyledInput id="instagram" type="url" 
                                    $hasError={!!errors.instagram_link}
                                    {...register('instagram_link', { maxLength: 64 })}
                                    placeholder="https://instagram.com/..."/>
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="linkedin">Linkedin</StyledLabel>
                                    <StyledInput id="linkedin" type="url" 
                                    $hasError={!!errors.linkedin_link}
                                    {...register('linkedin_link', { maxLength: 64 })}
                                    placeholder="https://linkedin.com/..."/>
                                </FormGroup>
                            </FormRow>
                        </FormContainer>
                    
                        <FormGroup>
                            <StyledLabel htmlFor="sobre">Sobre</StyledLabel>
                            <TextArea id="sobre" 
                            maxLength={512}
                            $hasError={!!errors.description}
                            {...register('description', { maxLength: 512 })}
                            placeholder="Escreva sobre quem é o palestrante"/>
                        </FormGroup>
                    
                    </MainPopUp>
                    <PopUpFooter>
                        {isEditMode && (
                            <Button onClick={deleteSpeaker} type="button">Remover</Button>
                        )}
                        <SecondaryButton onClick={handleClose} type="button">Cancelar</SecondaryButton>
                        <Button type="submit">{isEditMode ? 'Salvar Alterações' : 'Adicionar'}</Button>
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
