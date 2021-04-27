import axios from "axios";
import { makeAutoObservable } from "mobx";
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

  closeMessenger = () => {
    this.isMessengerOpen = false;
  };

  openMessenger = (
    user: User,
    conversationId: string | undefined,
    friendshipId: string
  ) => {
    if (!this.isMessengerOpen) this.isMessengerOpen = true;
    this.conversationId = conversationId;
    this.friendshipId = friendshipId;
    this.converser = user;
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
    } catch (error) {}
  };

  getMessages = async (conversationId: string) => {
    try {
      const messages = await agent.Conversation.getMessages(conversationId);

      messages.forEach((message) => {
        this.messages.set(message.id, message);
      });
    } catch (error) {}
  };
}
