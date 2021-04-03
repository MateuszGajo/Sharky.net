import React, { useState } from "react";
import { Comment, Divider, Input, Item } from "semantic-ui-react";
import useTranslation from "next-translate/useTranslation";
import agent from "~root/src/app/api/agent";
import { CommentMap as CommentInterface } from "~models/activity";
import { User } from "~root/src/app/models/authentication";
import { useActivityStore } from "~root/src/app/providers/RootStoreProvider";
import { v4 as uuid } from "uuid";
import ActivityReply from "./ActivityReply";

interface Props {
  postId: string;
  comments: Map<string, CommentInterface>;
  user: User;
}

const ActivityComment: React.FC<Props> = ({
  postId,
  comments: initialComments,
  user,
}) => {
  const { t } = useTranslation("components");
  const { createComment } = useActivityStore();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(initialComments);

  const commnetPlaceholder = t("activities.commentPlaceholder");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createComment(postId, { id: uuid(), content: comment }).then(() =>
      setComment("")
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "enter") {
      e.preventDefault();
      e.stopPropagation();
      new Event("submit");
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
      {!!comments.size && (
        <>
          <Divider />
          <Comment.Group>
            {Array.from(comments.values()).map((item) => {
              return (
                <Comment key={item.id}>
                  <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/large/stevie.jpg" />
                  <Comment.Content>
                    <Comment.Author as="a"> Matt</Comment.Author>
                    <Comment.Metadata>
                      <div>Today at 5:44</div>
                    </Comment.Metadata>
                    <Comment.Text>{item.content}</Comment.Text>
                    <Comment.Actions>
                      <Comment.Action>Reply</Comment.Action>
                    </Comment.Actions>
                  </Comment.Content>
                  <ActivityReply />
                </Comment>
              );
            })}
          </Comment.Group>
        </>
      )}
    </>
  );
};

export default ActivityComment;
