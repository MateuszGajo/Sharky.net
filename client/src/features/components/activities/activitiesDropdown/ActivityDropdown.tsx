import React from "react";
import { Dropdown } from "semantic-ui-react";
import cx from "classnames";
import useTranslate from "next-translate/useTranslation";
import { User } from "~root/src/app/models/activity";
import { useCommonStore } from "~root/src/app/providers/RootStoreProvider";
import styles from "./ActivityDropdown.module.scss";

interface Props {
  onClick: (type: string) => void;
  author: User;
  sharingUser?: User;
  isActivity?: boolean;
  isHidden?: boolean;
}

const ActivityDropdown: React.FC<Props> = ({
  onClick,
  author,
  sharingUser,
  isActivity = false,
  isHidden = false,
}) => {
  const { t } = useTranslate("components");

  const { user } = useCommonStore();

  const editText = t(
    `activities.header.settings.${isActivity ? "activity" : "comment"}.edit`
  );
  const removeText = t(
    `activities.header.settings.${isActivity ? "activity" : "comment"}.remove`
  );
  const unshareText = t("activities.header.settings.activity.unshare");
  const hideText = t(
    `activities.header.settings.${isActivity ? "activity" : "comment"}.hide`
  );
  const unhideText = t(
    `activities.header.settings.${isActivity ? "activity" : "comment"}.unhide`
  );
  const blockText = t("activities.header.settings.block");
  const reportText = t(`activities.header.settings.report`);
  return (
    <Dropdown
      className={`${styles.icon} icon`}
      icon="ellipsis horizontal"
      direction="left"
      trigger={<></>}
    >
      <Dropdown.Menu>
        {user.id === sharingUser?.id ? (
          <Dropdown.Item
            icon="remove"
            text={unshareText}
            onClick={() => onClick("unshare")}
          ></Dropdown.Item>
        ) : sharingUser?.id != undefined ? (
          <Dropdown.Item
            icon="exclamation"
            text={reportText}
            onClick={() => onClick("report")}
          ></Dropdown.Item>
        ) : user.id === author.id ? (
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
              icon={isHidden ? "unhide" : "hide"}
              text={isHidden ? unhideText : hideText}
              onClick={() => onClick(isHidden ? "unhide" : "hide")}
            ></Dropdown.Item>
            {isActivity && (
              <Dropdown.Item
                icon="ban"
                text={blockText}
                onClick={() => onClick("block")}
              ></Dropdown.Item>
            )}
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ActivityDropdown;
