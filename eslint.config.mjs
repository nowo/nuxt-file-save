// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

// Run `npx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt({
    features: {
        // Rules for module authors
        tooling: true,
        // Rules for formatting
        stylistic: {
            indent: 4, // 4, or 'tab'
            quotes: 'single', // or 'double'
        },
    },
    dirs: {
        src: [
            './playground',
        ],
    },
})
    .append(
        // your custom flat config here...
        {
            rules: {
                'no-console': [
                    'warn',
                    {
                        allow: ['error', 'warn'],
                    },
                ],
                '@typescript-eslint/no-unused-vars': [
                    'warn',
                    {
                        vars: 'all',
                        // "varsIgnorePattern": "^_",
                        // "args": "after-used",
                        // "argsIgnorePattern": "^_"
                        argsIgnorePattern: '^',
                    },
                ],
                // 'node/prefer-global/process': ['error', 'always'],
                'curly': ['error', 'multi-line', 'consistent'], // 统一的大括号
                // 'style/brace-style': ['error', '1tbs', { allowSingleLine: true }], // 统一的大括号
            },
        },
        {
            // Remember to specify the file glob here, otherwise it might cause the vue plugin to handle non-vue files
            files: ['**/*.vue'],
            rules: {
                'vue/max-attributes-per-line': 'off',
                'vue/first-attribute-linebreak': [
                    'warn',
                    {
                        multiline: 'beside',
                    },
                ],
                'vue/html-indent': ['error', 4, {
                    alignAttributesVertically: false,
                }],
                'vue/html-closing-bracket-newline': [
                    'error',
                    {
                        singleline: 'never',
                        multiline: 'never',
                        selfClosingTag: {
                            singleline: 'never',
                            multiline: 'never',
                        },
                    },
                ],
            },
        },
    )
