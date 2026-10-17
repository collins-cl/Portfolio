module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
    ],
    ignorePatterns: ["dist", ".next", "next.config.js", ".eslintrc.cjs"],
    overrides: [
        {
            files: ["server/**"],
            env: { node: true, es2020: true },
        },
    ],
    parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    settings: { react: { version: "18.2" } },
    rules: {
        "react/no-unescaped-entities": "off",
        "react/prop-types": "off",
    },
};
