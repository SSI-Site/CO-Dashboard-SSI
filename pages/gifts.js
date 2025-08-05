import NavBar from "../src/patterns/base/Nav";
import Meta from "../src/infra/Meta";
import styled from "styled-components";
import { useState, useEffect } from "react";
import Image from "next/image";

// saphira
import saphira from "../services/saphira";

// Components
import LoadingSVG from '../public/loading.svg'
import Alert from '../src/components/Alert'
import SecondaryButton from "../src/components/SecondaryButton";
import GiftsPopUp from "../src/components/GiftPopUp";
import GiftRow from "../src/components/GiftRow";

const Gifts = () => {

    const [gifts, setGifts] = useState([])
    const [isLoading, setisLoading] = useState(false);
    const [isOpen, setisOpen] = useState(false)

    const getGifts = async() => {  
        setisLoading(true)
        try {
            const { data } = await saphira.getGifts()
            if (data) {
                setGifts(data);
            }
        }
        catch(err){
            console.log(err)
        }
        finally{
            setisLoading(false)
        }
    }

    const OnClosePopUp = async(render) => {
        setisOpen(false)
        if (render) await getGifts()
    }

    useEffect(() => {
        getGifts()
    }, [])

    return (
        <>
            <Meta title = "COSSI 2025 | Controle de brindes"/>
            <NavBar name = {"Controle de brindes"}/>

            <GiftsContainer>
                <GiftsTitle>
                    <h5>Controle de brindes</h5>
                    <GiftsInteraction>
                        <SecondaryButton onClick = {() => setisOpen(true)}>
                            + Adicionar
                        </SecondaryButton> 

                        <GiftsPopUp isOpen = {isOpen} onClose={OnClosePopUp}/>
                    </GiftsInteraction>
                </GiftsTitle>

                <GiftsGrid>
                    <label>Brinde</label>
                    <label>Total</label>
                    <label>Disponível para retirada</label>
                    <label>Retirados</label>
                </GiftsGrid>
                <GiftsWrapper>
                    {!isLoading && 
                        gifts.map((gift, index) => {
                            return(
                                <GiftRow
                                    isEven = {index % 2}
                                    key = {gift.id}
                                    id = {gift.id}
                                    name = {gift.name}
                                    min_presence = {gift.min_presence}
                                    description = {gift.description}
                                    total_amount = {gift.total_amount}
                                />
                            )
                        })
                    }


                    {!isLoading &&
                        gifts.length == 0 &&
                            <p className = 'allRow noSpeakers'>Sem brindes cadastrados :(</p>
                           
                    }

                    {isLoading &&
                        <Image
                            src = {LoadingSVG}
                            width={120}
                            height={50}
                            className = "allRow"
                        />
                    }
                    
                </GiftsWrapper> 
                <GiftsFooter>
                    <p>{gifts.length} brindes encontrados</p>
                </GiftsFooter>  
            </GiftsContainer>
        </>
    )
}

export default Gifts

const GiftsContainer = styled.div`
    padding: 1.5rem;
    width: 100%;
    height: 100%;
    margin: auto;
    max-width: 1920px;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const GiftsTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 1.5rem;
`

const GiftsInteraction = styled.div`
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
    height: 100%;

    span {
        height: 3rem;
        border-left: 1px solid var(--outline-neutrals-secondary);
    }

    button {
        max-width: 8rem;
    }
`


const GiftsGrid = styled.div`
    width: 100%;
    border-block: 1px solid var(--outline-neutrals-secondary);
    padding: 1.5rem 0.5rem;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr; 
    grid-column-gap: 3rem;
    grid-row-gap: 0.75rem; 
    margin-bottom: 0.75rem;

    label {
        font: 700 1.125rem/1.5rem 'At Aero Bold';
    }
`

const GiftsWrapper = styled.div`
    width: 100%;
    display: grid;
    grid-column-gap: 3rem;
    padding-bottom: 0.75rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--outline-neutrals-secondary);

    .noSpeakers{
        text-align: center;
        font: 700 1.125rem/1.5rem 'At Aero Bold';
    }

    .allRow{
        grid-row-start: 1;
        grid-row-end: 11;
        align-self: center;
        width: 100%;
    }
`

const GiftsFooter = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-start;
    
    p {
        font: 700 1rem/1.5rem 'At Aero Bold';
    }
`