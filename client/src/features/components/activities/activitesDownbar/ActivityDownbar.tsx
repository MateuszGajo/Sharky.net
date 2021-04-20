import React, { useState } from "react";
import {
  Comment,
  Divider,
  Icon,
  Input,
  Item,
  Segment,
} from "semantic-ui-react";
import { observer } from "mobx-react";
import useTranslation from "next-translate/useTranslation";
import { CommentMap } from "~models/activity";
import { User } from "~root/src/app/models/activity";
import { useActivityStore } from "~root/src/app/providers/RootStoreProvider";
import { handleKeyDown } from "~root/src/app/utils/utils";
import ActivityComment from "../activitiesComment/ActivityComment";
import styles from "./ActivityDownbar.module.scss";

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
  const { createComment, isCommnetsLoading: isLoading } = useActivityStore();

  const [comment, setComment] = useState("");
  const [displayHiddenComments, setHiddenCommentsVisible] = useState<any>({});

  const commnetPlaceholder = t("activities.commentPlaceholder");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createComment(appActivityId, activityId, comment).then(() => {
      setComment("");
      setNumberOfComments(numberOfComments + 1);
    });
  };

  let display = false;
  const comments = Array.from(initialComments.values());

  const renderComments = (item: CommentMap, index: number) => {
    const prevEl = comments[index - 1];
    if (prevEl?.isHidden != item.isHidden) {
      display = displayHiddenComments[item.id] ? true : false;
    }

    if (display || item.isHidden === false) {
      return (
        <ActivityComment key={item.id} item={item} activityId={activityId} />
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
  };

  return (
    <>
      <Item.Group>
        <Item>
          <Item.Image
            size="mini"
            src={
              user.photo?.url ||
              "https://res.cloudinary.com/dqcup3ujq/image/upload/v1613718046/ubijj2hn4y8nuwe1twtg.png"
            }
          />
          <Item.Content verticalAlign="middle">
            <form onSubmit={handleSubmit}>
              <Input
                fluid
                placeholder={commnetPlaceholder}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={handleKeyDown}
                value={comment}
              />
            </form>
          </Item.Content>
        </Item>
      </Item.Group>
      {isLoading ? (
        <>
          <Segment basic loading></Segment>
        </>
      ) : (
        !!comments.length && (
          <>
            <Divider />
            <Comment.Group>
              {comments.map((item, index) => renderComments(item, index))}
            </Comment.Group>
          </>
        )
      )}
    </>
  );
};

export default observer(ActivityDownbar);
