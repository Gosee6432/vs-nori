import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>VS놀이 AI판정기</title>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          href='https://fonts.googleapis.com/css2?family=Pretendard&display=swap'
          rel='stylesheet'
        />
      </Head>
      <main className='font-sans'>
        <Component {...pageProps} />
      </main>
    </>
  );
}
