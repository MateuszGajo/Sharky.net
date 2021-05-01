import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Divider,
  Icon,
  Input,
  Loader,
  Segment,
} from "semantic-ui-react";
import styles from "./Messenger.module.scss";
import cx from "classnames";
import {
  useCommonStore,
  useMessagesStore,
} from "~root/src/app/providers/RootStoreProvider";
import { observer } from "mobx-react-lite";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "~common/Loading/Loading";

const Messenger = () => {
  const {
    closeMessenger,
    converser,
    conversationId,
    messages,
    newConversation,
    getMessages,
    getInitialMessages,
    addMessage,
    isLoading,
  } = useMessagesStore();
  const { user } = useCommonStore();

  const [text, setText] = useState("");

  const textRef = useRef<HTMLElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: any) => {
    setText(e.target.innerText);
  };

  useEffect(() => {
    if (conversationId) {
      getInitialMessages();
    }
    textRef.current?.addEventListener("input", handleChange);
    textRef.current?.focus();
    return () => {
      textRef.current?.removeEventListener("input", handleChange);
    };
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.size]);

  useEffect(() => {
    if (isLoading == false) {
      console.log(textContainerRef.current?.offsetHeight);
      if (contentContainerRef.current && textContainerRef.current)
        contentContainerRef.current.scrollTop =
          textContainerRef.current?.offsetHeight;
      console.log(contentContainerRef?.current?.scrollTop);
    }
  }, [isLoading, messages.size == 10]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (conversationId) {
      addMessage(text).then(() => {
        if (textRef.current) textRef.current.innerHTML = "";
      });
    } else {
      newConversation(text).then(() => {
        if (textRef.current) textRef.current.innerHTML = "";
      });
    }
  };

  const fetchData = () => {
    // getMessages();
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
      <div
        className={styles.content}
        ref={contentContainerRef}
        id="scrollableDiv"
      >
        {isLoading ? (
          <div className={styles.loader}>
            <Loader active inline />
          </div>
        ) : (
          <div className={styles.messagesContainer} ref={textContainerRef}>
            <InfiniteScroll
              dataLength={messages.size} //This is important field to render the next data
              next={fetchData}
              hasMore={true}
              loader={
                <div className={styles.loader}>
                  <Loader active inline />
                </div>
              }
              // inverse
              scrollableTarget="scrollableDiv"
            >
              {Array.from(messages.values()).map((message, index, array) => {
                const authorMessage =
                  array[index - 1]?.author.id == message.author.id;
                const lastRecipientMessage =
                  message.author.id == converser?.id &&
                  (array[index + 1]?.author.id == user.id ||
                    array[index + 1]?.author.id == undefined);
                return (
                  <div
                    className={cx(styles.message, {
                      [styles.littleMargin]: authorMessage,
                      [styles.bigMargin]: !authorMessage,
                    })}
                    key={message.id}
                  >
                    <div className={styles.messageUser}>
                      {lastRecipientMessage && (
                        <img
                          src={process.env.NEXT_PUBLIC_DEFAULT_AVATAR}
                          alt=""
                          className={styles.messageUserPhoto}
                        />
                      )}
                    </div>

                    <div className={cx(styles.messageTextContainer)}>
                      <div
                        className={cx(styles.messageText, {
                          [styles.authorMessage]:
                            message.author.id != converser?.id,
                        })}
                      >
                        {message.body}
                      </div>
                    </div>
                  </div>
                );
              })}
            </InfiniteScroll>
            <div ref={messagesEndRef}></div>
          </div>
        )}
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
