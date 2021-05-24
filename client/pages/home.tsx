import React from "react";
import MessageBoxItem from "~common/messageBox/messageBox/MessageBox";
import HomeLayout from "~root/src/features/layout/homeLayout/HomeLayout";
import ActivitiesList from "~components/activities/activitiesList/ActivitiesList";
import PrivateRoute from "~routes/PrivateRoute";

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

export const getServerSideProps = (ctx: any) => {
  return {};
};

export default PrivateRoute(home);
