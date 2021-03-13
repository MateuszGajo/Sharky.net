import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

interface Props {
  content?: string;
}

const Loading: React.FC<Props> = ({ content }) => {
  return (
    <Dimmer active>
      <Loader content={content} />
    </Dimmer>
  );
};

export default Loading;
