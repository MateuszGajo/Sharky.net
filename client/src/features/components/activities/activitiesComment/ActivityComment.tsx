import React, { useEffect, useState } from "react";
import { Comment, Icon, Input, Item, Segment } from "semantic-ui-react";
import cx from "classnames";
import { CommentMap, Reply } from "~root/src/app/models/activity";
import ActivityReply from "../activitiesReply/ActivityReply";
import styles from "./ActivityComment.module.scss";
import useTranslation from "next-translate/useTranslation";
import {
  useCommentStore,
  useReplyStore,
} from "~root/src/app/providers/RootStoreProvider";
import {
  formatDate,
  handleKeyDown,
  likeClick,
} from "~root/src/app/utils/utils";
import ActivityDropdown from "../activitiesDropdown/ActivityDropdown";
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
      <ActivityReply
        key={item.id}
        item={item}
        activityId={activityId}
        commentId={item.id}
      />
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

interface CommentContentI {
  item: CommentMap;
  isEditting: boolean;
  content: string;
  activityId: string;
  isHidden: boolean;
  setContent: (text: string) => void;
  setStatusOfEdit: (status: boolean) => void;
}

const CommentContent: React.FC<CommentContentI> = ({
  item,
  isEditting,
  content,
  activityId,
  isHidden,
  setContent,
  setStatusOfEdit,
}) => {
  const { editComment } = useCommentStore();
  const date = formatDate(new Date(item.createdAt));
  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (item.content == content) {
      setStatusOfEdit(false);
    } else {
      editComment(activityId, item.id, content).then(() => {
        setStatusOfEdit(false);
      });
    }
  };

  if (isEditting)
    return (
      <Item.Group className={styles.form}>
        <Item>
          <Item.Content verticalAlign="middle">
            <form onSubmit={handleEditSubmit}>
              <Input
                onClick={(e: MouseEvent) => e.stopPropagation()}
                fluid
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                value={content}
              />
            </form>
          </Item.Content>
        </Item>
      </Item.Group>
    );
  return (
    <>
      <Comment.Author
        as="a"
        className={cx(styles.username, {
          [styles.usernameHidden]: isHidden,
        })}
      >
        {" "}
        Matt
      </Comment.Author>
      <Comment.Metadata>
        <div>{date}</div>
      </Comment.Metadata>
      <Comment.Text
        className={cx({
          [styles.hiddenContent]: isHidden,
        })}
      >
        {item.content}
      </Comment.Text>
    </>
  );
};

interface Props {
  item: CommentMap;
  activityId: string;
}

const ActivityComment: React.FC<Props> = ({ item, activityId }) => {
  const [isReply, setStatusOfReply] = useState(false);
  const [isEditting, setStatusOfEdit] = useState(false);
  const [isHidden, setStatusOfHidden] = useState(item.isHidden);
  const [content, setContent] = useState("");

  const { hideComment, unhideComment } = useCommentStore();

  const handleDownbarClick = (type: string) => {
    switch (type) {
      case "edit":
        setStatusOfEdit(true);
        setContent(item.content);
        break;
      case "hide":
        hideComment(item.id).then(() => setStatusOfHidden(true));
        break;
      case "unhide":
        unhideComment(item.id).then(() => setStatusOfHidden(false));
        break;
      case "delete":
        break;
    }
  };

  const handleDocumentClick = () => {
    setStatusOfEdit(false);
  };

  useEffect(() => {
    if (isEditting) {
      document.addEventListener("click", handleDocumentClick);
    }
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [isEditting]);

  return (
    <Comment>
      <Comment.Avatar
        src="https://react.semantic-ui.com/images/avatar/large/stevie.jpg"
        className={cx({
          [styles.hiddenAvatar]: isHidden,
        })}
      />
      <Comment.Content className={styles.container}>
        <CommentContent
          item={item}
          isEditting={isEditting}
          content={content}
          activityId={activityId}
          isHidden={isHidden}
          setContent={setContent}
          setStatusOfEdit={setStatusOfEdit}
        />

        <div
          className={cx(styles.options, {
            [styles.hidden]: isEditting,
          })}
        >
          <ActivityDropdown
            onClick={handleDownbarClick}
            author={item.author}
            isHidden={isHidden}
          />
        </div>
      </Comment.Content>
      <IconsBar
        isHidden={isHidden}
        item={item}
        isReply={isReply}
        setStatusOfReply={setStatusOfReply}
        activityId={activityId}
      />
      <RepliesComponent
        isReply={isReply}
        item={item}
        content={content}
        activityId={activityId}
        setContent={setContent}
      />
    </Comment>
  );
};

export default observer(ActivityComment);
