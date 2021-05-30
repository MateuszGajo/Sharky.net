import React, { useEffect, useState } from "react";
import { Comment, Input, Item } from "semantic-ui-react";
import cx from "classnames";
import { useRouter } from "next/router";
import { CommentMap } from "~root/src/app/models/activity";
import styles from "./ActivityComment.module.scss";
import { useCommentStore } from "~root/src/app/providers/RootStoreProvider";
import { formatDate, handleKeyDown } from "~root/src/app/utils/utils";
import ActivityDropdown from "../activitiesDropdown/ActivityDropdown";
import { observer } from "mobx-react-lite";
import {
  IconsBar,
  RepliesComponent,
} from "../activitiesCommentDownbar/ActivitiesCommentDownbar";

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
  const router = useRouter();
  const date = formatDate(new Date(item.createdAt), router.locale!);
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
        src={item.author.photo?.url || process.env.NEXT_PUBLIC_DEFAULT_AVATAR}
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
