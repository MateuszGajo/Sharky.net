import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import HomeLayout from "~layout/homeLayout/HomeLayout";
import ProfileHeader from "~components/profile/profileHeader/ProfileHeader";
import ProfileNavbar from "~components/profile/profileNavbar/profileNavbar";
import ProfileContent from "~components/profile/profileContent/ProfileContent";
import {
  useCommonStore,
  useProfileStore,
} from "~root/src/app/providers/RootStoreProvider";
import ProfileNotFound from "~components/profile/profileNotFound/ProfileNotFound";
import { Segment } from "semantic-ui-react";
import PrivateRoute from "~root/src/features/routes/PrivateRoute";
import { observer } from "mobx-react-lite";
import styles from "./profile.module.scss";

const Index = () => {
  const { getUserDetails, isLoading, userDetails } = useProfileStore();
  const { user } = useCommonStore();
  const [isUser, setUser] = useState(true);
  const router = useRouter();
  let userId: string | undefined;

  const { userId: queryUserId } = router.query;
  if (Array.isArray(queryUserId) && queryUserId.length > 0) {
    userId = queryUserId[0];
  } else if (!Array.isArray(queryUserId)) userId = queryUserId;

  useEffect(() => {
    getUserDetails(userId || user.id);
  }, [userId]);

  return (
    <HomeLayout sidebar>
      <div className={styles.container}>
        {isLoading ? (
          <Segment loading />
        ) : (
          <>
            {userDetails ? (
              <>
                <ProfileHeader />
                <ProfileNavbar />
                <ProfileContent />
              </>
            ) : (
              <ProfileNotFound />
            )}
          </>
        )}
      </div>
    </HomeLayout>
  );
};

export const getServerSideProps = async () => {
  return {};
};

export default PrivateRoute(observer(Index));
