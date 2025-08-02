import NavBar from "../src/patterns/base/Nav";
import Meta from "../src/infra/Meta";
import styled from "styled-components";
import Image from "next/image";
import { useState, useEffect } from "react";

// Saphira
import saphira from "../services/saphira";

// Components
import Button from "../src/components/Button";
import SecondaryButton from "../src/components/SecondaryButton";
import LoadingSVG from '../public/loading.svg'
import SponsorRow from "../src/components/sponsorRow";
import SponsorPopUp from "../src/components/SponsorPopUp";

const Sponsors = () => {

    const [isOpen, setisOpen] = useState(false)
    const [sponsors, setSponsors] = useState([])
    const [isLoading, setisLoading] = useState(true)

    const getSponsors = async() => {
        if (!isLoading) setisLoading(true)

        try{
            const { data } = await saphira.getSponsors()
            if (data) setSponsors(data)
        }
        catch(err){
            console.log(err)
        }
        finally{
            setisLoading(false)
        }

    }

    useEffect(() => {
        getSponsors()
    }, [])

    useEffect(() => {
        if (isOpen) getSponsors()
    }, [isOpen])

    return (
        <>
            <Meta title = "COSSI 2025 | Empresas"/>
            <NavBar name = {"Empresas"}/>

            <SponsorsContainer>
                <SponsorsTitle>
                    <h5>Empresas</h5>

                    <SponsorsInteractions>
                        <SponsorsFilter>
                            <input 
                                placeholder = "Buscar por nome...">
                            </input>
                            <Button>Consultar</Button>
                            <span/>
                            <SecondaryButton onClick = {() => setisOpen(true)}>
                                + Adicionar
                            </SecondaryButton> 

                            <SponsorPopUp isOpen = {isOpen} onClose={() => setisOpen(false)}/>
                        </SponsorsFilter>
                    </SponsorsInteractions>
                </SponsorsTitle>

                <SponsorsGrid>
                    <label>Nome</label>
                    <label>URL do site</label>
                </SponsorsGrid>
                <SponsorsWrapper>
                    {!isLoading && sponsors.map((sponsor) => {
                        return(
                            <SponsorRow
                            id = {sponsor.id}
                            name={sponsor.name}
                            url={sponsor.url}
                            />
                        )
                        })
                    }

                    {!isLoading &&
                        sponsors.length == 0 &&
                            <p className = 'allRow noSpeakers'>Sem empresas cadastradas :(</p>
                           
                    }

                    {isLoading &&
                        <Image
                            src = {LoadingSVG}
                            width={120}
                            height={50}
                            className = "allRow"
                        />
                    }
                </SponsorsWrapper>   
                <SponsorsFooter>
                    <p>{sponsors.length} Parceiro/Apoiador encontrado</p>
                </SponsorsFooter>
            </SponsorsContainer>
        </>
    )
}

const SponsorsContainer = styled.div`
    padding: 1.5rem;
    width: 100%;
    height: 100%;
    margin: auto;
    max-width: 1920px;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const SponsorsTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 1.5rem;
`

const SponsorsFilter = styled.div`
    display: flex;
    gap: 0.5rem;
    width: 100%;
    align-items: center;
    justify-content: flex-end;
    margin-left: 1.5rem;

    input {
        font: 400 1rem/1.5rem 'At Aero';
        width: 100%;
        max-width: 30rem;
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

    button {
        max-width: 8rem;
    }
`

const SponsorsInteractions = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
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


const SponsorsGrid = styled.div`
    width: 100%;
    border-block: 1px solid var(--outline-neutrals-secondary);
    padding: 1.5rem 0.5rem;
    display: grid;
    grid-template-columns: 1fr 3fr; 
    grid-column-gap: 3rem;
    grid-row-gap: 0.75rem; 
    margin-bottom: 0.75rem;

    label {
        font: 700 1.125rem/1.5rem 'At Aero Bold';
    }
`

const SponsorsWrapper = styled.div`
    width: 100%;
    display: grid;
    grid-column-gap: 3rem;
    grid-row-gap: 0.75rem; 
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

const SponsorsFooter = styled.footer`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    P {
        font: 700 1.125rem/1.5rem 'At Aero Bold';
    }
`

export default Sponsors