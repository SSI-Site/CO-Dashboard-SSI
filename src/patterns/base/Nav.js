import { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useAuth from '../../../hooks/useAuth';


const pages = {
    "/presence": 1,
    "/giveaway": 2,
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
        <>
            <NavWrapper>
                <NavDesktop currentPage={router.pathname}>
                    <ul>
                        <li>
                            <Link href="/presence"><a>Presença</a></Link>
                            <div></div>
                        </li>

                        <li>
                            <Link href="/giveaway" ><a>Sorteio</a></Link>
                            <div></div>
                        </li>
                    </ul>
                </NavDesktop >


                <NavMobile isOpen={isOpen} currentPage={router.pathname}>
                    <div className={isOpen ? "sidepanel" : "sidepanel sidepanel-hidden"}>

                        <ul>
                            <li onClick={() => setIsOpen(false)}>
                                <Link href="/presence"><a>Presença</a></Link>
                                <div></div>
                            </li>

                            <li onClick={() => setIsOpen(false)}>
                                <Link href="/giveaway"><a>Sorteio</a></Link>
                                <div></div>
                            </li>
                        </ul>


                        <NavFooter>
                            <div className="logo-container">
                                <img src="./images/logos/logo_sem_estrela.svg" alt="SSI logo" />
                                <p>
                                    Semana de Sistemas de <br />Informação 2022
                                </p>
                            </div>
                        </NavFooter>

                    </div>

                    <button type="button" onClick={() => setIsOpen(!isOpen)}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </NavMobile >
            </NavWrapper >
        </>
    );

}

export default Nav;

const NavWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: right;
    position: fixed;
    width: 100%;
    height: 4.5rem;
    padding-right: 15px;
    z-index: 10;
    background-color: var(--color-primary);
    box-shadow: 0px 5px 24px 14px rgba(16,3,26,0.38);


    @media(min-width: 800px) {
        background-color: unset;
        position: unset;
        z-index: unset;
        padding-top: 20px;
        justify-content: center;
        box-shadow: unset;
    }
`

const NavMobile = styled.nav`
    padding: 10px;
    overflow: hidden;

    button {
        background-color: unset;
        border: unset;

        span {
            display: block;
            height: 3px;
            width: 25px;
            background: #FFF;
            margin-top: 3px;
            border-radius: 1px;

            transition: all 0.3s ease;
        }
    }

    ${props => props.isOpen && css`
        span {
            margin: 0;
        }
        span:nth-child(1){
            transform: rotate(45deg) translateY(8px);
        }
        span:nth-child(2){
            transform: translateX(50px);
            opacity: 0;
        }
        span:nth-child(3){
            transform: rotate(-45deg) translateY(-8px);
        }
    `}

    .sidepanel {
        height: 100%;
        width: 75%;
        max-width: 450px;
        position: fixed;
        top: 0;
        right: 0;
        background-color: #151023;
        border-left: 2px solid #ffffff;
        padding-top: 20px;
        transition: all linear .15s;

        ul {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-top: 30%;

            li {
                margin-top: 1.5rem;

                a {
                    font-family: 'Bebas Neue';
                    font-size: 2.2rem;
                    color: var(--color-text);
                    margin: 0 12px;
                    transition: all .2s;
                }

                span {
                    font-family: 'Bebas Neue';
                    font-size: 2.2rem;
                    color: gray;
                    margin: 0 12px;

                    cursor: default;
                }

                img {
                    width: 6rem;
                    border-radius: 100%;

                    ${props => props.currentPage == '/user' && css`
                        border: 2px solid white;
                    `}
                }

                a:active {
                    cursor: pointer;
                    font-size: 2.4rem;
                    color: var(--color-secondary);
                    filter: brightness(1.1);
                }
            }

            ${props => props.currentPage && css`
                li:nth-child(${pages[props.currentPage]}){
                    a {
                        padding: .2rem -5rem;
                        pointer-events: none;
                    }

                    div {
                        width: 70%;
                        margin-left: 15%;
                        height: 1px;
                        background-color: var(--color-text);
                    }
                }
            `}
        }

        @media(max-height: 590px) {
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

        @media(max-height: 590px) {
            right: -100%;
        }
    }

    @media (min-width: 800px) {
        display: none;
    }

`

const NavFooter = styled.div`
    position: absolute;
    bottom: 0;
    padding: 30px 0;
    width: 100%;

    p {
        font-weight: bold;
    }

    .logo-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        width: 100%;
        margin-bottom: 3rem;

        img {
            width: 30%;
            max-width: 100px;
        }
    }

    @media(max-height: 590px) {
        position: unset;
        bottom: unset;
        width: 45%;
        margin-left: 10px;
    }
`

const NavDesktop = styled.nav`

    display: none;

    ul {
        display: flex;
        height: 40px;

        .logInBtnContainer {
            position: absolute;
            top: 22px;
            right: 22px;

            @media(min-width: 1020px) {
                top: 26px;
                right: 26px;
            }
        }


        .userPicContainer {
            position: absolute;
            top: 15px;
            right: 10px;

            img {
                width: 50px;
                border-radius: 100%;
                transition: 0.1s;
            }

            img:hover {
                width: 60px;
                border: 2px solid white;
            }

            ${props => props.currentPage == '/user' && css`
                img {
                    width: 52px;
                    border: 2px solid white;
                }
            `}
        }

        li {
            div {
                width: 0%;
                margin-left: 50%;
                height: 1px;
                background-color: var(--color-text);
                transition: all .2s;
            }

            button {
                background: rgba(0,0,0,0);
                border: none;
            }
        }

        li:hover {
            div {
                width: 70%;
                margin-left: 15%;
                height: 1px;
                background-color: var(--color-text);
            }
        }

        a {
            font-family: 'Bebas Neue';
            font-size: 1.5rem;
            color: var(--color-text);
            margin: 0 12px;
            transition: all .2s;
        }

        span {
            font-family: 'Bebas Neue';
            font-size: 1.5rem;
            color: gray;
            margin: 0 12px;

            cursor: default;
        }

        a:hover {
            cursor: pointer;
            font-size: 1.7rem;
        }

        ${props => props.currentPage && css`
            li:nth-child(${pages[props.currentPage]}) {
                a {
                    padding: .2rem -5rem;
                    pointer-events: none;
                }

                div {
                    width: 70%;
                    margin-left: 15%;
                    height: 1px;
                    background-color: var(--color-text);
                }
            }
        `}
    }

    @media (min-width: 800px) {
        display: block;
    }
`