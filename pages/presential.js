import { useRouter } from 'next/router';
import { React, useEffect, useState, useMemo } from 'react';
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select';
import styled from 'styled-components';
import Swal from 'sweetalert2';

import useAuth from '../hooks/useAuth';
import saphira from '../services/saphira';
import Meta from '../src/infra/Meta';
import NavBar from '../src/patterns/base/Nav';

// components
import Button from '../src/components/Button';

const Presential = () => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { register, control, getValues, setError, setValue, setFocus, formState: { errors }, handleSubmit } = useForm();
    const [accessAllowed, setAccessAllowed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [talks, setTalks] = useState([])

    const onSubmit = async (data) => {
        setIsLoading(true); // Bloqueia o formulário e mostra o loading

        try {
            await saphira.addPresenceToUser(data.lectureId, data.document);

            setValue('document', '');  // Limpa o campo de código
            
            // Mostra o alerta de sucesso e espera o usuário fechá-lo (await)
            await Swal.fire({
                icon: 'success',
                title: `Presença adicionada para ${data.document}`,
                showConfirmButton: true,
                confirmButtonText: "Ok!",
                confirmButtonColor: "#151023"
            });

        } catch (err) {
            // Prepara a mensagem de erro
            const errorMessage = err.response?.data?.talk 
                ? "Palestra não encontrada" 
                : (err.response);

            // Mostra o alerta de erro e espera o usuário fechá-lo (await)
            await Swal.fire({
                icon: 'error',
                title: 'Falha na adição!',
                text: err.response.data.talk ? `Palestra não encontrada` : err.response.data,
                showConfirmButton: true,
                confirmButtonText: "Ok",
                confirmButtonColor: "#151023"
            });

        } finally {      
            setIsLoading(false);  // Remove o loading
            
            // Timeout para dar tempo do react carregar o input ante de setar o foco nele
            setTimeout(() => {
                setFocus('document');// Devolve o foco para o campo de documento
            }, 50);
        }
    };

    const checkAuthentication = () => {
        if (isAuthenticated === null) {
            return;
        }

        if (isAuthenticated) {
            setAccessAllowed(true);
        } else {
            setAccessAllowed(false);
            router.push("/");
        }
    }

    const getTalks = async () => {
        setIsLoading(true)
        try {
            const { data } = await saphira.getLectures()
            if (data) setTalks(data)
        }
        catch (err) {
            console.log("Houve um erro:", err)
        }
        finally {
            setIsLoading(false)
        }
    }

    const availableTalks = useMemo(() => {
        return talks
            .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
            .filter(talk => {
                const today = new Date().toDateString();
                const talkDate = new Date(talk.start_time).toDateString();
                // return today === talkDate; // Retorna true ou false
                return true
            })
            .filter(talk => {
                const current_time = new Date();
                const start_timeOffset = new Date(new Date(talk.start_time).getTime() + 20 * 60000);
                // return start_timeOffset > current_time;
                return true;
            });
    }, [talks]);

    // Transforma as palestras filtradas no formato que o react-select entende
    const talkOptions = useMemo(() => {
        return availableTalks.map(talk => ({
            value: talk.id,
            label: `${talk.id} - ${talk.title} - ${new Date(talk.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
        }));
    }, [availableTalks]);

    useEffect(() => {
        checkAuthentication();
    }, [isAuthenticated, router]);

    useEffect(() => {
        getTalks();
    }, []);

    return (
        <>
            <Meta title='COSSI 2026 | Registrar presença' />

            <NavBar name={"Registrar Presença"} />

            <PresenceWrapper>
                <div className='section-container'>

                    <h5>Registrar presença</h5>

                    {accessAllowed &&
                        <FormWrapper>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {!isLoading &&
                                    <>
                                        <label>ID da palestra:</label>
                                        <div className="form-input select-input">
                                            <Controller
                                                name="lectureId"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        options={talkOptions}
                                                        styles={customSelectStyles}
                                                        placeholder="Selecione uma palestra..."
                                                        noOptionsMessage={() => "Nenhuma palestra disponível no momento"}
                                                        
                                                        // Mapeia os dados entre o react-select e o react-hook-form
                                                        value={talkOptions.find(option => option.value === field.value) || null}
                                                        onChange={(selectedOption) => {
                                                            // Manda apenas o ID para o seu onSubmit(data)
                                                            field.onChange(selectedOption.value);
                                                        }}
                                                    />
                                                )}
                                            />
                                        </div>


                                        <InputBox>
                                            <label htmlFor='document'>Código do inscrito:</label>
                                            <div className='form-input'>
                                                <input id='document' type='text' placeholder='Insira o documento' className={`${errors.document && 'error-border'}`}
                                                    {...register("document", { required: true, minLength: 3 })} />
                                            </div>
                                            {errors.document && <ErrorMessage>Documento inválido</ErrorMessage>}
                                        </InputBox>

                                        <Button> Registrar </Button>
                                    </>
                                }

                                {isLoading &&
                                    <Loading>
                                        <img src='./loading.svg' alt='SSI 2026 - Loading' />
                                    </Loading>
                                }
                            </form>
                        </FormWrapper>
                    }

                </div>
            </PresenceWrapper>
        </>
    )
}

export default Presential;

// Estilos customizados para o react-select
const customSelectStyles = {
    // O container geral que engloba tudo
    container: (provided) => ({
        ...provided,
        width: '100%',
        height: '100%',
        
    }),
    
    // A caixa principal onde o valor escolhido aparece
    control: (provided, state) => ({
        ...provided,
        backgroundColor: 'transparent',
        border: 'none',
        boxShadow: 'none',
        cursor: 'pointer',
        padding: '0.5rem',
        minHeight: '100%',

    }),
    
    // O texto da opção que já foi selecionada
    singleValue: (provided) => ({
        ...provided,
        color: 'var(--content-neutrals-primary)',
        font: "400 1rem/1.5rem 'AT Aero'",
    }),

    // O menu suspenso (dropdown) que abre
    menu: (provided) => ({
        ...provided,
        backgroundColor: 'var(--background-neutrals-tertiary)',
        width: '100%',
        border: '2px solid var(--outline-neutrals-primary)',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        zIndex: 999 // Garante que o menu flutue por cima do resto da página
    }),

    // Cada item da lista
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused 
            ? 'var(--state-layers-neutrals-primary-012)' // Cor quando passa o mouse (hover)
            : 'transparent',
        cursor: 'pointer',
        padding: '0.75rem',
        transition: 'background-color 0.2s ease',
        
        ':active': {
            backgroundColor: 'var(--state-layers-neutrals-primary-012)',
        }
    }),

    // Customiza a barra de rolagem
    menuList: (provided) => ({
        ...provided,
        maxHeight: '15rem', // Altura máxima antes de rolar
        '::-webkit-scrollbar': {
            width: '6px',
        },
        '::-webkit-scrollbar-track': {
            background: 'transparent',
        },
        '::-webkit-scrollbar-thumb': {
            background: 'var(--content-neutrals-primary)',
            borderRadius: '10px',
        },
    }),
    
    // As setinhas da direita e o X de limpar
    indicatorSeparator: () => ({ display: 'none' }), // Some com a linha divisória

    dropdownIndicator: (provided) => ({
        ...provided,
        color: 'var(--content-neutrals-primary)',
        '&:hover': {
            color: 'var(--brand-primary)',
        }
    }),
};

const Loading = styled.figure`
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 50%;
        max-width: 250px;
    }
`

const PresenceWrapper = styled.section`
    padding: 1rem; 
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--content-neutrals-primary);

    .section-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: var(--background-neutrals-secondary); 
        padding: 1rem;
        gap: 1.5rem;
        border-radius: 1rem;

        h5 {
            width: 100%;
        }

        @media (min-width: 800px) {
            max-width: 41rem;
            padding: 3rem;
            border-radius: 2rem;
        }
    }
`

const ErrorMessage = styled.span`
    color: var(--color-invalid);
    text-decoration: underline;
    position: absolute;
    bottom: -1.1rem;
`

const FormWrapper = styled.div`
    --color-invalid: var(--content-accent-red);
    --color-valid: var(--content-accent-green);
    width: 100%;

    label {
        font: 700 1.125rem/1.5rem 'AT Aero Bold';
        width: 100%;   
    }

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 1rem;

        p {
            font: 700 1rem/1.5rem 'AT Aero Bold';
            text-align: left;
            width: 100%;
        }

        button {
            margin-top: .5rem;
        }
    }

    .form-input {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 4rem;
        padding: 0.5rem;
        margin-left: -4px;

        border: 2px solid var(--content-neutrals-primary);
        border-radius: 0.75rem;
        background: transparent;
        background-clip: padding-box;
        color: var(--content-neutrals-primary);

        &:has(input[type=text]:focus):not(:has(.error-border)):not(:has(.token-registered)) {
            border-color: var(--brand-primary);
        }

        &:has(input[type=password]:focus):not(:has(.error-border)):not(:has(.token-registered)) {
            border-color: var(--brand-primary);
        }

        &:has(.error-border) {
            border-color: var(--color-invalid);
        }

        &:has(.token-registered) {
            border-color: var(--color-valid);
        }

        input[type=text], input[type=password],  select {
            width: 95%;
            border: none;
            height: 100%;
            background-color: transparent;
            color: var(--content-neutrals-primary);
            font: 400 1rem/1.5rem 'AT Aero';
        }

        option{
            background-color: var(--background-neutrals-secondary);
            color: var(--content-neutrals-primary);
        }

        ::placeholder {
            color: var(--content-neutrals-primary);
            font: 400 1rem/1.5rem 'AT Aero';
        }

        ::-ms-input-placeholder {
            color: var(--content-neutrals-primary);
            font: 400 1rem/1.5rem 'AT Aero';
        }
    }

    .select-input {
        padding: 0;
    }

    /* Firefox */
    input[type=number] {
        -moz-appearance: textfield;
    }

    span {
        font: 400 0.875rem/1rem 'AT Aero Bold';
        color: var(--color-invalid);
    }
`

const InputBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;

    label {
        font: 700 1.125rem/1.5rem 'AT Aero Bold';
        width: 100%;
        margin-bottom: .5rem;
    }
`