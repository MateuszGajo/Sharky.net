import React from "react";
import { Divider, Grid, Container, TextArea, Form } from "semantic-ui-react";

const MessageBox = () => {
  return (
    <Grid centered>
      <Grid.Column width={6}>
        <Container textAlign="center">Create Post</Container>
        <Divider />
        <Form.Field width={6}>
          <textarea placeholder="what's up?" rows={6} cols={6} />
        </Form.Field>
      </Grid.Column>
    </Grid>
  );
};

export default MessageBox;
