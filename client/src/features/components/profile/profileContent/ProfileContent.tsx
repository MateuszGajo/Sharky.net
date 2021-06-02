import { observer } from "mobx-react-lite";
import React from "react";
import { useRouter } from "next/router";
import ActivitiesList from "~components/activities/activitiesList/ActivitiesList";
import { useProfileStore } from "~root/src/app/providers/RootStoreProvider";
import ProfileFriendsList from "~components/profile/profileFriendsList/ProfileFriendsList";
import ProfileAbout from "../profileAbout/ProfileAbout";
import styles from "./ProfileContent.module.scss";
import ProfileGroups from "../profileGroups/ProfileGroups";
import ProfileFanpages from "../profileFanpages/ProfileFanpages";

const ProfileContent = () => {
  const { activeItem } = useProfileStore();

  const router = useRouter();
  let userId: string | undefined;
  const { userId: queryUserId } = router.query;
  if (Array.isArray(queryUserId) && queryUserId.length > 0) {
    userId = queryUserId[0];
  } else if (!Array.isArray(queryUserId)) userId = queryUserId;

  const render = () => {
    switch (activeItem) {
      case "posts":
        return <ActivitiesList userId={userId} />;
      case "friends":
        return <ProfileFriendsList userId={userId} />;
      case "groups":
        return <ProfileGroups />;
      case "fanpages":
        return <ProfileFanpages />;
      case "about":
        return <ProfileAbout />;
    }
  };
  return <div className={styles.container}>{render()}</div>;
};

export default observer(ProfileContent);
