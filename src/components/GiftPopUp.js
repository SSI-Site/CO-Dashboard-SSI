import styled from "styled-components";
import { useForm } from "react-hook-form";

// saphira
import saphira from "../../services/saphira";

// components
import Button from "./Button"; 
import SecondaryButton from "./SecondaryButton";

const GiftsPopUp = ({isOpen, onClose}) => {
    if (!isOpen){ // ESVAZIA OS CAMPOS
        return null;
    }

    const {register, handleSubmit, watch, formState: {erros}} = useForm()
    
    const postGift = async(gift) => {
        try{
            await saphira.postGift(
                gift.name,
                gift.description,
                gift.min_presence,
                gift.total_amount
            )
        }
        catch(err){
            console.log(err)
        }
        finally{
            onClose()
        }

    }


    return(
        <>
        {
            <PopUpOverlay onClick = {onClose}>
                <PopUpContainer onClick={(e) => e.stopPropagation()}>
                    <PopUpHeader>
                        <h5>Adicionar Brinde</h5>
                        <div className = 'close' onClick={onClose}>
                            <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z"/>
                            </svg>
                        </div>
                    </PopUpHeader>
                    <form action = "" onSubmit = {handleSubmit(postGift)}>
                        <MainPopUp>
                            <FormGroup>
                                <label htmlFor="name">Nome</label>
                                <input id="name" type="text"
                                {...register('name')}
                                placeholder="Digite o nome do brinde..."/>
                            </FormGroup>

                            <FormGroup>
                                <label htmlFor="description">Descrição</label>
                                <input id="description" type="text"
                                {...register('description')}
                                placeholder="Digite a descrição do brinde..."/>
                            </FormGroup>

                            <FormGroup>
                                <label htmlFor="total_amount">Quantidade total disponível</label>
                                <input id="total_amount" type="number"
                                {...register('total_amount')}
                                placeholder="Digite a quantidade disponível"/>
                            </FormGroup>

                            <FormGroup>
                                <label htmlFor="min_presence">Quantidade mínima de presença</label>
                                <input id="min_presence" type="number"
                                {...register('min_presence')}
                                placeholder="Digite a quantidade mínima de presenças..."/>
                            </FormGroup>
                        </MainPopUp>

                        <PopUpFooter>
                            <SecondaryButton onClick={onClose} type = "button">Cancelar</SecondaryButton>
                            <Button type = "submit">Confirmar</Button>
                        </PopUpFooter>
                    </form>

                </PopUpContainer>
            </PopUpOverlay>
        }
        </>
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

    input {
        font: 400 1rem/1.5rem 'At Aero';
        width: 100%;
        //max-width: 30rem;
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
`;

const PopUpFooter = styled.div`
    margin-top: 1rem;
    gap: 1.5rem;
    display: flex;

    button{
        max-width: none;
    }
`