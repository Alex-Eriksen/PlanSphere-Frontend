﻿module.exports = {
    root: true,
    ignorePatterns: ["projects/**/*"],
    overrides: [
        {
            files: ["*.ts"],
            extends: [
                "eslint:recommended",
                "plugin:@typescript-eslint/recommended",
                "plugin:@angular-eslint/recommended",
                "plugin:@angular-eslint/template/process-inline-templates",
            ],
            rules: {
                "@typescript-eslint/no-explicit-any": 0,
                "@angular-eslint/directive-selector": [
                    "error",
                    {
                        type: "attribute",
                        prefix: "ps",
                        style: "camelCase",
                    },
                ],
                "@angular-eslint/component-selector": [
                    "error",
                    {
                        type: "element",
                        prefix: "ps",
                        style: "kebab-case",
                    },
                ],
            },
        },
        {
            files: ["*.html"],
            extends: ["plugin:@angular-eslint/template/recommended", "plugin:@angular-eslint/template/accessibility"],
            rules: {},
        },
    ],
};
