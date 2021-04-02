import React, { useState } from "react";
import { Card, Image, Feed, Container, Icon } from "semantic-ui-react";
import cx from "classnames";
import { Activity } from "~root/src/app/models/activity";
import ActivityComment from "./ActivityComment";
import styles from "./ActivityItem.module.scss";
import { formatDate } from "~root/src/app/utils/utils";
import ActivityDropdown from "./ActivityDropdown";
import { useActivityStore } from "~root/src/app/providers/RootStoreProvider";

const ActivityItem: React.FC<{ item: Activity }> = ({ item }) => {
  console.log(item);
  const { likeHandle } = useActivityStore();

  const date = formatDate(new Date(item.createdAt));

  const [isLiked, setStatusOfLike] = useState(item.isLiked);
  const [numberOfLikes, setNumberOfLikes] = useState<number>(item.likes);
  const [numberOfComments, setNumberOfComments] = useState<number>(
    item.comments.length
  );

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

  return (
    <Container className={styles.container}>
      <Card fluid>
        <Card.Content>
          <Container className={styles.headerContainer}>
            <Feed className={styles.noMargin}>
              <Feed.Event>
                <Feed.Label
                  className={styles.userPhoto}
                  image="https://react.semantic-ui.com/images/avatar/large/stevie.jpg"
                />
                <Feed.Content>
                  <Feed.Date content={date} />
                  <Feed.Summary>
                    {item.user.firstName + " " + item.user.lastName}
                  </Feed.Summary>
                </Feed.Content>
              </Feed.Event>
            </Feed>
            <div className={styles.optionsContainer}>
              <ActivityDropdown />
            </div>
          </Container>
        </Card.Content>
        <Card.Content className={styles.content}>
          <Card.Description className={styles.description}>
            <span>{item.content}</span>
          </Card.Description>
          <Container>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/stevie.jpg"
              className={styles.photo}
            />
          </Container>
        </Card.Content>
        <Card.Content extra>
          <Container className={styles.toolBar}>
            <a className={cx(styles.like)} onClick={handleLikeClick}>
              <Icon
                name="like"
                className={cx(styles.icon, {
                  [styles.likeIconActive]: isLiked,
                })}
              />
              {numberOfLikes}
            </a>
            <a className={styles.comment}>
              <Icon name="comment" className={styles.icon} />
              {numberOfComments}
            </a>
            <a className={styles.reply}>
              <Icon name="share" className={styles.icon} />
              22
            </a>
          </Container>

          <ActivityComment postId={item.id} comments={item.comments} />
        </Card.Content>
      </Card>
    </Container>
  );
};

export default ActivityItem;
