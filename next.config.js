module.exports = {
    output: "export",
    images: {
        unoptimized: true,
    },
    compiler: {
        styledComponents: true,
    },
    // proxy reverso
    skipTrailingSlashRedirect: true, // nao adiciona e nem remove / ao final da url
    async rewrites() {
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
    },
};