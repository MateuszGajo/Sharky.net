import { User } from "./authentication";

export interface ActivityFormValues {
  content: string;
  file: Blob;
}

export interface Activity {
  id: string;
  user: User;
  photo?: {
    id: string;
    url: string;
  };
  content: string;
  createdAt: Date;
  isLiked: boolean;
  likes: number;
  comments: [];
  commentsCount: number;
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
}

export interface CommentMap extends Omit<Comment, "replies"> {
  replies: Map<string, Reply>;
}

export interface Reply {
  id: string;
  content: string;
  createdAt: Date;
  author: User;
  isHidden: boolean;
}

export interface CreateActResp {
  id: string;
  photo: {
    id: string;
    url: string;
  };
  createdAt: Date;
}

export interface CreateCommResp {
  createdAt: Date;
  id: string;
}
