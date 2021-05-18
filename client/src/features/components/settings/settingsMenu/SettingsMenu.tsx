import { observer } from "mobx-react-lite";
import React from "react";
import { Menu } from "semantic-ui-react";
import { useSettingStore } from "~root/src/app/providers/RootStoreProvider";
import styles from "./SettingsMenu.module.scss";
import useTranslation from "next-translate/useTranslation";

const SettingsMenu = () => {
  const { t } = useTranslation("settings");
  const { activeItem, setActiveItem, openContent } = useSettingStore();
  const handleItemClick = (e: React.MouseEvent<HTMLElement>, { name }: any) => {
    setActiveItem(name);
    openContent();
  };

  return (
    <Menu vertical className={styles.container}>
      <Menu.Item>
        <Menu.Header>{t("menu.general")}</Menu.Header>

        <Menu.Menu>
          <Menu.Item
            name="account"
            active={activeItem === "account"}
            onClick={handleItemClick}
          >
            {t("menu.account")}
          </Menu.Item>
          <Menu.Item
            name="security"
            active={activeItem === "security"}
            onClick={handleItemClick}
          >
            {t("menu.security")}
          </Menu.Item>
        </Menu.Menu>
      </Menu.Item>

      <Menu.Item>
        <Menu.Header>{t("menu.privacy")}</Menu.Header>

        <Menu.Menu>
          <Menu.Item
            name="blocking"
            active={activeItem === "blocking"}
            onClick={handleItemClick}
          >
            {t("menu.blocking")}
          </Menu.Item>
          <Menu.Item
            name="notification"
            active={activeItem === "notification"}
            onClick={handleItemClick}
          >
            {t("menu.notification")}
          </Menu.Item>
        </Menu.Menu>
      </Menu.Item>

      <Menu.Item>
        <Menu.Header>{t("menu.support")}</Menu.Header>

        <Menu.Menu>
          <Menu.Item
            name="email"
            active={activeItem === "email"}
            onClick={handleItemClick}
          >
            {t("menu.emailSupport")}
          </Menu.Item>

          <Menu.Item
            name="faq"
            active={activeItem === "faq"}
            onClick={handleItemClick}
          >
            {t("menu.faqs")}
          </Menu.Item>
        </Menu.Menu>
      </Menu.Item>
    </Menu>
  );
};

export default observer(SettingsMenu);
