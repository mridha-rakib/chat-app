import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        console: "readonly",
        process: "readonly",
      },
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    plugins: {
      prettier: prettier,
      import: importPlugin,
    },
    rules: {
      ...prettierConfig.rules,

      // Import grouping and sorting
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // Node.js built-in modules
            "external", // npm packages
            "internal", // Internal modules
            "parent", // Parent directory imports
            "sibling", // Same directory imports
            "index", // Index file imports
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/newline-after-import": "error",

      // Remove the old sort-imports rule
      // "sort-imports": "off",  // Remove this line entirely

      // Prettier integration
      "prettier/prettier": "error",

      // General rules
      "no-console": "warn",
      "no-debugger": "error",
      "prefer-const": "error",
      "no-var": "error",
    },
    settings: {
      "import/resolver": {
        javascript: {
          project: "./jsconfig.json",
        },
        node: {
          extensions: [".js", ".jsx"],
        },
      },
    },
  },
];
