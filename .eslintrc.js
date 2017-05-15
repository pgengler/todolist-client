module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:ember-suave/recommended'
  ],
  env: {
    browser: true
  },
  rules: {
    'array-bracket-spacing': 'off',
    'ember-suave/no-direct-property-access': 'off',
    'ember-suave/prefer-destructuring': 'off',
    'new-cap': 'off'

    // 'ember-suave/require-access-in-comments': 'off',
  },
  globals: {
    Showdown: true
  }
};
