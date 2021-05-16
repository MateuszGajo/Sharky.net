import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Button, Input } from "semantic-ui-react";
import { useSettingStore } from "~root/src/app/providers/RootStoreProvider";
import styles from "./SettingsSecurityItem.module.scss";
import useTranslation from "next-translate/useTranslation";
import { securitySettingsValidation } from "~utils/utils";

interface Props {
  item: {
    name: string;
    value: string;
  };
}

const SettingsSecurityItem: React.FC<Props> = ({ item }) => {
  const { t } = useTranslation("settings");

  const { edittingEl, setEditting, editSecurity } = useSettingStore();

  const [currentValue, setCurrentValue] = useState(item.value);
  const [newValue, setNewValue] = useState("");
  const [retypeNewValue, setRetypeNewValue] = useState("");
  const [currentValueError, setCurrentValueError] = useState("");
  const [newValueError, setNewValueError] = useState("");
  const [retypeValueError, setRetypeValueError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentValueError("");
    setNewValueError("");
    setRetypeValueError("");
    if (newValue !== retypeNewValue) {
      const newError = t(`error.retype.${item.name}`);
      return setRetypeValueError(newError);
    }
    const currentValueValidationError = securitySettingsValidation(
      item.name,
      currentValue
    );
    if (currentValueValidationError) {
      const newError = t(`error.validation.${currentValueValidationError}`);
      return setCurrentValueError(newError);
    }
    const newValueValidationError = securitySettingsValidation(
      item.name,
      newValue
    );
    if (newValueValidationError) {
      const newError = t(`error.validation.${newValueValidationError}`);
      return setNewValueError(newError);
    }
    editSecurity(item.name, currentValue, newValue);
  };
  return (
    <div className={styles.container}>
      <div className={styles.itemContainer}>
        <div className={styles.name}>
          <span> Change {item.name}</span>
        </div>
        <div>
          <Button positive icon="edit" onClick={() => setEditting(item.name)} />
        </div>
      </div>
      {edittingEl === item.name && (
        <div className={styles.editContainer}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <span className={styles.label}>current</span>
              <Input
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                type={item.name === "password" ? "password" : "text"}
              />
              {currentValueError && (
                <p className={styles.error}>{currentValueError}</p>
              )}
            </div>
            <div className={styles.field}>
              <span className={styles.label}>new</span>
              <Input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                type={item.name === "password" ? "password" : "text"}
              />
              {newValueError && <p className={styles.error}>{newValueError}</p>}
            </div>
            <div className={styles.field}>
              <span className={styles.label}>retype new</span>
              <Input
                value={retypeNewValue}
                onChange={(e) => setRetypeNewValue(e.target.value)}
                type={item.name === "password" ? "password" : "text"}
              />
              {retypeValueError && (
                <p className={styles.error}>{retypeValueError}</p>
              )}
            </div>
            <div className={styles.buttonContainer}>
              <Button positive>Save changes</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default observer(SettingsSecurityItem);
