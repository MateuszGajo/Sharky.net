import React, { useState } from "react";
import styles from "./SearchbarItem.module.scss";
import cx from "classnames";

interface Props {
  reverse?: boolean;
  isActive?: boolean;
  text: string;
}

const SearchbarItem: React.FC<Props> = ({
  isActive = false,
  reverse = false,
  text,
}) => {
  return (
    <div
      className={cx(styles.item, {
        [styles.reverseItem]: reverse,
        [styles.itemActive]: isActive,
      })}
    >
      <div
        className={cx(styles.textContainer, {
          [styles.textContainerReverse]: reverse,
        })}
      >
        <span
          className={cx(styles.text, {
            [styles.textActive]: isActive,
          })}
        >
          {text}
        </span>
      </div>
      <div
        className={cx(styles.circle, {
          [styles.reverseCircle]: reverse,
          [styles.circleActive]: isActive,
        })}
      ></div>
    </div>
  );
};

export default SearchbarItem;
