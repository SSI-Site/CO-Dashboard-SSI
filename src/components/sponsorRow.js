import styled, { css } from "styled-components";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';

// saphira
import saphira from "../../services/saphira";

// components
import Button from "./Button";
import SecondaryButton from "./SecondaryButton";

const SponsorRow = ({id, name, url, isEven, update}) => {

    const [isModalOpen, setisModalOpen] = useState(false)
    const {register, handleSubmit, formState: {errors}} = useForm()

    const updateSponsor = async (sponsor) => {
        try {
            Swal.fire({
                title: 'Atualizando...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            await saphira.updateSponsor(id, sponsor.name, sponsor.url)
            
            await Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Empresa atualizada.',
                timer: 1000,
                showConfirmButton: false
            });

            await update()
            setisModalOpen(false)
        } catch (err) {
            console.error("Erro ao atualizar empresa:", err);
            Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Houve um problema ao atualizar a empresa.',
            });
        }
    }

    const deleteSponsor = async (id) => {
        const result = await Swal.fire({
            title: 'Apagar Empresa?',
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
                
                await saphira.deleteSponsor(id)
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Deletado!',
                    text: 'A empresa foi removida.',
                    timer: 1500,
                    showConfirmButton: false
                });

                await update()
                setisModalOpen(false)
            } catch (err) {
                console.error("Erro ao deletar empresa:", err);
                
                // Trata especificamente o erro de tentar apagar um patrocinador associado a uma palestra
                if(err?.response?.status === 400 || err?.response?.status === 409) {
                    Swal.fire({
                       icon: 'error',
                       title: 'Não é possível apagar',
                       text: 'Esta empresa está associada a uma ou mais palestras. Remova-a das palestras primeiro.',
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
        
            <ModalOverlay>
                <ModalContainer onClick={(e) => e.stopPropagation()}>
                    <ModalHeader>
                        <h5>Informações Empresa</h5>
                        <div className = 'close' onClick={() => setisModalOpen(false)}>
                            <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z"/>
                            </svg>
                        </div>
                    </ModalHeader>
                    <form action="" onSubmit={handleSubmit(updateSponsor)}>
                            <MainPopUp>
                                <FormContainer>
                                    <FormRow>
                                        <FormGroup>
                                            <StyledLabel htmlFor="name">Nome</StyledLabel>
                                            <StyledInput id="name" type="text" defaultValue = {name}
                                            $hasError={!!errors.name}
                                            {...register('name', { required: true, maxLength: 64 })}
                                            placeholder="Digite o nome da empresa"/>
                                        </FormGroup>
                                    </FormRow>
                                    <FormRow>
                                        <FormGroup>
                                            <StyledLabel htmlFor="url">URL do site</StyledLabel>
                                            <StyledInput id="url" type="url" defaultValue = {url}
                                            $hasError={!!errors.url}
                                            {...register('url', { required: true, maxLength: 200 })}
                                            placeholder="https://www.exemplo.com.br"/>
                                        </FormGroup>
                                    </FormRow>
                                </FormContainer>
                            
                            </MainPopUp>
                            <PopUpFooter>
                                <DeleteWrapper>
                                    <Button onClick={() => deleteSponsor(id)} type="button">Remover</Button>
                                </DeleteWrapper>

                                <ButtonsWrapper>
                                    <SecondaryButton onClick={() => setisModalOpen(false)} type="button">Cancelar</SecondaryButton>
                                    <Button type="submit">Salvar Alterações</Button>
                                </ButtonsWrapper>
                            </PopUpFooter>
                        </form>
                    </ModalContainer>
            </ModalOverlay>
        }

        <Sponsor onClick = {() => setisModalOpen(true)} $isEven = {isEven}>
            <p>{name}</p>
            <p>{url}</p>
        </Sponsor>
        </>
    )
}

export default SponsorRow;

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
    max-width: 34rem;
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

const PopUpFooter = styled.footer`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    width: 100%;
    margin-top: 1rem;
    
    button{
        max-width: none;
    }
`;

const DeleteWrapper = styled.div`
    display: flex;

    button {
        background-color: #F82122;
        color: white;
    }
`;

const ButtonsWrapper = styled.div`
    display: flex;
    gap: 1.5rem;
`;

const Sponsor = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-column-gap: 3rem;
    grid-row-gap: 0.75rem; 
    padding-inline: 0.75rem 0.5rem; 
    min-height: 4rem;
    align-items: center;
    cursor: pointer;
    background-color: ${({$isEven}) => $isEven ? 'var(--background-neutrals-secondary)' : 'transparent'};
    transition: background-color 200ms ease-in-out;
    
    &:hover{
        background-color: var(--state-layers-neutrals-primary-008);
    }

    p {
        font: 700 1rem/1.5rem 'AT Aero Bold';
    }
`