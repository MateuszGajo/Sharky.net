import CommonStore from "./commonStore";
import ActivityStore from "./activityStore";

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
  constructor() {
    this.commonStore = new CommonStore(this);
    this.activityStore = new ActivityStore(this);
  }

  hydrate(data: RootStoreHydration) {
    if (data.user) {
      this.commonStore.hydrate(data.user);
    }
  }
}
