import React from "react";
import { Comment } from "semantic-ui-react";
import styles from "./ActivityReply.module.scss";
import { Reply } from "~root/src/app/models/activity";
import ActivityDropdown from "../activitiesDropdown/ActivityDropdown";
import { formatDate } from "~root/src/app/utils/utils";
import { useActivityStore } from "~root/src/app/providers/RootStoreProvider";

interface Props {
  item: Reply;
  activityId: string;
  commentId: string;
}

const ActivityReply: React.FC<Props> = ({ item, activityId, commentId }) => {
  const { author, createdAt, content } = item;
  const date = formatDate(new Date(createdAt));
  const { deleteReply, hideReply } = useActivityStore();

  const handlerDropdownClick = (type: string) => {
    switch (type) {
      case "delete":
        deleteReply(activityId, commentId, item.id);
        break;
      case "hide":
        hideReply(activityId, commentId, item.id);
        break;
      case "edit":
        break;
    }
  };

  return (
    <Comment className={styles.item}>
      <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/large/stevie.jpg" />
      <Comment.Content>
        <Comment.Author as="a">
          {author.firstName + " " + author.lastName}
        </Comment.Author>
        <Comment.Metadata>
          <div>{date}</div>
        </Comment.Metadata>
        <Comment.Text>{content}</Comment.Text>
      </Comment.Content>
      <div className={styles.options}>
        <ActivityDropdown onClick={handlerDropdownClick} author={item.author} />
      </div>
    </Comment>
  );
};

export default ActivityReply;
