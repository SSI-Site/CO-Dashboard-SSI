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
    "/exterminate": 5
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
        <NavWrapper>
            <div>
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

                            <ul>
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
                                    <Link legacyBehavior href="/giveaway" ><a>Sorteio</a></Link>
                                </li>

                                <li onClick={() => setIsOpen(false)} className = {router.pathname == '/exterminate' ? 'active': ''}>
                                    <Link legacyBehavior href="/exterminate" ><a>Xterminate</a></Link>
                                </li>
                            </ul>
                        </div>

                        <SecondaryButton onClick={handleLogout} className='user-button'>Sair</SecondaryButton>
                    </div>

                    <div className='hamburguer-wrapper'>
                        <button className='hamburguer-menu' type="button" aria-label='Menu' onClick={() => setIsOpen(!isOpen)}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>

                </NavMobile>

                {/* Navbar para Desktop */}
                <NavDesktop $currentPage={router.pathname}>
                    <ul>
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
                            <Link legacyBehavior href="/giveaway" ><a>Sorteio</a></Link>
                            <div></div>
                        </li>

                        <li className = {router.pathname == '/exterminate' ? 'active': ''}>
                            <Link legacyBehavior href="/exterminate" ><a>Xterminate</a></Link>
                            <div></div>
                        </li>
                        <SecondaryButton onClick={handleLogout} className='user-button'>Sair</SecondaryButton>
                    </ul>
                </NavDesktop>

            </div>
        </NavWrapper>
    )
}

export default Nav;


const NavWrapper = styled.div`
    position:sticky;
    top:0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /*max-width: 1576px;*/
    margin: auto;
    z-index: 11;
    padding: 1.5rem 1rem; 
    background-color: var(--color-neutral);

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

    ul {
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
            transition: all 100ms ease-out;
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

    .hamburguer-wrapper {
        padding: .75rem;
        background: linear-gradient(to right, var(--color-neutral-50) 50%, transparent 50%);
        background-position: right;
        background-size: 202% 100%;
        transition: 100ms all ease-out;
    }

    .hamburguer-wrapper:hover {
        background-position: left;

        span {
            background-color: #161616;
        }
    }

    .hamburguer-menu {
        background-color: unset;
        border: unset;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 1.5rem;
        gap: .25rem;

        span {
            display: block;
            height: 3px;
            width: 100%;
            background-color: #FFF;
        }
    }

    .click-out {
        position:fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.5);
        
        z-index: 9;
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
        z-index: 10;
        top: 0;
        right: 0;
        background-color: var(--color-neutral-800);
        transition: all ease-out 100ms;
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
                width: 6.625rem;
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