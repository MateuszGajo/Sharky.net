import React from "react";
import useTranslation from "next-translate/useTranslation";
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
  const { t } = useTranslation("common");
  const loadingText = t("loading");
  return (
    <Dimmer active inverted={inverted}>
      <Loader content={content || loadingText} size={size} />
    </Dimmer>
  );
};

export default Loading;
