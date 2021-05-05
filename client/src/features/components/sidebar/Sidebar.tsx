import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Container, Feed, Icon } from "semantic-ui-react";
import { useRouter } from "next/router";
import {
  useCommonStore,
  useFriendStore,
  useMessagesStore,
} from "~root/src/app/providers/RootStoreProvider";
import styles from "./Sidebar.module.scss";

const Sidebar = () => {
  const { openMessenger } = useMessagesStore();
  const { user } = useCommonStore();
  const router = useRouter();

  const { getFriends, friends } = useFriendStore();
  const { createHubConnection, stopHubConnection } = useCommonStore();

  useEffect(() => {
    getFriends();
    createHubConnection(router.pathname);
    return () => {
      stopHubConnection();
    };
  }, []);

  return (
    <Container className={styles.container}>
      {Array.from(friends.values()).map((item) => (
        <Feed
          key={item.id}
          className={styles.element}
          onClick={() =>
            openMessenger(
              item.friend,
              item.conversation?.id,
              item.id,
              item.conversation?.messageTo === user.id,
              item.conversation?.messagesCount!
            )
          }
        >
          <Feed.Event>
            <Feed.Label className={styles.photo}>
              {item.conversation?.messageTo === user.id ? (
                <div className={styles.notifications}>
                  <Icon
                    name="envelope outline"
                    className={styles.envelopeIcon}
                  />
                </div>
              ) : (
                <img src="https://react.semantic-ui.com/images/avatar/small/elliot.jpg" />
              )}
            </Feed.Label>
            <Feed.Content>
              <Feed.Summary className={styles.username}>
                <span>
                  {item.friend.firstName + " " + item.friend.lastName}
                </span>
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>
        </Feed>
      ))}
    </Container>
  );
};

export default observer(Sidebar);
