import React from "react";
import SecondaryInput from "~common/secondaryInput/SecondaryInput";
import useTranslation from "next-translate/useTranslation";

const PersonalForm = () => {
  const { t } = useTranslation("signup");
  const firstNameText = t("firstName");
  const lastNameText = t("lastName");
  const phoneText = t("phone");
  return (
    <>
      <SecondaryInput placeholder={firstNameText} name="firstName" />
      <SecondaryInput placeholder={lastNameText} name="lastName" />
      <SecondaryInput placeholder={phoneText} name="phone" />
    </>
  );
};

export default PersonalForm;
