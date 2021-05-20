import React, { useEffect, useState } from "react";
import styles from "./friends.module.scss";
import Searchbar from "~components/searchbar/Searchbar";
import HomeLayout from "~layout/homeLayout/HomeLayout";
import Card from "~components/card/Card";
import { useFriendStore } from "~root/src/app/providers/RootStoreProvider";
import { observer } from "mobx-react-lite";
import InfiniteScroll from "react-infinite-scroll-component";

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

  return (
    <HomeLayout sidebar>
      <div className={styles.content}>
        <Searchbar
          value={value}
          onChange={setValue}
          onLeftItemClick={handleFriendClick}
          onRightItemClick={handleAddFriendClick}
          onSubmit={handleSubmit}
          leftText="Friends"
          rightText="Add friends"
        />

        <InfiniteScroll
          dataLength={view === "friends" ? friends.size : userList.size}
          next={() => fetchData(view)}
          hasMore={view === "friends" ? isMoreFriends : isMoreUsers}
          loader={<h4>Loading...</h4>}
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

export default observer(Friends);
