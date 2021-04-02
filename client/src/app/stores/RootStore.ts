import CommonStore from "./commonStore";
import ActivityStore from "./activityStore";
import AuthenticationStore from "./authenticationStore";

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
  authenticationStore: AuthenticationStore;
  constructor() {
    this.commonStore = new CommonStore(this);
    this.activityStore = new ActivityStore(this);
    this.authenticationStore = new AuthenticationStore(this);
  }

  hydrate(data: RootStoreHydration) {
    if (data.user) {
      this.commonStore.hydrate(data.user);
    }
  }
}
