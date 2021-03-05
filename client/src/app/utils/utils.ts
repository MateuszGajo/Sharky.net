import setLanguage from "next-translate/setLanguage";
export const navItems = [
  {
    id: 1,
    name: "home",
    icon: "home",
    linkTo: "/home",
  },
  {
    id: 2,
    name: "world",
    icon: "world",
    linkTo: "/world",
  },
  {
    id: 3,
    name: "notifications",
    icon: "bell",
    linkTo: "/notifications",
  },
  {
    id: 4,
    name: "messages",
    icon: "facebook messenger",
    linkTo: "/messages",
  },
  {
    id: 5,
    name: "friends",
    icon: "handshake",
    linkTo: "/friends",
  },
  {
    id: 6,
    name: "groups",
    icon: "users",
  },
  {
    id: 7,
    name: "fanpages",
    icon: "newspaper",
  },
  {
    id: 8,
    name: "profile",
    icon: "user",
  },
  {
    id: 9,
    name: "settings",
    icon: "cog",
  },
  {
    id: 10,
    name: "logout",
    icon: "sign-out",
  },
];

export const setLang = async (code: string) => {
  const date = new Date();
  const expireMs = 100 * 365 * 24 * 60 * 60 * 1000; // 100 days
  date.setTime(date.getTime() + expireMs);
  document.cookie = `NEXT_LOCALE=${code};expires=${date.toUTCString()};path=/`;
  await setLanguage(code);
};
