module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['node', 'typescript'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
      },
    ],
    'import/prefer-default-export': 'off',
    'import/no-named-as-default': 'off',
    'import/no-cycle': 'off',
    'import/no-commonjs': 'off',
    'import/no-named-as-default-member': 'off',
    'implicit-arrow-linebreak': 'off',
    'no-plusplus': 'off',
    'no-process-exit': 'off',
    'no-underscore-dangle': 'off',
    'no-shadow': 'off',
    'no-await-in-loop': 'off',
    'no-param-reassign': 'off',
    'no-continue': 'off',
    'no-return-await': 'off',
    'no-use-before-define': ['warn', {classes: false}],
    'no-restricted-syntax': [2, 'WithStatement', 'LabeledStatement'],

    'prefer-promise-reject-errors': 'off',
    'class-methods-use-this': 'off',
    'global-require': 'off',
    'max-len': ['error', {code: 120}],

    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-var-requires': 'off', // enable as warn
    '@typescript-eslint/no-explicit-any': 'off', // enable after fixing
  },
  ignorePatterns: ['**/*.js'],
  settings: {
    'import/extensions': ['.js', '.ts'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.ts'],
    },
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.js', '.ts'],
      },
      alias: {
        map: [
          ['@/*', './src/*'],
          ['@types/*', './src/@types/*'],
          ['@types', './src/@types'],
        ],
      },
    },
  },
};
