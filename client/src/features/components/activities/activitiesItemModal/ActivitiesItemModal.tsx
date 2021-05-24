import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Modal } from "semantic-ui-react";
import { useActivityStore } from "~root/src/app/providers/RootStoreProvider";
import ActivityItem from "../activitesItem/ActivityItem";
import styles from "./ActivitiesItemModal.module.scss";

interface Props {
  appActivityId: string;
  click: number;
}

const ActivitiesItemModal: React.FC<Props> = ({ appActivityId, click }) => {
  const { getActivity, activity, clearActivity } = useActivityStore();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (click > 0) {
      getActivity(appActivityId);
      setOpen(true);
    }
    return () => {
      clearActivity();
    };
  }, [click]);

  return (
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
  );
};

export default observer(ActivitiesItemModal);
