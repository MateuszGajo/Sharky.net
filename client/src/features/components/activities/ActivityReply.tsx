import React from "react";
import { Comment, Input, Item } from "semantic-ui-react";

const ActivityReply = () => {
  return (
    <>
      <Comment.Group>
        <Item.Group>
          <Item>
            <Item.Image
              size="mini"
              src={
                "https://res.cloudinary.com/dqcup3ujq/image/upload/v1613718046/ubijj2hn4y8nuwe1twtg.png"
              }
            />
            <Item.Content verticalAlign="middle">
              <form>
                <Input
                  fluid
                  placeholder="sasa"
                  // placeholder={commnetPlaceholder}
                  // onChange={(e) => setComment(e.target.value)}
                  // onKeyDown={handleKeyDown}
                  // value={comment}
                />
              </form>
            </Item.Content>
          </Item>
        </Item.Group>
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
    </>
  );
};

export default ActivityReply;
