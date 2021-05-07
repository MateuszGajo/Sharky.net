import React, { useState } from "react";
import { Comment, Icon, Input, Segment } from "semantic-ui-react";
import cx from "classnames";
import useTranslation from "next-translate/useTranslation";
import { CommentMap, Reply } from "~root/src/app/models/activity";
import ActivityReply from "../activitiesReply/ActivityReply";
import styles from "./ActivitiesCommentDownbar.module.scss";
import {
  useCommentStore,
  useReplyStore,
} from "~root/src/app/providers/RootStoreProvider";
import { handleKeyDown, likeClick } from "~root/src/app/utils/utils";
import { observer } from "mobx-react-lite";

interface RepliesWrapperI {
  index: number;
  replies: Reply[];
  item: Reply;
  activityId: string;
}

const RepliesWrapper: React.FC<RepliesWrapperI> = ({
  index,
  replies,
  item,
  activityId,
}) => {
  const [displayHiddenReply, setHiddenReplyVisible] = useState<any>({});
  let display = false;
  const prevEl = replies[index - 1];
  if (prevEl?.isHidden != item.isHidden) {
    display = displayHiddenReply[item.id] ? true : false;
  }

  if (display || item.isHidden === false) {
    return (
      <ActivityReply item={item} activityId={activityId} commentId={item.id} />
    );
  } else if (prevEl?.isHidden != item.isHidden) {
    return (
      <div className={styles.hiddenReplies}>
        <div
          className={styles.hiddenRepliesIcon}
          onClick={() =>
            setHiddenReplyVisible((prev: any) => ({
              ...prev,
              [item.id]: true,
            }))
          }
        >
          <Icon name="ellipsis horizontal" />
        </div>
      </div>
    );
  }
  return null;
};

interface RepliesLoaderI {
  item: CommentMap;
  activityId: string;
}

const RepliesLoader: React.FC<RepliesLoaderI> = observer(
  ({ item, activityId }) => {
    const { isLoading, commentId } = useReplyStore();
    const replies = Array.from(item.replies.values());

    if (isLoading && commentId == item.id)
      return (
        <Segment loading basic>
          <div></div>
        </Segment>
      );
    else if (item.replies.size > 0)
      return (
        <>
          {replies.map((reply, index) => (
            <RepliesWrapper
              key={reply.id}
              index={index}
              item={reply}
              activityId={activityId}
              replies={replies}
            />
          ))}
        </>
      );
    return null;
  }
);

interface IconsBarI {
  isHidden: boolean;
  item: CommentMap;
  isReply: boolean;
  activityId: string;
  setStatusOfReply: (status: boolean) => void;
}

const IconsBar: React.FC<IconsBarI> = ({
  isHidden,
  item,
  isReply,
  setStatusOfReply,
  activityId,
}) => {
  if (!isHidden) {
    const { commentLikeHandle } = useCommentStore();
    const { getReplies } = useReplyStore();

    const [isSubmitting, setStatusOfSubmitting] = useState(false);
    const [numberOfLikes, setNumberOfLikes] = useState(item.likes);
    const [isLiked, setStatusOfLike] = useState(item.isLiked);

    const handleIconClick = () => {
      if (item.repliesCount > 0 && item.replies.size == 0) {
        getReplies(activityId, item.id);
      }
      setStatusOfReply(!isReply);
    };

    const handleLikeClick = () =>
      likeClick({
        isSubmitting,
        setStatusOfSubmitting,
        setNumberOfLikes,
        giveLike: commentLikeHandle,
        setStatusOfLike,
        isLiked,
        id: item.id,
      });

    return (
      <Comment.Actions>
        <Comment.Action className={styles.icons}>
          <div onClick={handleIconClick}>
            <Icon
              name="reply"
              className={cx(styles.replyIcon, {
                [styles.replyIconActive]: isReply,
              })}
            />
            {item.repliesCount + " "}
            {item.replies.size === 1 ? "reply" : "replies"}
          </div>
          <div className={styles.like} onClick={handleLikeClick}>
            <Icon
              name="like"
              className={cx(styles.icon, {
                [styles.likeIconActive]: isLiked,
              })}
            />
            <span className={styles.number}>{numberOfLikes}</span>
          </div>
        </Comment.Action>
      </Comment.Actions>
    );
  }
  return null;
};

interface RepliesComponentI {
  isReply: boolean;
  item: CommentMap;
  content: string;
  activityId: string;
  setContent: (text: string) => void;
}

const RepliesComponent: React.FC<RepliesComponentI> = ({
  isReply,
  item,
  content,
  activityId,
  setContent,
}) => {
  if (isReply) {
    const { t } = useTranslation("components");
    const { createReply } = useReplyStore();

    const replyPlaceholder = t("activities.replyPlaceholder");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      createReply(activityId, item.id, content).then(() => setContent(""));
    };

    return (
      <Comment.Group className={styles.replyContainer}>
        <div className={styles.replyForm}>
          <div className={styles.replyFormPhotoContainer}>
            <img
              className={styles.replyFormPhoto}
              src="https://res.cloudinary.com/dqcup3ujq/image/upload/v1613718046/ubijj2hn4y8nuwe1twtg.png"
              alt=""
            />
          </div>
          <form onSubmit={handleSubmit} className={styles.replyFormContent}>
            <Input
              className={styles.replyFormInput}
              fluid
              placeholder={replyPlaceholder}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              value={content}
            />
          </form>
        </div>
        <RepliesLoader item={item} activityId={activityId} />
      </Comment.Group>
    );
  }
  return null;
};

export { IconsBar, RepliesComponent };
