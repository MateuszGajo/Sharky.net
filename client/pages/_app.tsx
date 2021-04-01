import type { AppProps } from "next/app";
import "semantic-ui-css/semantic.min.css";
import { RootStoreProvider } from "~root/src/app/stores/RootStoreProvider";
import "~styles/global.scss";
import "~styles/reset.scss";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <RootStoreProvider hydrationData={{ user: pageProps.user }}>
      <Component {...pageProps} />
    </RootStoreProvider>
  );
};

export default MyApp;
