import React, { useEffect, useRef, useState } from "react";
import { Card, Image, Feed, Container, Icon } from "semantic-ui-react";
import cx from "classnames";
import { ActivityMap } from "~root/src/app/models/activity";
import ActivityDownbar from "../activitesDownbar/ActivityDownbar";
import styles from "./ActivityItem.module.scss";
import { formatDate } from "~root/src/app/utils/utils";
import ActivityDropdown from "../activitiesDropdown/ActivityDropdown";
import {
  useActivityStore,
  useUserStore,
} from "~root/src/app/providers/RootStoreProvider";
import MessageBoxItem from "~common/messageBox/messageBox/MessageBox";
import agent from "~root/src/app/api/agent";

const ActivityItem: React.FC<{ item: ActivityMap }> = ({ item }) => {
  const {
    likeHandle,
    deleteActivity,
    hideActivity,
    getComments,
  } = useActivityStore();
  const { blockUser } = useUserStore();

  const date = formatDate(new Date(item.createdAt));

  const [isLiked, setStatusOfLike] = useState(item.isLiked);
  const [numberOfLikes, setNumberOfLikes] = useState<number>(item.likes);
  const [numberOfComments, setNumberOfComments] = useState<number>(
    item.commentsCount
  );
  const [isComments, setStatusOfComments] = useState(false);
  const [isEditting, setStatusOfEdit] = useState(false);

  const handleLikeClick = () => {
    likeHandle(isLiked, item.id).then(() => {
      if (isLiked) {
        setNumberOfLikes(numberOfLikes - 1);
        setStatusOfLike(false);
      } else {
        setNumberOfLikes(numberOfLikes + 1);
        setStatusOfLike(true);
      }
    });
  };

  const handleDownbarClick = (type: string) => {
    switch (type) {
      case "edit":
        setStatusOfEdit(true);
        break;
      case "delete":
        deleteActivity(item.id);
        break;
      case "hide":
        hideActivity(item.id);
        break;
      case "block":
        blockUser(item.user.id);
        break;
    }
  };

  const handleCommentIconClick = () => {
    if (!isComments) getComments(item.id);
    setStatusOfComments((prev) => !prev);
  };

  return (
    <>
      {isEditting ? (
        <MessageBoxItem
          content={item.content}
          photoUrl={item.photo?.url}
          setStatusOfEdit={setStatusOfEdit}
          activityId={item.id}
        />
      ) : (
        <Container className={styles.container}>
          <Card fluid>
            <Card.Content className={styles.header}>
              <Container className={styles.headerContainer}>
                <Feed className={styles.noMargin}>
                  <Feed.Event>
                    <Feed.Label
                      className={styles.userPhoto}
                      image={
                        item.user.photo?.url ||
                        "https://res.cloudinary.com/dqcup3ujq/image/upload/v1613718046/ubijj2hn4y8nuwe1twtg.png"
                      }
                    />
                    <Feed.Content>
                      <Feed.Date content={date} className={styles.date} />
                      <Feed.Summary className={styles.userName}>
                        {item.user.firstName + " " + item.user.lastName}
                      </Feed.Summary>
                    </Feed.Content>
                  </Feed.Event>
                </Feed>
                <div className={styles.optionsContainer}>
                  <ActivityDropdown
                    onClick={handleDownbarClick}
                    author={item.user}
                    isActivity
                  />
                </div>
              </Container>
            </Card.Content>

            <Card.Content className={styles.content}>
              {item.content && (
                <Card.Description className={styles.description}>
                  <span>{item.content}</span>
                </Card.Description>
              )}
              <Container>
                {item.photo && (
                  <Image src={item.photo.url} className={styles.photo} />
                )}
              </Container>
            </Card.Content>
            <Card.Content extra>
              <Container className={styles.toolBar}>
                <a className={styles.like} onClick={handleLikeClick}>
                  <Icon
                    name="like"
                    className={cx(styles.icon, {
                      [styles.likeIconActive]: isLiked,
                    })}
                  />
                  <span className={styles.number}>{numberOfLikes}</span>
                </a>
                <a className={styles.comment} onClick={handleCommentIconClick}>
                  <Icon name="comment" className={styles.icon} />
                  {numberOfComments}
                </a>
                <a className={styles.reply}>
                  <Icon name="share" className={styles.icon} />
                  22
                </a>
              </Container>

              {isComments && (
                <ActivityDownbar
                  activityId={item.id}
                  comments={item.comments}
                  user={item.user}
                  isComments={item.commentsCount > 0}
                />
              )}
            </Card.Content>
          </Card>
        </Container>
      )}
    </>
  );
};

export default ActivityItem;
