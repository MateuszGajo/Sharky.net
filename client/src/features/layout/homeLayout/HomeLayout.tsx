import { observer } from "mobx-react-lite";
import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Messenger from "~components/messenger/Messenger";
import Navbar from "~components/nav/Navbar";
import Sidebar from "~components/sidebar/Sidebar";
import {
  useCommonStore,
  useMessagesStore,
} from "~root/src/app/providers/RootStoreProvider";
import styles from "./HomeLayout.module.scss";

interface Props {
  children: ReactNode;
  sidebar?: boolean;
}

const HomeLayout: React.FC<Props> = ({ children, sidebar = false }) => {
  const { isMessengerOpen, isWindowMessenger } = useMessagesStore();
  const { createHubConnection, stopHubConnection } = useCommonStore();

  const router = useRouter();

  useEffect(() => {
    createHubConnection(router.pathname);
    return () => {
      stopHubConnection();
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <Navbar />
      </div>
      <div className={styles.content}>
        {isMessengerOpen && isWindowMessenger && <Messenger isWindow />}
        {children}
      </div>
      {sidebar && (
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
      )}
    </div>
  );
};

export default observer(HomeLayout);
