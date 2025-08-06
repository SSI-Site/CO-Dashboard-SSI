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
import SpeakerInput from "../src/components/SpeakerInput";

const TalkForm = () => {
    const router = useRouter();
    const { id } = router.query

    const [talkInfo, setTalkInfo] = useState([])
    const [sponsors, setSponsors] = useState([])
    const [speakers, setSpeakers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedSpeakers, setSelectedSpeakers] = useState([])
    const {register, handleSubmit, watch, formState: {erros}} = useForm()

    const postTalk = async(talk) => {
        try{
            if (!id){
                await saphira.postTalk(
                    `${talk.date}T${talk.start_time}`,
                    `${talk.date}T${talk.end_time}`,
                    selectedSpeakers.map(speaker => speaker.split('|')[0]),
                    talk.activity_type,
                    talk.mode,
                    talk.sponsor,
                    talk.title,
                    talk.description
                )   
            }
            else {
                await saphira.updateTalk(
                    id,
                    `${talk.date}T${talk.start_time}`,
                    `${talk.date}T${talk.end_time}`,
                    selectedSpeakers.map(speaker => speaker.split('|')[0]),
                    talk.activity_type,
                    talk.mode,
                    talk.sponsor,
                    talk.title,
                    talk.description
                )
            }
        }
        catch(err){
            console.log("Ocorreu um erro no POST da palestra", err)
        }
        finally{
            router.push('/talks')
        }
    }

    const getDate = (isoDate) => {
        const date = new Date(isoDate)
        return date.toISOString().split('T')[0]
    }

    const formatedTime = (isoDate) => {
        const date = new Date(isoDate)
        return date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit', hour12: false})
    }

    const fetchData = async() => {

        try{
            const [speakerRes, sponsorRes, talkRes] = await Promise.all([
                saphira.getSpeakers(),
                saphira.getSponsors(),
                saphira.getTalk(id)
            ])
    
            setTalkInfo(talkRes.data)
            setSpeakers(speakerRes.data)
            setSponsors(sponsorRes.data)
    
            if (talkRes.data) {
                const requests = talkRes.data.speakers.map((id) => saphira.getSpeaker(id))
                const response = await Promise.all(requests)
                const names = response.map(res => `${res.data.id}|${res.data.name}`)
                setSelectedSpeakers(names)
            }
        }

        catch(err){
            console.log(err)
        }
        finally{
            setIsLoading(false)
        }
    }

    const removeTalk = async(id) => {
        await saphira.removeTalk(id)
        router.push('/talks')
    }

    useEffect(() => {
        if (router.isReady){
            try{
                fetchData()
            }
            catch(err){
                console.log(err)
            }
        }
    }, [])


    return(
        <>
            <NavBar name = {`Palestrantes > ${id ? 'Editar Palestra' : 'Adicionar Palestra'}`}/>
            <Meta title = {`${id ? 'Editar Palestra' : 'Adicionar Palestra'} | COSSI 2025 Dashboard`}/>

            <FormContainer onClick={(e) => e.stopPropagation()}>
                <FormHeader>
                    <h5>{id ? 'Editar Palestra' : 'Adicionar Palestra'}</h5>
                </FormHeader>

                {!isLoading &&

                <form action = "" onSubmit={handleSubmit(postTalk)}>
                    <FormWrapper>
                        <FormColumn $columns = {'1fr 1fr'}>
                            <FormGroup>
                                <label htmlFor="title">Nome da palestra</label>
                                <input id = "title" type = "text" defaultValue = {talkInfo.title ? talkInfo.title : ''}
                                {...register('title')}
                                placeholder = "Nome da palestra..."/>
                            </FormGroup>

                            <FormGroup>
                                <label>Empresa</label>
                                <select id = "sponsor" {...register('sponsor')} defaultValue={talkInfo.sponsor ? talkInfo.sponsor.id : 'Nenhuma'}>
                                    {
                                        sponsors.map((sponsor) => 
                                                    <option key = {sponsor.id} value = {sponsor.id}>{sponsor.name}</option>
                                                
                                    )}
                                    <option value = {undefined}>Nenhuma</option>

                                </select>
                            </FormGroup>
                        </FormColumn>

                        <FormGroup>
                            <label>Descrição</label>
                            <textarea
                            id = "description"
                            defaultValue = {talkInfo.description ? talkInfo.description : ''}
                            placeholder="Descrição da palestra..."
                            {...register('description')}
                            >
                                
                            </textarea>
                        </FormGroup>

                        <FormGroup>
                            
                           <SpeakerInput setSelectedSpeakers={setSelectedSpeakers} selectedSpeakers={selectedSpeakers} speakers = {speakers}/>
                        </FormGroup>

                        <FormColumn $columns = '1fr 1fr 2fr 2fr 2fr'>
                            <FormGroup>
                                <label html = "start_time">Início</label>
                                <input id = "start_time" type = "time" defaultValue = {talkInfo.start_time ? formatedTime(talkInfo.start_time) : ''}
                                {...register('start_time')}
                                />
                            </FormGroup>

                            <FormGroup>
                                <label html = "end_time">Fim</label>
                                <input id = "end_time" type = "time" defaultValue = {talkInfo.end_time ? formatedTime(talkInfo.end_time) : ''}
                                {...register('end_time')}
                                />
                            </FormGroup>

                            <FormGroup>
                                <label html = "date">Data</label>
                                <input id = "date" type = "date" defaultValue = {talkInfo.end_time ? getDate(talkInfo.end_time) : ''}
                                {...register('date')}
                                />
                            </FormGroup>

                            <FormGroup>
                                <label html = "activity_type">Tipo de atividade</label>
                                <select id = "activity_type" defaultValue = {talkInfo.activity_type ? talkInfo.activity_type : 'PR'}
                                {...register('activity_type')}
                                >
                                    <option selected value = "PR">Palestra</option>
                                    <option value = "WS">Workshop</option>

                                </select>
                            </FormGroup>

                            <FormGroup>
                                <label html = "mode">Modalidade</label>
                                <select id = "mode"
                                defaultValue = {talkInfo.mode ? talkInfo.mode : 'IP'}
                                {...register('mode')}
                                >
                                    <option value = "ON">Online</option>
                                    <option value = "IP" selected >Presencial</option>
                                </select>
                            </FormGroup>
                        </FormColumn>
                    </FormWrapper>

                    <FormFooter $update = {id ? true : false}>
                        {id && 
                            <Cancel>
                                <Button style={{backgroundColor: '#F82122'}} onClick={() => removeTalk(id)}>Deletar palestra</Button>
                            </Cancel>
                        }
                        <FormButtons>
                            <SecondaryButton onClick={() => router.back()} type = "button">Cancelar</SecondaryButton>
                            <Button type = "submit">{id ? 'Salvar Alterações' : 'Adicionar nova palestra'}</Button>
                        </FormButtons>
                    </FormFooter>
                </form>
                }
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
    justify-content: ${({$update}) => $update ? 'space-between': 'flex-end'} ;
`

const Cancel = styled.div`
    display: flex;
`

const FormButtons = styled.div`
    display: flex;
    gap: 1.5rem;
`