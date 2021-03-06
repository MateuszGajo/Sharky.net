import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body id="app">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
export async function getStaticProps() {
  return {
    props: {},
  };
}

export default MyDocument;
