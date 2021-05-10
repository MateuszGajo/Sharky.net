import React, { useState } from "react";
import styles from "./friends.module.scss";
import Searchbar from "~components/searchbar/Searchbar";
import HomeLayout from "~layout/homeLayout/HomeLayout";
import Card from "~components/card/Card";

const index = () => {
  const [value, setValue] = useState("");
  const handleFriendClick = () => {};
  const handleAddFriendClick = () => {};
  return (
    <HomeLayout sidebar>
      <div className={styles.content}>
        <Searchbar
          value={value}
          onChange={setValue}
          onLeftItemClick={handleFriendClick}
          onRightItemClick={handleAddFriendClick}
          onSubmit={(e) => {
            e.preventDefault();
            console.log("submit");
          }}
          leftText="Friends"
          rightText="Add friends"
        />
        <div className={styles.cardContainer}>
          <Card
            name="aa"
            onDeleteClick={() => {
              console.log("click");
            }}
          />
          <Card
            name="aa"
            onDeleteClick={() => {
              console.log("click");
            }}
          />
          <Card
            name="aa"
            onDeleteClick={() => {
              console.log("click");
            }}
          />
          <Card
            name="aa"
            onDeleteClick={() => {
              console.log("click");
            }}
          />
        </div>
      </div>
    </HomeLayout>
  );
};

export default index;
