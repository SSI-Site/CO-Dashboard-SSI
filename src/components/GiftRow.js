import styled, { css } from "styled-components";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Swal from "sweetalert2";

// saphira
import saphira from "../../services/saphira";

// components
import Button from "./Button";
import SecondaryButton from "./SecondaryButton"; // <-- Importe se quiser usar para o Cancelar

const GiftRow = ({id, name, total_amount, min_presence, description, balance, isEven, update}) => {
    const {register, handleSubmit, formState: {errors}} = useForm()
    const [isModalOpen, setisModalOpen] = useState(false)

    const updateGift = async(updatedGift) => {
        try{
            Swal.fire({
                title: 'Atualizando...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            await saphira.updateGift(
                id,
                updatedGift.name,
                updatedGift.total_amount,
                updatedGift.min_presence,
                updatedGift.description
            )
            
            await Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Brinde atualizado.',
                timer: 1500,
                showConfirmButton: false
            });

            setisModalOpen(false)

            // Recarrega a tabela se a função update foi passada pelo componente pai
            if (typeof update === 'function') {
                await update();
            }
        }
        catch(err){
            console.error("Erro ao atualizar brinde:", err)
            Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Houve um problema ao atualizar o brinde.',
            });
        }
    }

    const deleteGift = async(id) => {
        const result = await Swal.fire({
            title: 'Apagar Brinde?',
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
                
                await saphira.deleteGift(id)
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Deletado!',
                    text: 'O brinde foi removido.',
                    timer: 1500,
                    showConfirmButton: false
                });

                setisModalOpen(false)

                // Recarrega a tabela se a função update foi passada pelo componente pai
                if (typeof update === 'function') {
                    await update();
                }
            } catch (err) {
                console.error("Erro ao deletar brinde:", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: 'Houve um erro no servidor ao tentar excluir o brinde.',
                });
            }
        }
    }

    return (
        <>
            {isModalOpen &&
                <ModalOverlay>
                    <PopUpContainer onClick={(e) => e.stopPropagation()}>
                        <PopUpHeader>
                            <h5>Editar Brinde</h5>
                            <div className = 'close' onClick={() => setisModalOpen(false)}>
                                <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z"/>
                                </svg>
                            </div>
                        </PopUpHeader>
                        <form onSubmit = {handleSubmit(updateGift)}>
                            <MainPopUp>
                                <FormGroup>
                                    <label htmlFor="name">Nome</label>
                                    <StyledInput id="name" type="text" defaultValue = {name}
                                    $hasError={!!errors.name}
                                    {...register('name', { required: true, maxLength: 64 })}
                                    placeholder="Digite o nome do brinde..."/>
                                </FormGroup>

                                <FormGroup>
                                    <label htmlFor="description">Descrição</label>
                                    <StyledInput id="description" type="text" defaultValue = {description}
                                    $hasError={!!errors.description}
                                    {...register('description', { maxLength: 256 })}
                                    placeholder="Digite a descrição do brinde..."/>
                                </FormGroup>

                                <FormGroup>
                                    <label htmlFor="total_amount">Quantidade total</label>
                                    <StyledInput id="total_amount" type="number" defaultValue = {total_amount}
                                    $hasError={!!errors.total_amount}
                                    {...register('total_amount', { required: true, min: 0})}
                                    placeholder="Digite a quantidade total do brinde"/>
                                </FormGroup>

                                <FormGroup>
                                    <label htmlFor="min_presence">Mínimo de presenças</label>
                                    <StyledInput id="min_presence" type="number" defaultValue = {min_presence}
                                    $hasError={!!errors.min_presence}
                                    {...register('min_presence', { required: true, min: 1})}
                                    placeholder="Digite a quantidade mínima de presenças..."/>
                                </FormGroup>
                            </MainPopUp>
                            
                            <PopUpFooter>
                                <DeleteWrapper>
                                    <Button onClick={() => deleteGift(id)} type="button">Remover</Button>
                                </DeleteWrapper>
                                
                                <ButtonsWrapper>
                                    <SecondaryButton onClick={() => setisModalOpen(false)} type="button">Cancelar</SecondaryButton>
                                    <Button type="submit">Salvar Alterações</Button>
                                </ButtonsWrapper>
                            </PopUpFooter>
                        </form>
                    </PopUpContainer>
                </ModalOverlay>
            }

            <Gift onClick = {() => setisModalOpen(true)} $isEven = {isEven}>
                <p>{name}</p>
                <p>{total_amount}</p>
                <p>{balance}</p>
                <p>{total_amount - balance}</p>
            </Gift>
        </>
    )
}

export default GiftRow

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

const PopUpContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: var(--background-neutrals-secondary);
    width: 100%;
    max-width: 62.5rem;
    padding: 2rem;
    color: var(--content-neutrals-primary);
`;

const PopUpHeader = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--outline-neutrals-secondary);

    h5{
        color: var(--content-neutrals-primary, #FFF);
        font: 700 2rem/2.5rem 'At aero Bold';
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

const MainPopUp = styled.main`
    display: flex;
    flex-direction: column;
    padding-block: 1rem;
    gap: 1.5rem;
    border-bottom: 1px solid var(--outline-neutrals-secondary);
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
        font: 700 1rem/1.5rem 'At Aero Bold';
    }
`;

const StyledInput = styled.input`
    font: 400 1rem/1.5rem 'At Aero';
    width: 100%;
    padding: 0.75rem 1rem;
    background-color: transparent;
    transition: all 200ms ease-in-out;
    border: 0.125rem solid ${({ $hasError }) => $hasError ? '#F82122' : 'var(--content-neutrals-primary)'} !important;
    color: var(--content-neutrals-primary);
    
    &:hover, &:focus-visible{
        background-color: var(--background-neutrals-secondary);
    }

    &:focus-visible{
        outline: none;
        border-color: ${({ $hasError }) => $hasError ? '#F82122' : 'var(--brand-primary)'} !important;
    }
`;

const PopUpFooter = styled.div`
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
`

const DeleteWrapper = styled.div`
    display: flex;
    button {
        background-color: #F82122;
        color: white;
        max-width: none;
    }
`;

const ButtonsWrapper = styled.div`
    display: flex;
    gap: 1.5rem;
    button {
         max-width: none;
    }
`;

const Gift = styled.div`
    width: 100%;
    cursor: pointer;
    display: grid;
    grid-template-columns: 2fr repeat(3, 1fr); 
    grid-column-gap: 3rem;
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
    }
`