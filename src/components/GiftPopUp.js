import styled, { css } from "styled-components";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

// saphira
import saphira from "../../services/saphira";

// components
import Button from "./Button"; 
import SecondaryButton from "./SecondaryButton";

const GiftsPopUp = ({isOpen, onClose}) => {
    const {register, handleSubmit, reset, formState: {errors}} = useForm();
    
    if (!isOpen){ 
        return null;
    }
    
    const postGift = async(gift) => {
        try{
            Swal.fire({
                title: 'Processando...',
                text: 'Adicionando o brinde...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            });

            await saphira.postGift(
                gift.name,
                gift.description,
                gift.min_presence,
                gift.total_amount
            )

            await Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Brinde adicionado com sucesso.',
                timer: 1500,
                showConfirmButton: false
            });

            reset();
            onClose(true); // Retorna true para o pai atualizar a lista

        } catch(err){
            console.error("Erro ao adicionar brinde:", err)
            Swal.fire({
                icon: 'error',
                title: 'Falha ao adicionar',
                text: 'Houve um problema de comunicação com o servidor. Verifique os dados e tente novamente.',
            });
        }
    }

    const handleClose = () => {
        reset();
        onClose();
    }

    return(
        <PopUpOverlay>
            <PopUpContainer onClick={(e) => e.stopPropagation()}>
                <PopUpHeader>
                    <h5>Adicionar Brinde</h5>
                    <div className='close' onClick={handleClose}>
                        <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z"/>
                        </svg>
                    </div>
                </PopUpHeader>
                <form action="" onSubmit={handleSubmit(postGift)}>
                    <MainPopUp>
                        <FormGroup>
                            <label htmlFor="name">Nome</label>
                            <StyledInput id="name" type="text"
                            $hasError={!!errors.name}
                            {...register('name', { required: true, maxLength: 64 })}
                            placeholder="Digite o nome do brinde..."/>
                        </FormGroup>

                        <FormGroup>
                            <label htmlFor="description">Descrição</label>
                            <StyledInput id="description" type="text"
                            $hasError={!!errors.description}
                            {...register('description', { maxLength: 256 })}
                            placeholder="Digite a descrição do brinde..."/>
                        </FormGroup>

                        <FormGroup>
                            <label htmlFor="total_amount">Quantidade total</label>
                            <StyledInput id="total_amount" type="number"
                            $hasError={!!errors.total_amount}
                            {...register('total_amount', { required: true, min: 0})}
                            placeholder="Digite a quantidade total"/>
                        </FormGroup>

                        <FormGroup>
                            <label htmlFor="min_presence">Mínimo de presenças</label>
                            <StyledInput id="min_presence" type="number"
                            $hasError={!!errors.min_presence}
                            {...register('min_presence', { required: true, min: 1})}
                            placeholder="Digite a quantidade mínima de presenças..."/>
                        </FormGroup>
                    </MainPopUp>

                    <PopUpFooter>
                        <SecondaryButton onClick={handleClose} type="button">Cancelar</SecondaryButton>
                        <Button type="submit">Confirmar</Button>
                    </PopUpFooter>
                </form>
            </PopUpContainer>
        </PopUpOverlay>
    )
}

export default GiftsPopUp;

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
    gap: 1.5rem;
    display: flex;
    justify-content: flex-end;

    button{
        max-width: none;
    }
`