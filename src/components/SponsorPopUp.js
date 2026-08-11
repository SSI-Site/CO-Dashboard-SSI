import styled, { css } from "styled-components";
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

// saphira
import saphira from "../../services/saphira";

// components
import Button from './Button';
import SecondaryButton from './SecondaryButton';

const SponsorPopUp = ({isOpen, onClose}) => {
    const {register, handleSubmit, reset, formState: {errors}} = useForm()

    if (!isOpen){ 
        return null;
    }
    
    const postSponsor = async(sponsor) => {
        try{
            // Feedback visual de carregamento
            Swal.fire({
                title: 'Processando...',
                text: 'Adicionando a empresa...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            });

            await saphira.postSponsor(sponsor.name, sponsor.url);

            // Alerta de sucesso
            await Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'A empresa foi adicionada com sucesso.',
                timer: 1000,
                showConfirmButton: false
            });

            reset(); // Limpa os campos do formulário para o próximo uso
            onClose(true); // Só fecha o pop-up se a requisição deu certo

        } catch(err){
            console.error("Ocorreu um erro no POST do Sponsor:", err)
            
            // Alerta de erro
            Swal.fire({
                icon: 'error',
                title: 'Falha ao adicionar',
                text: 'Houve um problema de comunicação com o servidor. Verifique os dados e tente novamente.',
            });
        }
    }

    const handleClose = () => {
        reset(); // Limpa os campos caso o usuário cancele
        onClose();
    }

    return (
        <>
            <PopUpOverlay>
                <PopUpContainer onClick={(e) => e.stopPropagation()}>
                    <PopUpHeader>
                        <h5>Adicionar Empresa</h5>
                        <div className='close' onClick={handleClose}>
                            <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z"/>
                            </svg>
                        </div>
                    </PopUpHeader>
                    
                    <form action="" onSubmit={handleSubmit(postSponsor)}>
                        <MainPopUp>
                            <FormContainer>
                                <FormRow>
                                    <FormGroup>
                                        <StyledLabel htmlFor="name">Nome</StyledLabel>
                                        <StyledInput id="name" type="text"
                                        $hasError={!!errors.name}
                                        {...register('name', { required: true, maxLength: 64 })}
                                        placeholder="Digite o nome da empresa"/>
                                    </FormGroup>
                                </FormRow>
                                <FormRow>
                                    <FormGroup>
                                        <StyledLabel htmlFor="url">URL do site</StyledLabel>
                                        <StyledInput id="url" type="url"
                                        $hasError={!!errors.url}
                                        {...register('url', { required: true, maxLength: 200 })}
                                        placeholder="https://www.exemplo.com.br"/>
                                    </FormGroup>
                                </FormRow>
                            </FormContainer>
                        </MainPopUp>
                        
                        <PopUpFooter>
                            <SecondaryButton onClick={handleClose} type="button">Cancelar</SecondaryButton>
                            <Button type="submit">Adicionar</Button>
                        </PopUpFooter>
                    </form>
                </PopUpContainer>
            </PopUpOverlay>
        </>
    )
}

export default SponsorPopUp

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
    max-width: 34rem;

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
    
    button{
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