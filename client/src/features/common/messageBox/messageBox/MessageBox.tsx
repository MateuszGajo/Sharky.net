import React, { useCallback, useEffect, useState } from "react";
import {
  Divider,
  Container,
  Form,
  Segment,
  Button,
  Modal,
  Item,
  Input,
  Icon,
  Label,
} from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { useDropzone } from "react-dropzone";
import { useActivityStore } from "~root/src/app/providers/RootStoreProvider";
import MessageBoxContext from "../messageBoxContent/MessageBoxContext";
import styles from "./MessageBox.module.scss";
import { verifyPhoto } from "~root/src/app/utils/utils";

interface Props {
  content?: string;
  photoUrl?: string;
  isEdit?: boolean;
}

const MessageBoxItem: React.FC<Props> = ({
  content = "",
  photoUrl,
  isEdit = false,
}) => {
  const { createActivity, isSubmitting } = useActivityStore();

  const initialFileState = photoUrl ? [{ preview: photoUrl }] : [];

  const [file, setFile] = useState<any[]>(initialFileState);
  const [text, setText] = useState(content);
  const [error, setError] = useState("");
  const [open, setOpen] = React.useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    verifyPhoto({ setFile, setError, acceptedFiles });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createActivity({ content: text, file: file[0] || null })
      .then(() => {
        setOpen(false);
      })
      .catch((err) => setError(err));
  };
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      className={styles.modalContainer}
      trigger={
        <Container className={styles.container}>
          <Item.Group className={styles.item}>
            <Item>
              <Item.Image
                src="https://react.semantic-ui.com/images/avatar/large/stevie.jpg"
                size="mini"
              />
              <Item.Content verticalAlign="middle">
                <Input placeholder="What's up?" fluid />
              </Item.Content>
            </Item>
          </Item.Group>
        </Container>
      }
    >
      <Form onSubmit={handleSubmit}>
        <Segment>
          <Modal.Header>
            <Container textAlign="center" className={styles.title}>
              {isEdit ? "Edit Post" : "Create Post"}
            </Container>
            <Divider />
          </Modal.Header>
          <MessageBoxContext
            content={content}
            file={file}
            setFile={setFile}
            onDrop={onDrop}
            setText={setText}
          />
          {error && (
            <Container className={styles.error}>
              <Label color="red" basic>
                <p>{error}</p>
              </Label>
            </Container>
          )}
          <Modal.Actions className={styles.toolbar}>
            <span
              {...getRootProps({
                onDrop: (event) => event.stopPropagation(),
              })}
            >
              <Button positive icon="plus" type="button" />
              <input {...getInputProps()} accept="image/*" />
            </span>
            {console.log(!text)}
            {console.log(!file.length)}
            <Button
              content={isEdit ? "save" : "send"}
              positive
              floated="right"
              loading={isSubmitting}
              disabled={!text.trim() && !file.length}
            />
          </Modal.Actions>
        </Segment>
      </Form>
      <div className={styles.iconContainer} onClick={() => setOpen(false)}>
        <Icon name="close" className={styles.closeIcon} />
      </div>
    </Modal>
  );
};

export default observer(MessageBoxItem);
