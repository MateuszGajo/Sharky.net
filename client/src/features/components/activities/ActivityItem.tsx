import React, { useState } from "react";
import {
  Card,
  Image,
  Feed,
  Container,
  Icon,
  Dropdown,
  Divider,
} from "semantic-ui-react";
import cx from "classnames";
import { Activity } from "~root/src/app/models/activity";
import ActivityComment from "./ActivityComment";
import styles from "./ActivityItem.module.scss";
import { formatDate } from "~root/src/app/utils/utils";
import { useStore } from "~root/src/app/stores/store";

const options = [
  { key: "edit", icon: "edit", text: "Edit Post", value: "edit" },
  { key: "delete", icon: "delete", text: "Remove Post", value: "delete" },
  { key: "hide", icon: "hide", text: "Hide Post", value: "hide" },
];

const ActivityItem: React.FC<{ item: Activity }> = ({ item }) => {
  const { activityStore } = useStore();
  const { likeHandle } = activityStore;

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
                <Feed.Label image="https://react.semantic-ui.com/images/avatar/large/stevie.jpg" />
                <Feed.Content>
                  <Feed.Date content={date} />
                  <Feed.Summary>
                    {item.user.firstName + " " + item.user.lastName}
                  </Feed.Summary>
                </Feed.Content>
              </Feed.Event>
            </Feed>
            <div className={styles.optionsContainer}>
              <Dropdown
                className=" icon"
                icon="ellipsis horizontal"
                options={options}
                direction="left"
                trigger={<></>}
              />
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
        <Card.Content Extra>
          <Container className={styles.toolBar}>
            <a>
              <Icon
                name="like"
                className={cx(styles.like, {
                  [styles.likeActive]: isLiked,
                })}
                onClick={handleLikeClick}
              />
              {numberOfLikes}
            </a>
            <a>
              <Icon name="comment" className={styles.comment} />
              {numberOfComments}
            </a>
            <a>
              <Icon name="share" className={styles.reply} />
              22
            </a>
          </Container>

          {!!item.comments.length && (
            <>
              <Divider />
              <ActivityComment />
            </>
          )}
        </Card.Content>
      </Card>
    </Container>
  );
};

export default ActivityItem;
