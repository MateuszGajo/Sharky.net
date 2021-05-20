import { enableStaticRendering } from "mobx-react-lite";
import React, { createContext, ReactNode, useContext } from "react";
import { RootStore, RootStoreHydration } from "../stores/RootStore";

enableStaticRendering(typeof window === "undefined");

let store: RootStore;
const StoreContext = createContext<RootStore | undefined>(undefined);
StoreContext.displayName = "StoreContext";

export function useRootStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useRootStore must be used within RootStoreProvider");
  }
  return context;
}

export const useActivityStore = () => {
  const { activityStore } = useRootStore();
  return activityStore;
};

export const useCommentStore = () => {
  const { commentStore } = useRootStore();
  return commentStore;
};

export const useReplyStore = () => {
  const { replyStore } = useRootStore();
  return replyStore;
};

export const useCommonStore = () => {
  const { commonStore } = useRootStore();
  return commonStore;
};

export const useAuthenticationStore = () => {
  const { authenticationStore } = useRootStore();
  return authenticationStore;
};

export const useUserStore = () => {
  const { userStore } = useRootStore();
  return userStore;
};

export const useMessagesStore = () => {
  const { messageStore } = useRootStore();
  return messageStore;
};

export const useFriendStore = () => {
  const { friendStore } = useRootStore();
  return friendStore;
};

export const useNotificationStore = () => {
  const { notificationStore } = useRootStore();
  return notificationStore;
};

export const useSettingStore = () => {
  const { settingsStore } = useRootStore();
  return settingsStore;
};

export function RootStoreProvider({
  children,
  hydrationData,
}: {
  children: ReactNode;
  hydrationData?: RootStoreHydration;
}) {
  const store = initializeStore(hydrationData);

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

function initializeStore(initialData?: RootStoreHydration): RootStore {
  const _store = store ?? new RootStore();

  if (initialData) {
    _store.hydrate(initialData);
  }

  if (typeof window === "undefined") return _store;

  if (!store) store = _store;

  return _store;
}
