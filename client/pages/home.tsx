import React from "react";
import MessageBox from "~common/messageBox/MessageBox";
import HomeLayout from "~root/src/features/layout/homeLayout/HomeLayout";

const home = () => {
  return (
    <section>
      <HomeLayout children={<MessageBox />} />
    </section>
  );
};

export default home;
