import React, { useState } from "react";
import styles from "./SettingsGeneralItem.module.scss";
import { Button, Divider, Icon, Input } from "semantic-ui-react";
import { useSettingStore } from "~root/src/app/providers/RootStoreProvider";
import useTranslation from "next-translate/useTranslation";

interface Props {
  item: {
    name: string;
    displayName: string;
    value: string;
  };
}

const SettingsGeneralItem: React.FC<Props> = ({ item }) => {
  const { t } = useTranslation("settings");

  const [isEditting, setEditting] = useState(false);
  const [value, setValue] = useState("");
  const { editGeneral } = useSettingStore();

  const editText = t("general.edit");
  const buttonText = t("general.button");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editGeneral({ [item.name]: value }).then(() => setEditting(false));
  };

  return (
    <>
      <div className={styles.item}>
        <div className={styles.fieldName}>{item.displayName}</div>
        <div className={styles.fieldContent}>
          {isEditting ? (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputContainer}>
                <Input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              <div className={styles.buttonContainer}>
                <Button positive size="tiny">
                  {buttonText}
                </Button>
              </div>
            </form>
          ) : (
            <span> {item.value}</span>
          )}
        </div>
        {!isEditting && (
          <div
            className={styles.fieldEdit}
            onClick={() => {
              setValue(item.value);
              setEditting(true);
            }}
          >
            <div>
              <Icon name="edit outline" />
            </div>
            <span>{editText}</span>
          </div>
        )}
      </div>
      <Divider />
    </>
  );
};

export default SettingsGeneralItem;
