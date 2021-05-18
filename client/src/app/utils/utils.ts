import useTranslate from "next-translate/useTranslation";
import setLanguage from "next-translate/setLanguage";
import type { NextApiRequest } from "next";
import * as Yup from "yup";
import jwt from "jsonwebtoken";
import cookies from "js-cookie";
import { Token } from "../models/authentication";
import React from "react";

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
    linkTo: "/groups",
  },
  {
    id: 7,
    name: "fanpages",
    icon: "newspaper",
    linkTo: "/fanpages",
  },
  {
    id: 8,
    name: "profile",
    icon: "user",
    linkTo: "/profile",
  },
  {
    id: 9,
    name: "settings",
    icon: "cog",
    linkTo: "/settings",
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

export const registerValidationSchema = () => {
  const { t } = useTranslate("common");

  const passwordText = t("signup:password");
  const confirmPasswordText = t("signup:confirmPassword");
  const firstNameText = t("signup:firstName");
  const lastNameText = t("signup:lastName");

  const firstNameRequired = t("validation.requiredField", {
    name: firstNameText,
  });
  const lastNameRequired = t("validation.requiredField", {
    name: lastNameText,
  });
  const emaiRequired = t("validation.requiredField", { name: "E-mail" });
  const passwordRequired = t("validation.requiredField", {
    name: passwordText,
  });
  const confirmPasswordRequired = t("validation.requiredField", {
    name: confirmPasswordText,
  });
  const incorrectConfirmPassword = t("validation.confirmPassword", {
    name: confirmPasswordText,
  });
  const incorrectEmail = t("validation.email");
  const incorrectPhone = t("validation.phone");

  return Yup.object().shape({
    email: Yup.string().required(emaiRequired).email(incorrectEmail),
    password: Yup.string()
      .required(passwordRequired)
      .matches(/^[A-Za-z\d@$!%*?&]{6,}$/, "Must Contain 8 Characters")
      .matches(/(?=.*[A-Z])/, "one big")
      .matches(/(?=.*[a-z])/, "one small")
      .matches(/(?=.*\d)/, "one digit")
      .matches(/[^-a-zA-Z0-9]/, "Password must contain non alphanumeric"),
    confirmPassword: Yup.string()
      .required(confirmPasswordRequired)
      .oneOf([Yup.ref("password"), null], incorrectConfirmPassword),
    firstName: Yup.string().required(firstNameRequired),
    lastName: Yup.string().required(lastNameRequired),
    telephone: Yup.string().matches(
      /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/,
      incorrectPhone
    ),
  });
};

export const signinValidationSchema = () => {
  const { t } = useTranslate("common");
  const passwordText = t("signin:password");

  const emailRequired = t("validation.requiredField", { name: "E-mail" });
  const passwordRequired = t("validation.requiredField", {
    name: passwordText,
  });
  const incorrectEmail = t("validation.email");

  return Yup.object().shape({
    email: Yup.string().required(emailRequired).email(incorrectEmail),
    password: Yup.string().required(passwordRequired),
  });
};

const englishMonthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const polishMonthNames = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
];

export const formatDate = (date: Date) => {
  const time = new Date(date).getTime();
  const currentTime = new Date().getTime();
  const timeDifference = currentTime - time;

  const language = cookies.get("NEXT_LOCALE");
  if (timeDifference < 86400000) {
    if (timeDifference < 60000) {
      const secondsAgo = Math.floor(timeDifference / 1000);
      const enText = timeDifference < 2000 ? " second ago" : " seconds ago";
      const plText =
        timeDifference < 2000
          ? " sekunda temu"
          : timeDifference < 5000
          ? " sekundy temu"
          : " sekund temu";
      const text = language == "pl" ? plText : enText;
      return secondsAgo + text;
    } else if (timeDifference < 3600000) {
      const minutesAgo = Math.floor(timeDifference / 60000);
      const enText = timeDifference < 120000 ? " minut ago" : " minutes ago";
      const plText =
        timeDifference < 120000
          ? " minuta temu"
          : timeDifference < 300000
          ? " minuty temu"
          : " minut temu";
      const text = language == "pl" ? plText : enText;
      return minutesAgo + text;
    }
    const hoursAgo = Math.floor(timeDifference / 3600000);
    const enText = timeDifference < 7200000 ? " hour ago" : " hours ago";
    const plText =
      timeDifference < 7200000
        ? " godzin temu"
        : timeDifference < 18000000
        ? " godziny"
        : " godzin temu";
    const text = language == "pl" ? plText : enText;
    return hoursAgo + text;
  } else {
    let d = new Date(date),
      monthNumber = d.getMonth() + 1,
      day = "" + d.getDate(),
      year = d.getFullYear();

    const monthNames = language == "pl" ? polishMonthNames : englishMonthNames;

    const month = monthNames[monthNumber - 1];
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join(" ");
  }
};

export const verifyJWT = (token: string) => {
  return new Promise<Token>((resolve) => {
    const user = jwt.verify(token, String(process.env.TOKEN_KEY)) as Token;
    resolve(user);
  });
};

export const isLoggedIn = async (req: NextApiRequest) => {
  try {
    const resp = await verifyJWT(req.cookies["Token"]);
    const user = {
      id: resp.id,
      firstName: resp.firstName,
      lastName: resp.lastName,
    };
    return {
      props: { user },
    };
  } catch (err) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }
};

interface verifyPhotoProps {
  setError: (err: string) => void;
  setFile: (file: object[]) => void;
  acceptedFiles: any;
}

export const verifyPhoto = ({
  setError,
  setFile,
  acceptedFiles,
}: verifyPhotoProps) => {
  if (!acceptedFiles[0]) {
    setError("You can only upload a picture");
  } else if (acceptedFiles[0].size > 5242880) {
    setError("You can't upload picture larger than 5mb");
  } else {
    setError("");
    setFile(
      acceptedFiles.map((file: object) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }
};

export const isNotLoggedIn = async (req: NextApiRequest) => {
  try {
    await verifyJWT(req.cookies["Token"]);
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  } catch (err) {
    return {
      props: {},
    };
  }
};

export const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  if (e.key === "enter") {
    e.preventDefault();
    e.stopPropagation();
    new Event("submit");
  }
};

interface handleLikeClickI {
  isSubmitting: boolean;
  setStatusOfSubmitting: (status: boolean) => void;
  giveLike: (isLiked: boolean, id: string) => Promise<void>;
  setNumberOfLikes: (value: number | ((prevVar: number) => number)) => void;
  setStatusOfLike: (status: boolean) => void;
  isLiked: boolean;
  id: string;
}

export const likeClick = ({
  isSubmitting,
  setStatusOfSubmitting,
  giveLike,
  setNumberOfLikes,
  setStatusOfLike,
  isLiked,
  id,
}: handleLikeClickI) => {
  if (!isSubmitting) {
    setStatusOfSubmitting(true);
    giveLike(isLiked, id).then(() => {
      if (isLiked) {
        setNumberOfLikes((prev) => prev - 1);
        setStatusOfLike(false);
        setStatusOfSubmitting(false);
      } else {
        setNumberOfLikes((prev) => prev + 1);
        setStatusOfLike(true);
        setStatusOfSubmitting(false);
      }
    });
  }
};

const regexValidation = {
  email: [
    {
      regex:
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      error: "email",
    },
  ],
  password: [
    {
      regex: /^[A-Za-z\d@$!%*?&]{6,}$/,
      error: "eightCharacters",
    },
    {
      regex: /(?=.*[A-Z])/,
      error: "uppercaseLetter",
    },
    {
      regex: /(?=.*[a-z])/,
      error: "lowercaseLetter",
    },
    {
      regex: /(?=.*\d)/,
      error: "oneDigit",
    },
    {
      regex: /[^-a-zA-Z0-9]/,
      error: "nonAlphanumeric",
    },
  ],
};

export const securitySettingsValidation = (type: string, value: string) => {
  const rules = regexValidation[type as keyof typeof regexValidation];
  for (let i = 0; i < rules.length; i++) {
    if (!value.match(rules[i].regex)) return rules[i].error;
  }
  return "";
};
