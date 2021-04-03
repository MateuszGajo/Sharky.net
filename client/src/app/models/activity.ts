import { User } from "./authentication";

export interface ActivityFormValues {
  id: string;
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
  replies: Reply[];
}

export interface CommentMap extends Omit<Comment, "replies"> {
  replies: Map<string, Reply>;
}

export interface Reply {
  id: string;
  content: string;
  author: User;
}

export interface CreateActResp {
  photo: {
    id: string;
    url: string;
  };
  date: Date;
}

export interface CommentFormValues {
  id: string;
  content: string;
}
