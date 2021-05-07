import React, { useEffect, useRef, useState } from "react";
import { Button, Divider, Icon, Loader } from "semantic-ui-react";
import styles from "./Messenger.module.scss";
import cx from "classnames";
import {
  useCommonStore,
  useMessagesStore,
} from "~root/src/app/providers/RootStoreProvider";
import { observer } from "mobx-react-lite";
import InfiniteScroll from "react-infinite-scroll-component";
import { Message } from "~root/src/app/models/conversation";

interface ItemI {
  message: Message;
  authorMessage: boolean;
  lastRecipientMessage: boolean;
}

const Item: React.FC<ItemI> = ({
  message,
  authorMessage,
  lastRecipientMessage,
}) => {
  const { converser } = useMessagesStore();
  return (
    <div
      className={cx(styles.message, {
        [styles.littleMargin]: authorMessage,
        [styles.bigMargin]: !authorMessage,
      })}
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
            [styles.authorMessage]: message.author.id != converser?.id,
          })}
        >
          {message.body}
        </div>
      </div>
    </div>
  );
};

interface ContentI {
  contentContainerRef: React.RefObject<HTMLDivElement>;
}

const Content: React.FC<ContentI> = observer(({ contentContainerRef }) => {
  const {
    converser,
    messages,
    isLoading,
    messagesCount,
    getMesangesByDate,
    getMessages,
  } = useMessagesStore();
  const { user } = useCommonStore();

  const [isScrolling, setScrollingStatus] = useState(false);

  const textContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchData = () => {
    getMessages();
  };

  useEffect(() => {
    if (!isScrolling)
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.size]);

  let timeOut: ReturnType<typeof setTimeout>;

  const handleScroll = (e: any) => {
    if (e.deltaY < 0) {
      clearTimeout(timeOut);
      setScrollingStatus(true);
      timeOut = setTimeout(() => {
        setScrollingStatus(false);
      }, 10000);
    }
  };

  useEffect(() => {
    contentContainerRef.current?.addEventListener("mousewheel", handleScroll);
  }, []);

  if (isLoading)
    return (
      <div className={styles.loader}>
        <Loader active inline />
      </div>
    );
  return (
    <InfiniteScroll
      dataLength={messages.size}
      next={fetchData}
      hasMore={messages.size < messagesCount}
      style={{ display: "flex", flexDirection: "column-reverse" }}
      loader={
        <div className={styles.loader}>
          <Loader active inline />
        </div>
      }
      inverse
      scrollableTarget="messenger__scrollableDiv"
    >
      <div className={styles.messagesContainer} ref={textContainerRef}>
        <div ref={messagesEndRef}></div>
        {getMesangesByDate.map((message, index, array) => {
          const authorMessage =
            array[index + 1]?.author.id == message.author.id;
          const lastRecipientMessage =
            message.author.id == converser?.id &&
            (array[index - 1]?.author.id == user.id ||
              array[index - 1]?.author.id == undefined);
          return (
            <Item
              key={message.id}
              message={message}
              authorMessage={authorMessage}
              lastRecipientMessage={lastRecipientMessage}
            />
          );
        })}
      </div>
    </InfiniteScroll>
  );
});

interface Props {
  isWindow?: boolean;
}

const Messenger: React.FC<Props> = ({ isWindow = false }) => {
  const {
    closeMessenger,
    converser,
    conversationId,
    newConversation,
    getInitialMessages,
    addMessage,
  } = useMessagesStore();

  const [text, setText] = useState("");
  const textRef = useRef<HTMLElement>(null);

  const contentContainerRef = useRef<HTMLDivElement>(null);
  const myFormRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: any) => {
    setText(e.target.innerText);
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      if (text) {
        myFormRef.current?.dispatchEvent(
          new Event("submit", { bubbles: true, cancelable: true })
        );
      }
    }
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

  const controlSelectHandler = (e: any) => {
    e.preventDefault();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    textRef.current?.addEventListener("mscontrolselect", controlSelectHandler);
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

  return (
    <div
      className={cx(styles.container, {
        [styles.windowContainer]: isWindow,
      })}
    >
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
            <Icon
              name="close"
              className={cx(styles.closeIcon, {
                [styles.closeIconVisble]: isWindow,
              })}
            />
          </div>
        </div>
      </div>
      <div
        className={styles.content}
        ref={contentContainerRef}
        id="messenger__scrollableDiv"
      >
        <Content contentContainerRef={contentContainerRef} />
      </div>

      <Divider className={styles.divider} />
      <div className={styles.toolbar}>
        <form className={styles.form} onSubmit={handleSubmit} ref={myFormRef}>
          <div className={styles.newMessage}>
            <span
              contentEditable
              role="textbox"
              className={styles.textField}
              placeholder="Type a message"
              suppressContentEditableWarning={true}
              ref={textRef}
              onKeyPress={handleKeyPress}
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
