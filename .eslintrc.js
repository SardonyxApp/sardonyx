module.exports = {
  "env": {
    "browser": true,
    //to enable browser APIs that are supported by React, like fetch
    "commonjs": true,
    "es6": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    "react"
  ],
  "rules": {
    /* for standardization */
    "indent": [
      "warn",
      2
    ],
    "linebreak-style": [
      "warn",
      "windows"
    ],
    "quotes": [
      "warn",
      "single"
    ],
    "semi": [
      "warn",
      "always"
    ],
    "no-unused-vars": [
      "off"
      /* DO NOT CHANGE -- turned off as no-unused-vars does not recognize component reference in JSX */       
    ],
    "no-console": [
      "off"
      /* We are not in production mode */
    ]
  }
};