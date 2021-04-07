import React from "react";
import { Dropdown } from "semantic-ui-react";
import useTranslate from "next-translate/useTranslation";
import { User } from "~root/src/app/models/authentication";
import { useCommonStore } from "~root/src/app/providers/RootStoreProvider";

interface Props {
  onClick: (type: string) => void;
  author: User;
}

const ActivityDropdown: React.FC<Props> = ({ onClick, author }) => {
  const { t } = useTranslate("components");

  const { user } = useCommonStore();

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
        {user.id === author.id ? (
          <>
            <Dropdown.Item
              icon="edit"
              text={editText}
              onClick={() => onClick("edit")}
            ></Dropdown.Item>
            <Dropdown.Item
              icon="remove"
              text={removeText}
              onClick={() => onClick("delete")}
            ></Dropdown.Item>
          </>
        ) : (
          <>
            <Dropdown.Item
              icon="hide"
              text={hideText}
              onClick={() => onClick("hide")}
            ></Dropdown.Item>
            <Dropdown.Item
              icon="ban"
              text={blockText}
              onClick={() => onClick("block")}
            ></Dropdown.Item>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ActivityDropdown;
