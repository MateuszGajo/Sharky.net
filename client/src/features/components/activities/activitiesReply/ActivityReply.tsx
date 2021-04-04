import React, { useState } from "react";
import { Comment, Input, Item } from "semantic-ui-react";
import styles from "./ActivityReply.module.scss";
import { Reply } from "~root/src/app/models/activity";
import ActivityDropdown from "../activitiesDropdown/ActivityDropdown";

interface Props {
  item: Reply;
  postId: string;
  commentId: string;
}

const ActivityReply: React.FC<Props> = ({ item, postId, commentId }) => {
  return (
    <Comment className={styles.item}>
      <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/large/stevie.jpg" />
      <Comment.Content>
        <Comment.Author as="a"> Matt</Comment.Author>
        <Comment.Metadata>
          <div>Today at 5:44</div>
        </Comment.Metadata>
        <Comment.Text>Wow wow wow</Comment.Text>
      </Comment.Content>
      <div className={styles.options}>
        <ActivityDropdown onClick={() => {}} />
      </div>
    </Comment>
  );
};

export default ActivityReply;
