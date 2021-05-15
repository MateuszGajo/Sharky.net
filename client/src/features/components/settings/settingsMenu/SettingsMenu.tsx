import React from "react";
import { Menu } from "semantic-ui-react";
import styles from "./SettingsMenu.module.scss";

const SettingsMenu = () => {
  const { activeItem } = { activeItem: "enterprise" };
  const handleItemClick = (e: any, { name }: any) => {};
  return (
    <Menu vertical className={styles.container}>
      <Menu.Item>
        <Menu.Header>General</Menu.Header>

        <Menu.Menu>
          <Menu.Item
            name="Account settings"
            active={activeItem === "enterprise"}
            onClick={handleItemClick}
          />
          <Menu.Item
            name="security"
            active={activeItem === "consumer"}
            onClick={handleItemClick}
          />
        </Menu.Menu>
      </Menu.Item>

      <Menu.Item>
        <Menu.Header>Privacy</Menu.Header>

        <Menu.Menu>
          <Menu.Item
            name="blocking"
            active={activeItem === "rails"}
            onClick={handleItemClick}
          />
          <Menu.Item
            name="notification"
            active={activeItem === "python"}
            onClick={handleItemClick}
          />
        </Menu.Menu>
      </Menu.Item>

      <Menu.Item>
        <Menu.Header>Support</Menu.Header>

        <Menu.Menu>
          <Menu.Item
            name="email"
            active={activeItem === "email"}
            onClick={handleItemClick}
          >
            E-mail Support
          </Menu.Item>

          <Menu.Item
            name="faq"
            active={activeItem === "faq"}
            onClick={handleItemClick}
          >
            FAQs
          </Menu.Item>
        </Menu.Menu>
      </Menu.Item>
    </Menu>
  );
};

export default SettingsMenu;
