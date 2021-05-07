import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Divider,
  Form,
  Icon,
  Modal,
  Segment,
} from "semantic-ui-react";
import cx from "classnames";
import styles from "./ActivitiesReportModal.module.scss";
import agent from "~root/src/app/api/agent";

interface Props {
  isOpen: boolean;
  setOpen: (status: boolean) => void;
  userId: string;
}

const ActivitiesReportModal: React.FC<Props> = ({
  isOpen,
  setOpen,
  userId,
}) => {
  const [reportList, setReportList] = useState<any>({});

  const firstRowlist = [
    {
      name: "scam",
      description: "scam",
    },
    {
      name: "spam",
      description: "Spam",
    },
    {
      name: "misleading",
      description: "Misleading",
    },
  ];
  const secondRowList = [
    {
      name: "offensiveContent",
      description: "Offenstive Content",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    agent.User.report(userId, Object.keys(reportList));
  };

  const handleItemClick = (item: any) => {
    let report = reportList[item.name];
    const list = reportList;

    if (report) {
      delete list[item.name];
      setReportList({ ...list });
    } else {
      list[item.name] = true;
      setReportList({ ...list });
    }
  };

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={isOpen}
      className={styles.container}
    >
      <Form onSubmit={handleSubmit}>
        <Segment className={styles.segment}>
          <Modal.Header>
            <Container textAlign="center" className={styles.title}>
              <h1>Report</h1>
            </Container>
            <Divider />
          </Modal.Header>
          <div className={styles.listContainer}>
            <div className={styles.rows}>
              {firstRowlist.map((item) => (
                <div
                  key={item.name}
                  className={cx(styles.item, {
                    [styles.itemActive]: reportList[item.name],
                  })}
                  onClick={() => {
                    handleItemClick(item);
                  }}
                >
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
            <div className={cx(styles.listContainerSecondRow, styles.rows)}>
              {secondRowList.map((item) => (
                <div
                  key={item.name}
                  className={cx(styles.item, {
                    [styles.itemActive]: reportList[item.name],
                  })}
                  onClick={() => {
                    handleItemClick(item);
                  }}
                >
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <Divider />
          <Modal.Actions className={styles.toolbar} c>
            <Button content={"submit"} positive className={styles.button} />
          </Modal.Actions>
          <div className={styles.iconContainer} onClick={() => setOpen(false)}>
            <Icon name="close" className={styles.icon} />
          </div>
        </Segment>
      </Form>
    </Modal>
  );
};

export default ActivitiesReportModal;
