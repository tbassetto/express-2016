module.exports = {
  plugins: ['node'],
  extends: [
    'airbnb-base',
    'plugin:node/recommended',
  ],
  env: {
    node: true
  },
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
  },
};
