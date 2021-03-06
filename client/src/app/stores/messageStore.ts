import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { User } from "../models/activity";
import { ConversationItem, Message } from "../models/conversation";
import { Friend, OnlineFriend } from "../models/user";
import { RootStore } from "./RootStore";

export default class MessageStore {
  root: RootStore;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  isMessengerOpen = false;
  conversationId: string | undefined = undefined;
  friendshipId: string | undefined = undefined;
  converser: User | null = null;
  messages = new Map<string, Message>();
  conversations = new Map<string, ConversationItem>();
  isMoreConversation = true;
  isWindowMessenger = false;
  isLoading = false;
  messagesCount = 0;

  get getMesangesByDate() {
    return Array.from(this.messages.values()).sort((a, b) => {
      return (
        new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()
      );
    });
  }

  get getConversationsByDate() {
    return Array.from(this.conversations.values()).sort((a, b) => {
      return (
        new Date(b?.lastMessage?.createdAt).getTime() -
        new Date(a?.lastMessage?.createdAt).getTime()
      );
    });
  }

  closeMessenger = () => {
    this.conversationId = undefined;
    this.friendshipId = undefined;
    this.converser = null;
    this.isMessengerOpen = false;
  };

  openMessenger = async (
    user: User,
    conversationId: string | undefined,
    friendshipId: string,
    isMessage: boolean,
    messagesCount: number,
    isWindowMessenger: boolean = false
  ) => {
    if (!this.isMessengerOpen) this.isMessengerOpen = true;
    if (this.conversationId !== conversationId || conversationId == null) {
      this.conversationId = conversationId;
      this.friendshipId = friendshipId;
      this.converser = user;
      this.messagesCount = messagesCount;
      this.isWindowMessenger = isWindowMessenger;
      this.messages = new Map<string, Message>();
      if (isMessage === true) {
        try {
          await agent.Conversation.readMessages(this.conversationId!);
          runInAction(() => {
            this.root.commonStore.messagesCount -= 1;

            const friend =
              this.root.friendStore.onlineFriends.get(friendshipId);

            if (friend) {
              const newFriendObject = {
                ...friend,
                conversation: {
                  ...friend.conversation!,
                  messageTo: null,
                },
              };
              this.root.friendStore.onlineFriends.set(
                newFriendObject.id,
                newFriendObject
              );
            }
          });
        } catch (error) {}
      }
    }
  };

  getConversation = async () => {
    try {
      const conversations = await agent.Conversation.get(
        this.conversations.size
      );
      if (conversations.length < 20) {
        this.isMoreConversation = false;
      }
      runInAction(() => {
        conversations.forEach((conversation) => {
          this.conversations.set(conversation.id, conversation);
        });
      });
    } catch (error) {}
  };

  newConversation = async (message: string) => {
    try {
      const response = await agent.Conversation.create(
        this.friendshipId!,
        this.converser!.id,
        message
      );
      this.conversationId = response.conversationId;
      const newMessage = {
        id: response.id,
        createdAt: response.createdAt,
        body: message,
        author: this.root.commonStore.user,
      };
      runInAction(() => {
        this.messages.set(newMessage.id, newMessage);
      });
    } catch (error) {
      const { conversationId } = error.response.data.errors;
      if (conversationId) {
        this.conversationId = conversationId;
        this.addMessage(message);
      }
    }
  };

  setMessage = (messages: Message[]) => {
    messages.forEach((message) => {
      this.messages.set(message.id, message);
    });
  };

  getInitialMessages = async () => {
    this.isLoading = true;
    try {
      const messages = await agent.Conversation.getMessages(
        this.conversationId!,
        this.messages.size
      );
      runInAction(() => {
        this.setMessage(messages);
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  getMessages = async () => {
    try {
      const messages = await agent.Conversation.getMessages(
        this.conversationId!,
        this.messages.size
      );
      runInAction(() => {
        this.setMessage(messages);
      });
    } catch (error) {}
  };

  addMessage = async (messageContext: string) => {
    try {
      const {
        value: { id, createdAt, user },
      } = await this.root.commonStore.hubConnection?.invoke("AddMessage", {
        message: messageContext,
        conversationId: this.conversationId,
        friendshipId: this.friendshipId,
      });

      const message = {
        id: id,
        createdAt: createdAt,
        body: messageContext,
        author: user,
      };
      runInAction(() => {
        this.messagesCount += 1;
        this.messages.set(message.id, message);
        const conversation = this.conversations.get(this.conversationId!);
        if (conversation) {
          const newConversation = {
            ...conversation,
            lastMessage: {
              id: id,
              createdAt: createdAt as Date,
              body: messageContext,
              author: user as User,
            },
          };
          this.conversations.set(newConversation.id!, newConversation);
        }
      });
    } catch (error) {}
  };

  messageListener = () => {
    this.root.commonStore.hubConnection?.on(
      "reciveMessage",
      (
        id: string,
        message: string,
        conversationId: string,
        createdAt: Date,
        user: User,
        friendId: string
      ) => {
        this.newMessage(id, message, conversationId, createdAt, user, friendId);
        const conversation = this.conversations.get(this.conversationId!);
        if (conversation) {
          const newConversation = {
            ...conversation,
            lastMessage: {
              id,
              createdAt,
              body: message,
              author: user,
            },
          };
          this.conversations.set(newConversation.id!, newConversation);
        }
      }
    );
  };

  newMessage = async (
    id: string,
    message: string,
    conversationId: string,
    createdAt: Date,
    user: User,
    friendId: string
  ) => {
    if (
      this.root.messageStore.isMessengerOpen &&
      this.root.messageStore.conversationId == conversationId
    ) {
      const newMessage = {
        id,
        createdAt,
        body: message,
        author: user,
      };

      try {
        await agent.Conversation.readMessages(this.conversationId!);
      } catch (error) {}

      this.root.messageStore.messagesCount += 1;
      this.root.messageStore.messages.set(newMessage.id, newMessage);
    } else {
      const friend = this.root.friendStore.onlineFriends.get(friendId);
      if (friend?.conversation?.messageTo != this.root.commonStore.user.id) {
        this.root.commonStore.messagesCount += 1;

        if (friend) {
          const newFriendObject: OnlineFriend = {
            ...friend,
            conversation: {
              ...friend.conversation!,
              messageTo: this.root.commonStore.user.id,
            },
          };
          this.root.friendStore.onlineFriends.set(
            newFriendObject.id,
            newFriendObject
          );
        }
      }
    }
  };
}
