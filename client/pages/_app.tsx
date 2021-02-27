import type { AppProps } from "next/app";
import "semantic-ui-css/semantic.min.css";
import "~styles/global.scss";
import "~styles/variables.scss";

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => (
  <Component {...pageProps} />
);

export default MyApp;
