import React, { useState } from "react";
import styles from "./SettingsGeneralItem.module.scss";
import { Button, Divider, Icon, Input } from "semantic-ui-react";
import { useSettingStore } from "~root/src/app/providers/RootStoreProvider";

interface Props {
  item: {
    name: string;
    value: string;
  };
}

const SettingsGeneralItem: React.FC<Props> = ({ item }) => {
  const [isEditting, setEditting] = useState(false);
  const [value, setValue] = useState("");
  const { editGeneral } = useSettingStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editGeneral({ [item.name]: value }).then(() => setEditting(false));
  };
  return (
    <>
      <div className={styles.item}>
        <div className={styles.fieldName}>{item.name}</div>
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
                  Save changes
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
            <span>Edit</span>
          </div>
        )}
      </div>
      <Divider />
    </>
  );
};

export default SettingsGeneralItem;
