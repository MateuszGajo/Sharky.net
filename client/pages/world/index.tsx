import React from "react";
import useTranslation from "next-translate/useTranslation";
import HomeLayout from "~layout/homeLayout/HomeLayout";

const Index = () => {
  const { t } = useTranslation("common");
  const pageInDevelopment = t("pageInDevelopment");

  const styles = {
    textAlign: "center" as const,
    marginTop: "1em",
    fontSize: "2rem",
    fontWeight: "bold" as const,
  };
  return (
    <HomeLayout sidebar>
      <p style={styles}>{pageInDevelopment}</p>
    </HomeLayout>
  );
};

export default Index;
