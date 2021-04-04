import React, { useEffect, useRef, useState } from "react";
import { Comment, Icon, Input, Item, TextArea } from "semantic-ui-react";
import cx from "classnames";
import { CommentMap } from "~root/src/app/models/activity";
import ActivityReply from "../activitiesReply/ActivityReply";
import styles from "./ActivityComment.module.scss";
import useTranslation from "next-translate/useTranslation";
import { useActivityStore } from "~root/src/app/providers/RootStoreProvider";
import { v4 as uuid } from "uuid";
import { handleKeyDown } from "~root/src/app/utils/utils";
import ActivityDropdown from "../activitiesDropdown/ActivityDropdown";

interface Props {
  item: CommentMap;
  postId: string;
}

const ActivityComment: React.FC<Props> = ({ item, postId }) => {
  const [isReply, setStatusOfReply] = useState(false);
  const [isEditting, setStatusOfEdit] = useState(false);
  const { t } = useTranslation("components");

  const [content, setContent] = useState("");

  const { createReply, editComment } = useActivityStore();

  const replyPlaceholder = t("activities.replyPlaceholder");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createReply(postId, item.id, { content, id: uuid() });
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (item.content == content) {
      setStatusOfEdit(false);
    } else {
      editComment(postId, item.id, content).then(() => {
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
      <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/large/stevie.jpg" />
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
            <Comment.Author as="a"> Matt</Comment.Author>
            <Comment.Metadata>
              <div>Today at 5:44</div>
            </Comment.Metadata>
            <Comment.Text>{item.content}</Comment.Text>
          </>
        )}

        <Comment.Actions>
          <Comment.Action
            className={styles.replyRef}
            onClick={() => setStatusOfReply(!isReply)}
          >
            <Icon
              name="reply"
              className={cx(styles.replyIcon, {
                [styles.replyIconActive]: isReply,
              })}
            />
            {item.replies.size + " "}
            {item.replies.size === 1 ? "reply" : "replies"}
          </Comment.Action>
        </Comment.Actions>
        <div
          className={cx(styles.options, {
            [styles.hidden]: isEditting,
          })}
        >
          <ActivityDropdown onClick={handleDownbarClick} />
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
          {Array.from(item.replies.values()).map((reply) => (
            <ActivityReply
              key={reply.id}
              item={reply}
              postId={postId}
              commentId={item.id}
            />
          ))}
        </Comment.Group>
      )}
    </Comment>
  );
};

export default ActivityComment;
