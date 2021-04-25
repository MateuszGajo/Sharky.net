import React, { ReactNode } from "react";
import { Icon } from "semantic-ui-react";
import Navbar from "~components/nav/Navbar";
import Sidebar from "~components/sidebar/Sidebar";
import styles from "./HomeLayout.module.scss";

interface Props {
  children: ReactNode;
  sidebar?: boolean;
}

const HomeLayout: React.FC<Props> = ({ children, sidebar = false }) => {
  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <Navbar />
      </div>
      <div className={styles.content}>{children}</div>
      {sidebar && (
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
      )}
    </div>
  );
};

export default HomeLayout;
