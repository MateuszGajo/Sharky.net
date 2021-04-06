import React from "react";
import MessageBoxItem from "~common/messageBox/messageBox/MessageBox";
import { isLoggedIn } from "~utils/utils";
import HomeLayout from "~root/src/features/layout/homeLayout/HomeLayout";
import ActivitiesList from "~components/activities/activitiesList/ActivitiesList";

const home = () => {
  return (
    <section>
      <HomeLayout sidebar>
        <MessageBoxItem />
        <ActivitiesList />
      </HomeLayout>
    </section>
  );
};

export const getServerSideProps = async ({ req, ctx }: any) => {
  return await isLoggedIn(req);
};

export default home;
