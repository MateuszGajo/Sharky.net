const nextTranslate = require("next-translate");
const withPlugins = require("next-compose-plugins");

module.exports = withPlugins([[nextTranslate]], {
  sassOptions: {
    prependData: `@import "~styles/variables.scss";`,
  },
  distDir: "build",
});
