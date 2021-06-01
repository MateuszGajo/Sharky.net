import { observer } from "mobx-react-lite";
import React from "react";
import { Menu, MenuItemProps } from "semantic-ui-react";
import useTranslation from "next-translate/useTranslation";
import { useProfileStore } from "~root/src/app/providers/RootStoreProvider";
import styles from "./profileNavbar.module.scss";

const profileNavbar = () => {
  const { t } = useTranslation("profile");
  const { setActiveItem, activeItem } = useProfileStore();

  const handleItemClick = (e: any, { name }: MenuItemProps) => {
    setActiveItem(name!);
  };

  const postsText = t("navbar.posts");
  const friendsText = t("navbar.friends");
  const groupsText = t("navbar.groups");
  const fanpagesText = t("navbar.fanpages");
  const aboutText = t("navbar.about");
  return (
    <Menu pointing secondary fluid widths={5}>
      <Menu.Item
        className={styles.class}
        name="posts"
        active={activeItem === "posts"}
        onClick={handleItemClick}
      >
        {postsText}
      </Menu.Item>
      <Menu.Item
        name="friends"
        active={activeItem === "friends"}
        onClick={handleItemClick}
      >
        {friendsText}
      </Menu.Item>
      <Menu.Item
        name="groups"
        active={activeItem === "groups"}
        onClick={handleItemClick}
      >
        {groupsText}
      </Menu.Item>
      <Menu.Item
        name="fanpages"
        active={activeItem === "fanpages"}
        onClick={handleItemClick}
      >
        {fanpagesText}
      </Menu.Item>
      <Menu.Item
        name="about"
        active={activeItem === "about"}
        onClick={handleItemClick}
      >
        {aboutText}
      </Menu.Item>
    </Menu>
  );
};

export default observer(profileNavbar);
