import { User } from "./activity";

export interface Conversation {
  id: string;
  creator: User;
  recipient: User;
}

export interface Message {
  id: string;
  createdAt: Date;
  body: string;
  author: User;
}
