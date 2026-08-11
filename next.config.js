// next.config.js
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase) => {
    
    // Configuração base válida para todos os ambientes
    const config = {
        images: { unoptimized: true },
        compiler: { styledComponents: true },
    };

    // Se NÃO for modo de desenvolvimento, sem proxy reverso
    if (phase !== PHASE_DEVELOPMENT_SERVER) {
        config.output = "export"; 
        return config; 
    }

    // Se FOR modo de desenvolvimento, proxy reverso
    config.skipTrailingSlashRedirect = true; // nao adiciona e nem remove / ao final da url
    
    config.rewrites = async () => {
        return [
            {
                // mantem rotas com / no final
                source: '/api/:path*/',
                destination: `${process.env.NEXT_PUBLIC_SAPHIRA_URL}/:path*/`
            },
            {
                // fallback do caso de rota sem / no final
                source: '/api/:path*',
                destination: `${process.env.NEXT_PUBLIC_SAPHIRA_URL}/:path*`
            }
        ]
    }

    return config;
};