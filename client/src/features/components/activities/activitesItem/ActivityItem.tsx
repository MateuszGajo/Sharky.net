import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Image,
  Feed,
  Container,
  Icon,
  Form,
  Button,
} from "semantic-ui-react";
import cx from "classnames";
import { Activity, ActivityMap } from "~root/src/app/models/activity";
import ActivityDownbar from "../activitesDownbar/ActivityDownbar";
import styles from "./ActivityItem.module.scss";
import { formatDate } from "~root/src/app/utils/utils";
import ActivityDropdown from "../activitiesDropdown/ActivityDropdown";
import { useActivityStore } from "~root/src/app/providers/RootStoreProvider";

const ActivityItem: React.FC<{ item: ActivityMap }> = ({ item }) => {
  const { likeHandle } = useActivityStore();

  const date = formatDate(new Date(item.createdAt));

  const [isLiked, setStatusOfLike] = useState(item.isLiked);
  const [numberOfLikes, setNumberOfLikes] = useState<number>(item.likes);
  const [numberOfComments, setNumberOfComments] = useState<number>(
    item.comments.size
  );
  const [isEditting, setStatusOfEditting] = useState(true);
  const [content, setContent] = useState("");

  const editTextRef = useRef<HTMLHeadingElement>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(content);
  };

  const handleChange = (e) => {
    setContent(e.target.outerText);
  };
  useEffect(() => {
    if (isEditting)
      editTextRef.current?.addEventListener("input", handleChange);

    return () => {
      editTextRef.current?.removeEventListener("input", handleChange);
    };
  }, [isEditting]);

  return (
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
              <ActivityDropdown onClick={() => {}} author={item.user} />
            </div>
          </Container>
        </Card.Content>
        {isEditting ? (
          <Card.Content className={styles.content}>
            <Card.Description className={styles.editContainer}>
              <Form onSubmit={handleSubmit}>
                <Form.Field>
                  <div className={styles.editContent}>
                    <span
                      ref={editTextRef}
                      role="textbox"
                      contentEditable
                      className={styles.textEdit}
                    >
                      {item.content}
                    </span>
                    <div className={styles.previewContainer}>
                      <img
                        className={styles.preview}
                        src="https://res.cloudinary.com/dqcup3ujq/image/upload/v1613718046/ubijj2hn4y8nuwe1twtg.png"
                        alt=""
                      />
                    </div>
                  </div>
                  <div className={styles.editButtons}>
                    <Button icon="plus" positive />
                    <Button positive>Save</Button>
                  </div>
                </Form.Field>
              </Form>
            </Card.Description>
          </Card.Content>
        ) : (
          <>
            <Card.Content className={styles.content}>
              <Card.Description className={styles.description}>
                <textarea>aa</textarea>
                <span>{item.content}</span>
              </Card.Description>
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
                <a className={styles.comment}>
                  <Icon name="comment" className={styles.icon} />
                  {numberOfComments}
                </a>
                <a className={styles.reply}>
                  <Icon name="share" className={styles.icon} />
                  22
                </a>
              </Container>

              <ActivityDownbar
                postId={item.id}
                comments={item.comments}
                user={item.user}
              />
            </Card.Content>
          </>
        )}
      </Card>
    </Container>
  );
};

export default ActivityItem;
