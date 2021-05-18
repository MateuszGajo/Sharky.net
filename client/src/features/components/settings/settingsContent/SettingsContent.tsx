import { observer } from "mobx-react-lite";
import React from "react";
import { useSettingStore } from "~root/src/app/providers/RootStoreProvider";
import SettingsGeneral from "../settingsGeneral/SettingsGeneral";
import SettingsSecurty from "../settingsSecurity/SettingsSecurity";
import SettingsUsersBlocked from "../SettingsUsersBlocked/SettingsUsersBlocked";

const SettingsContent = () => {
  const { activeItem } = useSettingStore();
  const render = () => {
    switch (activeItem) {
      case "account":
        return <SettingsGeneral />;
      case "security":
        return <SettingsSecurty />;
      case "blocking":
        return <SettingsUsersBlocked />;
      default:
        return <SettingsGeneral />;
    }
  };
  return render();
};

export default observer(SettingsContent);
