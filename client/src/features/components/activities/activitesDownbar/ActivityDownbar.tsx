import React, { useState } from "react";
import { Comment, Divider, Icon, Input, Segment } from "semantic-ui-react";
import { observer } from "mobx-react";
import useTranslation from "next-translate/useTranslation";
import { CommentMap } from "~models/activity";
import { User } from "~root/src/app/models/activity";
import { useCommentStore } from "~root/src/app/providers/RootStoreProvider";
import { handleKeyDown } from "~root/src/app/utils/utils";
import ActivityComment from "../activitiesComment/ActivityComment";
import styles from "./ActivityDownbar.module.scss";

interface CommentWrapperI {
  appActivityId: string;
  item: CommentMap;
  comments: CommentMap[];
  index: number;
}

const CommentWrapper: React.FC<CommentWrapperI> = ({
  item,
  index,
  comments,
  appActivityId,
}) => {
  const [displayHiddenComments, setHiddenCommentsVisible] = useState<any>({});
  let display = false;
  const prevEl = comments[index - 1];
  if (prevEl?.isHidden != item.isHidden) {
    display = displayHiddenComments[item.id] ? true : false;
  }

  if (display || item.isHidden === false) {
    return (
      <ActivityComment key={item.id} item={item} activityId={appActivityId} />
    );
  } else if (prevEl?.isHidden != item.isHidden) {
    return (
      <div className={styles.hiddenComments}>
        <div
          className={styles.hiddenCommentsIcon}
          onClick={() =>
            setHiddenCommentsVisible((prev: any) => ({
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

interface CommentsComponentI {
  comments: CommentMap[];
  activityId: string;
  appActivityId: string;
}

const CommentsComponent: React.FC<CommentsComponentI> = observer(
  ({ comments, activityId, appActivityId }) => {
    const { isLoading, activityId: loadingActivityId } = useCommentStore();

    if (isLoading && loadingActivityId == activityId)
      return <Segment basic loading></Segment>;
    else if (comments.length)
      return (
        <>
          <Divider />
          <Comment.Group className={styles.comments}>
            {comments.map((item, index) => (
              <CommentWrapper
                item={item}
                index={index}
                appActivityId={appActivityId}
                comments={comments}
              />
            ))}
          </Comment.Group>
        </>
      );
    return null;
  }
);

interface Props {
  activityId: string;
  comments: Map<string, CommentMap>;
  user: User;
  setNumberOfComments: (number: number) => void;
  numberOfComments: number;
  appActivityId: string;
}

const ActivityDownbar: React.FC<Props> = ({
  activityId,
  appActivityId,
  comments: initialComments,
  user,
  setNumberOfComments,
  numberOfComments,
}) => {
  const { t } = useTranslation("components");
  const { createComment } = useCommentStore();

  const [comment, setComment] = useState("");

  const commnetPlaceholder = t("activities.commentPlaceholder");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createComment(appActivityId, activityId, comment).then(() => {
      setComment("");
      setNumberOfComments(numberOfComments + 1);
    });
  };

  const comments = Array.from(initialComments.values());

  return (
    <>
      <div className={styles.commentCreator}>
        <div className={styles.photo}>
          <img
            src={user.photo?.url || process.env.NEXT_PUBLIC_DEFAULT_AVATAR}
            alt="avatar"
          />
        </div>
        <form onSubmit={handleSubmit} className={styles.commentCreatorContent}>
          <Input
            fluid
            placeholder={commnetPlaceholder}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={handleKeyDown}
            value={comment}
          />
        </form>
      </div>
      <CommentsComponent
        comments={comments}
        activityId={activityId}
        appActivityId={appActivityId}
      />
    </>
  );
};

export default observer(ActivityDownbar);
