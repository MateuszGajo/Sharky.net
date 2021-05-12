import React from "react";
import { Button, Dropdown, Icon } from "semantic-ui-react";
import styles from "./Card.module.scss";

interface Props {
  photo?: string;
  name: string;
  onDeleteClick?: (id: string) => void;
  onInviteClick?: (id: string) => void;
  referenceId: string;
}

const Card: React.FC<Props> = ({
  photo,
  name,
  onDeleteClick,
  onInviteClick,
  referenceId,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.cardContainer}>
        <div className={styles.user}>
          <div className={styles.photoContainer}>
            <img
              src={photo || process.env.NEXT_PUBLIC_DEFAULT_AVATAR}
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
                  text="Unfriend"
                  onClick={() => onDeleteClick(referenceId)}
                />
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            onInviteClick && (
              <Button positive size="tiny">
                invite
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
