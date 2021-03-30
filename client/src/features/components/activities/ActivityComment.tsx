import React, { useState } from "react";
import { Comment, Divider, Input, Item } from "semantic-ui-react";
import useTranslation from "next-translate/useTranslation";
import agent from "~root/src/app/api/agent";
import { Comment as CommentInterface } from "~models/activity";

interface Props {
  postId: string;
  comments: CommentInterface[];
}

const ActivityComment: React.FC<Props> = ({
  postId,
  comments: initialComments,
}) => {
  const { t } = useTranslation("components");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(initialComments);

  const commnetPlaceholder = t("activities.commentPlaceholder");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    agent.Activities.createComment(postId, comment)
      .then(() => console.log("good"))
      .catch((err) => console.log(err.response));
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
            src="https://react.semantic-ui.com/images/avatar/large/stevie.jpg"
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
      {!!comments.length && (
        <>
          <Divider />
          <Comment.Group>
            {comments.map((item) => {
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
                  {/* <Comment.Group>
                <Comment>
                  <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/large/stevie.jpg" />
                  <Comment.Content>
                    <Comment.Author as="a"> Matt</Comment.Author>
                    <Comment.Metadata>
                      <div>Today at 5:44</div>
                    </Comment.Metadata>
                    <Comment.Text>Wow wow wow</Comment.Text>
                  </Comment.Content>
                </Comment>
              </Comment.Group> */}
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
