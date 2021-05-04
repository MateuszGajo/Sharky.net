import React from "react";
import { Container, Feed } from "semantic-ui-react";
import HomeLayout from "~layout/homeLayout/HomeLayout";

const notifications = () => {
  return (
    <HomeLayout sidebar>
      <div>
        <Feed>
          <Feed.Event>
            <Feed.Label image={process.env.NEXT_PUBLIC_DEFAULT_AVATAR} />
            <Feed.Content date={Date} summary={"Aaa"} />
          </Feed.Event>
        </Feed>
      </div>
    </HomeLayout>
  );
};

export default notifications;
