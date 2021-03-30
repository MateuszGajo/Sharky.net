export interface ActivityFormValues {
  id: string;
  content: string;
  file: Blob;
}

export interface Activity {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
  content: string;
  createdAt: Date;
  isLiked: boolean;
  likes: number;
  comments: [];
}

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
  };
  likes: number;
  replies: [];
}
