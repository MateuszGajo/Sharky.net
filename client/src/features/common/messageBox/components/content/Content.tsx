import React from "react";
import { useDropzone } from "react-dropzone";
import { Form, Grid, Header, Icon } from "semantic-ui-react";

interface Props {
  onDrop: (props: any) => void;
  setText: (content: string) => void;
  text: string;
}

const Content: React.FC<Props> = ({ onDrop, setText, text }) => {
  console.log(text);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
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
          value={text}
        />
      )}
    </Form.Field>
  );
};

export default Content;
