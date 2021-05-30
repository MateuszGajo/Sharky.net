import React, { useRef, useState } from "react";
import { Button, Icon } from "semantic-ui-react";
import styles from "./Searchbar.module.scss";
import SearchbarItem from "./SearchbarItem";
import useTranslation from "next-translate/useTranslation";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onLeftItemClick: () => void;
  onRightItemClick: () => void;
  onSubmit: (event: any) => void;
  leftText: string;
  rightText: string;
  active?: boolean;
}

const Searchbar: React.FC<Props> = ({
  value,
  onChange,
  onLeftItemClick,
  onRightItemClick,
  leftText,
  rightText,
  onSubmit,
}) => {
  const myFormRef = useRef<HTMLFormElement>(null);
  const { t } = useTranslation("friends");

  const handleKeyDown = (e: any) => {
    if (e.onKeyDownCode === 13) {
      myFormRef.current?.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
    }
  };
  const [activeElement, setActiveElement] = useState("left");

  const searchPlaceholder = t("searchPlaceholder");
  return (
    <div className={styles.container}>
      <div
        className={styles.item}
        onClick={() => {
          setActiveElement("left");
          onLeftItemClick();
        }}
      >
        <SearchbarItem isActive={activeElement === "left"} text={leftText} />
      </div>
      <form className={styles.form} onSubmit={onSubmit} ref={myFormRef}>
        <div className={styles.field}>
          <input
            className={styles.input}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={searchPlaceholder}
            onKeyDown={handleKeyDown}
          />
          <Button
            icon="search"
            type="submit"
            className={styles.searchIcon}
            value={value}
            onChange={(e: any) => onChange(e.target.value)}
          />
        </div>
      </form>
      <div
        className={styles.item}
        onClick={() => {
          setActiveElement("right");
          onRightItemClick();
        }}
      >
        <SearchbarItem
          reverse
          isActive={activeElement === "right"}
          text={rightText}
        />
      </div>
    </div>
  );
};

export default Searchbar;
