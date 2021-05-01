import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { User } from "../models/activity";
import { Message } from "../models/conversation";
import { RootStore } from "./rootStore";

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
  isLoading = false;

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
    isMessage: boolean
  ) => {
    if (!this.isMessengerOpen) this.isMessengerOpen = true;
    if (this.conversationId != conversationId) {
      this.conversationId = conversationId;
      this.friendshipId = friendshipId;
      this.converser = user;

      this.messages = new Map<string, Message>();

      if (isMessage == true) {
        try {
          await agent.Conversation.readMessages(this.conversationId!);
          const friend = this.root.friendStore.friends.get(friendshipId);
          if (friend) {
            const newFriendObject = {
              ...friend,
              conversation: {
                ...friend.conversation!,
                messageTo: null,
              },
            };
            this.root.friendStore.friends.set(
              newFriendObject.id,
              newFriendObject
            );
          }
        } catch (error) {}
      }
    }
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
      this.messages.set(newMessage.id, newMessage);
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
      this.setMessage(messages);
      runInAction(() => {
        console.log(this.messages.size);
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
      this.setMessage(messages);
    } catch (error) {}
  };

  addMessage = async (messageContext: string) => {
    try {
      const {
        value: { id, createdAt, user },
      } = await this.root.friendStore.hubConnection?.invoke("AddMessage", {
        message: messageContext,
        conversationId: this.conversationId,
      });

      const message = {
        id: id,
        createdAt: createdAt,
        body: messageContext,
        author: user,
      };

      this.messages.set(message.id, message);
    } catch (error) {}
  };
}
