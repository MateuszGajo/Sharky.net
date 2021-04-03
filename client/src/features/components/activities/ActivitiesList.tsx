import React, { useEffect } from "react";
import styles from "./ActivitiesList.module.scss";
import { Container } from "semantic-ui-react";
import ActivityItem from "./ActivityItem";
import { observer } from "mobx-react-lite";
import { useActivityStore } from "~root/src/app/providers/RootStoreProvider";

const ActivitiesList = () => {
  const { getActivities, activitiesByDate } = useActivityStore();

  useEffect(() => {
    getActivities();
  }, []);

  return (
    <div>
      <Container className={styles.container}>
        {activitiesByDate.map((item) => (
          <ActivityItem key={item.id} item={item} />
        ))}
      </Container>
    </div>
  );
};

export default observer(ActivitiesList);
