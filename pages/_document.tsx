import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head />
      <body className='antialiased'>
        {/* ✅ 애드센스 광고 스크립트 */}
        <script
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1217533439838380'
          crossOrigin='anonymous'
        />

        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
