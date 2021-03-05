import "semantic-ui-css/semantic.min.css";
import { appWithTranslation } from "next-i18next";
import "~styles/global.scss";
import "~styles/reset.scss";
import "~styles/variables.scss";

const MyApp: any = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default appWithTranslation(MyApp);
