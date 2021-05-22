import type { AppProps } from "next/app";
import "semantic-ui-css/semantic.min.css";
import { RootStoreProvider } from "~root/src/app/providers/RootStoreProvider";
import "~styles/global.scss";
import "~styles/reset.scss";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <RootStoreProvider>
      <Component {...pageProps} />
    </RootStoreProvider>
  );
};

export default MyApp;
