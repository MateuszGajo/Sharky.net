import React from "react";
import SecondaryInput from "~common/secondaryInput/SecondaryInput";
import useTranslation from "next-translate/useTranslation";

const CredsForm = () => {
  const { t } = useTranslation("signup");
  const passwordText = t("password");
  const confirmPasswordText = t("confirmPassword");

  return (
    <>
      <SecondaryInput placeholder="Email*" name="email" />
      <SecondaryInput
        placeholder={passwordText + "*"}
        name="password"
        type="password"
      />
      <SecondaryInput
        placeholder={confirmPasswordText + "*"}
        name="confirmPassword"
        type="password"
      />
    </>
  );
};

export default CredsForm;
