import CommonStore from "./commonStore";
import ActivityStore from "./activityStore";
import AuthenticationStore from "./authenticationStore";
import UserStore from "./userStore";
import CommentStore from "./CommentStore";
import ReplyStore from "./ReplyStore";
import MessageStore from "./messageStore";
import FriendStore from "./friendStore";
import NotificationStore from "./notificationStore";
import SettingStore from "./settingStore";
import ProfileStore from "./profileStore";

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
  messageStore: MessageStore;
  friendStore: FriendStore;
  notificationStore: NotificationStore;
  settingsStore: SettingStore;
  profileStore: ProfileStore;

  constructor() {
    this.commonStore = new CommonStore(this);
    this.activityStore = new ActivityStore(this);
    this.commentStore = new CommentStore(this);
    this.replyStore = new ReplyStore(this);
    this.authenticationStore = new AuthenticationStore(this);
    this.userStore = new UserStore(this);
    this.messageStore = new MessageStore(this);
    this.friendStore = new FriendStore(this);
    this.notificationStore = new NotificationStore(this);
    this.settingsStore = new SettingStore(this);
    this.profileStore = new ProfileStore(this);
  }
}
