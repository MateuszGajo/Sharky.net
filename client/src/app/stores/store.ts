import { createContext, useContext } from "react";
import MultiStepStore from "./authenticationStore";

export const store = {
  authenticationStore: new MultiStepStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
