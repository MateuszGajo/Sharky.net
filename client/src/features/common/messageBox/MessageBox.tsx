import React, { useCallback, useState } from "react";
import {
  Divider,
  Grid,
  Container,
  Form,
  Segment,
  Button,
} from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import style from "./MessageBox.module.scss";
import Preview from "./components/preview/Preview";
import Content from "./components/preview/content/Content";

const MessageBox = () => {
  const [file, setFile] = useState([]);
  const [text, setText] = useState("");
  const onDrop = useCallback((acceptedFiles) => {
    setFile(
      acceptedFiles.map((file: object) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Grid centered>
      <Grid.Column width={6}>
        <Form onSubmit={handleSubmit}>
          <Segment>
            <Container textAlign="center">Create Post</Container>
            <Divider />
            <Content
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              isDragActive={isDragActive}
              setText={setText}
            />
            <Container className={`${style.toolbar} local`}>
              <Preview
                file={file}
                setFile={setFile}
                getRootProps={getRootProps}
                getInputProps={getInputProps}
              />
              <Button content="send" positive floated="right" />
            </Container>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default MessageBox;
