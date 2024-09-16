import GlobalStyles from "../components/GlobalStyles";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <html lang="de" />
      <Head>
        <title>ICE bingo</title>
      </Head>
      <GlobalStyles />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
