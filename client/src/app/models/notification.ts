import { User } from "./activity";

export interface NotificationCount {
  messagesCount: number;
  notificationCount: number;
  friendRequestCount: number;
}

export interface Notification {
  id: string;
  user: User;
  type: string;
  createdAt: Date;
  refId: string;
}
