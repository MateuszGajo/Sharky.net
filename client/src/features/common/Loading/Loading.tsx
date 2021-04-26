import React from "react";
import { Dimmer, Loader, SemanticSIZES } from "semantic-ui-react";

interface Props {
  content?: string;
  inverted?: boolean;
  size?: SemanticSIZES;
}

const Loading: React.FC<Props> = ({
  content,
  inverted = true,
  size = "medium",
}) => {
  return (
    <Dimmer active inverted={inverted}>
      <Loader content={content || "loading..."} size={size} />
    </Dimmer>
  );
};

export default Loading;
