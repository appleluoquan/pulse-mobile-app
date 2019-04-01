module.exports = {
    "parser": "babel-eslint",
    "parserOptions": {
      "sourceType": "module",
      "ecmaFeatures": {
        "jsx": true
      }
    },
    "rules": {
      "strict": "error",
      "complexity": ["error", 8],
      "max-nested-callbacks": ["error", 3],
      "max-params": ["error", 4],
      "max-depth": ["error", 3],
      "max-len": [
        "error",
        {
          "code": 80,
          "ignoreStrings": true,
          "ignoreComments": true,
          "ignoreTemplateLiterals": true
        }
      ],
      "require-await": "error",
      "no-func-assign": "error",
      "object-shorthand": [
        "error",
        "methods",
        { "avoidExplicitReturnArrows": false }
      ],
      "object-curly-spacing": ["error", "always"],
      "prefer-const": ["error", {
        "destructuring": "any",
        "ignoreReadBeforeAssign": false
      }],
      "no-useless-return": "error",
      "no-else-return": "error",
      "no-return-await": "error",
      "no-var": "error",
      "import/no-duplicates": "error",
      "import/extensions": [
        "error",
        "never",
        {
          ".json": "always",
        }
      ],
      "jest/no-disabled-tests": "error",
      "react/require-optimization": "error",
      "react/no-unused-prop-types": "error",
      "react/no-unused-state": "error",
      "react/no-deprecated": "warn",
      "prettier/prettier": ["error", {
        "trailingComma": "es5",
        "parser": "flow",
        "printWidth": 80
      }]
    },
    "env": {
      "es6": true,
      "jest": true,
      "browser": true,
      "node": true,
      "detox/detox": true
    },
    "plugins": ["detox", "flowtype", "react", "react-native", "jest", "prettier"],
    "extends": [
      "plugin:flowtype/recommended",
      "eslint:recommended",
      "plugin:import/errors",
      "plugin:import/warnings",
      "plugin:jest/recommended",
      "plugin:react/recommended",
      "plugin:react-native/all",
      "prettier",
      "prettier/flowtype",
      "prettier/react"
    ],
    "settings" : {
      "import/resolver": {
        "babel-module": {},
        "node": {
          "extensions": [".js"]
        }
      }
    }
  };