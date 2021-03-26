import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

interface Props {
  content?: string;
  inverted?: boolean;
}

const Loading: React.FC<Props> = ({ content, inverted = true }) => {
  return (
    <Dimmer active inverted={true}>
      <Loader content={content || "loading..."} />
    </Dimmer>
  );
};

export default Loading;
