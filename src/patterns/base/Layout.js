import styled from 'styled-components';
import { useState } from 'react';
import Meta from '../../infra/Meta';
import GlobalStyle from '../../../styles/global';

import NavBar from './Nav';
import Footer from './Footer';

const SiteWrapper = styled.div`

  min-height:100vh;
  max-width: 1500px;
  margin: auto;
  position:relative;
  padding-bottom: 33.8rem; /* match footer height */

  @media(min-width: 600px){
    padding-bottom: 13rem; /* match footer height */
  }

`

const Layout = ({ children }) => {

  return (
    <>
      <Meta />
      <style jsx>
        {`
          @font-face {
            font-family: 'Plaza';
            src: url('/fonts/plazaitc-normal.ttf');
          }
        `}
      </style>
      {/* <NavBar/> */}
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
