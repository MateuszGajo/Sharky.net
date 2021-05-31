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
import {
  useActivityStore,
  useCommonStore,
} from "~root/src/app/providers/RootStoreProvider";
import MessageBoxContext from "../messageBoxContent/MessageBoxContext";
import styles from "./MessageBox.module.scss";
import { verifyPhoto } from "~root/src/app/utils/utils";
import useTranslation from "next-translate/useTranslation";

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
  const { t } = useTranslation("components");
  const { createActivity, isSubmitting, editActivity } = useActivityStore();
  const { user } = useCommonStore();

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
    setFile([]);
    if (isEdit) {
      isEdit(false);
    }
  };

  const placeholderText = t("messageBox.placeholder");
  const createPostText = t("messageBox.createPost");
  const editPostText = t("messageBox.editPost");
  const sendButtonText = t("messageBox.sendButton");
  const saveButtontext = "messageBox.saveButton";
  return (
    <Modal
      onClose={closeModal}
      onOpen={() => setOpen(true)}
      open={open}
      className={styles.modalContainer}
      trigger={
        <div className={styles.container}>
          <div className={styles.activityCreator}>
            <div className={styles.photoContainer}>
              <img
                className={styles.photo}
                src={user.photo?.url || process.env.NEXT_PUBLIC_DEFAULT_AVATAR}
                alt=""
              />
            </div>
            <div className={styles.creatorContent}>
              <Input
                placeholder={placeholderText}
                fluid
                className={styles.creatorInput}
              />
            </div>
          </div>
        </div>
      }
    >
      <Form onSubmit={handleSubmit}>
        <Segment>
          <Modal.Header>
            <Container className={styles.title}>
              <h1>{isEdit ? editPostText : createPostText}</h1>
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
              <Button
                positive
                icon="plus"
                type="button"
                className={styles.button}
              />
              <input {...getInputProps()} accept="image/*" />
            </span>
            <Button
              content={isEdit ? saveButtontext : sendButtonText}
              positive
              loading={isSubmitting}
              disabled={!text.trim() && !file.length}
              className={styles.button}
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
