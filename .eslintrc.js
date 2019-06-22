module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ['eslint:recommended', 'airbnb', 'prettier', 'plugin:prettier/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    document: true,
    localStorage: true,
    window: true,
    require: true,
    __DEV__: true,
    global: true,
    stateStore: true,
    require: true
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['react', 'prettier'],
  rules: {
    eqeqeq: 0,
    'no-loop-func': 0,
    'func-names': 0,
    'consistent-return': 0,
    'import/no-extraneous-dependencies': 0,
    'class-methods-use-this': 0,
    'no-unused-expressions': 0,
    'no-restricted-syntax': 0,
    'react/no-access-state-in-setstate': 0,
    'array-callback-return': 0,
    'import/extensions': 0,
    'guard-for-in': 0,
    'react/jsx-indent': 0,
    'react/jsx-one-expression-per-line': 0,

    quotes: [0, 'single'], //单引号
    'no-console': 0, //不禁用console
    'no-debugger': 2, //禁用debugger
    'no-var': 0, //对var警告
    semi: 0, //不强制使用分号
    'no-irregular-whitespace': 0, //不规则的空白不允许
    'no-trailing-spaces': 1, //一行结束后面有空格就发出警告
    'eol-last': 0, //文件以单一的换行符结束
    'no-unused-vars': [2, { vars: 'all', args: 'after-used' }], //不能有声明后未被使用的变量或参数
    'no-underscore-dangle': 0, //标识符不能以_开头或结尾
    'no-alert': 2, //禁止使用alert confirm prompt
    'no-lone-blocks': 0, //禁止不必要的嵌套块
    'no-class-assign': 2, //禁止给类赋值
    'no-cond-assign': 2, //禁止在条件表达式中使用赋值语句
    'no-const-assign': 2, //禁止修改const声明的变量
    'no-delete-var': 2, //不能对var声明的变量使用delete操作符
    'no-dupe-keys': 2, //在创建对象字面量时不允许键重复
    'no-duplicate-case': 2, //switch中的case标签不能重复
    'no-dupe-args': 2, //函数参数不能重复
    'no-empty': 0, //块语句中的内容不能为空
    'no-func-assign': 2, //禁止重复的函数声明
    'no-invalid-this': 0, //禁止无效的this，只能用在构造器，类，对象字面量
    'no-redeclare': 2, //禁止重复声明变量
    'no-spaced-func': 2, //函数调用时 函数名与()之间不能有空格
    'no-this-before-super': 0, //在调用super()之前不能使用this或super
    'no-undef': 2, //不能有未定义的变量
    'no-use-before-define': 0, //未定义前不能使用
    camelcase: 0, //强制驼峰法命名
    'jsx-quotes': [2, 'prefer-double'], //强制在JSX属性（jsx-quotes）中一致使用双引号
    'react/display-name': 0, //防止在React组件定义中丢失displayName
    'react/forbid-prop-types': [0, { forbid: ['any'] }], //禁止某些propTypes
    'react/jsx-boolean-value': 2, //在JSX中强制布尔属性符号
    'react/jsx-closing-bracket-location': 1, //在JSX中验证右括号位置
    'react/jsx-key': 2, //在数组或迭代器中验证JSX具有key属性
    'react/jsx-max-props-per-line': [1, { maximum: 1 }], // 限制JSX中单行上的props的最大数量
    'react/jsx-no-bind': 0, //JSX中不允许使用箭头函数和bind
    'react/jsx-no-duplicate-props': 2, //防止在JSX中重复的props
    'react/jsx-no-literals': 0, //防止使用未包装的JSX字符串
    'react/jsx-no-undef': 1, //在JSX中禁止未声明的变量
    'react/jsx-pascal-case': 0, //为用户定义的JSX组件强制使用PascalCase
    'react/jsx-sort-props': 2, //强化props按字母排序
    'react/jsx-uses-react': 1, //防止反应被错误地标记为未使用
    'react/jsx-uses-vars': 2, //防止在JSX中使用的变量被错误地标记为未使用
    'react/no-danger': 0, //防止使用危险的JSX属性
    'react/no-did-mount-set-state': 0, //防止在componentDidMount中使用setState
    'react/no-did-update-set-state': 1, //防止在componentDidUpdate中使用setState
    'react/no-direct-mutation-state': 2, //防止this.state的直接变异
    'react/no-multi-comp': 0, //防止每个文件有多个组件定义
    'react/no-set-state': 0, //防止使用setState
    'react/no-unknown-property': 2, //防止使用未知的DOM属性
    'react/prefer-es6-class': 2, //为React组件强制执行ES5或ES6类
    'react/prop-types': 0, //防止在React组件定义中丢失props验证
    'react/react-in-jsx-scope': 2, //使用JSX时防止丢失React
    'react/self-closing-comp': 0, //防止没有children的组件的额外结束标签
    'react/sort-comp': 0, //强制组件方法顺序
    'no-extra-boolean-cast': 0, //禁止不必要的bool转换
    'react/no-array-index-key': 0, //防止在数组中遍历中使用数组key做索引
    'react/no-deprecated': 1, //不使用弃用的方法
    'react/jsx-equals-spacing': 2, //在JSX属性中强制或禁止等号周围的空格
    'no-unreachable': 1, //不能有无法执行的代码
    'comma-dangle': 2, //对象字面量项尾不能有逗号
    'no-mixed-spaces-and-tabs': 0, //禁止混用tab和空格
    'prefer-arrow-callback': 0, //比较喜欢箭头回调
    'arrow-parens': 0, //箭头函数用小括号括起来
    'arrow-spacing': 0, //=>的前/后括号
    //
    //
    // 可能的错误
    // 这些规则与 JavaScript 代码中可能的语法错误或逻辑错误有关
    //
    // 禁止 for 循环出现方向错误的循环，比如 for (i = 0; i < 10; i--)
    'for-direction': 'error',
    // getter 必须有返回值，并且禁止返回空，比如 return;
    'getter-return': [
      'error',
      {
        allowImplicit: false
      }
    ],
    // 禁止将 await 写在循环里，因为这样就无法同时发送多个异步请求了
    // @off 要求太严格了，有时需要在循环中写 await
    'no-await-in-loop': 'off',
    // 禁止与负零进行比较
    'no-compare-neg-zero': 'error',
    // 禁止在测试表达式中使用赋值语句，除非这个赋值语句被括号包起来了
    'no-cond-assign': ['error', 'except-parens'],
    // 禁止使用 console
    // @off console 的使用很常见
    'no-console': 'off',
    // 禁止将常量作为分支条件判断中的测试表达式，但允许作为循环条件判断中的测试表达式
    'no-constant-condition': [
      'error',
      {
        checkLoops: false
      }
    ],
    // 禁止在正则表达式中出现 Ctrl 键的 ASCII 表示，即禁止使用 /\x1f/
    // @off 几乎不会遇到这种场景
    'no-control-regex': 'off',
    // @fixable 禁止使用 debugger
    'no-debugger': 'error',
    // 禁止在函数参数中出现重复名称的参数
    'no-dupe-args': 'error',
    // 禁止在对象字面量中出现重复名称的键名
    'no-dupe-keys': 'error',
    // 禁止在 switch 语句中出现重复测试表达式的 case
    'no-duplicate-case': 'error',
    // 禁止出现空代码块，允许 catch 为空代码块
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true
      }
    ],
    // 禁止在正则表达式中使用空的字符集 []
    'no-empty-character-class': 'error',
    // 禁止将 catch 的第一个参数 error 重新赋值
    'no-ex-assign': 'error',
    // @fixable 禁止不必要的布尔类型转换，比如 !! 或 Boolean
    'no-extra-boolean-cast': 'error',
    // @fixable 禁止函数表达式中出现多余的括号，比如 let foo = (function () { return 1 })
    'no-extra-parens': ['error', 'functions'],
    // @fixable 禁止出现多余的分号
    'no-extra-semi': 'off',
    // 禁止将一个函数声明重新赋值，如：
    // function foo() {}
    // foo = bar
    'no-func-assign': 'error',
    // 禁止在 RegExp 构造函数中出现非法的正则表达式
    'no-invalid-regexp': 'error',
    // 禁止使用特殊空白符（比如全角空格），除非是出现在字符串、正则表达式或模版字符串中
    'no-irregular-whitespace': [
      'error',
      {
        skipStrings: true,
        skipComments: false,
        skipRegExps: true,
        skipTemplates: true
      }
    ],
    // 禁止将 Math, JSON 或 Reflect 直接作为函数调用
    'no-obj-calls': 'error',
    // 禁止使用 hasOwnProperty, isPrototypeOf 或 propertyIsEnumerable
    // @off hasOwnProperty 比较常用
    'no-prototype-builtins': 'off',
    // @fixable 禁止在正则表达式中出现连续的空格，必须使用 /foo {3}bar/ 代替
    'no-regex-spaces': 'error',
    // 禁止在数组中出现连续的逗号，如 let foo = [,,]
    'no-sparse-arrays': 'error',
    // 禁止在普通字符串中出现模版字符串里的变量形式，如 'Hello ${name}!'
    'no-template-curly-in-string': 'error',
    // 禁止出现难以理解的多行表达式，如：
    // let foo = bar
    // [1, 2, 3].forEach(baz);
    'no-unexpected-multiline': 'error',
    // 禁止在 return, throw, break 或 continue 之后还有代码
    'no-unreachable': 'error',
    // 禁止在 finally 中出现 return, throw, break 或 continue
    'no-unsafe-finally': 'error',
    // @fixable 禁止在 in 或 instanceof 操作符的左侧使用感叹号，如 if (!key in object)
    'no-unsafe-negation': 'error',
    // 必须使用 isNaN(foo) 而不是 foo === NaN
    'use-isnan': 'error',
    // 注释必须符合 jsdoc 的规范
    // @off jsdoc 要求太严格
    'valid-jsdoc': 'off',
    // typeof 表达式比较的对象必须是 'undefined', 'object', 'boolean', 'number', 'string', 'function' 或 'symbol'
    'valid-typeof': 'error',

    //
    //
    // 最佳实践
    // 这些规则通过一些最佳实践帮助你避免问题
    //
    // setter 必须有对应的 getter，getter 可以没有对应的 setter
    'accessor-pairs': [
      'error',
      {
        setWithoutGet: true,
        getWithoutSet: false
      }
    ],
    // 将 var 定义的变量视为块作用域，禁止在块外使用
    'block-scoped-var': 'error',
    // 在类的非静态方法中，必须存在对 this 的引用
    // @off 太严格了
    'class-methods-use-this': 'off',
    // 禁止函数在不同分支返回不同类型的值
    // @off 太严格了
    'consistent-return': 'off',
    // @fixable if 后面必须要有 {，除非是单行 if
    curly: ['error', 'multi-line', 'consistent'],
    // switch 语句必须有 default
    // @off 太严格了
    'default-case': 'off',
    // @fixable 链式调用的时候，点号必须放在第二行开头处，禁止放在第一行结尾处
    'dot-location': ['error', 'property'],
    // @fixable 禁止出现 foo['bar']，必须写成 foo.bar
    // @off 当需要写一系列属性的时候，可以更统一
    'dot-notation': 'off',
    // 禁止使用 alert
    // @off alert 很常用
    'no-alert': 'off',
    // 禁止使用 caller 或 callee
    'no-caller': 'error',
    // switch 的 case 内有变量定义的时候，必须使用大括号将 case 内变成一个代码块
    'no-case-declarations': 'error',
    // 禁止在正则表达式中出现形似除法操作符的开头，如 let a = /=foo/
    // @off 有代码高亮的话，在阅读这种代码时，也完全不会产生歧义或理解上的困难
    'no-div-regex': 'off',
    // @fixable 禁止在 else 内使用 return，必须改为提前结束
    // @off else 中使用 return 可以使代码结构更清晰
    'no-else-return': 'off',
    // 不允许有空函数，除非是将一个空函数设置为某个项的默认值
    'no-empty-function': [
      'error',
      {
        allow: ['functions', 'arrowFunctions']
      }
    ],
    // 禁止解构中出现空 {} 或 []
    'no-empty-pattern': 'error',
    // 禁止使用 foo == null 或 foo != null，必须使用 foo === null 或 foo !== null
    // @off foo == null 用于判断 foo 不是 undefined 并且不是 null，比较常用，故允许此写法
    'no-eq-null': 'off',
    // 禁止使用 eval
    'no-eval': 'error',
    // 禁止修改原生对象
    'no-extend-native': 'error',
    // @fixable 禁止出现没必要的 bind
    'no-extra-bind': 'error',
    // @fixable 禁止出现没必要的 label
    'no-extra-label': 'error',
    // switch 的 case 内必须有 break, return 或 throw
    'no-fallthrough': 'error',
    // @fixable 表示小数时，禁止省略 0，比如 .5
    'no-floating-decimal': 'error',
    // 禁止对全局变量赋值
    'no-global-assign': 'error',
    // @fixable 禁止使用 !! ~ 等难以理解的运算符
    // 仅允许使用 !!
    'no-implicit-coercion': [
      'error',
      {
        allow: ['!!']
      }
    ],
    // 禁止在全局作用域下定义变量或申明函数
    'no-implicit-globals': 'error',
    // 禁止在 setTimeout 或 setInterval 中传入字符串，如 setTimeout('alert("Hi!")', 100);
    'no-implied-eval': 'error',
    // 禁止在类之外的地方使用 this
    // @off this 的使用很灵活，事件回调中可以表示当前元素，函数也可以先用 this，等以后被调用的时候再 call
    'no-invalid-this': 'off',
    // 禁止使用 __iterator__
    'no-iterator': 'error',
    // 禁止使用 label
    'no-labels': 'error',
    // 禁止使用没必要的 {} 作为代码块
    'no-lone-blocks': 'error',
    // 禁止使用 magic numbers
    // @off 太严格了
    'no-magic-numbers': 'off',
    // @fixable 禁止出现连续的多个空格，除非是注释前，或对齐对象的属性、变量定义、import 等
    'no-multi-spaces': [
      'error',
      {
        ignoreEOLComments: true,
        exceptions: {
          Property: true,
          BinaryExpression: false,
          VariableDeclarator: true,
          ImportDeclaration: true
        }
      }
    ],
    // 禁止使用 \ 来换行字符串
    'no-multi-str': 'error',
    // 禁止直接 new 一个类而不赋值
    'no-new': 'error',
    // 禁止使用 new Function，比如 let x = new Function("a", "b", "return a + b");
    'no-new-func': 'error',
    // 禁止使用 new 来生成 String, Number 或 Boolean
    'no-new-wrappers': 'error',
    // 禁止使用 0 开头的数字表示八进制数
    'no-octal': 'error',
    // 禁止使用八进制的转义符
    'no-octal-escape': 'error',
    // 禁止对函数的参数重新赋值
    'no-param-reassign': 'off',
    // 禁止使用 __proto__
    'no-proto': 'error',
    // 禁止重复定义变量
    'no-redeclare': 'error',
    // 禁止使用指定的对象属性
    // @off 它用于限制某个具体的 api 不能使用
    'no-restricted-properties': 'off',
    // 禁止在 return 语句里赋值
    'no-return-assign': ['error', 'always'],
    // 禁止在 return 语句里使用 await
    'no-return-await': 'error',
    // 禁止出现 location.href = 'javascript:void(0)';
    'no-script-url': 'error',
    // 禁止将自己赋值给自己
    'no-self-assign': 'error',
    // 禁止将自己与自己比较
    'no-self-compare': 'error',
    // 禁止使用逗号操作符
    'no-sequences': 'error',
    // 禁止 throw 字面量，必须 throw 一个 Error 对象
    'no-throw-literal': 'error',
    // 循环内必须对循环条件的变量有修改
    'no-unmodified-loop-condition': 'error',
    // @fixable 禁止出现没用的 label
    'no-unused-labels': 'error',
    // 禁止出现没必要的 call 或 apply
    'no-useless-call': 'error',
    // 禁止出现没必要的字符串连接
    'no-useless-concat': 'error',
    // 禁止出现没必要的转义
    // @off 转义可以使代码更易懂
    'no-useless-escape': 'off',
    // @fixable 禁止没必要的 return
    // @off 没必要限制 return
    'no-useless-return': 'off',
    // 禁止使用 void
    'no-void': 'error',
    // 禁止注释中出现 TODO 和 FIXME
    // @off TODO 很常用
    'no-warning-comments': 'off',
    // 禁止使用 with
    'no-with': 'error',
    // Promise 的 reject 中必须传入 Error 对象，而不是字面量
    'prefer-promise-reject-errors': 'error',
    // parseInt 必须传入第二个参数
    radix: 'error',
    // async 函数中必须存在 await 语句
    // @off async function 中没有 await 的写法很常见，比如 koa 的示例中就有这种用法
    'require-await': 'off',
    // var 必须在作用域的最前面
    // @off var 不在最前面也是很常见的用法
    'vars-on-top': 'off',
    // @fixable 立即执行的函数必须符合如下格式 (function () { alert('Hello') })()
    'wrap-iife': [
      'error',
      'inside',
      {
        functionPrototypeMethods: true
      }
    ],
    // @fixable 必须使用 if (foo === 5) 而不是 if (5 === foo)
    yoda: [
      'error',
      'never',
      {
        onlyEquality: true
      }
    ],

    //
    //
    // 严格模式
    // 这些规则与严格模式指令有关
    //
    // @fixable 禁止使用 'strict';
    strict: ['error', 'never'],

    //
    //
    // 变量
    // 这些规则与变量申明有关
    //
    // 变量必须在定义的时候赋值
    // @off 先定义后赋值很常见
    'init-declarations': 'off',
    // 禁止 catch 的参数名与定义过的变量重复
    // @off 太严格了
    'no-catch-shadow': 'off',
    // 禁止使用 delete
    'no-delete-var': 'error',
    // 禁止 label 名称与定义过的变量重复
    'no-label-var': 'error',
    // 禁止使用指定的全局变量
    // @off 它用于限制某个具体的变量名不能使用
    'no-restricted-globals': 'off',
    // 禁止变量名与上层作用域内的定义过的变量重复
    // @off 很多时候函数的形参和传参是同名的
    'no-shadow': 'off',
    // 禁止使用保留字作为变量名
    'no-shadow-restricted-names': 'error',
    // 禁止使用未定义的变量
    'no-undef': [
      'error',
      {
        typeof: false
      }
    ],
    // @fixable 禁止将 undefined 赋值给变量
    'no-undef-init': 'error',
    // 禁止对 undefined 重新赋值
    'no-undefined': 'error',
    // 定义过的变量必须使用
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'none',
        caughtErrors: 'none',
        ignoreRestSiblings: true
      }
    ],
    // 变量必须先定义后使用
    'no-use-before-define': [
      'error',
      {
        functions: false,
        classes: false,
        variables: false
      }
    ],

    //
    //
    // Node.js 和 CommonJS
    // 这些规则与在 Node.js 中运行的代码或浏览器中使用的 CommonJS 有关
    //
    // callback 之后必须立即 return
    // @off Limitations 太多了
    'callback-return': 'off',
    // require 必须在全局作用域下
    // @off 条件加载很常见
    'global-require': 'off',
    // callback 中的 error 必须被处理
    'handle-callback-err': 'error',
    // 禁止直接使用 Buffer
    'no-buffer-constructor': 'error',
    // 相同类型的 require 必须放在一起
    // @off 太严格了
    'no-mixed-requires': 'off',
    // 禁止直接 new require('foo')
    'no-new-require': 'error',
    // 禁止对 __dirname 或 __filename 使用字符串连接
    'no-path-concat': 'error',
    // 禁止使用 process.env.NODE_ENV
    // @off 使用很常见
    'no-process-env': 'off',
    // 禁止使用 process.exit(0)
    // @off 使用很常见
    'no-process-exit': 'off',
    // 禁止使用指定的模块
    // @off 它用于限制某个具体的模块不能使用
    'no-restricted-modules': 'off',
    // 禁止使用 node 中的同步的方法，比如 fs.readFileSync
    // @off 使用很常见
    'no-sync': 'off',

    //
    //
    // 风格问题
    // 这些规则与代码风格有关，所以是非常主观的
    //
    // @fixable 配置数组的中括号内前后的换行格式
    // @off 配置项无法配制成想要的样子
    'array-bracket-newline': 'off',
    // @fixable 数组的括号内的前后禁止有空格
    'array-bracket-spacing': ['error', 'never'],
    // @fixable 配置数组的元素之间的换行格式
    // @off 允许一行包含多个元素，方便大数量的数组的书写
    'array-element-newline': 'off',
    // @fixable 代码块如果在一行内，那么大括号内的首尾必须有空格，比如 function () { alert('Hello') }
    'block-spacing': ['error', 'always'],
    // @fixable if 与 else 的大括号风格必须一致
    // @off else 代码块可能前面需要有一行注释
    'brace-style': 'off',
    // 变量名必须是 camelcase 风格的
    // @off 很多 api 或文件名都不是 camelcase
    camelcase: 'off',
    // @fixable 注释的首字母必须大写
    // @off 没必要限制
    'capitalized-comments': 'off',
    // @fixable 对象的最后一个属性末尾必须有逗号
    // @off 没必要限制
    'comma-dangle': 'off',
    // @fixable 逗号前禁止有空格，逗号后必须要有空格
    'comma-spacing': [
      'error',
      {
        before: false,
        after: true
      }
    ],
    // @fixable 禁止在行首写逗号
    'comma-style': ['error', 'last'],
    // @fixable 用作对象的计算属性时，中括号内的首尾禁止有空格
    'computed-property-spacing': ['error', 'never'],
    // 限制 this 的别名
    // @off 没必要限制
    'consistent-this': 'off',
    // @fixable 文件最后一行必须有一个空行
    // @off 没必要限制
    'eol-last': 'off',
    // @fixable 函数名和执行它的括号之间禁止有空格
    'func-call-spacing': ['error', 'never'],
    // 函数赋值给变量的时候，函数名必须与变量名一致
    'func-name-matching': [
      'error',
      'always',
      {
        includeCommonJSModuleExports: false
      }
    ],
    // 函数必须有名字
    // @off 没必要限制
    'func-names': 'off',
    // 必须只使用函数声明或只使用函数表达式
    // @off 没必要限制
    'func-style': 'off',
    // 禁止使用指定的标识符
    // @off 它用于限制某个具体的标识符不能使用
    'id-blacklist': 'off',
    // 限制变量名长度
    // @off 没必要限制变量名长度
    'id-length': 'off',
    // 限制变量名必须匹配指定的正则表达式
    // @off 没必要限制变量名
    'id-match': 'off',
    // @fixable jsx 中的属性必须用双引号
    'jsx-quotes': ['error', 'prefer-double'],
    // @fixable 对象字面量中冒号前面禁止有空格，后面必须有空格
    'key-spacing': [
      'error',
      {
        beforeColon: false,
        afterColon: true,
        mode: 'strict'
      }
    ],
    // 单行注释必须写在上一行
    // @off 没必要限制
    'line-comment-position': 'off',
    // @fixable 限制换行符为 LF 或 CRLF
    // @off 没必要限制
    'linebreak-style': 'off',
    // @fixable 注释前后必须有空行
    // @off 没必要限制
    'lines-around-comment': 'off',
    // 限制一行的长度
    // @off 现在编辑器已经很智能了，不需要限制一行的长度
    'max-len': 'off',
    // 限制一个文件最多的行数
    // @off 没必要限制
    'max-lines': 'off',
    // 函数的参数禁止超过 7 个
    'max-params': ['error', 7],
    // 限制函数块中的语句数量
    // @off 没必要限制
    'max-statements': 'off',
    // 限制一行中的语句数量
    // @off 没必要限制
    'max-statements-per-line': 'off',
    // 三元表达式必须得换行
    // @off 三元表达式可以随意使用
    'multiline-ternary': 'off',
    // new 后面的类名必须首字母大写
    'new-cap': [
      'error',
      {
        newIsCap: true,
        capIsNew: false,
        properties: true
      }
    ],
    // @fixable new 后面的类必须有小括号
    'new-parens': 'error',
    // 链式调用必须换行
    // @off 没必要限制
    'newline-per-chained-call': 'off',
    // 禁止使用 Array 构造函数
    'no-array-constructor': 'error',
    // 禁止使用位运算
    // @off 位运算很常见
    'no-bitwise': 'off',
    // 禁止使用 continue
    // @off continue 很常用
    'no-continue': 'off',
    // 禁止在代码后添加内联注释
    // @off 内联注释很常用
    'no-inline-comments': 'off',
    // @fixable 禁止 else 中只有一个单独的 if
    // @off 单独的 if 可以把逻辑表达的更清楚
    'no-lonely-if': 'off',
    // 禁止混用不同的操作符，比如 let foo = a && b < 0 || c > 0 || d + 1 === 0
    // @off 太严格了，可以由使用者自己去判断如何混用操作符
    'no-mixed-operators': 'off',
    // 禁止混用空格和缩进
    'no-mixed-spaces-and-tabs': 'error',
    // 禁止连续赋值，比如 a = b = c = 5
    // @off 没必要限制
    'no-multi-assign': 'off',
    // @fixable 禁止出现超过三行的连续空行
    'no-multiple-empty-lines': [
      'error',
      {
        max: 3,
        maxEOF: 1,
        maxBOF: 1
      }
    ],
    // 禁止 if 里面有否定的表达式，比如：
    // if (a !== b) {
    //     doSomething();
    // } else {
    //     doSomethingElse();
    // }
    // @off 否定的表达式可以把逻辑表达的更清楚
    'no-negated-condition': 'off',
    // 禁止使用嵌套的三元表达式，比如 a ? b : c ? d : e
    // @off 没必要限制
    'no-nested-ternary': 'off',
    // 禁止直接 new Object
    'no-new-object': 'error',
    // 禁止使用 ++ 或 --
    // @off 没必要限制
    'no-plusplus': 'off',
    // 禁止使用特定的语法
    // @off 它用于限制某个具体的语法不能使用
    'no-restricted-syntax': 'off',
    // 禁止使用 tabs
    'no-tabs': 'error',
    // 禁止使用三元表达式
    // @off 三元表达式很常用
    'no-ternary': 'off',
    // @fixable 禁止行尾有空格
    'no-trailing-spaces': 'error',
    // 禁止变量名出现下划线
    // @off 下划线在变量名中很常用
    'no-underscore-dangle': 'off',
    // @fixable 必须使用 !a 替代 a ? false : true
    // @off 后者表达的更清晰
    'no-unneeded-ternary': 'off',
    // @fixable 禁止属性前有空格，比如 foo. bar()
    'no-whitespace-before-property': 'error',
    // @fixable 对象字面量内的属性每行必须只有一个
    // @off 没必要限制
    'object-property-newline': 'off',
    // 禁止变量申明时用逗号一次申明多个
    'one-var': 0,
    // @fixable 必须使用 x = x + y 而不是 x += y
    // @off 没必要限制
    'operator-assignment': 'off',
    // @fixable 需要换行的时候，操作符必须放在行末，比如：
    // let foo = 1 +
    //     2
    // @off 有时放在第二行开始处更易读
    'operator-linebreak': 'off',
    // @fixable 代码块首尾必须要空行
    // @off 没必要限制
    'padded-blocks': 'off',
    // @fixable 限制语句之间的空行规则，比如变量定义完之后必须要空行
    // @off 没必要限制
    'padding-line-between-statements': 'off',
    // @fixable 对象字面量的键名禁止用引号括起来
    // @off 没必要限制
    'quote-props': 'off',
    // 必须使用 jsdoc 风格的注释
    // @off 太严格了
    'require-jsdoc': 'off',
    // 对象字面量的键名必须排好序
    // @off 没必要限制
    'sort-keys': 'off',
    // 变量申明必须排好序
    // @off 没必要限制
    'sort-vars': 'off',
    // @fixable 正则表达式必须有括号包起来
    // @off 没必要限制
    'wrap-regex': 'off',

    //
    //
    // ECMAScript 6
    // 这些规则与 ES6（即通常所说的 ES2015）有关
    //
    // @fixable 箭头函数能够省略 return 的时候，必须省略，比如必须写成 () => 0，禁止写成 () => { return 0 }
    // @off 箭头函数的返回值，应该允许灵活设置
    'arrow-body-style': 'off',
    // @fixable 箭头函数只有一个参数的时候，必须加括号
    // @off 应该允许灵活设置
    'arrow-parens': 'off',
    // constructor 中必须有 super
    'constructor-super': 'error',
    // 禁止对定义过的 class 重新赋值
    'no-class-assign': 'error',
    // 禁止对使用 const 定义的常量重新赋值
    'no-const-assign': 'error',
    // 禁止重复定义类
    'no-dupe-class-members': 'error',
    // 禁止重复 import 模块
    'no-duplicate-imports': 'error',
    // 禁止使用 new 来生成 Symbol
    'no-new-symbol': 'error',
    // 禁止 import 指定的模块
    // @off 它用于限制某个具体的模块不能使用
    'no-restricted-imports': 'off',
    // 禁止在 super 被调用之前使用 this 或 super
    'no-this-before-super': 'error',
    // @fixable 禁止出现没必要的计算键名，比如 let a = { ['0']: 0 };
    'no-useless-computed-key': 'error',
    // 禁止出现没必要的 constructor，比如 constructor(value) { super(value) }
    'no-useless-constructor': 'off',
    // @fixable 禁止解构时出现同样名字的的重命名，比如 let { foo: foo } = bar;
    'no-useless-rename': 'off',
    // @fixable 禁止使用 var
    'no-var': 'error',
    // @fixable 必须使用 a = {b} 而不是 a = {b: b}
    // @off 没必要强制要求
    'object-shorthand': 'off',
    // @fixable 必须使用箭头函数作为回调
    // @off 没必要强制要求
    'prefer-arrow-callback': 'off',
    // @fixable 申明后不再被修改的变量必须使用 const 来申明
    // @off 没必要强制要求
    'prefer-const': 'off',
    // 必须使用解构
    // @off 没必要强制要求
    'prefer-destructuring': 'off',
    // @fixable 必须使用 0b11111011 而不是 parseInt('111110111', 2)
    // @off 没必要强制要求
    'prefer-numeric-literals': 'off',
    // 必须使用 ...args 而不是 arguments
    // @off 没必要强制要求
    'prefer-rest-params': 'off',
    // @fixable 必须使用 ... 而不是 apply，比如 foo(...args)
    // @off  apply 很常用
    'prefer-spread': 'off',
    // @fixable 必须使用模版字符串而不是字符串连接
    // @off 字符串连接很常用
    'prefer-template': 'off',
    // generator 函数内必须有 yield
    'require-yield': 'error',
    // @fixable ... 的后面禁止有空格
    'rest-spread-spacing': ['error', 'never'],
    // @fixable import 必须按规则排序
    // @off 没必要强制要求
    'sort-imports': 'off',
    // 创建 Symbol 时必须传入参数
    'symbol-description': 'error',
    // @fixable ${name} 内的首尾禁止有空格
    'template-curly-spacing': ['error', 'never'],
    // @fixable yield* 后面必须要有空格
    'yield-star-spacing': ['error', 'after'],
    // 布尔值类型的 propTypes 的 name 必须为 is 或 has 开头
    // @off 不强制要求写 propTypes
    'react/boolean-prop-naming': 'off',
    // 一个 defaultProps 必须有对应的 propTypes
    // @off 不强制要求写 propTypes
    'react/default-props-match-prop-types': 'off',
    // 组件必须有 displayName 属性
    // @off 不强制要求写 displayName
    'react/display-name': 'off',
    // 禁止在自定义组件中使用一些指定的 props
    // @off 没必要限制
    'react/forbid-component-props': 'off',
    // 禁止使用一些指定的 elements
    // @off 没必要限制
    'react/forbid-elements': 'off',
    // 禁止使用一些指定的 propTypes
    // @off 不强制要求写 propTypes
    'react/forbid-prop-types': 'off',
    // 禁止直接使用别的组建的 propTypes
    // @off 不强制要求写 propTypes
    'react/forbid-foreign-prop-types': 'off',
    // 禁止使用数组的 index 作为 key
    // @off 太严格了
    'react/no-array-index-key': 'off',
    // 禁止使用 children 做 props
    'react/no-children-prop': 'error',
    // 禁止使用 dangerouslySetInnerHTML
    // @off 没必要限制
    'react/no-danger': 'off',
    // 禁止在使用了 dangerouslySetInnerHTML 的组建内添加 children
    'react/no-danger-with-children': 'error',
    // 禁止使用已废弃的 api
    'react/no-deprecated': 'error',
    // 禁止在 componentDidMount 里面使用 setState
    // @off 同构应用需要在 didMount 里写 setState
    'react/no-did-mount-set-state': 'off',
    // 禁止在 componentDidUpdate 里面使用 setState
    'react/no-did-update-set-state': 'error',
    // 禁止直接修改 this.state
    'react/no-direct-mutation-state': 'error',
    // 禁止使用 findDOMNode
    'react/no-find-dom-node': 'error',
    // 禁止使用 isMounted
    'react/no-is-mounted': 'error',
    'react/destructuring-assignment': 0,
    // 禁止在一个文件创建两个组件
    // @off 有一个 bug https://github.com/yannickcr/eslint-plugin-react/issues/1181
    'react/no-multi-comp': 'off',
    // 禁止在 PureComponent 中使用 shouldComponentUpdate
    'react/no-redundant-should-component-update': 'error',
    // 禁止使用 ReactDOM.render 的返回值
    'react/no-render-return-value': 'error',
    // 禁止使用 setState
    // @off setState 很常用
    'react/no-set-state': 'off',
    // 禁止拼写错误
    'react/no-typos': 'error',
    // 禁止使用字符串 ref
    'react/no-string-refs': 'error',
    // 禁止在组件的内部存在未转义的 >, ", ' 或 }
    'react/no-unescaped-entities': 'error',
    // @fixable 禁止出现 HTML 中的属性，如 class
    'react/no-unknown-property': 'error',
    // 禁止出现未使用的 propTypes
    // @off 不强制要求写 propTypes
    'react/no-unused-prop-types': 'off',
    // 定义过的 state 必须使用
    // @off 没有官方文档，并且存在很多 bug： https://github.com/yannickcr/eslint-plugin-react/search?q=no-unused-state&type=Issues&utf8=%E2%9C%93
    'react/no-unused-state': 'off',
    // 禁止在 componentWillUpdate 中使用 setState
    'react/no-will-update-set-state': 'error',
    // 必须使用 Class 的形式创建组件
    'react/prefer-es6-class': ['error', 'always'],
    // 必须使用 pure function
    // @off 没必要限制
    'react/prefer-stateless-function': 'off',
    // 组件必须写 propTypes
    // @off 不强制要求写 propTypes
    'react/prop-types': 'off',
    // 出现 jsx 的地方必须 import React
    // @off 已经在 no-undef 中限制了
    'react/react-in-jsx-scope': 'off',
    // 非 required 的 prop 必须有 defaultProps
    // @off 不强制要求写 propTypes
    'react/require-default-props': 'off',
    // 组件必须有 shouldComponentUpdate
    // @off 没必要限制
    'react/require-optimization': 'off',
    // render 方法中必须有返回值
    'react/require-render-return': 'error',
    // @fixable 组件内没有 children 时，必须使用自闭和写法
    // @off 没必要限制
    'react/self-closing-comp': 'off',
    // @fixable 组件内方法必须按照一定规则排序
    // propTypes 的熟悉必须按照字母排序
    // @off 没必要限制
    'react/sort-prop-types': 'off',
    // style 属性的取值必须是 object
    'react/style-prop-object': 'error',
    // HTML 中的自闭和标签禁止有 children
    'react/void-dom-elements-no-children': 'error',
    // @fixable 布尔值的属性必须显式的写 someprop={true}
    // @off 没必要限制
    'react/jsx-boolean-value': 'off',
    // @fixable 结束标签必须与开始标签的那一行对齐
    // @off 已经在 jsx-indent 中限制了
    'react/jsx-closing-tag-location': 'off',
    // @fixable props 与 value 之间的等号前后禁止有空格
    'react/jsx-equals-spacing': ['error', 'never'],
    // 限制文件后缀
    // @off 没必要限制
    'react/jsx-filename-extension': 'off',
    // @fixable 第一个 prop 必须得换行
    // @off 没必要限制
    'react/jsx-first-prop-new-line': 'off',
    // handler 的名称必须是 onXXX 或 handleXXX
    // @off 没必要限制
    'react/jsx-handler-names': 'off',
    // 数组中的 jsx 必须有 key
    'react/jsx-key': 'error',
    // @fixable 限制每行的 props 数量
    // @off 没必要限制
    'react/jsx-max-props-per-line': 'off',
    // jsx 中禁止使用 bind
    // @off 太严格了
    'react/jsx-no-bind': 'off',
    // 禁止在 jsx 中使用像注释的字符串
    'react/jsx-no-comment-textnodes': 'error',
    // 禁止出现重复的 props
    'react/jsx-no-duplicate-props': 'error',
    // 禁止在 jsx 中出现字符串
    // @off 没必要限制
    'react/jsx-no-literals': 'off',
    // 禁止使用 target="_blank"
    // @off 没必要限制
    'react/jsx-no-target-blank': 'off',
    // 禁止使用未定义的 jsx elemet
    'react/jsx-no-undef': 'error',
    // 禁止使用 pascal 写法的 jsx，比如 <TEST_COMPONENT>
    'react/jsx-pascal-case': 'off',
    // @fixable props 必须排好序
    // @off 没必要限制
    'react/jsx-sort-props': 'off',
    // jsx 文件必须 import React
    'react/jsx-uses-react': 'error',
    // 定义了的 jsx element 必须使用
    'react/jsx-uses-vars': 'error',
    // @fixable 多行的 jsx 必须有括号包起来
    // @off 没必要限制
    'react/jsx-wrap-multilines': 'off'
  }
}
