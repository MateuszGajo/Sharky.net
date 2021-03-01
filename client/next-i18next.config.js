module.exports = {
  i18n: {
    defaultLocale: "pl",
    locales: ["en", "pl"],
    load: "languageOnly",
    ns: ["common", "components"],
    defaultNS: "components",
    localePath: "public/locales", //  Problem persist if i comment this line and use ./static/locales
    localeStructure: "{{lng}}/{{ns}}",
    react: {
      bindI18n: "languageChanged",
      useSuspense: false,
    },
  },
};
