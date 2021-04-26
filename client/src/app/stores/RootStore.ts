import CommonStore from "./commonStore";
import ActivityStore from "./activityStore";
import AuthenticationStore from "./authenticationStore";
import UserStore from "./userStore";
import CommentStore from "./CommentStore";
import ReplyStore from "./ReplyStore";

export type RootStoreHydration = {
  user?: {
    id: string;
    firstName: string;
    lastName: string;
  };
};

export class RootStore {
  commonStore: CommonStore;
  activityStore: ActivityStore;
  commentStore: CommentStore;
  replyStore: ReplyStore;
  authenticationStore: AuthenticationStore;
  userStore: UserStore;

  constructor() {
    this.commonStore = new CommonStore(this);
    this.activityStore = new ActivityStore(this);
    this.commentStore = new CommentStore(this);
    this.replyStore = new ReplyStore(this);
    this.authenticationStore = new AuthenticationStore(this);
    this.userStore = new UserStore(this);
  }

  hydrate(data: RootStoreHydration) {
    if (data.user) {
      this.commonStore.hydrate(data.user);
    }
  }
}
