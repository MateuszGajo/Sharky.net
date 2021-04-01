import React from "react";
import MessageBox from "~common/messageBox/MessageBox";
import { isLoggedIn } from "~utils/utils";
import HomeLayout from "~root/src/features/layout/homeLayout/HomeLayout";
import ActivitiesList from "~components/activities/ActivitiesList";

const home = () => {
  return (
    <section>
      <HomeLayout sidebar>
        <MessageBox />
        {/* <ActivitiesList /> */}
      </HomeLayout>
    </section>
  );
};

export const getServerSideProps = async ({ req, ctx }: any) => {
  return await isLoggedIn(req);
};

export default home;
