import React, { useEffect, useRef, useState } from "react";
import { Icon } from "semantic-ui-react";
import cx from "classnames";
import styles from "./Navbar.module.scss";
import { navItems } from "~utils/utils";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import agent from "~root/src/app/api/agent";

interface redirectProps {
  name: string;
  linkTo: string;
}

const Navbar = () => {
  const { t } = useTranslation("components");
  const [activeItem, setActiveItem] = useState<string>("home");
  const router = useRouter();

  const handleItemClick = ({ name, linkTo }: redirectProps) => {
    if (name == "logout") {
      agent.Account.logout().then(() => router.push("/signin"));
    } else {
      setActiveItem(name);
      router.push(linkTo);
    }
  };

  const navbar = useRef<HTMLDivElement | null>(null);
  const [isNavbarScrolling, setStatusOfNavbarScrolling] = useState(false);

  let timeout: number;

  const showScroll = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    setStatusOfNavbarScrolling(true);

    timeout = window.setTimeout(() => {
      setStatusOfNavbarScrolling(false);
    }, 1000);
  };

  useEffect(() => {
    navbar.current?.addEventListener("wheel", showScroll);

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
      <div className={styles.navbarContainer}>
        {navItems.map((item: any) => (
          <div
            className={cx(styles.item, {
              [styles.itemActive]: activeItem == item.name,
            })}
            key={item.id}
            onClick={() =>
              handleItemClick({ name: item.name, linkTo: item.linkTo })
            }
          >
            <Icon name={item.icon} />
            <span className={styles.itemText}>
              {t(`components:navbar.${item.name}`)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
