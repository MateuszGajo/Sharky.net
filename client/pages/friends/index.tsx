import React, { useEffect, useState } from "react";
import styles from "./friends.module.scss";
import Searchbar from "~components/searchbar/Searchbar";
import HomeLayout from "~layout/homeLayout/HomeLayout";
import Card from "~components/card/Card";
import { useFriendStore } from "~root/src/app/providers/RootStoreProvider";
import { observer } from "mobx-react-lite";
import InfiniteScroll from "react-infinite-scroll-component";
import PrivateRoute from "~root/src/features/routes/PrivateRoute";
import useTranslation from "next-translate/useTranslation";

const Friends = () => {
  const {
    friends,
    getFriends,
    unfriend,
    getUser,
    isMoreFriends,
    isMoreUsers,
    userList,
    addFriend,
  } = useFriendStore();
  const { t } = useTranslation("friends");

  const [value, setValue] = useState("");
  const [view, setView] = useState("friends");

  const handleFriendClick = () => {
    if (view !== "friends") {
      setView("friends");
      isMoreFriends && friends.size === 0 && fetchData("friends");
    }
  };
  const handleAddFriendClick = () => {
    if (view !== "addFriends") {
      setView("addFriends");
      isMoreUsers && userList.size === 0 && fetchData("addFriends");
    }
  };

  useEffect(() => {
    fetchData(view);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(view);
  };

  const fetchData = (view: string) => {
    if (view === "friends") getFriends({ filterText: value });
    else getUser(value);
  };

  const loadingText = t("common:loading");
  const friendsText = t("friends");
  const addFriendsText = t("addFriends");
  const buttonText = t("addButton");

  return (
    <HomeLayout sidebar>
      <div className={styles.content}>
        <Searchbar
          value={value}
          onChange={setValue}
          onLeftItemClick={handleFriendClick}
          onRightItemClick={handleAddFriendClick}
          onSubmit={handleSubmit}
          leftText={friendsText}
          rightText={addFriendsText}
        />

        <InfiniteScroll
          dataLength={view === "friends" ? friends.size : userList.size}
          next={() => fetchData(view)}
          hasMore={view === "friends" ? isMoreFriends : isMoreUsers}
          loader={<h4>{loadingText}</h4>}
        >
          <div className={styles.cardContainer}>
            {view === "friends" ? (
              <>
                {Array.from(friends.values()).map((friend) => {
                  return (
                    <Card
                      name={friend.user.firstName + " " + friend.user.lastName}
                      onDeleteClick={unfriend}
                      referenceId={friend.id}
                      key={friend.id}
                    />
                  );
                })}
              </>
            ) : (
              <>
                {Array.from(userList.values()).map((user) => {
                  return (
                    <Card
                      name={user.firstName + " " + user.lastName}
                      onButtonClick={addFriend}
                      referenceId={user.id}
                      key={user.id}
                      buttonText={buttonText}
                    />
                  );
                })}
              </>
            )}
          </div>
        </InfiniteScroll>
      </div>
    </HomeLayout>
  );
};

export const getServerSideProps = async () => {
  return {};
};

export default PrivateRoute(observer(Friends));
