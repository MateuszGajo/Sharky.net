import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Container, Feed, Icon, Loader, Segment } from "semantic-ui-react";
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

  const { getFriends, onlineFriends } = useFriendStore();
  const { createHubConnection, stopHubConnection } = useCommonStore();

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getFriends().then(() => setLoading(false));
    createHubConnection(router.pathname);
    return () => {
      stopHubConnection();
    };
  }, []);

  return (
    <Container className={styles.container}>
      {Array.from(onlineFriends.values()).map((item) => (
        <Feed
          key={item.id}
          className={styles.element}
          onClick={() =>
            openMessenger(
              item.friend,
              item.conversation?.id,
              item.id,
              item.conversation?.messageTo === user.id,
              item.conversation?.messagesCount!,
              true
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
      {isLoading ? (
        <Segment basic loading className={styles.loader} />
      ) : (
        onlineFriends.size == 0 && <p>There are no active friends</p>
      )}
    </Container>
  );
};

export default observer(Sidebar);
