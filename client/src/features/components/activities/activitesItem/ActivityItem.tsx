import React, { useState } from "react";
import { Card, Image, Container, Icon, Segment, Item } from "semantic-ui-react";
import cx from "classnames";
import { ActivityMap } from "~root/src/app/models/activity";
import ActivityDownbar from "../activitesDownbar/ActivityDownbar";
import styles from "./ActivityItem.module.scss";
import { formatDate, likeClick } from "~root/src/app/utils/utils";
import ActivityDropdown from "../activitiesDropdown/ActivityDropdown";
import {
  useActivityStore,
  useCommentStore,
  useUserStore,
} from "~root/src/app/providers/RootStoreProvider";
import MessageBoxItem from "~common/messageBox/messageBox/MessageBox";
import { observer } from "mobx-react-lite";

interface shareComponentI {
  isShared: boolean;
  item: ActivityMap;
}

const ShareComponent: React.FC<shareComponentI> = ({ isShared, item }) => {
  if (isShared) {
    const { firstName, lastName, photo } = item.share!.user;
    const { url } = photo || {};
    return (
      <div className={styles.shareContainer}>
        <Segment
          compact
          className={styles.shareSegment}
          title={firstName + lastName}
        >
          <div className={styles.shareContent}>
            <div className={styles.sharingUserPhoto}>
              <img
                src={
                  url ||
                  `https://res.cloudinary.com/dqcup3ujq/image/upload/v1613718046/ubijj2hn4y8nuwe1twtg.png`
                }
                alt=""
              />
            </div>

            <div className={styles.sharingUsername}>
              {firstName} {lastName}
            </div>
          </div>
        </Segment>
        <div className={styles.shareIcon}>
          <Icon name="share" />
        </div>
      </div>
    );
  }
  return null;
};

interface ItemI {
  item: ActivityMap;
}

const CardContent: React.FC<ItemI> = ({ item }) => {
  const { content, photo } = item;
  const { url } = item.photo || {};

  const contentComponent = (
    <Card.Description className={styles.description}>
      <span>{item.content}</span>
    </Card.Description>
  );

  const photoComponent = (
    <div>
      <Image src={url} className={styles.photo} />
    </div>
  );

  const contentAndPhotoComponents = (
    <>
      {contentComponent}
      {photoComponent}
    </>
  );

  const render = () => {
    if (content && photo) return contentAndPhotoComponents;
    else if (item.content) return contentComponent;
    else return photoComponent;
  };

  return render();
};

const IconBar: React.FC<ItemI> = ({ item }) => {
  if (!item.share?.user) {
    const { activityLikeHandle, shareActivity } = useActivityStore();
    const { getComments } = useCommentStore();

    const [numberOfComments, setNumberOfComments] = useState(
      item.commentsCount
    );
    const [numberOfShares, setNumberOfShares] = useState(item.sharesCount);
    const [isComments, setStatusOfComments] = useState(false);
    const [isLiked, setStatusOfLike] = useState(item.isLiked);
    const [numberOfLikes, setNumberOfLikes] = useState<number>(item.likes);
    const [isSubmitting, setStatusOfSubmitting] = useState(false);

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

    const handleLikeClick = () =>
      likeClick({
        isSubmitting,
        setStatusOfSubmitting,
        setNumberOfLikes,
        giveLike: activityLikeHandle,
        setStatusOfLike,
        isLiked,
        id: item.activityId,
      });

    return (
      <Card.Content extra className={styles.downbar}>
        <div className={styles.toolBar}>
          <a className={styles.reply} onClick={handleShareIconClick}>
            <Icon name="share" className={styles.icon} />
            {numberOfShares}
          </a>
          <a className={styles.comment} onClick={handleCommentIconClick}>
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
        </div>

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
    );
  } else return null;
};

const ActivityItem: React.FC<{
  item: ActivityMap;
  setOpen: (status: boolean) => void;
  isShared: boolean;
  isModal?: boolean;
}> = ({ item, setOpen, isShared, isModal = false }) => {
  const { firstName, lastName } = item.user;
  const { user: sharingUser } = item.share || {};

  const {
    deleteActivity,
    hideActivity,
    unshareActivity,
    getActivity,
  } = useActivityStore();
  const { blockUser } = useUserStore();

  const date = formatDate(new Date(item.createdAt));

  const [isEditting, setStatusOfEdit] = useState(false);

  const handleDownbarClick = (type: string) => {
    switch (type) {
      case "edit":
        setStatusOfEdit(true);
        break;
      case "delete":
        deleteActivity(item.activityId, item.id);
        break;
      case "hide":
        hideActivity(item.activityId, item.id);
        break;
      case "block":
        blockUser(item.user.id);
        break;
      case "unshare":
        unshareActivity(item.id);
        break;
    }
  };

  const cardProps = {
    ...(isShared && {
      onClick: () => {
        getActivity(item.share?.appActivityId!);
        setOpen(true);
      },
    }),
  };

  const noEditContent = (
    <Container
      className={cx(styles.container, {
        [styles.modalContainer]: isModal,
      })}
    >
      <ShareComponent item={item} isShared={isShared} />
      <Card fluid {...cardProps} className={styles.activityContainer}>
        <Card.Content className={styles.header}>
          <div className={styles.headerContainer}>
            <div className={styles.header}>
              <div className={styles.userPhotoContainer}>
                <img
                  className={styles.userPhoto}
                  src={
                    item.user.photo?.url ||
                    process.env.NEXT_PUBLIC_DEFAULT_AVATAR
                  }
                  alt="avatar"
                />
              </div>
              <div className={styles.headerTitle}>
                <div className={styles.date}>{date}</div>
                <div className={styles.username}>
                  {firstName + " " + lastName}
                </div>
              </div>
            </div>
            <div className={styles.optionsContainer}>
              <ActivityDropdown
                onClick={handleDownbarClick}
                author={item.user}
                sharingUser={sharingUser}
                isActivity
              />
            </div>
          </div>
        </Card.Content>
        <Card.Content className={styles.content}>
          <CardContent item={item} />
        </Card.Content>
        <IconBar item={item} />
      </Card>
    </Container>
  );

  if (isEditting) {
    return (
      <MessageBoxItem
        content={item.content}
        photoUrl={item.photo?.url}
        setStatusOfEdit={setStatusOfEdit}
        activityId={item.activityId}
        appActivityId={item.id}
      />
    );
  }
  return noEditContent;
};

export default observer(ActivityItem);
