import { User } from "./activity";
import { Photo } from "./authentication";
import { Conversation } from "./conversation";

export interface UserDetails {
  id: string;
  firstName: string;
  lastName: String;
  photo: Photo | null;
  activitiesCount: number;
  friendsCount: number;
}

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

export interface UserList extends User {
  isFriend: boolean;
}
