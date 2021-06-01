import React, { useEffect } from "react";
import Card from "~components/card/Card";
import InfiniteScroll from "react-infinite-scroll-component";
import useTranslation from "next-translate/useTranslation";
import { useFriendStore } from "~root/src/app/providers/RootStoreProvider";
import styles from "./ProfileFriendsList.module.scss";
import { observer } from "mobx-react-lite";

interface Props {
  userId?: string;
}

const ProfileFriendsList: React.FC<Props> = ({ userId }) => {
  const { friends, isMoreFriends, getFriends } = useFriendStore();
  const { t } = useTranslation("profile");
  const loadingText = t("common:loading");
  const viewButtonText = t("friendsList.viewButton");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getFriends({ id: userId });
  };
  return (
    <InfiniteScroll
      dataLength={friends.size}
      next={() => fetchData()}
      hasMore={isMoreFriends}
      loader={<h4 className={styles.loading}>{loadingText}</h4>}
    >
      <div className={styles.cardContainer}>
        <>
          {Array.from(friends.values()).map((friend) => {
            return (
              <Card
                id={friend.user.id}
                name={friend.user.firstName + " " + friend.user.lastName}
                referenceId={friend.id}
                key={friend.id}
                profileButton
                photo={friend.user.photo || null}
                buttonText={viewButtonText}
              />
            );
          })}
        </>
      </div>
    </InfiniteScroll>
  );
};

export default observer(ProfileFriendsList);
