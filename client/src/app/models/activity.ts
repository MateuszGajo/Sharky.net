import { Photo } from "./authentication";

export interface ActivityFormValues {
  content: string;
  file: Blob;
}
export interface User {
  id: string;
  firstName: string;
  lastName: String;
  photo: Photo | null;
}

export interface Activity {
  id: string;
  activityId: string;
  user: User;
  photo?: {
    id: string;
    url: string;
  };
  content: string;
  createdAt: Date;
  modifiedAt: Date;
  isLiked: boolean;
  likes: number;
  comments: [];
  commentsCount: number;
  sharesCount: number;
  share?: {
    user: User;
    createdAt: Date;
    appActivityId: string;
  };
}

export interface ActivityMap extends Omit<Activity, "comments"> {
  comments: Map<string, CommentMap>;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  likes: number;
  createdAt: Date;
  replies: [];
  repliesCount: number;
  isHidden: boolean;
  isLiked: boolean;
}

export interface CommentMap extends Omit<Comment, "replies"> {
  replies: Map<string, Reply>;
}

export interface Reply {
  id: string;
  content: string;
  createdAt: Date;
  author: User;
  likes: number;
  isHidden: boolean;
  isLiked: boolean;
}

export interface CreateActResp {
  id: string;
  activityId: string;
  photo: {
    id: string;
    url: string;
  };
  createdAt: Date;
  notifyId: string;
}

export interface CreateCommResp {
  createdAt: Date;
  id: string;
}
