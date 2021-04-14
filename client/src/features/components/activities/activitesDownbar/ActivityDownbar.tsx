import React, { useState } from "react";
import {
  Comment,
  Container,
  Divider,
  Icon,
  Input,
  Item,
  Segment,
} from "semantic-ui-react";
import useTranslation from "next-translate/useTranslation";
import { CommentMap as CommentInterface } from "~models/activity";
import { User } from "~root/src/app/models/authentication";
import { useActivityStore } from "~root/src/app/providers/RootStoreProvider";
import { handleKeyDown } from "~root/src/app/utils/utils";
import ActivityComment from "../activitiesComment/ActivityComment";
import { observer } from "mobx-react";
import Loading from "~common/Loading/Loading";

interface Props {
  postId: string;
  comments: Map<string, CommentInterface>;
  user: User;
  isComments: boolean;
}

const ActivityDownbar: React.FC<Props> = ({
  postId,
  comments: initialComments,
  user,
  isComments,
}) => {
  const { t } = useTranslation("components");
  const { createComment } = useActivityStore();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(initialComments);

  const commnetPlaceholder = t("activities.commentPlaceholder");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createComment(postId, comment).then(() => setComment(""));
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
      {isComments && !comments.size ? (
        <>
          <Segment basic loading></Segment>
        </>
      ) : (
        !!comments.size && (
          <>
            <Divider />
            <Comment.Group>
              {Array.from(comments.values()).map((item) => (
                <ActivityComment key={item.id} item={item} postId={postId} />
              ))}
            </Comment.Group>
          </>
        )
      )}
    </>
  );
};

export default observer(ActivityDownbar);
