module.exports = {
    extends: [
        "airbnb-base",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
        "prettier/@typescript-eslint",
    ],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
    },
    plugins: ["@typescript-eslint", "prettier"],
    rules: {
        quotes: ["error", "double", { avoidEscape: true }],
        "no-unused-vars": ["error", { argsIgnorePattern: "^_" }], // Same rule as ts
        "no-use-before-define": "off",
        "no-console": "off",
        "no-new": "off", // AWS CDK rely on new Object to process
        "no-template-curly-in-string": "off", // AWS CDK uses template string in Fn functions
        "import/prefer-default-export": "off",
        "import/extensions": "off",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-use-before-define": "off",
        "prefer-destructuring": ["error", { array: false, object: true }],
    },
    overrides: [
        {
            files: ["*.test.ts"],
            rules: {
                "import/first": "off",
                "import/newline-after-import": "off",
            },
        },
    ],
    env: {
        node: true,
        browser: true,
        jest: true,
        es6: true,
    },
    settings: {
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"],
        },
        "import/resolver": {
            // use <root>/tsconfig.json
            typescript: {
                alwaysTryTypes: true, // always try to resolve types under `<roo/>@types` directory even it doesn't contain any source code, like `@types/unist`
            },
        },
    },
};
