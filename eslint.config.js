const eslintPluginAngular = require('@angular-eslint/eslint-plugin');
const eslintPluginAngularTemplate = require('@angular-eslint/eslint-plugin-template');
const eslintPluginTailwindCSS = require('eslint-plugin-tailwindcss');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const typescriptEslintParser = require('@typescript-eslint/parser');

module.exports = [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: './tsconfig.json',
        createDefaultProgram: true,
      },
    },
    plugins: {
      '@angular-eslint': eslintPluginAngular,
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: require('@angular-eslint/template-parser'),
    },
    plugins: {
      '@angular-eslint/template': eslintPluginAngularTemplate,
      tailwindcss: eslintPluginTailwindCSS,
    },
    rules: {
      'tailwindcss/classnames-order': 'off',
      'tailwindcss/no-arbitrary-value': 'off',
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/no-contradicting-classname': 'error',
      'tailwindcss/enforces-shorthand': 'off',
    },
  },
];
