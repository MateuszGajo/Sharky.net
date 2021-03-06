import React from "react";
import { Button, Dropdown } from "semantic-ui-react";
import useTranslation from "next-translate/useTranslation";
import styles from "./Card.module.scss";
import { Photo } from "~root/src/app/models/authentication";

interface Props {
  photo?: Photo | null;
  id: string;
  name: string;
  onDeleteClick?: (id: string) => void;
  onButtonClick?: (id: string) => void;
  profileButton?: boolean;
  buttonText?: string;
  referenceId: string;
}

const Card: React.FC<Props> = ({
  id,
  photo,
  name,
  onDeleteClick,
  onButtonClick,
  profileButton,
  referenceId,
  buttonText,
}) => {
  const { t } = useTranslation("common");
  const unfriendText = t("card.unfriend");
  return (
    <div className={styles.container}>
      <div className={styles.cardContainer}>
        <div className={styles.user}>
          <div className={styles.photoContainer}>
            <img
              src={photo?.url || process.env.NEXT_PUBLIC_DEFAULT_AVATAR}
              alt=""
              className={styles.photo}
            />
          </div>
          <div className={styles.username}>
            <span className={styles.usernameText}>{name}</span>
          </div>
        </div>
        <div className={styles.dropdownContainer}>
          {onDeleteClick != undefined ? (
            <Dropdown
              icon="ellipsis horizontal"
              direction="left"
              trigger={<></>}
              className={styles.dropdown}
            >
              <Dropdown.Menu>
                <Dropdown.Item
                  className={styles.optionItem}
                  icon="remove user"
                  text={unfriendText}
                  onClick={() => onDeleteClick(referenceId)}
                />
              </Dropdown.Menu>
            </Dropdown>
          ) : onButtonClick != undefined ? (
            <Button
              positive
              size="tiny"
              onClick={() => onButtonClick(referenceId)}
            >
              {buttonText}
            </Button>
          ) : (
            profileButton && (
              <Button
                positive
                size="tiny"
                as="a"
                href={`/profile${id ? "?userId=" + id : ""}`}
              >
                {buttonText}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
