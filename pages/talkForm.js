import styled, { css } from "styled-components";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import NavBar from "../src/patterns/base/Nav";
import Meta from "../src/infra/Meta";
import { useForm } from "react-hook-form";

//saphira
import saphira from "../services/saphira";

// Componenets
import Button from "../src/components/Button";
import SecondaryButton from "../src/components/SecondaryButton";

const TalkForm = () => {
    const router = useRouter();
    const {data = "None"} = router.query
    const [sponsors, setSponsors] = useState([])
    const [speakers, setSpeakers] = useState([])
    const [isLoading, setisLoading] = useState(true)
    const {register, handleSubmit, watch, formState: {erros}} = useForm()


    const postTalk = async(talk) => {

        const speakers = []
        speakers.push(talk.speakers)
        speakers.push('e41f901b-03be-4604-8ca4-155383fd5dba')

        await saphira.postTalk(
            `${talk.date}T${talk.start_time}`,
            `${talk.date}T${talk.end_time}`,
            speakers,
            talk.activity_type,
            "IP",
            talk.sponsor,
            talk.title,
            "talk.description"
        )   
    }

    const fetchData = async() => {
        const [speakerRes, sponsorRes] = await Promise.all([
            saphira.getSpeakers(),
            saphira.getSponsors()
        ])

        setSpeakers(speakerRes.data)
        setSponsors(sponsorRes.data)
    }

    useEffect(() => {
        if (router.isReady){
            try{
                fetchData()
            }
            catch(err){
                console.log(err)
            }
            finally{
                setisLoading(false)
            }
        }
    }, [])

    const speakersOptions = useMemo(() => {
        return speakers.map((speaker)  => {
            return(
                <option key = {speaker.id} value = {speaker.id}>{speaker.name}</option>
            )
        })
    }, [speakers])

    return(
        <>
            <NavBar name = "Palestrantes > Adicionar Palestra"/>
            <Meta title = "Adicionar Palestra | COSSI 2025 Dashboard"/>

            <FormContainer onClick={(e) => e.stopPropagation()}>
                <FormHeader>
                    <h5>Adicionar Palestra</h5>
                </FormHeader>

                <form action = "" onSubmit={handleSubmit(postTalk)}>
                    <FormWrapper>
                        <FormColumn $columns = {'1fr 1fr'}>
                            <FormGroup>
                                <label htmlFor="title">Nome da palestra</label>
                                <input id = "title" type = "text"
                                {...register('title')}
                                placeholder = "Nome da palestra..."/>
                            </FormGroup>

                            <FormGroup>
                                <label>Empresa</label>
                                <select id = "sponsor" {...register('sponsor')}>
                                    {
                                        sponsors.map((sponsor) => {
                                            return(
                                                <option key = {sponsor.id} value = {sponsor.id}>{sponsor.name}</option>
                                            )
                                        })
                                    }
                                    <option selected value = {0}>Nenhuma</option>

                                </select>
                            </FormGroup>
                        </FormColumn>

                        <FormGroup>
                            <label>Descrição</label>
                            <textarea
                            id = "description"
                            placeholder="Descrição da palestra..."
                            {...register('description')}
                            >
                                
                            </textarea>
                        </FormGroup>

                        <FormGroup>
                            <label>Palestrantes</label>
                            <select id = "speakers"  
                            {...register('speakers')}>
                                {speakersOptions}
                            </select>
                        </FormGroup>

                        <FormColumn $columns = '1fr 1fr 2fr 2fr 2fr'>
                            <FormGroup>
                                <label html = "start_time">Início</label>
                                <input id = "start_time" type = "time"
                                {...register('start_time')}
                                />
                            </FormGroup>

                            <FormGroup>
                                <label html = "end_time">Fim</label>
                                <input id = "end_time" type = "time"
                                {...register('end_time')}
                                />
                            </FormGroup>

                            <FormGroup>
                                <label html = "date">Data</label>
                                <input id = "date" type = "date"
                                {...register('date')}
                                />
                            </FormGroup>

                            <FormGroup>
                                <label html = "activity_type">Tipo de atividade</label>
                                <select id = "activity_type"
                                {...register('activity_type')}
                                >
                                    <option selected value = "PR">Palestra</option>
                                    <option value = "WS">Workshop</option>

                                </select>
                            </FormGroup>

                            <FormGroup>
                                <label html = "mode">Modalidade</label>
                                <select id = "mode"
                                {...register('mode')}
                                >
                                    <option value = "ON">Online</option>
                                    <option value = "IP" selected >Presencial</option>
                                </select>
                            </FormGroup>
                        </FormColumn>
                    </FormWrapper>

                    <FormFooter>
                        <SecondaryButton onClick={() => router.back()} type = "button">Cancelar</SecondaryButton>
                        <Button type = "submit">Confirmar</Button>
                    </FormFooter>
                </form>
            </FormContainer>
        </>
    )
}

export default TalkForm;

const FormContainer = styled.div`
    width: 100%;
    padding: 2rem;
    max-width: 1920px;
    color: var(--content-neutrals-primary);
`;

const FormHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    align-self: stretch;
    padding-bottom: 1rem;

    h5{
        color: var(--content-neutrals-primary, #FFF);
        font-size: 2rem;
        font-style: normal;
        font-weight: 700;
        line-height: 2.5rem;
        flex: 1 0 0;
    }
`

const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding-block: 1rem;
    gap: 1.5rem;
    border-bottom: 1px solid var(--outline-neutrals-secondary);
`

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
        font: 700 1rem/1.5rem 'At Aero Bold';
    }

    input, select {
        font: 400 1rem/1.5rem 'At Aero';
        width: 100%;
        height: 3rem;
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

    textarea{
        height: 10rem;
        background-color: transparent;
        border: 1px solid var(--content-neutrals-primary);
        padding: 0.75rem 1rem;
        font: 700 1rem/1.5rem 'At Aero';
    }
`;

const FormColumn = styled.div`
    display: grid;
    grid-template-columns: ${({$columns}) => $columns};
    width: 100%;
    grid-column-gap: 1rem;
`


const FormFooter = styled.div`
    margin-top: 1rem;
    gap: 1.5rem;
    display: flex;
    justify-content: space-between;

    button{
        max-width: none;
    }
`