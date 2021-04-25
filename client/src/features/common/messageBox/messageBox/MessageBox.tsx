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
  setStatusOfEdit?: (status: boolean) => void;
  activityId?: string;
  appActivityId?: string;
}

const MessageBoxItem: React.FC<Props> = ({
  content = "",
  photoUrl,
  setStatusOfEdit: isEdit,
  activityId,
  appActivityId,
}) => {
  const { createActivity, isSubmitting, editActivity } = useActivityStore();

  const initialFileState = photoUrl ? [{ preview: photoUrl }] : [];
  const [file, setFile] = useState<any[]>(initialFileState);
  const [text, setText] = useState(content || "");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(isEdit ? true : false);

  const onDrop = useCallback((acceptedFiles) => {
    verifyPhoto({ setFile, setError, acceptedFiles });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEdit) {
      const photo = !file[0]
        ? null
        : file[0].preview == photoUrl
        ? null
        : file[0];
      editActivity({ content: text, file: photo }, activityId!, appActivityId!);
      isEdit(false);
    } else {
      createActivity({ content: text, file: file[0] || null })
        .then(() => {
          setOpen(false);
        })
        .catch((err) => setError(err));
    }
  };

  const closeModal = () => {
    setOpen(false);
    setText("");
    if (isEdit) {
      isEdit(false);
    }
  };
  return (
    <Modal
      onClose={closeModal}
      onOpen={() => setOpen(true)}
      open={open}
      className={styles.modalContainer}
      trigger={
        <Container className={styles.container}>
          <div className={styles.activityCreator}>
            <div className={styles.photoContainer}>
              <img
                className={styles.photo}
                src="https://react.semantic-ui.com/images/avatar/large/stevie.jpg"
                alt=""
              />
            </div>
            <div className={styles.creatorContent}>
              <Input
                placeholder="What's up?"
                fluid
                className={styles.creatorInput}
              />
            </div>
          </div>
        </Container>
      }
    >
      <Form onSubmit={handleSubmit}>
        <Segment>
          <Modal.Header>
            <Container textAlign="center" className={styles.title}>
              <h1>{isEdit ? "Edit Post" : "Create Post"}</h1>
            </Container>
            <Divider className={styles.divider} />
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
      <div className={styles.iconContainer} onClick={closeModal}>
        <Icon name="close" className={styles.closeIcon} />
      </div>
    </Modal>
  );
};

export default observer(MessageBoxItem);
