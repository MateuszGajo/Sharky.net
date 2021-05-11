import React, { useEffect, useState } from "react";
import styles from "./friends.module.scss";
import Searchbar from "~components/searchbar/Searchbar";
import HomeLayout from "~layout/homeLayout/HomeLayout";
import Card from "~components/card/Card";
import { useFriendStore } from "~root/src/app/providers/RootStoreProvider";
import { observer } from "mobx-react-lite";
import InfiniteScroll from "react-infinite-scroll-component";

const Friends = () => {
  const { friends, getFriends, unfriend, filterFriends, isMore } =
    useFriendStore();
  const [value, setValue] = useState("");

  const handleFriendClick = () => {};
  const handleAddFriendClick = () => {};

  // const handleDeleteClick = (id: string) => {
  //   console.log(id);
  // };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value) filterFriends(value);
    else getFriends({});
  };

  const fetchData = () => {
    getFriends({ filterText: value });
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
          dataLength={friends.size} //This is important field to render the next data
          next={fetchData}
          hasMore={isMore}
          loader={<h4>Loading...</h4>}
        >
          <div className={styles.cardContainer}>
            {Array.from(friends.values()).map((friend) => {
              return (
                <Card
                  name={friend.user.firstName + " " + friend.user.lastName}
                  onDeleteClick={unfriend}
                  referenceId={friend.id}
                />
              );
            })}
          </div>
        </InfiniteScroll>
      </div>
    </HomeLayout>
  );
};

export default observer(Friends);
