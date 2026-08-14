import styled, { css } from "styled-components";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import NavBar from "../src/patterns/base/Nav";
import Meta from "../src/infra/Meta";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

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
    const {register, handleSubmit, watch, formState: {errors}} = useForm()

    const postTalk = async(talk) => {
        try{
            Swal.fire({
                title: 'Processando...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            });

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

            // Exibe mensagem de sucesso e SÓ ENTÃO redireciona
            await Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: `Palestra ${id ? 'atualizada' : 'adicionada'} com sucesso!`,
                timer: 1000,
                showConfirmButton: false
            });
            
            router.push('/talks')
            
        } catch(err){
            console.error("Ocorreu um erro no POST da palestra", err.response)
            // Informa ao usuário que algo deu errado e NÃO redireciona
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Não foi possível salvar a palestra. Verifique os dados e tente novamente.',
            });
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

    const getTalk = async() => {
        setIsLoading(true)

        try{
            const { data } = await saphira.getTalk(id)
            if (data) setTalkInfo(data)
    
            if (data) {
                const requests = data.speakers.map((speakerId) => saphira.getSpeaker(speakerId))
                const response = await Promise.all(requests)
                const names = response.map(res => `${res.data.id}|${res.data.name}`)
                setSelectedSpeakers(names)
            }
        }
        catch(err){
            console.error(err)
            Swal.fire({
                icon: 'error',
                title: 'Erro de Carregamento',
                text: 'Não foi possível carregar os dados desta palestra.',
            });
        }
        finally{
            setIsLoading(false)
        }
    }

    const fetchData = async() => {
        try{
            const [speakerRes, sponsorRes ] = await Promise.all([
                saphira.getSpeakers(),
                saphira.getSponsors(),
            ])
    
            setSpeakers(speakerRes.data)
            setSponsors(sponsorRes.data)
    
            if (id) getTalk()
            else setIsLoading(false)
        }
        catch(err){
            console.error(err)
            Swal.fire({
                icon: 'warning',
                title: 'Atenção',
                text: 'Houve um problema ao buscar palestrantes ou patrocinadores.',
            });
            setIsLoading(false) // Adicionado para destravar a tela mesmo com erro
        }
    }

    const removeTalk = async(id) => {
        // Pede confirmação antes de deletar
        const result = await Swal.fire({
            title: 'Tem certeza?',
            text: "Você não poderá reverter isso!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#F82122', // Usando a cor do seu botão
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                Swal.fire({ title: 'Deletando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                
                await saphira.removeTalk(id)
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Deletado!',
                    text: 'A palestra foi removida.',
                    timer: 1500,
                    showConfirmButton: false
                });
                
                router.push('/talks')
            } catch (err) {
                console.error("Erro ao deletar", err)
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: 'Houve um problema ao tentar excluir a palestra.',
                });
            }
        }
    }

    useEffect(() => {
        if (router.isReady){
            fetchData()
        }
    }, [router.isReady])

    return(
        <>
            <NavBar name = {`Palestrantes > ${id ? 'Editar Palestra' : 'Adicionar Palestra'}`}/>
            <Meta title = {`${id ? 'Editar Palestra' : 'Adicionar Palestra'} | COSSI 2026 Dashboard`}/>

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
                                {...register('title', { required: true })}
                                placeholder = "Nome da palestra..."/>
                            </FormGroup>

                            <FormGroup>
                                <label>Empresa</label>
                                <select id = "sponsor" {...register('sponsor')} defaultValue={talkInfo.sponsor != null? talkInfo.sponsor.id : 'Nenhuma'}>
                                    {sponsors.map((sponsor) => 
                                        <option key = {sponsor.id} value = {sponsor.id}>{sponsor.name}</option>
                                    )}
                                    <option value = {'Nenhuma'}>Nenhuma</option>
                                </select>
                            </FormGroup>
                        </FormColumn>

                        <FormGroup>
                            <label>Descrição</label>
                            <textarea
                            id = "description"
                            maxLength={1024}
                            defaultValue = {talkInfo.description ? talkInfo.description : ''}
                            placeholder="Descrição da palestra... (no máximo 1024 caracteres)"
                            {...register('description')}
                            />   
                        </FormGroup>

                        <FormGroup>
                           <SpeakerInput setSelectedSpeakers={setSelectedSpeakers} selectedSpeakers={selectedSpeakers} speakers = {speakers}/>
                        </FormGroup>

                        <FormColumn $columns = '1fr 1fr 2fr 2fr 2fr'>
                            <FormGroup>
                                <label htmlFor="start_time">Início</label>
                                <input id = "start_time" type = "time" defaultValue = {talkInfo.start_time ? formatedTime(talkInfo.start_time) : ''}
                                {...register('start_time')}
                                />
                            </FormGroup>

                            <FormGroup>
                                <label htmlFor="end_time">Fim</label>
                                <input id = "end_time" type = "time" defaultValue = {talkInfo.end_time ? formatedTime(talkInfo.end_time) : ''}
                                {...register('end_time')}
                                />
                            </FormGroup>

                            <FormGroup>
                                <label htmlFor="date">Data</label>
                                <input id = "date" type = "date" defaultValue = {talkInfo.start_time ? getDate(talkInfo.start_time) : ''}
                                {...register('date')}
                                />
                            </FormGroup>

                            <FormGroup>
                                <label htmlFor="activity_type">Tipo de atividade</label>
                                <select id = "activity_type" defaultValue = {talkInfo.activity_type ? talkInfo.activity_type : 'PR'}
                                {...register('activity_type')}
                                >
                                    <option value = "PR">Palestra</option>
                                    <option value = "WS">Workshop</option>
                                </select>
                            </FormGroup>

                            <FormGroup>
                                <label htmlFor="mode">Modalidade</label>
                                <select id = "mode"
                                defaultValue = {talkInfo.mode ? talkInfo.mode : 'IP'}
                                {...register('mode')}
                                >
                                    <option value = "ON">Online</option>
                                    <option value = "IP">Presencial</option>
                                </select>
                            </FormGroup>
                        </FormColumn>
                    </FormWrapper>

                    <FormFooter $update = {id ? true : false}>
                        {id && 
                            <Cancel>
                                <Button type="button" style={{backgroundColor: '#F82122'}} onClick={() => removeTalk(id)}>Deletar palestra</Button>
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

    *{
        color: var(--content-neutrals-primary);
    }
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