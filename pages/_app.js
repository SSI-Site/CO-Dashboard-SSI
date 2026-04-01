import { useEffect } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import Layout from '../src/patterns/base/Layout';

// barra de carregamento
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

Router.events.on('routeChangeStart', () => { NProgress.start() });
Router.events.on('routeChangeComplete', () => { NProgress.done() });
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }) {

    useEffect(() => {
        if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
            import('../src/mocks/browser').then(({ worker }) => {
                worker.start({
                    onUnhandledRequest: 'bypass', // Ignora requisições não mockadas (como imagens)
                });
            });
        }
    }, []);
    
    return (
        <AuthProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </AuthProvider>
    )
}

export default MyApp;