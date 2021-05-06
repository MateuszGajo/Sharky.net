import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Feed } from "semantic-ui-react";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import HomeLayout from "~layout/homeLayout/HomeLayout";
import {
  useCommonStore,
  useNotificationStore,
} from "~root/src/app/providers/RootStoreProvider";
import { isLoggedIn } from "~root/src/app/utils/utils";
import { formatDate } from "~utils/utils";
import styles from "./notifications.module.scss";

const Notifications = () => {
  const { t } = useTranslation("notifications");

  const router = useRouter();

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
          <Feed
            className={styles.item}
            onClick={() => router.push(`/${item.type}/${item.refId}`)}
          >
            <Feed.Event>
              <Feed.Label
                image={
                  item.user.photo || process.env.NEXT_PUBLIC_DEFAULT_AVATAR
                }
              />
              <Feed.Content>
                <Feed.Summary>
                  <Feed.User>
                    {item.user.firstName + " " + item.user.lastName}
                  </Feed.User>{" "}
                  <Feed.Date>{formatDate(item.createdAt)}</Feed.Date>
                </Feed.Summary>
                <Feed.Extra text>{t(`${item.type}.${item.action}`)}</Feed.Extra>
              </Feed.Content>
            </Feed.Event>
          </Feed>
        ))}
      </div>
    </HomeLayout>
  );
};

export const getServerSideProps = async ({ req, ctx }: any) => {
  return await isLoggedIn(req);
};

export default observer(Notifications);
