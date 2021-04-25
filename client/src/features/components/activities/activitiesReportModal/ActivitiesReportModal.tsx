import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Divider,
  Form,
  Modal,
  Segment,
} from "semantic-ui-react";
import cx from "classnames";
import styles from "./ActivitiesReportModal.module.scss";
import agent from "~root/src/app/api/agent";

interface Props {
  isActive: boolean;
  userId: string;
}

const ActivitiesReportModal: React.FC<Props> = ({ isActive, userId }) => {
  const [open, setOpen] = useState(false);
  const [reportList, setReportList] = useState<any>({});

  const firstRowlist = [
    {
      name: "offensiveContent",
      description: "Offenstive Content",
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
      name: "scam",
      description: "scam",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(Object.keys(reportList));
    agent.User.report(userId, Object.keys(reportList));
  };

  useEffect(() => {
    if (open != isActive) setOpen(isActive);
  }, [isActive]);

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
      open={open}
      className={styles.container}
    >
      <Form onSubmit={handleSubmit}>
        <Segment>
          <Modal.Header>
            <Container textAlign="center" className={styles.title}>
              <h1>Report</h1>
            </Container>
            <Divider />
          </Modal.Header>
          <div className={styles.listContainer}>
            <div>
              {firstRowlist.map((item) => (
                <div
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
            <div className={styles.listContainerSecondRow}>
              {secondRowList.map((item) => (
                <div
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
            <Button content={"submit"} positive />
          </Modal.Actions>
        </Segment>
      </Form>
    </Modal>
  );
};

export default ActivitiesReportModal;
