import React, { Ref, RefObject, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Button, Form, Grid, Header, Icon, Modal } from "semantic-ui-react";
import cx from "classnames";
import styles from "./MessageBoxContext.module.scss";

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

  const textRef = useRef<HTMLElement>(null);

  const handleChange = (e: any) => {
    setText(e.target.outerText);
  };

  useEffect(() => {
    textRef.current?.addEventListener("input", handleChange);
    textRef.current?.focus();
    return () => {
      textRef.current?.removeEventListener("input", handleChange);
    };
  }, []);

  return (
    <Modal.Content
      className={styles.content}
      {...getRootProps({
        onClick: (e) => e.stopPropagation(),
      })}
    >
      {isDragActive ? (
        <Grid centered padded className={styles.dropbox}>
          <Icon name="upload" size="huge" />
          <Header content="Drop image here" />
        </Grid>
      ) : (
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
          {!!file.length && (
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
          )}
        </>
      )}
    </Modal.Content>
  );
};

export default MessageBoxContext;
