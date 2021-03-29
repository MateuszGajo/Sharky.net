import React from "react";
import { Comment } from "semantic-ui-react";

const ActivityComment = () => {
  return (
    <Comment.Group>
      <Comment>
        <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/large/stevie.jpg" />
        <Comment.Content>
          <Comment.Author as="a"> Matt</Comment.Author>
          <Comment.Metadata>
            <div>Today at 5:44</div>
          </Comment.Metadata>
          <Comment.Text>Wow wow wow</Comment.Text>
          <Comment.Actions>
            <Comment.Action>Reply</Comment.Action>
          </Comment.Actions>
        </Comment.Content>
        <Comment.Group>
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
        </Comment.Group>
      </Comment>
    </Comment.Group>
  );
};

export default ActivityComment;
