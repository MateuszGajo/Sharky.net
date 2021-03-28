import React, { useEffect } from "react";
import styles from "./ActivitiesList.module.scss";
import { Container } from "semantic-ui-react";
import { useStore } from "~root/src/app/stores/store";
import ActivityItem from "./ActivityItem";

const ActivitiesList = () => {
  const { activityStore } = useStore();
  const { getActivities, activities } = activityStore;

  useEffect(() => {
    getActivities();
  }, []);

  return (
    <Container className={styles.container}>
      {activities.map((item) => (
        <ActivityItem key={item.id} />
      ))}
    </Container>
  );
};

export default ActivitiesList;
