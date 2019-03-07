# Babel学习系列3-babel-preset,babel-plugin


第1篇 [Babel学习系列1-Babel历史][1]
第2篇 [Babel学习系列2-Babel设计组成][2]

这篇聊下Babel的 `@babel/babel-preset-*` 预设插件, `@babel/babel-plugin-*` 我下面的例子都是以 Babel7 讲的，不知道Babel7 和Babel6的差别可以google下

项目根目录下`.babelrc`或者`babel.config.js` 是 Babel的配置文件,Babel 会自动查找并读取内容。目录结构一般如下:
```
.
├──main.js
├──package.json
└──.babelrc
```
`.babelrc` 里面内容一般如下

```
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "debug": true,
                "targets": ["last 2 versions"]
            }
        ]
    ],
    "plugins": [
        ["@babel/plugin-transform-runtime"]
    ],
}
```
上篇我们讲过 presets 是 plugins 的集合,把很多需要转换的ES6的语法插件集合在一起，避免大家各种配置,比如
```
var _default = {
  "syntax-async-generators": require("@babel/plugin-syntax-async-generators"),
  "syntax-json-strings": require("@babel/plugin-syntax-json-strings"),
  "syntax-optional-catch-binding": require("@babel/plugin-syntax-optional-catch-binding"),
  "transform-async-to-generator": require("@babel/plugin-transform-async-to-generator"),
  "proposal-async-generator-functions": require("@babel/plugin-proposal-async-generator-functions"),
  "proposal-json-strings": require("@babel/plugin-proposal-json-strings"),
  "transform-arrow-functions": require("@babel/plugin-transform-arrow-functions"),
  "transform-classes": require("@babel/plugin-transform-classes"),
  "transform-computed-properties": require("@babel/plugin-transform-computed-properties"),
  .........
  还有好多,如果没有 presets,我们在用ES6的 async,class,let,都得自己配置插件
};
```
最常用的 presets 是 `@babel/preset-env`, `@babel/preset-env` 包含了我们大部分能想到的 ES6 语法,没有的,它会在打包报错,自己加 `plugins`, 用过 Babel6 的可能会看到 `stage-0,stage-1` 这样的配置，但在 Babel已经全部舍弃,具体 Babel6 和 Babel7差别，我会单独一篇来讲

如果 你用 `Vue`  presets 一般是 `@vue/app `,这个是把 在`@babel/preset-env` 包含的 plugins 上又加了很多自己定义的 plugins

# @babel/preset-env 常用参数

`@babel/preset-env` 参数非常多,这里讲下几个常用的,

## debug
默认是 false 开启后控制台会看到 哪些语法做了转换，Babel的日志信息，开发的时候强烈建议开启

## useBuiltIns 
这个是非常重要的一个属性，主要是用来配合`@babel/polyfill` ，这里简单讲下，在 transform-runtime 和 polyfill 差别的环节重点讲,
 有 `false`,`entry`,`usage`,默认是 false 啥子也不干，为  entry，项目中 main.js 主动引入 `@babel/polyfill` ,会把所有的 polyfill 都引入，为 usage  main.js 主动引入 `@babel/polyfill`, 只会把用到的 polyfill 引入，
## targets

targets 用来指定 是转换 需要支持哪些浏览器的的支持,这个语法是参照 browserslist,如果设置 browserslist 可以不设置 target,什么 browserslist 不知道是啥子，简单讲是 配置项目打包需要支持那些版本的浏览器 ,babel,webpack,roolup 都是参照这个语法来打包的，具体可以网上搜下，比方下面这个指的是 市场份额 大于 1%，最近2个大版本，不包括 IE8 参见 https://browserl.ist
```
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "debug": true,
                "targets": ["> 1%", "last 2 versions", "not ie <= 8"],
                "useBuiltIns": "entry"
            }
        ]
    ],
}
```
![](https://user-gold-cdn.xitu.io/2019/3/1/16939de64981e922?w=1321&h=988&f=png&s=106403)

以上三个 是我平常用的最多的,其他用到了 再去查就好

#  presets，plugins 加载顺序
- presets 加载顺序和一般理解不一样 ，是倒序的，比方下面的先加载 `@babel/preset-react`,在加载
`@babel/preset-react`,这个是个历史原因的，因为作者认为大部分会把 presets 写成 ["es2015", "stage-0"]，stage-x 是 Javascript 语法的一些提案，那这部分可能依赖了ES6的语法，解析的时候得先解析这部分到ES6,在把ES6解析成ES5

- plugins 按照数组的 index 增序(从数组第一个到最后一个)进行编译

- plugins 优先于 presets进行编译。
```
{
    "presets": [
        [
            "@babel/preset-env",
             "@babel/preset-react",
        ]
    ],
    plugins": [
        "@babel/plugin-a",
        "@babel/plugin-b"
    ],
}
```
基本上 preset 就是这些了，睡觉去咯，下篇写 `@babel/polyfill`,`transform-runtime` 的差别




[1]: https://mp.weixin.qq.com/s?__biz=MzAwOTkzNDc0Mg==&mid=2247483745&idx=1&sn=3ad02c5981127907840a3c3c9d0fb86c&chksm=9b594398ac2eca8e5b5c8473ae617e49e968d9b75db8242512ad0df6d4b6e8ad1d5aef9b9d86#rd
[2]: https://mp.weixin.qq.com/s?__biz=MzAwOTkzNDc0Mg==&mid=2247483750&idx=1&sn=c90e95159199ac7aa2612207e89e9182&chksm=9b59439fac2eca89bc558fd2a360408bf8e8a928688963f7f21a5e17ae2ae678f8265a8003aa#rd