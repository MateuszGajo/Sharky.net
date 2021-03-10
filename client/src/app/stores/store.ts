import { createContext, useContext } from "react";
import MultiStepStore from "./multiStepStore";

export const store = {
  multiStepStore: new MultiStepStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
