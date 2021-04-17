import React, { useEffect, useState } from "react";
import { Comment, Icon, Input, Item, Segment } from "semantic-ui-react";
import cx from "classnames";
import { CommentMap, Reply } from "~root/src/app/models/activity";
import ActivityReply from "../activitiesReply/ActivityReply";
import styles from "./ActivityComment.module.scss";
import useTranslation from "next-translate/useTranslation";
import { useActivityStore } from "~root/src/app/providers/RootStoreProvider";
import { formatDate, handleKeyDown } from "~root/src/app/utils/utils";
import ActivityDropdown from "../activitiesDropdown/ActivityDropdown";
import { observer } from "mobx-react-lite";

interface Props {
  item: CommentMap;
  activityId: string;
}

const ActivityComment: React.FC<Props> = ({ item, activityId }) => {
  const { t } = useTranslation("components");

  const [isReply, setStatusOfReply] = useState(false);
  const [isEditting, setStatusOfEdit] = useState(false);
  const [isHidden, setStatusOfHidden] = useState(item.isHidden);
  const [displayHiddenReply, setHiddenReplyVisible] = useState<any>({});
  const [content, setContent] = useState("");

  const {
    createReply,
    editComment,
    hideComment,
    unhideComment,
    getReplies,
    isRepliesLoading: isLoading,
  } = useActivityStore();

  const replyPlaceholder = t("activities.replyPlaceholder");

  const date = formatDate(new Date(item.createdAt));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createReply(activityId, item.id, content).then(() => setContent(""));
  };

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

  const handleIconClick = () => {
    if (!isReply && item.replies.size == 0) getReplies(activityId, item.id);
    setStatusOfReply(!isReply);
  };

  useEffect(() => {
    if (isEditting) {
      document.addEventListener("click", handleDocumentClick);
    }
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [isEditting]);

  const replies = Array.from(item.replies.values());
  let display = false;
  const renderReplies = (item: Reply, index: number) => {
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
  };
  return (
    <Comment>
      <Comment.Avatar
        src="https://react.semantic-ui.com/images/avatar/large/stevie.jpg"
        className={cx({
          [styles.hiddenAvatar]: isHidden,
        })}
      />
      <Comment.Content className={styles.container}>
        {isEditting ? (
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
        ) : (
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
        )}
        {!isHidden && (
          <Comment.Actions>
            <Comment.Action
              className={styles.replyRef}
              onClick={handleIconClick}
            >
              <Icon
                name="reply"
                className={cx(styles.replyIcon, {
                  [styles.replyIconActive]: isReply,
                })}
              />
              {item.repliesCount + " "}
              {item.replies.size === 1 ? "reply" : "replies"}
            </Comment.Action>
          </Comment.Actions>
        )}

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
      {isReply && (
        <Comment.Group className={styles.replyContainer}>
          <Item.Group className={styles.form}>
            <Item>
              <Item.Image
                size="mini"
                src={
                  "https://res.cloudinary.com/dqcup3ujq/image/upload/v1613718046/ubijj2hn4y8nuwe1twtg.png"
                }
              />
              <Item.Content verticalAlign="middle">
                <form onSubmit={handleSubmit}>
                  <Input
                    size="mini"
                    fluid
                    placeholder={replyPlaceholder}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    value={content}
                  />
                </form>
              </Item.Content>
            </Item>
          </Item.Group>
          {isLoading ? (
            <Segment loading basic></Segment>
          ) : (
            replies.map((reply, index) => renderReplies(reply, index))
          )}
        </Comment.Group>
      )}
    </Comment>
  );
};

export default observer(ActivityComment);
