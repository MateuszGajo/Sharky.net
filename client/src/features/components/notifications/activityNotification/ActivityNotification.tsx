import React, { useState } from "react";
import { Feed } from "semantic-ui-react";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { formatDate } from "~root/src/app/utils/utils";
import { Notification } from "~models/notification";
import styles from "./ActivityNotification.module.scss";
import ActivitiesItemModal from "~components/activities/activitiesItemModal/ActivitiesItemModal";

interface Props {
  item: Notification;
}

const ActivityNotification: React.FC<Props> = ({ item }) => {
  const { t } = useTranslation("notifications");
  const router = useRouter();
  const [click, setClick] = useState(0);
  return (
    <>
      <ActivitiesItemModal
        appActivityId={item.refId}
        click={click}
        key={item.id}
      />
      <Feed
        className={styles.item}
        onClick={() => setClick((prev) => prev + 1)}
      >
        <Feed.Event>
          <Feed.Label
            image={item.user.photo || process.env.NEXT_PUBLIC_DEFAULT_AVATAR}
          />
          <Feed.Content>
            <Feed.Summary>
              <Feed.User>
                {item.user.firstName + " " + item.user.lastName}
              </Feed.User>{" "}
              <Feed.Date>
                {formatDate(item.createdAt, router.locale!)}
              </Feed.Date>
            </Feed.Summary>
            <Feed.Extra text>{t(`${item.type}.${item.action}`)}</Feed.Extra>
          </Feed.Content>
        </Feed.Event>
      </Feed>
    </>
  );
};

export default ActivityNotification;
