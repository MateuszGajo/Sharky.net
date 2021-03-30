import type { AppProps } from "next/app";
import "semantic-ui-css/semantic.min.css";
import { store, StoreContext } from "~root/src/app/stores/store";
import "~styles/global.scss";
import "~styles/reset.scss";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <StoreContext.Provider value={store}>
      <Component {...pageProps} />
    </StoreContext.Provider>
  );
};

export default MyApp;
