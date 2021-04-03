import React, { useCallback, useState } from "react";
import {
  Divider,
  Grid,
  Container,
  Form,
  Segment,
  Button,
  Label,
} from "semantic-ui-react";
import styles from "./MessageBox.module.scss";
import Preview from "./components/preview/Preview";
import Content from "./components/content/Content";
import { v4 as uuid } from "uuid";
import { useActivityStore } from "~root/src/app/providers/RootStoreProvider";
import { observer } from "mobx-react-lite";

const MessageBox = () => {
  const { createActivity, isSubmitting } = useActivityStore();
  const [file, setFile] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles[0]) {
      setError("You can only upload a picture");
    } else if (acceptedFiles[0].size > 5242880) {
      setError("You can't upload picture larger than 5mb");
    } else {
      setError("");
      setFile(
        acceptedFiles.map((file: object) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = uuid();
    createActivity({ id, content: text, file: file[0] || null })
      .then((photo) => {
        setFile([]);
        setText("");
      })
      .catch((err) => setError(err));
  };

  return (
    <Grid centered>
      <Grid.Column width={6}>
        <Form onSubmit={handleSubmit}>
          <Segment>
            <Container textAlign="center">Create Post</Container>
            <Divider />
            <Content onDrop={onDrop} setText={setText} text={text} />
            {error && (
              <Container className={styles.error}>
                <Label color="red" basic>
                  <p>{error}</p>
                </Label>
              </Container>
            )}
            <Container className={`${styles.toolbar} local`}>
              <Preview file={file} setFile={setFile} onDrop={onDrop} />
              <Button
                content="send"
                positive
                floated="right"
                loading={isSubmitting}
                disabled={!text && !file.length}
              />
            </Container>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default observer(MessageBox);
