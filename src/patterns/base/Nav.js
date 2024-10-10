import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import useAuth from '../../../hooks/useAuth';

// components
import SecondaryButton from '../../components/SecondaryButton';

// assets
import CloseBtn from '../../../public/images/icons/close.svg';
import LogoHorizontal from '../../../public/images/logos/logo_horizontal.svg';

const pages = {
    "/presential": 1,
    "/query": 2,
    "/token": 3,
    "/giveaway": 4,
    "/registered": 5,
    "/exterminate": 6
}

const Nav = () => {

    const { signOut } = useAuth();
    const router = useRouter();
    
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Erro ao deslogar:", error);
        }
    }

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    return (
        <>
            <NavWrapper>
                <div>
                    {/* Logo que redireciona para a home */}
                    <Link legacyBehavior href='/' passHref>
                        <a>
                            <img
                                src={LogoHorizontal}
                                width={180}
                                height={45}
                                alt='Semana de Sistemas de Informação'
                            />
                        </a>

                    </Link>

                    {/* Navbar para Mobile */}
                    <NavMobile $isOpen={isOpen}>

                        <div className='hamburguer-wrapper'>
                            <button className='hamburguer-menu' type="button" aria-label='Menu' onClick={() => setIsOpen(!isOpen)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M3 18V16H21V18H3ZM3 13V11H21V13H3ZM3 8V6H21V8H3Z" fill="white"/>
                                </svg>
                            </button>
                        </div>

                    </NavMobile>

                    {/* Navbar para Desktop */}
                    <NavDesktop $currentPage={router.pathname}>
                        <NavigationList>
                            <li className = {router.pathname == '/presential' ? 'active': ''}>
                                <Link legacyBehavior href="/presential"><a>Registrar presença</a></Link>
                                <div></div>
                            </li>

                            <li className = {router.pathname == '/query' ? 'active': ''}>
                                <Link legacyBehavior href="/query"><a>Consultar presença</a></Link>
                                <div></div>
                            </li>

                            <li className = {router.pathname == '/token' ? 'active': ''}>
                                <Link legacyBehavior href="/token"><a>Token</a></Link>
                                <div></div>
                            </li>

                            <li className = {router.pathname == '/giveaway' ? 'active': ''}>
                                <Link legacyBehavior href="/giveaway"><a>Sorteio</a></Link>
                                <div></div>
                            </li>

                            <li className = {router.pathname == '/registered' ? 'active': ''}>
                                <Link legacyBehavior href="/registered"><a>Lista de inscritos</a></Link>
                                <div></div>
                            </li>

                            <li className = {router.pathname == '/exterminate' ? 'active': ''}>
                                <Link legacyBehavior href="/exterminate"><a>Xterminate</a></Link>
                                <div></div>
                            </li>
                            <SecondaryButton onClick={handleLogout} className='user-button'>Sair</SecondaryButton>
                        </NavigationList>
                    </NavDesktop>

                </div>
            </NavWrapper>
            <Sidepanel>
                <div className={isOpen ? 'click-out' : "click-out click-out-hidden"} onClick={() => setIsOpen(false)}>
                </div>
                <div className = {isOpen ? "sidepanel" : "sidepanel sidepanel-hidden"}>
                    <div className = "sidepanel-wrapper">
                        <div className = 'header-nav'>
                            <h6>Navegação rápida</h6>
                            <div className = 'close' onClick={() => setIsOpen(!isOpen)}>
                                <img 
                                    src={CloseBtn}
                                    width={18}
                                    height={18}
                                    alt='Fechar'
                                />
                            </div>
                        </div>

                        <NavigationList>
                            <li onClick={() => setIsOpen(false)} className = {router.pathname == '/presential' ? 'active': ''}>
                                <Link legacyBehavior href="/presential"><a>Registrar presença</a></Link>
                            </li>

                            <li onClick={() => setIsOpen(false)} className = {router.pathname == '/query' ? 'active': ''}>
                                <Link legacyBehavior href="/query"><a>Consultar presença</a></Link>
                            </li>

                            <li onClick={() => setIsOpen(false)} className = {router.pathname == '/token' ? 'active': ''}>
                                <Link legacyBehavior href="/token"><a>Token</a></Link>
                            </li>

                            <li onClick={() => setIsOpen(false)} className = {router.pathname == '/giveaway' ? 'active': ''}>
                                <Link legacyBehavior href="/giveaway"><a>Sorteio</a></Link>
                            </li>

                            <li onClick={() => setIsOpen(false)} className = {router.pathname == '/registered' ? 'active': ''}>
                                <Link legacyBehavior href="/registered"><a>Lista de inscritos</a></Link>
                            </li>

                            <li onClick={() => setIsOpen(false)} className = {router.pathname == '/exterminate' ? 'active': ''}>
                                <Link legacyBehavior href="/exterminate"><a>Xterminate</a></Link>
                            </li>
                        </NavigationList>
                    </div>

                    <SecondaryButton onClick={handleLogout} className='user-button'>Sair</SecondaryButton>
                </div>
            </Sidepanel>
        </>
    )
}

export default Nav;


const NavWrapper = styled.div`
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /*max-width: 1576px;*/
    max-height: 5rem;
    margin: auto;
    z-index: 11;
    padding: 1.5rem 1rem; 
    background-color: var(--color-neutral);
    border-bottom: 1px solid var(--color-neutral-secondary);

    > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        max-width: 1328px; // 1920px - (344px * 2)
        height: 100%;

        a {
            display: flex;
            align-items: center;
            justify-content: center;

            &:focus-visible {
                outline: 2px solid var(--color-primary);
                outline-offset: 2px;
            }
        }
    }

    @media (min-width:1300px) {
        padding-block: 1rem;
        justify-content: center;
        box-shadow: unset;
        padding-inline: 6.75rem;
    }
`

const NavMobile = styled.nav`
    overflow: hidden;   

    .hamburguer-wrapper {
        width: 3rem;
        height: 3rem;
        background: linear-gradient(to right, var(--color-neutral-50) 50%, transparent 50%);
        background-position: right;
        background-size: 202% 100%;
        transition: 0.15s all ease-out;
    }

    .hamburguer-wrapper:hover {
        background-position: left;

        svg path {
            fill: var(--color-neutral);
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

    li a {
        display: block;
        padding: 0.125rem 0.5rem;
        background-color: transparent;
        background-image: linear-gradient(to right, var(--color-neutral-50), var(--color-neutral-50));
        background-size: 200%;
        background-position-x: 200%;
        transition: all 0.15s ease-out;
        background-repeat: no-repeat;
        white-space: nowrap;
        line-height: 1.5rem;
        font-weight: 400;

        &:hover, &:focus-visible {
            color: var(--color-neutral);
            background-position-x: 100%;
        }

        &:focus-visible {
            outline: 2px solid var(--color-primary);
            outline-offset: 2px;
        }
            
    }

    .active {            
        background: linear-gradient(to right, var(--color-neutral-50) 50%, var(--color-primary) 50%);
        background-size: 250% 100%;
        background-position: right;
        
        a {
            font-family: 'At Aero Bold';
        }

        &:hover a, a:focus-visible {
            color: var(--color-primary);
        }
    }
`

const Sidepanel = styled.div`
    /* position: fixed; */
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
        background-color: var(--color-neutral-800);
        transition: all ease-out 0.15s;
        padding: 1.5rem 1rem;
        gap: 1.5rem;

        @media (min-width:648px) {
            width: 50%;
        }

        h6 {
            color: #FFF;
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
                    color: var(--color-neutral);
                    background-position-x: 100%;

                    p {
                        color: var(--color-neutral);
                    }

                    svg path {
                        fill: var(--color-primary);
                    }
                }
                
                &:focus-visible {
                    outline: 2px solid var(--color-primary);
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
                background: var(--color-primary);
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

const NavDesktop = styled.nav`
    display: none;
    margin-left: auto;

    @media (min-width:995px) {
        display: flex;
        
        ul {
            flex-direction: row;
            align-items: center;
            justify-content: unset;
            gap: 1rem;
        }
        
        .profile-container {
            background-color: var(--color-neutral-800);

            .profile-content {
                gap: 0.5rem;
                display: flex;
                flex-direction: row;
                padding: 0.25rem;

                &:hover, &:focus-visible {
                    p {
                        color: var(--color-neutral);
                    }
                }
            }

            .user-pic-container {
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

            &:hover, &:focus-visible {
                background: var(--color-neutral-800);
            }
        }        
    }
`