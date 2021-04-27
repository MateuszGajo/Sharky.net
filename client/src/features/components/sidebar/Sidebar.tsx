import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Container, Feed } from "semantic-ui-react";
import {
  useFriendStore,
  useMessagesStore,
} from "~root/src/app/providers/RootStoreProvider";
import styles from "./Sidebar.module.scss";

const Sidebar = () => {
  const { openMessenger } = useMessagesStore();
  const { getFriends, friends } = useFriendStore();

  useEffect(() => {
    getFriends();
  }, []);
  return (
    <Container className={styles.container}>
      {Array.from(friends.values()).map((item) => (
        <Feed
          className={styles.element}
          onClick={() =>
            openMessenger(item.friend, item.conversation?.id, item.id)
          }
        >
          <Feed.Event>
            <Feed.Label>
              <img src="https://react.semantic-ui.com/images/avatar/small/elliot.jpg" />
            </Feed.Label>
            <Feed.Content>
              <Feed.Summary className={styles.username}>
                {item.friend.firstName + " " + item.friend.lastName}
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>
        </Feed>
      ))}
    </Container>
  );
};

export default observer(Sidebar);
