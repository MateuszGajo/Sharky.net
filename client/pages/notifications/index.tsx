import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import Activity from "~components/notifications/activityNotification/ActivityNotification";
import FriendRequest from "~components/notifications/friendRequestNotification/FriendRequestNotification";
import HomeLayout from "~layout/homeLayout/HomeLayout";
import {
  useCommonStore,
  useNotificationStore,
} from "~root/src/app/providers/RootStoreProvider";
import { isLoggedIn } from "~root/src/app/utils/utils";

const Notifications = () => {
  const { notificationCount, readNotification } = useCommonStore();
  const { getNotification, notifications } = useNotificationStore();

  useEffect(() => {
    if (notificationCount > 0) {
      readNotification();
    }
    getNotification();
  }, []);

  return (
    <HomeLayout sidebar>
      <div>
        {Array.from(notifications.values()).map((item) => (
          <>
            {item.type === "post" && <Activity item={item} />}
            {item.type === "friend" && <FriendRequest item={item} />}
          </>
        ))}
      </div>
    </HomeLayout>
  );
};

export const getServerSideProps = async ({ req, ctx }: any) => {
  return await isLoggedIn(req);
};

export default observer(Notifications);
