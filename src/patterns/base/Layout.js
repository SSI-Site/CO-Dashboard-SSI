import styled from 'styled-components';
import { useState } from 'react';
import Meta from '../../infra/Meta';
import GlobalStyle from '../../../styles/global';

import NavBar from './Nav';
import Footer from './Footer';

const Layout = ({ children }) => {

    return (
        <>
            <Meta />
            <style jsx>
                {`
                  @font-face {
                    font-family: 'Space_Mono';
                    src: url('/fonts/space_mono-regular.ttf');
                  }
                  @font-face {
                    font-family: 'Space_Mono_Bold';
                    src: url('/fonts/space_mono-bold.ttf');
                  }
                `}
            </style>
            <NavBar/> {/** isso aqui deve estar comentado ao fim do desenvolvimento e teste da plataforma */}
            <GlobalStyle />
            <SiteWrapper>
                <main>
                    {children}
                </main>
                <Footer />
            </SiteWrapper>
        </>
    )
}

export default Layout;


const SiteWrapper = styled.div`
    min-height: 100vh;
    margin: auto;
    position: relative;
    padding-bottom: 21rem; /* match footer height */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    main {
        width: 100%;
    }

    @media (min-width:960px) {
        padding-bottom: 21rem; /* match footer height */
    }

    @media (min-width:1365px) {
        padding-inline: 0;
    }
`