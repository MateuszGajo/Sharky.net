import React, { useEffect, useRef, useState } from "react";
import { Button, Divider, Icon, Input } from "semantic-ui-react";
import styles from "./Messenger.module.scss";
import cx from "classnames";
import { useMessagesStore } from "~root/src/app/providers/RootStoreProvider";
import { observer } from "mobx-react-lite";

const Messenger = () => {
  const {
    closeMessenger,
    converser,
    conversationId,
    messages,
    newConversation,
    getMessages,
  } = useMessagesStore();

  const [text, setText] = useState("");

  const textRef = useRef<HTMLElement>(null);

  const handleChange = (e: any) => {
    setText(e.target.innerText);
  };

  useEffect(() => {
    if (conversationId) {
      getMessages(conversationId);
    }
    textRef.current?.addEventListener("input", handleChange);
    textRef.current?.focus();
    return () => {
      textRef.current?.removeEventListener("input", handleChange);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (conversationId) {
    } else {
      console.log(text);
      newConversation(text);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.user}>
          <div className={styles.photoContainer}>
            <img
              src={process.env.NEXT_PUBLIC_DEFAULT_AVATAR}
              alt=""
              className={styles.photo}
            />
          </div>
          <div className={styles.userInfo}>
            <div className={styles.username}>
              {converser?.firstName + " " + converser?.lastName}
            </div>
            <div className={styles.userExtraInfo}></div>
          </div>
        </div>
        <div className={styles.icons}>
          <div className={styles.icon} onClick={() => closeMessenger()}>
            <Icon name="close" className={styles.closeIcon} />
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.messagesContainer}>
          {Array.from(messages.values()).map((message) => (
            <div
              className={cx(styles.message, {
                [styles.friendMessage]: message.author.id == converser?.id,
              })}
            >
              <div className={styles.messageUser}>
                <img
                  src={process.env.NEXT_PUBLIC_DEFAULT_AVATAR}
                  alt=""
                  className={styles.messageUserPhoto}
                />
              </div>
              <div
                className={cx(styles.messageTextContainer, {
                  [styles.authorMessage]: message.author.id != converser?.id,
                })}
              >
                <div className={styles.messageText}>{message.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Divider className={styles.divider} />
      <div className={styles.toolbar}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.newMessage}>
            <span
              contentEditable
              role="textbox"
              className={styles.textField}
              placeholder="Type a message"
              suppressContentEditableWarning={true}
              ref={textRef}
            ></span>
          </div>
          <div className={styles.sendMessage}>
            <Button icon="send" className={styles.sendIcon} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default observer(Messenger);
