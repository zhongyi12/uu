module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
  },
  extends: 'airbnb-base',
  plugins: [
    'html',
  ],
  settings: {
    "html/html-extensions": [".html", ".vue"],  // consider .html and .we files as HTML
  },
  'rules': {
    'global-require': 0,
    'import/no-unresolved': 0,
    'no-param-reassign': 0,
    'no-shadow': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'indent': ['error', 2, {
      'SwitchCase': 1
    }],
    'brace-style': ['error', 'stroustrup', {
      'allowSingleLine': true
    }],
    'camelcase': 0,
    'no-console': 0,
    // 'func-names': ["error", "always"],
    'space-before-function-paren': ["error", "never"],
    // "no-unused-vars": ["error", { "args": "after-used" }],
    // "max-len": ["error", 128],
    "max-len": ["error", 512],
    "radix":0,
    "no-underscore-dangle":0,
    //
    "no-return-assign":0,
    "linebreak-style":0,
    "semi": 0,
    "no-continue": 0,//禁止使用continue
    // "func-names": 1,//函数表达式必须有名字
    "no-cond-assign": 0,//禁止在条件表达式中使用赋值语句
    "arrow-body-style": 0, // 要求箭头函数体使用大括号
    "no-mixed-operators": 0, // 禁止混合使用不同的操作符
    "func-names": 0, // 强制使用命名的 function 表达式
    "object-shorthand": 0,
    "no-restricted-syntax": 0, // 禁止使用特定的语法
    "guard-for-in": 0, // for in循环要用if语句过滤
    "newline-after-import": 0, 
    "no-lonely-if": 0, // 禁止else语句内只有if语句
    "no-unused-vars": 0,
    "dot-notation": 0,
    "prefer-template": 0,
    "no-extra-parens": 0,
    "no-empty-function": 0,
    "no-empty": 0,
    // "max-len": 0,
    "no-multiple-empty-lines": 0,
    "no-constant-condition": 0,
  },
  // TODO: Remove Eslint setting.
  'globals':{
    //"fabric": true,
  }
};
