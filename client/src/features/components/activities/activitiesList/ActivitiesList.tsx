import React, { useEffect, useState } from "react";
import styles from "./ActivitiesList.module.scss";
import { Container, Modal } from "semantic-ui-react";
import ActivityItem from "../activitesItem/ActivityItem";
import { observer } from "mobx-react-lite";
import { useActivityStore } from "~root/src/app/providers/RootStoreProvider";

interface Props {
  userId?: string;
}

const ActivitiesList: React.FC<Props> = ({ userId }) => {
  const { getActivities, activitiesByDate, activity } = useActivityStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getActivities(userId);
  }, []);
  return (
    <div>
      <div className={styles.container}>
        <Modal
          centered={false}
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          className={styles.modal}
        >
          {activity && (
            <ActivityItem
              item={activity!}
              setOpen={setOpen}
              isShared={!!activity.share?.user}
              isModal
            />
          )}
        </Modal>
        {activitiesByDate.map((item) => {
          const isShared = !!item.share?.user;
          return (
            <ActivityItem
              key={item.id}
              item={item}
              setOpen={setOpen}
              isShared={isShared}
            />
          );
        })}
      </div>
    </div>
  );
};

export default observer(ActivitiesList);
