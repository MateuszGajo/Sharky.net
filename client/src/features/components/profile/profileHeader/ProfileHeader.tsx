import { observer } from "mobx-react-lite";
import React from "react";
import { Item } from "semantic-ui-react";
import { useProfileStore } from "~root/src/app/providers/RootStoreProvider";
import styles from "./profileHeader.module.scss";

const ProfileHeader = () => {
  const { userDetails, changePhoto } = useProfileStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file;
    if (e.target.files) {
      file = e.target.files[0];
    }
    if (file) changePhoto(file);
  };
  return (
    <div className={styles.container}>
      <Item.Group divided>
        <Item>
          <Item.Image size="small" className={styles.photoContainer}>
            <img
              src={
                userDetails?.photo?.url ||
                process.env.NEXT_PUBLIC_DEFAULT_AVATAR
              }
            />
            <div className={styles.profileUpload}>
              <input
                type="file"
                id="profile-upload"
                className={styles.uploadPhotoInput}
                onChange={handleChange}
              />
              <label
                htmlFor="profile-upload"
                className={styles.profileUploadLabel}
              >
                Upload
              </label>
            </div>
          </Item.Image>
          <Item.Content verticalAlign="middle">
            <div className={styles.username}>
              <p>{userDetails!.firstName}</p>
              <p>{userDetails!.lastName}</p>
            </div>
          </Item.Content>
        </Item>
      </Item.Group>
    </div>
  );
};

export default observer(ProfileHeader);
