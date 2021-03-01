import React, { useEffect, useRef, useState } from "react";
import { Icon } from "semantic-ui-react";
import cx from "classnames";
import styles from "./Navbar.module.scss";
import { navItems } from "~utils/utils";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

const Navbar = () => {
  const { t } = useTranslation("components");
  const [activeItem, setActiveItem] = useState("home");
  const router = useRouter();
  const handleItemClick = ({ name, linkTo }) => {
    setActiveItem(name);
    router.push(linkTo);
  };

  const navbar = useRef(null);
  const [isNavbarScrolling, setStatusOfNavbarScrolling] = useState(false);

  let timeout;

  const showScroll = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    setStatusOfNavbarScrolling(true);

    timeout = setTimeout(() => {
      setStatusOfNavbarScrolling(false);
    }, 1000);
  };

  useEffect(() => {
    navbar.current.addEventListener("wheel", showScroll);

    return () => {
      navbar.current?.removeEventListener("whell", showScroll);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      className={cx(styles.navbar + " primary-scroll", {
        "primary-scroll--active": isNavbarScrolling,
      })}
      ref={navbar}
    >
      <div className={styles.navbar__container}>
        {navItems.map((item: any) => (
          <div
            className={
              activeItem == item.name
                ? styles.navbar__container__item +
                  " " +
                  styles["navbar__container__item--active"]
                : styles.navbar__container__item
            }
            key={item.id}
            onClick={() =>
              handleItemClick({ name: item.name, linkTo: item.linkTo })
            }
          >
            <Icon name={item.icon} />
            <span className={styles.navbar__container__item__text}>
              {t(`components:navbar.${item.name}`)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
