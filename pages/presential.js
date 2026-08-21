import { React, useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { Html5QrcodeScanner } from 'html5-qrcode';

// Custom Hooks e Serviços
import useAuth from '../hooks/useAuth';
import saphira from '../services/saphira';

// Componentes da Infraestrutura e UI
import Meta from '../src/infra/Meta';
import NavBar from '../src/patterns/base/Nav';
import Button from '../src/components/Button';

// Ícone do QR Code
const QRcodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3.09048 11.25C2.61254 11.25 2.2251 10.8625 2.2251 10.3846V3.06534C2.2251 2.5874 2.61254 2.19995 3.09048 2.19995H10.3847C10.8627 2.19995 11.2501 2.5874 11.2501 3.06534V10.3846C11.2501 10.8625 10.8627 11.25 10.3847 11.25H3.09048ZM4.5001 8.94995H8.9751V4.49995H4.5001V8.94995ZM3.09048 21.775C2.61254 21.775 2.2251 21.3875 2.2251 20.9096V13.6153C2.2251 13.1374 2.61254 12.75 3.09048 12.75H10.3847C10.8627 12.75 11.2501 13.1374 11.2501 13.6153V20.9096C11.2501 21.3875 10.8627 21.775 10.3847 21.775H3.09048ZM4.5001 19.5H8.9751V15.025H4.5001V19.5ZM13.6155 11.25C13.1375 11.25 12.7501 10.8625 12.7501 10.3846V3.06534C12.7501 2.5874 13.1375 2.19995 13.6155 2.19995H20.9347C21.4127 2.19995 21.8001 2.5874 21.8001 3.06534V10.3846C21.8001 10.8625 21.4127 11.25 20.9347 11.25H13.6155ZM15.0501 8.94995H19.5001V4.49995H15.0501V8.94995ZM19.5501 21.775V19.525H21.8001V21.775H19.5501ZM12.7501 15V12.75H15.0251V15H12.7501ZM15.0251 17.25V15H17.2501V17.25H15.0251ZM12.7501 19.525V17.25H15.0251V19.525H12.7501ZM15.0251 21.775V19.525H17.2501V21.775H15.0251ZM17.2501 19.525V17.25H19.5501V19.525H17.2501ZM17.2501 15V12.75H19.5501V15H17.2501ZM19.5501 17.25V15H21.8001V17.25H19.5501Z" fill="currentColor"/>
    </svg>
);

// Helper centralizado para disparar os alertas
const showFeedbackAlert = (icon, title, text = "") => {
    return Swal.fire({
        icon,
        title,
        text,
        background: 'var(--background-neutrals-secondary)',
        color: 'var(--content-neutrals-primary)',
        confirmButtonColor: "var(--brand-primary)",
        borderRadius: '2rem',
        backdrop: `rgba(0,0,0,0.8)`
    });
};

const Presential = () => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    
    // Configuração do form e seus controles
    const { register, control, getValues, setValue, setFocus, formState: { errors }, handleSubmit } = useForm();
    
    const [isLoading, setIsLoading] = useState(true);
    const [talks, setTalks] = useState([]);
    const [showScanner, setShowScanner] = useState(false);

    // LÓGICA DE AUTENTICAÇÃO E INICIALIZAÇÃO    
    
    // Redireciona usuários não autenticados para a home
    useEffect(() => {
        if (isAuthenticated === false) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

    // Busca as palestras disponíveis assim que o componente monta
    useEffect(() => {
        const fetchTalks = async () => {
            setIsLoading(true);
            try {
                const { data } = await saphira.getLectures();
                if (data) setTalks(data);
            } catch (err) {
                console.error("Erro ao buscar palestras:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTalks();
    }, []);

    // TRATAMENTO DOS DADOS DAS PALESTRAS (TALKS)
    const availableTalks = useMemo(() => {
        return talks
            .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
            .filter(talk => {
                // TODO: Para produção, descomentar as validações de data e hora para filtrar palestras antigas
                // const today = new Date().toDateString();
                // const talkDate = new Date(talk.start_time).toDateString();
                // return today === talkDate; 
                return true;
            })
            .filter(talk => {
                // const current_time = new Date();
                // const start_timeOffset = new Date(new Date(talk.start_time).getTime() + 20 * 60000);
                // return start_timeOffset > current_time;
                return true;
            });
    }, [talks]);

    const talkOptions = useMemo(() => {
        return availableTalks.map(talk => ({
            value: talk.id,
            label: `${talk.id} - ${talk.title} - ${new Date(talk.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
        }));
    }, [availableTalks]);


    // FLUXO DO QR CODE SCANNER
    const handleToggleScanner = () => {
        if (!showScanner) {
            const currentLectureId = getValues('lectureId');
            
            // Exige que uma palestra seja selecionada ANTES de abrir a câmera
            if (!currentLectureId) {
                showFeedbackAlert('warning', 'Atenção', 'Selecione uma palestra primeiro para ler o QR Code!');
                return; 
            }
            setShowScanner(true);
        } else {
            setShowScanner(false);
        }
    };

    // Controla o ciclo de vida do componente da câmera
    useEffect(() => {
        if (!showScanner) return;

        const scanner = new Html5QrcodeScanner(
            "reader", 
            { fps: 10, qrbox: { width: 250, height: 250 } }, 
            false
        );

        scanner.render(
            async (decodedText) => {
                const code = decodedText.trim(); 

                // Validação de segurança e formato
                if (code.length !== 3) {
                    scanner.clear(); // Desliga a câmera para evitar repetição do alerta
                    setShowScanner(false);
                    showFeedbackAlert('error', 'QR Code Inválido', `O código lido ("${code}") é invalido.`);
                    return; 
                }

                // Fluxo de sucesso: desliga câmera e preenche o formulário
                scanner.clear(); 
                setShowScanner(false); 
                setValue('document', code); // Usa a ref do react-hook-form para preencher o input sem forçar re-render total

                const currentLectureId = getValues('lectureId');
                if (currentLectureId) {
                    await onSubmit({ lectureId: currentLectureId, document: code });
                }
            },
            (errorMessage) => {
                // Erros de leitura contínua caem aqui. É ignorado propositalmente 
                // pois ocorrem centenas de vezes por segundo enquanto a câmera tenta focar.
            }
        );

        // Cleanup: Garante que a câmera e os workers sejam encerrados ao fechar/desmontar
        return () => {
            scanner.clear().catch(error => console.error("Falha ao limpar o scanner", error));
        };
    }, [showScanner, setValue, getValues]); // O onSubmit precisa ser capturado via closure atualizado ou usar form refs


    // SUBMISSÃO DO FORMULÁRIO (VIA CÓDIGO OU SCAN)
    const onSubmit = async (data) => {
        setIsLoading(true); 

        try {
            await saphira.addPresenceToUser(data.lectureId, data.document);
            setValue('document', ''); // Limpa o input após sucesso
            
            await showFeedbackAlert('success', `Presença adicionada para ${data.document}`);
        } catch (err) {
            const errorMessage = err.response?.data?.talk 
                ? "Palestra não encontrada" 
                : (err.response?.data || "Ocorreu um erro desconhecido");

            await showFeedbackAlert('error', 'Falha na adição!', errorMessage);
        } finally {      
            setIsLoading(false); 
            
            // Timeout de 50ms garante que o input renderize novamente antes do focus agir
            setTimeout(() => {
                setFocus('document');
            }, 50);
        }
    };

    // Bloqueia a renderização enquanto a autenticação está sendo verificada
    if (isAuthenticated === null) return null;

    return (
        <>
            <Meta title='COSSI 2026 | Registrar presença' />
            <NavBar name={"Registrar Presença"} />

            <PresenceWrapper>
                <div className='section-container'>
                    <h5>Registrar presença</h5>

                    {/* Formulário principal */}
                    {isAuthenticated && (
                        <FormWrapper>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {!isLoading ? (
                                    <>
                                        <HideableSection $hidden={showScanner}>
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
                                                            value={talkOptions.find(option => option.value === field.value) || null}
                                                            onChange={(selectedOption) => field.onChange(selectedOption.value)}
                                                        />
                                                    )}
                                                />
                                            </div>

                                            <InputBox>
                                                <label htmlFor='document'>Código do inscrito:</label>
                                                <div className='form-input'>
                                                    <input 
                                                        id='document' 
                                                        type='text' 
                                                        placeholder='Insira o documento' 
                                                        className={`${errors.document && 'error-border'}`}
                                                        {...register("document", { required: true, minLength: 3 })} 
                                                    />
                                                </div>
                                                {errors.document && <ErrorMessage>Documento inválido</ErrorMessage>}
                                            </InputBox>

                                            <Button> Registrar </Button>
                                        </HideableSection>

                                        <ScannerWrapper $isScanning={showScanner}>
                                            <Button 
                                                type="button" 
                                                onClick={handleToggleScanner}
                                            >
                                                {showScanner ? 'Cancelar Leitura' : 'Ler QR Code'}
                                                {!showScanner && <QRcodeIcon />}
                                            </Button>
                                            
                                            {showScanner && <div id="reader"></div>}
                                        </ScannerWrapper>
                                    </>
                                ) : (
                                    <Loading>
                                        <img src='./loading.svg' alt='SSI 2026 - Loading' />
                                    </Loading>
                                )}
                            </form>
                        </FormWrapper>
                    )}
                </div>
            </PresenceWrapper>
        </>
    );
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

const HideableSection = styled.div`
    width: 100%;
    display: ${props => props.$hidden ? 'none' : 'flex'};
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    button {
        margin-top: 1rem;
    }
`

const ScannerWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    button {
        background: none;
        border-radius: 0.75rem;
        border: 2px solid var(--content-neutrals-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    button:hover {
        background-color: var(--content-neutrals-primary);
        color: var(--content-neutrals-inverse);
    }

    #reader {
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
        background-color: white;
        border-radius: 1rem;
        overflow: hidden;
        border: 2px solid var(--brand-primary);
        color: black; 
    }
    
    #reader button {
        cursor: pointer;
        padding: 0.5rem 1rem;
    }
`
