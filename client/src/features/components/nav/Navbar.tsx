import React, { useEffect, useRef, useState } from "react";
import { Icon, SemanticICONS } from "semantic-ui-react";
import cx from "classnames";
import styles from "./Navbar.module.scss";
import { navItems } from "~utils/utils";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import agent from "~root/src/app/api/agent";
import { useCommonStore } from "~root/src/app/providers/RootStoreProvider";
import { NavbarItem } from "~root/src/app/models/common";
import { observer } from "mobx-react-lite";

interface Item {
  item: NavbarItem;
  notifyCount: number;
}

const Item: React.FC<Item> = ({ item, notifyCount }) => {
  const router = useRouter();
  const { t } = useTranslation("components");
  const [activeItem, setActiveItem] = useState<string>(
    router.pathname.substring(1)
  );

  const handleItemClick = ({ name, linkTo }: redirectProps) => {
    if (name == "logout") {
      agent.Account.logout().then(() => router.push("/signin"));
    } else {
      setActiveItem(name);
      router.push(linkTo);
    }
  };

  return (
    <div
      className={cx(styles.item, {
        [styles.itemActive]: activeItem == item.name,
      })}
      onClick={() =>
        handleItemClick({
          name: item.name,
          linkTo: item.linkTo || "",
        })
      }
    >
      <div className={styles.iconContainer}>
        {notifyCount > 0 && (
          <div className={styles.notify}>
            <span className={styles.notifyNumber}>{notifyCount}</span>
          </div>
        )}

        <Icon name={item.icon as SemanticICONS} className={styles.icon} />
      </div>
      <span className={styles.itemText}>
        {t(`components:navbar.${item.name}`)}
      </span>
    </div>
  );
};

interface redirectProps {
  name: string;
  linkTo: string;
}

const Navbar = () => {
  const [isActive, setStatusOfActive] = useState(false);

  const {
    getNotification,
    notificationCount,
    messagesCount,
    friendRequestCount,
  } = useCommonStore();

  const notifyCounts = {
    notifications: notificationCount,
    messages: messagesCount,
    friends: friendRequestCount,
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
    getNotification();

    return () => {
      navbar.current?.removeEventListener("whell", showScroll);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      <div className={styles.mobileBar}>
        <h1 className={styles.brand}>
          Sha<span className={styles.brandMix}>rky</span>
        </h1>
        <div
          className={styles.hamburger}
          onClick={() => setStatusOfActive(!isActive)}
        >
          <Icon
            name={isActive ? "close" : "bars"}
            className={styles.hamburgerIcon}
          />
        </div>
      </div>
      <div
        className={cx(styles.navbar + " primary-scroll", {
          "primary-scroll--active": isNavbarScrolling,
          [styles.navbarActive]: isActive,
        })}
        ref={navbar}
      >
        <div className={styles.navbarContainer}>
          {navItems.map((item: NavbarItem) => {
            const notifyCount =
              notifyCounts[item.name as keyof typeof notifyCounts];
            return <Item key={item.id} item={item} notifyCount={notifyCount} />;
          })}
        </div>
      </div>
    </>
  );
};

export default observer(Navbar);
