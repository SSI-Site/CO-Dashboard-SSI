import NavBar from "../src/patterns/base/Nav";
import Meta from "../src/infra/Meta";
import styled from "styled-components";
import { useState, useEffect } from "react";

// saphira
import saphira from "../services/saphira";

// Components
import LoadingSVG from '../public/loading.svg'
import Alert from '../src/components/Alert'

const Gifts = () => {

    const [gifts, setGifts] = useState([])
    const [isLoading, setisLoading] = useState(false);

    const getGifts = () => {  
        setisLoading(true)
        try {
            const { data } = saphira.getGifts()
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
                </GiftsTitle>

                <GiftsGrid>
                    <label>Brinde</label>
                    <label>Total</label>
                    <label>Disponível para retirada</label>
                    <label>Retirados</label>
                </GiftsGrid>
                <GiftsWrapper>
                    {!isLoading && 
                        gifts.forEach((gift) => {
                            return(
                                <Gift>
                                    <p>{gift.name}</p>
                                    <p>{gift.total_amount}</p>
                                    <p>{gift.balance}</p>
                                </Gift>
                            )
                        })
                    }
                    
                </GiftsWrapper>   
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
    grid-template-rows: repeat(11, 1fr);
    grid-column-gap: 3rem;
    grid-row-gap: 0.75rem; 
`

const Gift = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr; 
    grid-column-gap: 3rem;
    grid-row-gap: 0.75rem; 
    padding-inline: 0.75rem 0.5rem; 
    height: 4rem;
    align-items: center;
`