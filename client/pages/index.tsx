import React, { useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";

const Home: React.FC = () => {
  return (
    <div>
      <Link href="/home">Home</Link>
    </div>
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

export default Home;
