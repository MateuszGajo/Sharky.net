import React from "react";
import { Dropdown, Icon } from "semantic-ui-react";
import styles from "./Card.module.scss";

interface Props {
  photo?: string;
  name: string;
  onDeleteClick: () => void;
}

const Card: React.FC<Props> = ({ photo, name, onDeleteClick }) => {
  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <div className={styles.photoContainer}>
          <img
            src={photo || process.env.NEXT_PUBLIC_DEFAULT_AVATAR}
            alt=""
            className={styles.photo}
          />
        </div>
        <div className={styles.username}>{name}</div>
      </div>
      <div className={styles.dropdown}>
        <Dropdown icon="ellipsis horizontal" direction="left" trigger={<></>}>
          <Dropdown.Menu>
            <Dropdown.Item
              icon="remove user"
              text="Unfriend"
              onClick={() => onDeleteClick()}
            />
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default Card;
