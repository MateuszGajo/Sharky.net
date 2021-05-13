module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "airbnb",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "import/no-unresolved": ["error", { ignore: ["^~"] }],
    "@typescript-eslint/no-explicit-any": "off",
    "linebreak-style": ["error", "windows"],
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [
      2,
      { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    ],
    "no-plusplus": [2, { allowForLoopAfterthoughts: true }],
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    "operator-linebreak": [
      2,
      "after",
      {
        overrides: {
          ":": "before",
          "?": "before",
        },
      },
    ],
    "comma-dangle": [
      "error",
      {
        arrays: "only-multiline",
        objects: "only-multiline",
        imports: "only-multiline",
        exports: "never",
        functions: "never",
      },
    ],
    "react/jsx-props-no-spreading": 0,
    "object-curly-newline": "off",
    "no-unused-expressions": [
      2,
      { allowTernary: true, allowShortCircuit: true },
    ],
    curly: [2, "multi-line"],
    "import/prefer-default-export": "off",
    "jsx-a11y/label-has-associated-control": [
      2,
      {
        labelComponents: ["CustomInputLabel"],
        labelAttributes: ["label"],
        controlComponents: ["CustomInput"],
        depth: 3,
      },
    ],
    "implicit-arrow-linebreak": "off",
    "function-paren-newline": "off",
    "react/jsx-curly-newline": "off",
    "no-param-reassign": ["error", { props: false }],
    indent: "off",
    "no-use-before-define": "off",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
        mjs: "never",
      },
    ],
    "lines-between-class-members": [
      "error",
      "always",
      { exceptAfterSingleLine: true },
    ],
    "arrow-body-style": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "no-inferrable-types": [true, "ignore-params", "ignore-properties"],
    "no-non-null-assertion": true,
  },

  globals: {
    React: "writable",
  },
  settings: {
    "import/resolver": {
      "babel-module": {},
      node: {
        extensions: [".ts", ".tsx", ".native.js"],
        paths: ["src"],
      },
    },
    node: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
  },
};
