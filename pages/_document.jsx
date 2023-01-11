import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head></Head>
        <body>
          <Main />
          <NextScript />
          <div id="notificaitons"></div>
        </body>
      </Html>
    )
  }
}

export default MyDocument