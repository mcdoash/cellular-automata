// eslint.config.js
const js = require('@eslint/js');
const globals = require('globals');
const { defineConfig } = require('eslint/config');
const stylistic = require('@stylistic/eslint-plugin');
const jsdoc = require('eslint-plugin-jsdoc');

module.exports = defineConfig([
  jsdoc.configs['flat/recommended'],
  {
    files: ['**/*.{js,jms}'],
    plugins: {
      js,
      '@stylistic': stylistic,
      jsdoc
    },
    extends: ['js/recommended', stylistic.configs.recommended],
    languageOptions: {
      sourceType: 'script',
      globals: {
        ...globals.browser,
        ...globals.jquery,
        ...globals.commonjs }
    },
    rules: {
      'no-unused-vars': 'warn',
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/lines-between-class-members': [
        'warn',
        {
          enforce: [
            { blankLine: 'never', prev: 'field', next: 'field' }
          ]
        },
        { exceptAfterOverload: true }
      ],
      'class-methods-use-this': 'warn'
    }
  }
]);
