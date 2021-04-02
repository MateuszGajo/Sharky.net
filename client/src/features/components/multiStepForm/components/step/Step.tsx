import { observer } from "mobx-react-lite";
import React from "react";
import { Icon } from "semantic-ui-react";
import { useAuthenticationStore } from "~root/src/app/providers/RootStoreProvider";
import styles from "./Step.module.scss";

interface Props {
  children: any;
  pageIndex?: number;
  dataKey?: string;
}

const Step: React.FC<Props> = ({ children, pageIndex }) => {
  const {
    page,
    numberOfPages,
    nextPage,
    previousPage,
  } = useAuthenticationStore();
  return pageIndex === page ? (
    <div className={styles.container}>
      <Icon
        name="arrow left"
        className={styles.arrowLeft}
        size="big"
        disabled={page === 1}
        onClick={previousPage}
      />
      <Icon
        name="arrow right"
        className={styles.arrowRight}
        size="big"
        disabled={page === numberOfPages}
        onClick={() => nextPage()}
      />
      {children}
    </div>
  ) : null;
};

export default observer(Step);
