export interface ActivityFormValues {
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
