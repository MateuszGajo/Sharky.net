import React, { useState } from "react";
import {
  Card,
  Image,
  Feed,
  Container,
  Icon,
  Item,
  Segment,
} from "semantic-ui-react";
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
import { observer } from "mobx-react-lite";

const ActivityItem: React.FC<{
  item: ActivityMap;
  setOpen: (status: boolean) => void;
  isShared: boolean;
  isModal?: boolean;
}> = ({ item, setOpen, isShared, isModal = false }) => {
  const {
    activityLikeHandle,
    deleteActivity,
    hideActivity,
    getComments,
    shareActivity,
    unshareActivity,
    getActivity,
  } = useActivityStore();
  const { blockUser } = useUserStore();

  const date = formatDate(new Date(item.createdAt));

  const [isLiked, setStatusOfLike] = useState(item.isLiked);
  const [numberOfLikes, setNumberOfLikes] = useState<number>(item.likes);
  const [numberOfComments, setNumberOfComments] = useState(item.commentsCount);
  const [numberOfShares, setNumberOfShares] = useState(item.sharesCount);
  const [isComments, setStatusOfComments] = useState(false);
  const [isEditting, setStatusOfEdit] = useState(false);
  const [isSubmitting, setStatusOfSubmitting] = useState(false);

  const handleLikeClick = () => {
    if (!isSubmitting) {
      setStatusOfSubmitting(true);
      activityLikeHandle(isLiked, item.activityId).then(() => {
        if (isLiked) {
          setNumberOfLikes(numberOfLikes - 1);
          setStatusOfLike(false);
          setStatusOfSubmitting(false);
        } else {
          setNumberOfLikes(numberOfLikes + 1);
          setStatusOfLike(true);
          setStatusOfSubmitting(false);
        }
      });
    }
  };

  const handleDownbarClick = (type: string) => {
    switch (type) {
      case "edit":
        setStatusOfEdit(true);
        break;
      case "delete":
        deleteActivity(item.activityId);
        break;
      case "hide":
        hideActivity(item.activityId);
        break;
      case "block":
        blockUser(item.user.id);
        break;
      case "unshare":
        unshareActivity(item.id);
        break;
    }
  };

  const handleCommentIconClick = () => {
    if (!isComments && item.commentsCount > 0)
      getComments(item.activityId, item.id);
    setStatusOfComments((prev) => !prev);
  };

  const handleShareIconClick = () => {
    shareActivity(item.activityId, item.id).then(() =>
      setNumberOfShares((prev) => prev + 1)
    );
  };

  return (
    <>
      {isEditting ? (
        <MessageBoxItem
          content={item.content}
          photoUrl={item.photo?.url}
          setStatusOfEdit={setStatusOfEdit}
          activityId={item.activityId}
        />
      ) : (
        <Container
          className={cx(styles.container, {
            [styles.modalContainer]: isModal,
          })}
        >
          {isShared && (
            <div className={styles.shareContainer}>
              <Segment compact className={styles.shareSegment}>
                <Item.Group>
                  <Item>
                    <Item.Image
                      size="mini"
                      src={
                        item.share?.user.photo ||
                        `https://res.cloudinary.com/dqcup3ujq/image/upload/v1613718046/ubijj2hn4y8nuwe1twtg.png`
                      }
                    />

                    <Item.Content
                      verticalAlign="middle"
                      className={styles.sharingUsername}
                    >
                      {item.share?.user.firstName} {item.share?.user.lastName}
                      aaaaa
                    </Item.Content>
                  </Item>
                </Item.Group>
              </Segment>
              <div className={styles.shareIcon}>
                <Icon name="share" />
              </div>
            </div>
          )}

          <Card
            fluid
            {...(isShared && {
              onClick: () => {
                getActivity(item.share?.appActivityId!);
                setOpen(true);
              },
            })}
            className={styles.activityContainer}
          >
            <Card.Content className={styles.header}>
              <Container className={styles.headerContainer}>
                <div className={styles.header}>
                  <div className={styles.userPhotoContainer}>
                    <img
                      className={styles.userPhoto}
                      src={
                        item.user.photo?.url ||
                        "https://res.cloudinary.com/dqcup3ujq/image/upload/v1613718046/ubijj2hn4y8nuwe1twtg.png"
                      }
                      alt="user"
                    />
                  </div>
                  <div className={styles.headerTitle}>
                    <div className={styles.date}>{date}</div>
                    <div className={styles.userName}>
                      {item.user.firstName + " " + item.user.lastName}
                    </div>
                  </div>
                </div>
                <div className={styles.optionsContainer}>
                  <ActivityDropdown
                    onClick={handleDownbarClick}
                    author={item.user}
                    sharingUser={item.share?.user}
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
            {!item.share?.user && (
              <Card.Content extra>
                <Container className={styles.toolBar}>
                  <a className={styles.reply} onClick={handleShareIconClick}>
                    <Icon name="share" className={styles.icon} />
                    {numberOfShares}
                  </a>
                  <a
                    className={styles.comment}
                    onClick={handleCommentIconClick}
                  >
                    <Icon name="comment" className={styles.icon} />
                    {numberOfComments}
                  </a>

                  <a className={styles.like} onClick={handleLikeClick}>
                    <Icon
                      name="like"
                      className={cx(styles.icon, {
                        [styles.likeIconActive]: isLiked,
                      })}
                    />
                    <span className={styles.number}>{numberOfLikes}</span>
                  </a>
                </Container>

                {isComments && (
                  <ActivityDownbar
                    activityId={item.activityId}
                    comments={item.comments}
                    user={item.user}
                    setNumberOfComments={setNumberOfComments}
                    numberOfComments={numberOfComments}
                    appActivityId={item.id}
                  />
                )}
              </Card.Content>
            )}
          </Card>
        </Container>
      )}
    </>
  );
};

export default observer(ActivityItem);
