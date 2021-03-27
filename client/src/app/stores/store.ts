import { createContext, useContext } from "react";
import AuthenticationStore from "./authenticationStore";
import ActivityStore from "./activityStore";

export const store = {
  authenticationStore: new AuthenticationStore(),
  activityStore: new ActivityStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
