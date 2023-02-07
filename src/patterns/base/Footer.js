import styled from 'styled-components';
import { useRouter } from 'next/router';

// assets
import LogoSemEstrela from '../../../public/images/logos/logo_sem_estrela.svg';

const Footer = () => {

    const router = useRouter();

    return (
        <>
            <FooterWrapper>
                <div className='ssi'>
                    <div onClick={() => router.push('/')} className="logo-box">
                        <img src={LogoSemEstrela} alt="logo" />
                        <p>
                            Semana de Sistemas de <br />Informação 2022
                        </p>
                    </div>
                    <div className='footer-blur'></div>
                </div>
            </FooterWrapper >
        </>
    )
}

export default Footer;


const FooterWrapper = styled.footer`
    display: flex;
    width: 100%;
    padding-bottom: 1rem;
    position: absolute;
    bottom: 0;
    background: #151023;
    text-align: center;
    opacity: 0.8;

    p {
        color: white;
        font-family: 'Roboto', sans-serif;
        font-weight: 700;
    }

    .ssi {
        width: 100%;
        margin-top: 2rem;
        font-size: 1.95rem;
        height: 17rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
    }
    .logo-box {
        display: flex;
        flex-direction: column;
    }

    .logo-box:hover {
        cursor: pointer;
    }

    .ssi a {
        display: flex;
        flex-direction: column;
        text-decoration: none;
        color: white;
    }

    .ssi .footer-blur {
        width: 100%;
        height: 50%;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(138, 69, 198, 0.1);
        filter: blur(15px);
        z-index: -1;
    }

    .ssi img {
        width: 8.2rem;
        align-self: center;
        margin-bottom: 0.3rem;
    }


    @media (min-width:600px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0 4rem;
        height: 13rem;

        .ssi {
            font-size: 1.3rem;
            height: 50%;
            margin-top: 0;
        }

        .ssi img {
            width: 5.5rem;
        }
    }

    @media (min-width:1600px) {
        width: calc(100vw - 10px);
        margin-left: calc( (1500px - 100vw - 10px) / 2 );
    }
`