import React, { useState } from "react";
import { Comment, Icon } from "semantic-ui-react";
import cx from "classnames";
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
  const {
    deleteReply,
    hideReply,
    unhideReply,
    replyLikeHandle,
  } = useActivityStore();
  const [isHidden, setStatusOfHidden] = useState(item.isHidden);
  const [isSubmitting, setStatusOfSubmitting] = useState(false);
  const [isLiked, setStatusOfLike] = useState(item.isLiked);
  const [numberOfLikes, setNumberOfLikes] = useState(item.likes);

  const handlerDropdownClick = (type: string) => {
    switch (type) {
      case "delete":
        deleteReply(activityId, commentId, item.id);
        break;
      case "hide":
        hideReply(item.id).then(() => setStatusOfHidden(true));
        break;
      case "unhide":
        unhideReply(item.id).then(() => setStatusOfHidden(false));
      case "edit":
        break;
    }
  };

  const handleLikeClick = () => {
    if (!isSubmitting) {
      setStatusOfSubmitting(true);
      replyLikeHandle(isLiked, item.id).then(() => {
        if (isLiked) {
          setNumberOfLikes(numberOfLikes - 1);
          setStatusOfLike(false);
          setStatusOfSubmitting(false);
        } else {
          setNumberOfLikes(numberOfLikes + 1);
          setStatusOfLike(true);
          setStatusOfSubmitting(false);
        }
      });
    }
  };

  return (
    <Comment className={styles.item}>
      <Comment.Avatar
        src="https://react.semantic-ui.com/images/avatar/large/stevie.jpg"
        className={cx({
          [styles.hiddenAvatar]: isHidden,
        })}
      />
      <Comment.Content>
        <Comment.Author
          as="a"
          className={cx(styles.username, {
            [styles.usernameHidden]: isHidden,
          })}
        >
          {author.firstName + " " + author.lastName}
        </Comment.Author>
        <Comment.Metadata>
          <div>{date}</div>
        </Comment.Metadata>
        <Comment.Text
          className={cx(styles.content, {
            [styles.hiddenContent]: item.isLiked,
          })}
        >
          {content}
        </Comment.Text>
      </Comment.Content>
      <Comment.Actions>
        <Comment.Action className={styles.icons}>
          <a className={styles.like} onClick={handleLikeClick}>
            <Icon
              name="like"
              className={cx(styles.icon, {
                [styles.likeIconActive]: isLiked,
              })}
            />
            <span className={styles.number}>{numberOfLikes}</span>
          </a>
        </Comment.Action>
      </Comment.Actions>
      <div className={styles.options}>
        <ActivityDropdown
          onClick={handlerDropdownClick}
          author={item.author}
          isHidden={isHidden}
        />
      </div>
    </Comment>
  );
};

export default ActivityReply;
