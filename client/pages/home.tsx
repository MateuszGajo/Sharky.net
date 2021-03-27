import React from "react";
import MessageBox from "~common/messageBox/MessageBox";
import { isLoggedIn } from "~utils/utils";
import HomeLayout from "~root/src/features/layout/homeLayout/HomeLayout";

const home = () => {
  return (
    <section>
      <HomeLayout sidebar>
        <MessageBox />
      </HomeLayout>
    </section>
  );
};

export const getServerSideProps = async ({ req }: any) => {
  return await isLoggedIn(req);
};

export default home;
