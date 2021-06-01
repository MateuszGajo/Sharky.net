import React from "react";
import useTranslation from "next-translate/useTranslation";

const ProfileGroups = () => {
  const { t } = useTranslation("profile");
  const featureInProgress = t("inProgress");
  const styles = {
    fontSize: "2rem",
    fontWeight: "bold",
    marginTop: "2em",
    textAlign: "center",
  } as React.CSSProperties;
  return (
    <div>
      <p style={styles}>{featureInProgress}</p>
    </div>
  );
};

export default ProfileGroups;
