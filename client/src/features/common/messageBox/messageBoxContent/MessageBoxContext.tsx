import React, { useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Button, Form, Grid, Header, Icon, Modal } from "semantic-ui-react";
import cx from "classnames";
import styles from "./MessageBoxContext.module.scss";

interface PreviewI {
  file: any[];
  setFile: (files: object[]) => void;
}

const Preview: React.FC<PreviewI> = ({ file, setFile }) => {
  if (!!file.length)
    return (
      <div className={styles.itemCenter}>
        <div className={styles.previewContainer}>
          <img src={file[0]?.preview} className={styles.imgPreview} />
          <span className={styles.imgCancel}>
            <Button
              icon="cancel"
              color="red"
              size="tiny"
              onClick={() => setFile([])}
            />
          </span>
        </div>
      </div>
    );
  return null;
};

interface ModalContentI {
  isDragActive: boolean;
  file: any[];
  setFile: (files: object[]) => void;
  setText: (text: string) => void;
  content: string;
}

const ModalContent: React.FC<ModalContentI> = ({
  isDragActive,
  file,
  setFile,
  setText,
  content,
}) => {
  const handleChange = (e: any) => {
    setText(e.target.innerText);
  };

  const textRef = useRef<HTMLElement>(null);
  useEffect(() => {
    textRef.current?.addEventListener("input", handleChange);
    textRef.current?.focus();
    return () => {
      textRef.current?.removeEventListener("input", handleChange);
    };
  }, []);

  if (isDragActive)
    return (
      <Grid centered padded className={styles.dropbox}>
        <Icon name="upload" size="huge" />
        <Header content="Drop image here" />
      </Grid>
    );
  return (
    <>
      <Form.Field
        className={cx({
          [styles.field]: file.length == 0,
        })}
      >
        <span
          contentEditable
          role="textbox"
          className={cx(styles.textarea, {
            [styles.textareaOnly]: file.length == 0,
          })}
          placeholder="What's up?"
          suppressContentEditableWarning={true}
          ref={textRef}
        >
          {content}
        </span>
      </Form.Field>
      <Preview file={file} setFile={setFile} />
    </>
  );
};

interface Props {
  onDrop: (props: any) => void;
  file: any[];
  setFile: (files: object[]) => void;
  content: string;
  setText: (text: string) => void;
}

const MessageBoxContext: React.FC<Props> = ({
  onDrop,
  file,
  content,
  setText,
  setFile,
}) => {
  const { getRootProps, isDragActive } = useDropzone({ onDrop });

  const props = {
    ...getRootProps({
      onClick: (e) => e.stopPropagation(),
    }),
  };

  return (
    <Modal.Content className={styles.content} {...props}>
      <ModalContent
        isDragActive={isDragActive}
        file={file}
        setFile={setFile}
        setText={setText}
        content={content}
      />
    </Modal.Content>
  );
};

export default MessageBoxContext;
