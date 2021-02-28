import React from "react";
import { Form, Grid, Header, Icon } from "semantic-ui-react";

const Content = ({ getRootProps, getInputProps, isDragActive, setText }) => {
  return (
    <Form.Field
      {...getRootProps({
        onClick: (e) => e.stopPropagation(),
      })}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <>
          <Grid centered padded>
            <Icon name="upload" size="huge" />
            <Header content="Drop image here" />
          </Grid>
        </>
      ) : (
        <textarea
          placeholder="what's up?"
          rows={4}
          onChange={(e) => setText(e.target.value)}
        />
      )}
    </Form.Field>
  );
};

export default Content;
