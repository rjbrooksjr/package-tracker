module.exports = {
  env: {
    browser: false,
    node: true,
  },
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier/@typescript-eslint',
  ],
  rules: {
    'comma-style': ['error', 'last'],
    'eol-last': ['error', 'always'],
    'max-len': ['error', { 'code': 120, 'tabWidth': 2 }],
    'semi': ['error', 'always'],
    '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }]
  }
};
