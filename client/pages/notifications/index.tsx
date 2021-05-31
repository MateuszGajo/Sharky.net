import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import Activity from "~components/notifications/activityNotification/ActivityNotification";
import FriendRequest from "~components/notifications/friendRequestNotification/FriendRequestNotification";
import HomeLayout from "~layout/homeLayout/HomeLayout";
import {
  useCommonStore,
  useNotificationStore,
} from "~root/src/app/providers/RootStoreProvider";
import PrivateRoute from "~root/src/features/routes/PrivateRoute";

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
          <div key={item.id}>
            {item.type === "post" && <Activity item={item} key={item.id} />}
            {item.type === "friend" && (
              <FriendRequest item={item} key={item.id} />
            )}
          </div>
        ))}
      </div>
    </HomeLayout>
  );
};

export const getServerSideProps = async () => {
  return {};
};

export default PrivateRoute(observer(Notifications));
