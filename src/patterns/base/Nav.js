import { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useRouter } from 'next/router';
import Link from 'next/link';

import useAuth from '../../../hooks/useAuth';

// assets
import LogoPrincipal from '../../../public/images/logos/logo_principal.svg';
import CloseBtn from '../../../public/images/icons/close.svg';

const pages = {
    "/presential": 1,
    "/token": 2,
    "/giveaway": 3,
    "/query": 4,
}

const Nav = () => {

    const { user } = useAuth();
    const router = useRouter();
    
    const [isOpen, setIsOpen] = useState(false);

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
                
            {/* Logo que redireciona para a home */}
            <div>
                <a className="logo-container">
                    <img src={LogoPrincipal} alt="SSI logo" />
                    <p className='text-small'>
                        Semana de Sistemas de Informação 2024
                    </p>
                </a>
            </div>
            
            {/* Navbar para Desktop */}
            <NavDesktop $currentPage={router.pathname}>
                <ul>
                    <li>
                        <Link legacyBehavior href="/presential"><a>Presencial</a></Link>
                        <div></div>
                    </li>

                    <li>
                        <Link legacyBehavior href="/token"><a>Token</a></Link>
                        <div></div>
                    </li>

                    <li>
                        <Link legacyBehavior href="/giveaway" ><a>Sorteio</a></Link>
                        <div></div>
                    </li>

                    <li>
                        <Link legacyBehavior href="/query"><a>Consulta</a></Link>
                        <div></div>
                    </li>
                </ul>
            </NavDesktop>

            {/* Navbar para Mobile */}
            <NavMobile $isOpen={isOpen} $currentPage={router.pathname}>
                <div className={isOpen ? "sidepanel" : "sidepanel sidepanel-hidden"}>

                    <ul>
                        <li onClick={() => setIsOpen(false)}>
                            <Link legacyBehavior href="/presential"><a>Presencial</a></Link>
                            <div></div>
                        </li>

                        <li onClick={() => setIsOpen(false)}>
                            <Link legacyBehavior href="/token"><a>Token</a></Link>
                            <div></div>
                        </li>

                        <li onClick={() => setIsOpen(false)}>
                            <Link legacyBehavior href="/giveaway"><a>Sorteio</a></Link>
                            <div></div>
                        </li>

                        <li onClick={() => setIsOpen(false)}>
                            <Link legacyBehavior href="/query"><a>Consulta</a></Link>
                            <div></div>
                        </li>
                    </ul>

                    <div className='close-btn' onClick={() => setIsOpen(!isOpen)}>
                        <div className='close'>
                            <img src={CloseBtn} alt='Botão de fechar'></img>
                        </div>
                        <p className='text-small'>Fechar</p>
                    </div>
                </div>

                <button className='hamburguer-menu' type="button" onClick={() => setIsOpen(!isOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </NavMobile>

            </div>
        </NavWrapper>
    )
}

export default Nav;


const NavWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-inline: 1rem;
    position: fixed;
    width: 100%;
    height: 3.75rem;
    z-index: 10;
    background-color: var(--color-neutral-900);
    box-shadow: 0px 5px 24px 14px rgba(16,3,26,0.38);

    > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        max-width: 1440px;
        height: 100%;
    }

    .logo-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 14rem;
        gap: 1rem;

        img {
            height: 2.75rem;
        }
    }

    .text-small {
        font: 400 0.875rem/1.125rem 'Space_Mono_Bold';
        color: var(--color-neutral-50);
    }

    @media (min-width:800px) {
        position: unset;
        height: 3.75rem;
        z-index: unset;
        justify-content: center;
        box-shadow: unset;
        padding-inline: 6.75rem;
    }
`

const NavMobile = styled.nav`
    overflow: hidden;

    .hamburguer-menu {
        background-color: unset;
        border: unset;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 1.375rem;
        width: 2rem;

        span {
            display: block;
            height: 3px;
            width: 100%;
            background: #FFF;
            border-radius: 12px;
            transition: all 0.3s ease;
        }
    }

    .sidepanel {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        height: 100%;
        width: 200px;
        min-width: 40%;
        position: fixed;
        top: 0;
        right: 0;
        background-color: var(--color-neutral-900);
        transition: all linear .15s;
        border-radius: 12px;
        padding: 1.5rem;
        
        .close-btn {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            width: 5rem;
            cursor: pointer;
            
            .close {
                img {
                    width: 17.58px;
                    margin-top: 0.3rem;
                }
            }
        }

        ul {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .login-button {
                margin-bottom: 2rem;
                
                button {
                    padding-block: 0.65rem;
                }
            }

            li {
                margin-bottom: 1.5rem;
                position: relative;

                a {
                    color: var(--color-neutral-50);
                    margin: 0 12px;
                    transition: all .2s;
                }

                span {
                    color: gray;
                    margin: 0 12px;

                    cursor: default;
                }

                img {
                    width: 2.75rem;
                    border-radius: 100%;
                    margin-right: 1rem;
                }

                a:active {
                    cursor: pointer;
                    color: var(--color-secondary);
                    filter: brightness(1.1);
                }
            }

            ${props => props.$currentPage && css`
                li:nth-child(${pages[props.$currentPage]}){
                    a {
                        font-family: 'Space_Mono_Bold';
                        font-weight: 400;
                        padding: .2rem -5rem;
                        pointer-events: none;
                    }

                    div {
                        width: calc(100% - 24px);
                        margin-left: 12px;
                        height: 4px;
                        background-color: var(--color-primary-500);
                        border-radius: 12px;
                    }
                }
            `}
        }

        @media (max-height:590px) {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            max-width: unset;

            ul {
                width: 45%;
                margin-top: 0;
                margin-right: 10px;
            }
        }
    }

    .sidepanel-hidden {
        right: -450px;

        @media (max-height:590px) {
            right: -100%;
        }
    }

    @media (min-width:800px) {
        display: none;
    }
`

const NavDesktop = styled.nav`
    display: none;
    margin-left: auto;

    ul {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 40px;

        li {
            position: relative;
            max-height: 44px;

            div {
                position: absolute;
                margin-top: 2px;
                width: 0%;
                margin-left: 50%;
                height: 4px;
                background-color: var(--color-neutral-50);
                transition: all .2s;
                border-radius: 12px;
            }

            a {
                max-height: 44px;
            }
        }

        button {
            padding-block: 0.65rem;
            height: 44px;
            width: 108px;
        }

        a {
            font: 700 1rem/1.25rem 'Space_Mono';
            margin: 0 12px;
            transition: all .2s;

            :hover {
                cursor: pointer;
            }
        }

        span {
            color: gray;
            margin: 0 12px;
            cursor: default;
        }

        ${props => props.$currentPage && css`
            li:nth-child(${pages[props.$currentPage]}) {
                a {
                    font-family: 'Space_Mono_Bold';
                    font-weight: 400;
                    padding: .2rem -5rem;
                    pointer-events: none;
                }

                div {
                    width: calc(100% - 24px);
                    margin-left: 12px;
                    height: 4px;
                    background-color: var(--color-primary-500);
                }
            }

            li:not(:nth-child(${pages[props.$currentPage]})):hover {
                div {
                    width: calc(100% - 24px);
                    margin-left: 12px;
                    height: 4px;
                    background-color: var(--color-neutral-50);
                }
            }
        `}

    }

    @media (min-width:800px) {
        display: block;
    }
`