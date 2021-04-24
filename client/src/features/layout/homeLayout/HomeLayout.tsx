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
      <div className={styles.mobileBar}>
        <h1 className={styles.brand}>
          Sha<span className={styles.brandMix}>rky</span>
        </h1>
        <div className={styles.hamburger}>
          <Icon name="bars" className={styles.hamburgerIcon} />
        </div>
      </div>
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
