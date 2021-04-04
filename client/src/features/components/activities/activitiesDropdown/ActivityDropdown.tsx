import React from "react";
import { Dropdown } from "semantic-ui-react";
import useTranslate from "next-translate/useTranslation";

interface Props {
  onClick: (type: string) => void;
}

const ActivityDropdown: React.FC<Props> = ({ onClick }) => {
  const { t } = useTranslate("components");
  const editText = t("activities.header.settings.edit");
  const removeText = t("activities.header.settings.remove");
  const hideText = t("activities.header.settings.hide");
  const blockText = t("activities.header.settings.block");
  return (
    <Dropdown
      className=" icon"
      icon="ellipsis horizontal"
      direction="left"
      trigger={<></>}
    >
      <Dropdown.Menu>
        <Dropdown.Item
          icon="edit"
          text={editText}
          onClick={() => onClick("edit")}
        ></Dropdown.Item>
        <Dropdown.Item icon="remove" text={removeText}></Dropdown.Item>
        <Dropdown.Item icon="hide" text={hideText}></Dropdown.Item>
        <Dropdown.Item icon="ban" text={blockText}></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ActivityDropdown;
