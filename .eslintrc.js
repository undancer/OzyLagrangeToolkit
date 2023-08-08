module.exports = {
    extends: ["airbnb-base", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
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
        // The default no-shaw doesn't work on enum, we need to turn on the typescript version.
        // See comment at: https://github.com/typescript-eslint/typescript-eslint/issues/2483
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": "error",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "no-use-before-define": "off",
        "no-console": "off",
        "no-new": "off", // AWS CDK rely on new Object to process
        "no-template-curly-in-string": "off", // AWS CDK uses template string in Fn functions
        "import/prefer-default-export": "off",
        "no-case-declarations": "off",
        "import/extensions": "off",
        // Disabled for now to be fixed later if possible
        "import/no-cycle": "off",
        "@typescript-eslint/ban-ts-comment": ["error", { "ts-ignore": "allow-with-description" }],
        // Disabling this rule as it conflicts with default behavior with redux toolkit
        "no-param-reassign": "off",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-use-before-define": "off",
        "prefer-destructuring": ["error", { array: false, object: true }],
        "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
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
