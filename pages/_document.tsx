import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" /> 
      </Head>
      <body>
        <Main />
        <NextScript />
        <Script src="https://cdn.checkout.com/js/framesv2.min.js" strategy="beforeInteractive"></Script>
      </body>
    </Html>
  )
}
