import React from "react";
import MessageBox from "~common/messageBox/MessageBox";
import HomeLayout from "~root/src/features/layout/homeLayout/HomeLayout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const home = () => {
  return (
    <section>
      <HomeLayout children={<MessageBox />} />
    </section>
  );
};

export const getStaticProps = async ({ locale }) => {
  console.log(locale);
  return {
    props: {
      ...(await serverSideTranslations(locale, ["components"])),
    },
  };
};

export default home;
