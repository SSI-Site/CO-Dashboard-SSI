import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import Image from 'next/image';

import useAuth from '../../../hooks/useAuth';

// components
import SecondaryButton from '../../components/SecondaryButton';
import Accordion from '../../components/Accordion';

// assets
import CloseBtn from '../../../public/images/icons/close.svg';
import LogoHorizontal from '../../../public/images/logos/logo_horizontal.svg';

// ==========================================
// CONFIGURAÇÃO DE NAVEGAÇÃO
// Adicione ou remova itens aqui para atualizar ambos os menus (Mobile e Desktop) simultaneamente.
// ==========================================
const NAV_ITEMS = [
    {
        title: 'Presença',
        items: [
            { href: '/presential', label: 'Registrar presença' },
            { href: '/exterminate', label: 'Remover presença' }
        ]
    },
    { href: '/students', label: 'Inscritos' },
    {
        title: 'Sorteio',
        items: [
            { href: '/giveaway', label: 'Realizar sorteio' },
            { href: '/winners', label: 'Lista de ganhadores' }
        ]
    },
    { href: '/speakers', label: 'Palestrantes' },
    { href: '/talks', label: 'Palestras' },
    { href: '/gifts', label: 'Controle de brindes' },
    { href: '/sponsors', label: 'Empresas' }
];

const NavBar = ({ name }) => {
    const { signOut } = useAuth();
    const router = useRouter();
    
    // Estado para controlar a abertura/fechamento do menu lateral
    const [isOpen, setIsOpen] = useState(true);

    // Lida com o processo de logout do usuário
    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Erro ao deslogar:", error);
        }
    }

    // Efeito para ajustar o padding do <main> de acordo com o estado do menu.
    // NOTA: Manipular o DOM diretamente no React não é a melhor prática. 
    // O ideal no futuro seria passar o estado `isOpen` para um Contexto ou Layout wrapper.
    useEffect(() => {
        const main = document.querySelector('main');
        
        // Proteção caso o elemento main ainda não exista na tela
        if (!main) return; 

        if (isOpen) {
            const width = document.documentElement.clientWidth;
            main.style.paddingLeft = width > 994 ? '16rem' : '0';
            main.style.transition = 'padding 200ms ease-in-out';
        } else {
            main.style.marginLeft = '0rem';
            main.style.paddingLeft = '0';
        }
    }, [isOpen]);

    // FUNÇÃO AUXILIAR DE RENDERIZAÇÃO
    const renderNavLinks = () => {
        return NAV_ITEMS.map((item, index) => {
            // Se o item tem 'items' aninhados, renderizamos um Accordion
            if (item.items) {
                return (
                    <Accordion key={index} title={item.title}>
                        {item.items.map((subItem) => (
                            <li key={subItem.href} className={router.pathname === subItem.href ? 'active' : ''}>
                                <Link legacyBehavior href={subItem.href}>
                                    <a>{subItem.label}</a>
                                </Link>
                            </li>
                        ))}
                    </Accordion>
                );
            }

            // Se for um link direto, renderizamos o <li> normal
            return (
                <li key={item.href} className={router.pathname === item.href ? 'active' : ''}>
                    <Link legacyBehavior href={item.href}>
                        <a>{item.label}</a>
                    </Link>
                </li>
            );
        });
    };

    return (
        <>
            {/* NAVBAR MOBILE (Topo) */}
            <NavMobile $isOpen={isOpen}>
                <div className="infos">
                    <div className="logo">
                        <Image
                            src={LogoHorizontal}
                            width={180}
                            height={40}
                            alt="LogoHorizontal"
                            priority 
                        />
                    </div>

                    <div className='hamburguer-wrapper'>
                        <button className='hamburguer-menu' type="button" aria-label='Menu' onClick={() => setIsOpen(!isOpen)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M3 18V16H21V18H3ZM3 13V11H21V13H3ZM3 8V6H21V8H3Z" fill="white"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="routeName">
                    <p>{name}</p>
                </div>
            </NavMobile>

            {/* MENU LATERAL MOBILE (Aberto/Fechado) */}
            <Sidepanel>
                {/* Fundo escuro para fechar ao clicar fora */}
                <div className={isOpen ? 'click-out' : "click-out click-out-hidden"} onClick={() => setIsOpen(false)}></div>
                
                <div className={isOpen ? "sidepanel" : "sidepanel sidepanel-hidden"}>
                    <div className="sidepanel-wrapper">
                        <div className='header-nav'>
                            <h6>Navegação rápida</h6>
                            <div className='close' onClick={() => setIsOpen(!isOpen)}>
                                <Image 
                                    src={CloseBtn}
                                    width={18}
                                    height={18}
                                    alt='Fechar'
                                />
                            </div>
                        </div>

                        <NavigationList>
                            {renderNavLinks()}
                        </NavigationList>
                    </div>

                    <SecondaryButton onClick={handleLogout} className='user-button'>Sair</SecondaryButton>
                </div>
            </Sidepanel>

            {/* MENU LATERAL DESKTOP */}
            <SidepanelDesktop $isOpen={isOpen}>
                <SidepanelWrapper>
                    <div className="logo">
                        <Image
                            alt="Logo"
                            src={LogoHorizontal}
                            width={180}
                            height={40}
                        />
                    </div>

                    <NavigationList>
                        {renderNavLinks()}
                    </NavigationList>
                </SidepanelWrapper>
                
                <SecondaryButton onClick={handleLogout} className='user-button'>Sair</SecondaryButton>
            </SidepanelDesktop>

            {/* NAVBAR DESKTOP (Topo - Botão de Toggle e Título) */}
            <NavDesktop $isOpen={isOpen}>
                <div className="toggle">
                    <button type='button' onClick={() => setIsOpen(!isOpen)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.7274 2C22.3377 2.58328 21.7326 2 21.7326 2L21.7329 5.33351V21.9944L18.4441 22L2 22L2.0003 18.6667L2.00034 2.00021L5.28906 2.00021L21.7274 2ZM18.4441 4.22241H8.57782V19.7778L19.5401 19.7776V4.2222L18.4441 4.22241Z" fill="white"/>
                            <path d="M15.9304 10.5635L14.514 12.0001L15.9304 13.4368L16.7052 14.2221L15.9349 15.0027L15.1551 15.7931L14.3803 15.0079L12.1878 12.7857L11.4127 12.0001L12.1878 11.2146L14.3803 8.99236L15.1553 8.20681L15.9304 8.99236L16.7052 9.7777L15.9336 10.5598L15.9304 10.5635Z" fill="white"/>
                        </svg>
                    </button>
                </div>

                <div className="title">
                    <p>{name}</p>
                </div>
            </NavDesktop>
        </>
    )
}

export default NavBar;

const NavMobile = styled.nav`
    overflow: hidden;   
    display: flex;
    flex-direction: column;
    color: var(--contetn-neutrals-primary);
    margin: 0.5rem 1rem;

    .infos {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 1rem;
        border-radius: 1.5rem;
        background: rgba(43, 43, 43, 0.75);
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
        backdrop-filter: blur(6px);
            
        .logo {
            display: flex;
            img {
                width: 100%;
            }
        }
    }

    .routeName{
        padding: 1.5rem;

        p {
            font: 700 1rem/1.5rem "At Aero Bold";
            color: var(--brand-purple-200);
        }   
    }

    .hamburguer-wrapper {
        width: 3rem;
        height: 3rem;
        background: linear-gradient(to right, var(--background-neutrals-inverse) 50%, transparent 50%);
        background-position: right;
        background-size: 200% 100%;
        transition: 0.15s all ease-out;
    }

    .hamburguer-wrapper:hover {
        background-position: left;

        svg path {
            fill: var(--content-neutrals-inverse);
        }
    }

    .hamburguer-menu {
        background-color: unset;
        border: unset;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        gap: .25rem;
    }

    @media (min-width:995px) {
        display: none;
    }
`

const NavigationList = styled.ul`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    justify-content: center;
    gap: 1.5rem;
    color: var(--content-neutrals-primary);

    li a {
        display: block;
        padding: 0.125rem 0.5rem;
        background: linear-gradient(to right, var(--background-neutrals-primary) 50%, var(--background-neutrals-inverse) 50%);
        background-size: 200%;
        background-position-x: 200%;
        transition: all 0.15s ease-out;
        background-repeat: no-repeat;
        white-space: nowrap;
        line-height: 1.5rem;
        font-weight: 400;
        color: var(--content-neutrals-primary);

        &:hover, &:focus-visible {
            color: var(--content-neutrals-inverse);
            background-position-x: 100%;
        }

        &:focus-visible {
            outline: 2px solid var(--brand-primary);
            outline-offset: 2px;
        }
            
    }

    .active {            
        background: linear-gradient(to right, var(--background-neutrals-inverse)  50%, var(--brand-primary) 50%);
        background-size: 250%;
        background-position: right;
        color: var(--content-neutrals-fixed-white);
        
        a {
            font-family: 'At Aero Bold';
            color: var(--content-neutrals-fixed-white);
        }

        &:hover a, a:focus-visible {
            color: var(--content-neutrals-inverse);
        }
    }
`

const Sidepanel = styled.aside`
    top: 0;
    width: 100%;
    height: 100%;

    .sidepanel-wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 1.5rem;
        height: 100%;
    }

    .header-nav {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
    }
    
    .close {
        padding: 1rem;
        cursor: pointer;       
    }

    .click-out {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.5);
        
        z-index: 17;
    }

    .click-out-hidden {
        display: none
    }

    .sidepanel {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        overflow-y: scroll;
        height: 100%;
        width: 100%;
        position: fixed;
        z-index: 17;
        top: 0;
        right: 0;
        background: rgba(43, 43, 43);
        transition: all ease-out 0.15s;
        padding: 1.5rem 1rem;
        gap: 1.5rem;

        @media (min-width:648px) {
            width: 50%;
        }

        h6 {
            color: var(--content-neutrals-primary);
        }

        .profile-side-bar {
            display: flex;
            align-items: center;
            width: 100%;
            height: 44px;
            flex-direction: row;
            justify-content: space-between;
    
            a {
                display: flex;
                width: 100%;
                justify-content: space-between;
                padding: 0 0.25rem;
            
                &:hover, &:focus-visible {
                    color: var(--content-neutrals-primary);
                    background-position-x: 100%;

                    p {
                        color: var(--content-neutrals-primary);
                    }

                    svg path {
                        fill: var(--brand-primary);
                    }
                }
                
                &:focus-visible {
                    outline: 2px solid var(--brand-primary);
                    outline-offset: 2px;
                }
            }
    
            .profile-content{
                width: fit-content;
                height: 2.75rem;
                padding: 0;
                gap: 0.5rem;
                display: flex;
                flex-direction: row;
                align-items: center;
            }
    
            .user-pic-container {
                background: var(--brand-primary);
                width: 36px;
                height: 36px;
                padding: 0;
                gap: 0.5rem;
                display: flex;
                justify-content: center;
                align-items: center;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            p {
                text-align: left;
                font-family: 'AT Aero Bold';
                font-size: 1rem;
            }
    
            .see-profile {
                display: flex;
                flex-direction: row;
                gap: 0.5rem;
                align-items: center;
            }
        }
        
        .user-button {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.2rem 1rem;
            width: 100%;

            p {
                font-family: 'AT Aero Bold';
                font-weight: 700;
            }
        }
    }

    .sidepanel-hidden {
        right: -999px;
    }

    @media (min-width:995px) {
        display: none;
    }
`

const SidepanelDesktop = styled.aside`
    @media screen and (max-width: 994px) {
        display: none;
    }
    width: 16rem;
    height: 100%;
    padding: 1.5rem 1rem;
    position: fixed;
    
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    left: 0;
    top: 0;

    .logo {
        img {
            width: auto;
            height: 3rem;
        }
    }
    
    color: var(--content-neutrals-primary);
    background: rgba(43, 43, 43);
    transition: all 200ms ease-in-out;

    ${props => !props.$isOpen && css`
        left: -260px;
    `}
`

const SidepanelWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`

const NavDesktop = styled.nav`
    @media screen and (max-width: 994px) {
        display: none;
    }

    display: flex;
    position: sticky;
    align-items: center;
    transition: all 200ms ease-in-out;
    color: var(--content-neutrals-primary);

    .title {
        padding: 1rem;

        p {
            font: 700 1rem/1.5rem "At Aero Bold";
            color: var(--brand-primary-light);

            @media (min-width: 995px) {
                font-size: 1.5rem;
            }
        }
    }

    .toggle {
        padding: 1rem;

        button {
            padding: 0.75rem;
            border: none;

            background: linear-gradient(to right, var(--background-neutrals-inverse) 50%, transparent 50%);
            background-position: right;
            background-size: 250% 100%;
            transition: 0.15s all ease-out;

            svg path {
                fill: var(--content-neutrals-primary);
            }

            &:hover{
                background-position: left;

                svg path {
                    fill: var(--content-neutrals-inverse);
                }
            }
        }
    }
`