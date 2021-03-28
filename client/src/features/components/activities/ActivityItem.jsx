import React from "react";
import {
  Card,
  Image,
  Feed,
  Container,
  Icon,
  Dropdown,
} from "semantic-ui-react";
import styles from "./ActivityItem.module.scss";

const options = [
  { key: "edit", icon: "edit", text: "Edit Post", value: "edit" },
  { key: "delete", icon: "delete", text: "Remove Post", value: "delete" },
  { key: "hide", icon: "hide", text: "Hide Post", value: "hide" },
];

const ActivityItem = () => {
  return (
    <Container className={styles.container}>
      <Card fluid>
        <Card.Content>
          <Container className={styles.headerContainer}>
            <Feed className={styles.noMargin}>
              <Feed.Event>
                <Feed.Label image="https://react.semantic-ui.com/images/avatar/large/stevie.jpg" />
                <Feed.Content>
                  <Feed.Date content="1 day ago" />
                  <Feed.Summary>Janny</Feed.Summary>
                </Feed.Content>
              </Feed.Event>
            </Feed>
            <div className={styles.optionsContainer}>
              <Icon name="" />
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
            <span> dsaad</span>
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
              <Icon name="like" />
              22
            </a>
            <a>
              <Icon name="comment" />
              22
            </a>
            <a>
              <Icon name="share" />
              22
            </a>
          </Container>
        </Card.Content>
      </Card>
    </Container>
  );
};

export default ActivityItem;
