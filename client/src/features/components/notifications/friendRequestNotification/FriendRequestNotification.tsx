import React from "react";
import { useRouter } from "next/router";
import { Button, Card, Feed, Image } from "semantic-ui-react";
import { Notification } from "~models/notification";
import styles from "./FriendRequestNotification.module.scss";
import { useNotificationStore } from "~root/src/app/providers/RootStoreProvider";
import useTranslation from "next-translate/useTranslation";

interface Props {
  item: Notification;
}

const FriendRequestNotification: React.FC<Props> = ({ item }) => {
  const { t } = useTranslation("notifications");
  const router = useRouter();
  const { acceptFriendRequest, declineFriendRequest } = useNotificationStore();

  const approveRequestText = t("request.approve");
  const declineRequestText = t("request.decline");
  const requestInfo = t("request.info");
  const requestRole = t("request.friend");
  return (
    <div className={styles.container}>
      <Card basic="true" className={styles.card}>
        <Card.Content>
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
                  </Feed.User>
                </Feed.Summary>
              </Feed.Content>
            </Feed.Event>
          </Feed>
          <Card.Description>
            {requestInfo} <strong>{requestRole}</strong>
          </Card.Description>
        </Card.Content>
        <Card.Content extra className={styles.contentExtra}>
          <div className="ui two buttons">
            <Button
              basic
              color="green"
              onClick={() => acceptFriendRequest(item.refId, item.id)}
            >
              {approveRequestText}
            </Button>
            <Button
              basic
              color="red"
              onClick={() => declineFriendRequest(item.refId, item.id)}
            >
              {declineRequestText}
            </Button>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default FriendRequestNotification;
