import { User } from "./activity";
import { Conversation } from "./conversation";

export interface Friend {
  id: string;
  friend: User;
  requestTime: Date;
  friendRequestFlag: number;
  conversation?: Conversation;
}
