import React from "react";
import MessageBox from "~common/messageBox/MessageBox";
import HomeLayout from "~root/src/features/layout/homeLayout/HomeLayout";
import setLanguage from "next-translate/setLanguage";
import { setLanguage as sLang } from "~utils/utils";

const home = () => {
  const handleClick = () => {
    const setLanguagee = async () => {
      sLang("pl");
      await setLanguage("pl");
    };

    setLanguagee();
  };
  return (
    <section>
      <button onClick={handleClick}>Click</button>
      <HomeLayout children={<MessageBox />} />
    </section>
  );
};

export default home;
