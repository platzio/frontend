import globals from "globals";
import js from "@eslint/js";
import eslintPluginVue from "eslint-plugin-vue";
import ts from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  ...eslintPluginVue.configs["flat/recommended"],
  eslintConfigPrettier,
  {
    files: ["src/**/*.{vue,js,jsx,cjs,mjs,ts,tsx,cts,mts}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "error",
      "vue/require-default-prop": "error",
    },
  },
];
