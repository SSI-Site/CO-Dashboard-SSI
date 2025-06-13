import styled from 'styled-components';

// assets
import LogoPrincipal from '../../../public/images/logos/logo_principal.svg';

const Footer = () => {

    return (
        <>
            <FooterWrapper>
                <div className='ssi'>
                    <div className="logo-box">
                        <img src={LogoPrincipal} alt="logo" />
                        <h6>
                            Semana de Sistemas de <br />Informação 2025
                        </h6>
                    </div>
                </div>
            </FooterWrapper >
        </>
    )
}

export default Footer;


const FooterWrapper = styled.footer`
    position: absolute;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 21rem;
    text-align: center;
    padding-block: 3.5rem;

    background: var(--color-neutral-900);
    border-top: 8px solid var(--color-primary-800);

    h6 {
        margin-top: 2rem;
    }

    .ssi {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .logo-box {
        display: flex;
        flex-direction: column;
        white-space: nowrap;
    }

    .ssi img {
        width: 7.325rem;
        align-self: center;
    }

    @media (min-width:480px) {}

    @media (min-width:600px) {}

    @media (min-width:960px) { /** mudar para horizontal */
        /* height:26.75rem; */
        flex-direction: row;
        align-items: center;

        .ssi {
            height: 50%;
        }

        .ssi img {
            width: 7.3rem;
            height:8.25rem;
        }
    }

    @media (min-width:1400px) {

    }

    @media (min-width:1600px) {
        /* width: calc(100vw - 10px);
        margin-left: calc( (1500px - 100vw - 10px) / 2 ); */
    }

    @media (min-width:2200px) {
        /* padding: 0 20rem; */
        /* 4k */
    }
`