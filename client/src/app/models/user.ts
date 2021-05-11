import { User } from "./activity";
import { Conversation } from "./conversation";

export interface Friend {
  id: string;
  user: User;
}

export interface OnlineFriend {
  id: string;
  friend: User;
  requestTime: Date;
  friendRequestFlag: number;
  conversation?: Conversation;
  isMessage?: boolean;
}

export interface GetFriends {
  id?: string;
  filterText?: string;
}
