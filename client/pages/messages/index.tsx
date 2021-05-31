import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { Feed, Loader } from "semantic-ui-react";
import cx from "classnames";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/router";
import Loading from "~common/Loading/Loading";
import Messenger from "~components/messenger/Messenger";
import HomeLayout from "~layout/homeLayout/HomeLayout";
import {
  useCommonStore,
  useMessagesStore,
} from "~root/src/app/providers/RootStoreProvider";
import { formatDate, isLoggedIn } from "~utils/utils";
import styles from "./messages.module.scss";
import InfiniteScroll from "react-infinite-scroll-component";
import PrivateRoute from "~root/src/features/routes/PrivateRoute";
import useTranslation from "next-translate/useTranslation";

const Messages = () => {
  const { t } = useTranslation("messages");
  const {
    getConversationsByDate,
    getConversation,
    openMessenger,
    conversations,
    isMoreConversation,
    isMessengerOpen,
  } = useMessagesStore();
  const { user } = useCommonStore();

  const router = useRouter();

  const isTabletOrMobileDevice = useMediaQuery({
    query: "(max-device-width: 1023px)",
  });

  const [isLoading, setLoading] = useState(true);
  const [isNavbarScrolling, setStatusOfNavbarScrolling] = useState(false);

  const conversationListRef = useRef<HTMLDivElement | null>(null);

  let timeout: number;

  const showScroll = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    setStatusOfNavbarScrolling(true);

    timeout = window.setTimeout(() => {
      setStatusOfNavbarScrolling(false);
    }, 1000);
  };

  useEffect(() => {
    getConversation().then(() => {
      if (conversations.size > 0 && !isTabletOrMobileDevice) {
        const conversation = conversations.entries().next().value[1];
        openMessenger(
          conversation.user,
          conversation.id,
          conversation.friendshipId!,
          conversation.messageTo == user.id,
          conversation.MessagesCount
        );
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      conversationListRef.current?.addEventListener("wheel", showScroll);
      return () => {
        conversationListRef.current?.removeEventListener("whell", showScroll);
        clearTimeout(timeout);
      };
    }
  }, [isLoading]);
  const fetchData = () => {
    console.log("fetch");
    getConversation();
  };

  const startNewConversationText = t("startNewConversation");
  return (
    <HomeLayout>
      {isLoading ? (
        <Loading />
      ) : conversations.size == 0 ? (
        <p>any</p>
      ) : (
        <div className={styles.container}>
          <div
            className={cx(styles.conversationList, "primary-scroll", {
              "primary-scroll--active": isNavbarScrolling,
            })}
            ref={conversationListRef}
            id="conversation-list__scrollableDiv"
          >
            <InfiniteScroll
              dataLength={conversations.size}
              next={fetchData}
              hasMore={isMoreConversation}
              loader={
                <div className={styles.loader}>
                  <Loader active inline />
                </div>
              }
              scrollableTarget="conversation-list__scrollableDiv"
            >
              <Feed>
                {getConversationsByDate.map((conversation) => {
                  return (
                    <Feed.Event
                      className={styles.item}
                      key={conversation.id}
                      onClick={() => {
                        openMessenger(
                          conversation.user,
                          conversation.id,
                          conversation.FriendshipId!,
                          conversation.messageTo == user.id,
                          conversation.MessagesCount
                        );
                      }}
                    >
                      <Feed.Label
                        image={
                          conversation.user.photo ||
                          process.env.NEXT_PUBLIC_DEFAULT_AVATAR
                        }
                      />
                      <Feed.Content>
                        <Feed.Summary>
                          {conversation.user.firstName +
                            " " +
                            conversation.user.lastName}
                          <Feed.Date>
                            {conversation?.lastMessage?.createdAt &&
                              formatDate(
                                conversation?.lastMessage?.createdAt,
                                router.locale!
                              )}
                          </Feed.Date>
                        </Feed.Summary>

                        <Feed.Extra>
                          {conversation?.lastMessage?.body ? (
                            conversation?.lastMessage?.body
                          ) : (
                            <p className={styles.newConversation}>
                              {startNewConversationText}
                            </p>
                          )}
                        </Feed.Extra>
                      </Feed.Content>
                    </Feed.Event>
                  );
                })}
              </Feed>
            </InfiniteScroll>
          </div>
          <div
            className={cx(styles.messenger, {
              [styles.messengerOpen]: isMessengerOpen,
            })}
          >
            <Messenger />
          </div>
        </div>
      )}
    </HomeLayout>
  );
};

export const getServerSideProps = async () => {
  return {};
};

export default PrivateRoute(observer(Messages));
