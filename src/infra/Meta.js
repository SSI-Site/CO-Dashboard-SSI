import Head from 'next/head';
import img_src from '../../public/images/logos/preview_logo.jpg';

const Meta = ({  
  title = 'CO Dashboard 2025',
  keywords = 'Semana, semana, Sistemas, sistemas, Informação, informação, informacao, USP, usp, EACH, each, SI, si, Evento, evento, palestras, tecnologia, universidade, universitário, universitario',
  description = 'Destinado à Comissão Organizadora da SSI de 2025',
}) => {
  return (
    <Head>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name="theme-color" content="#151023" />
      <meta name='keywords' content={keywords} />
      <meta name='description' content={description} />

      <meta property="og:url" content="https://co-dashboard.semanadesi.com" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={img_src} />


      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="co-dashboard.semanadesi.com" />
      <meta property="twitter:url" content="https://co-dashboard.semanadesi.com" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img_src}></meta>

      <meta charSet='utf-8' />
      <link rel='icon' href='/favicon_logo.png' />
      <title>{title}</title>

    </Head>
  )
}

export default Meta;
