

第1篇 [Babel学习系列1-Babel历史][1]

第2篇 [Babel学习系列2-Babel设计组成][2]

第3篇 [Babel学习系列3-babel-preset,babel-plugin][3]

这篇主要讲 `polyfill` 和 `runtime` 总结下, `Babel` 只是转换 `syntax` 层语法,所有需要 `@babel/polyfill` 来处理API兼容,又因为 `polyfill` 体积太大，所以通过 `preset`的 useBuiltIns 来实现按需加载,再接着为了满足 npm 组件开发的需要 出现了 `@babel/runtime` 来做隔离

下面上一段 常见代码

 转换前代码

```javascript
let array = [1, 2, 3, 4, 5, 6];
array.includes(item => item > 2);
new Promise()
```
Babel转换后代码
```javascript
var array = [1, 2, 3, 4, 5, 6];
array.includes(function (item) {
  return item > 2;
});
new Promise()
```
`Babel` 默认只是转换了 箭头函数 `let` ,`Promise` 和 `includes` 都没有转换 ,这是为什么

`Babel` 把 `Javascript` 语法 分为 `syntax` 和 `api`  

先说 `api` , `api` 指那些我们可以通过 函数重新覆盖的语法 ，类似 `includes,map,includes,Promise`,凡是我们能想到重写的都可以归属到 `api `

啥子是 `syntax` ,像 箭头函数，`let,const,class, 依赖注入 Decorators`,等等这些，我们在 `Javascript` 在运行是无法重写的，想象下，在不支持的浏览器里不管怎么样，你都用不了 let 这个关键字

千万要get到上面这2个点，非常重要,很多人以为只要 引用了 `Babel` 就不会出现兼容性问题了，这个是大错特错的

`syntax` 这个关键字 `Babel` 的官网只是一笔带过，直译又不准确，网上很多文章在说 `polyfill` 和 `transform-runtime` 的差别都没说到点上，还互相瞎鸡儿抄，这个点上小编还是很自信的，按照自己的理解,说出二者的差别(默默的给自己加个鸡腿)

那 `Babel` 只负责 转换 `syntax` , `includes,map,includes` 这些 `API` 层面的 怎么办, `Babel` 把这个放在了 单独放在了 `polyfill` 这个模块处理

`Babel` 这个设计非常好,  把 `Javascript` 语法抽象成2个方面的, `syntax` 和 `polyfill` 独立开来，分而治理，`6to5` 一开始设计是把二者放在一起的，大家想想 `polyfill` 随着浏览器的不同，差异是非常大的,2个要是在一起 代码的耦合性就太大了，到处都是` if else`

`polyfill` 直译的话是垫片的意思，那处理类似 `assign,includes,map,includes` ，某些浏览器 没有的方法 最直接的办法的是 根据 一份浏览器不兼容的表格(这个`browserslist`已经完成了)，把对应浏览器不支持的语法全部重新写一遍，类似下面这样
```javascript
 // 
  if (typeof Object.assign != 'function') {
      Object.defineProperty(Object, "assign", 
      ·····
  }
  if (!Array.prototype.includes){
     Object.defineProperty(Array.prototype, 'includes',
      ·····
  }
  if (!Array.prototype.every){
     Object.defineProperty(Array.prototype, 'every',
      ·····
  }
  .....好多好多
```
这种方式可以简单粗暴的解决兼容性问题, 那问题也来了,这样会导致 `polyfill.js` 这个包非常大,这个大家又受不了

怎么办,Babel 开发大佬们肯定是又办法的,只要我用到了`includes`
Babel 就只给我引入 `includes` 的对应的不就好了,按需加载，要啥给我加载啥

这个就需要用到上篇说到 `@babel/preset-env` 的 `useBuiltIns` 属性了，不了解 `@babel/preset-env` 看下上篇
`useBuiltIns` 有 `false`,`entry`,`usage` 三个属性

先执行下 
```
npm i @babel/polyfill -s
```

##  useBuiltIns 设置
 `false` 是默认值,表示啥也不干

 `entry`表示就是把全部 `@babel/polyfill` 全部一次性引入 
 ```
 .babelrc
 {
    "presets": [
        [
            "@babel/preset-env",
            {
                "debug": true,
                "useBuiltIns": "entry",
                "targets":{
                    "browsers":["> 1%"]
                }
            }
        ]
    ]
   
}
 ```
 
 然后在 `sample.js` 中引入 打包后生成的 文件是这样样子的 
 
![](https://user-gold-cdn.xitu.io/2019/3/4/16944515a8dbcc06?w=948&h=988&f=png&s=157246)


 这个一般没人用,长的丑的人才会用，因为体积实在是太大了

 `usage` 的意思是 按需加载 ,把上面 改成 `"useBuiltIns": "usage"` 打包出来如下


![](https://user-gold-cdn.xitu.io/2019/3/4/16944528d884184a?w=922&h=818&f=png&s=123069)

 这就是这 2 个值得差别, 使 用`entry` 需要手动在 `sample.js` 中手动 `@babel/polyfill`，并且会把所有的 `polyfill`引入进来, 使用 `usage` 实现按需加载,一般在项目里使用这样方式


## runtime 机制，为组件开发而生

 好,`polyfill`  问题是已经解决了,现在又出现了一个场景, 假设你是开发 一个 npm 组件的选手
 你刚好用到了 `Promise` 方法, 按照上面的方法,写完发布到 npm 仓库
现在隔壁印度小哥刚好搜到你这包，下载下来了,但是他的项目里面也用到了 `Promise` ,但是他的 `Promise` 是 自定义的 一套，类似
```
window.Promise  = function (){
    this.reject = ..
    this.resolve = ..
}
```
这个时候就傻眼了，小哥项目跑不起来了，跑到 github 上用蹩脚 English 骂了你一通,这个场景其实很常见,那这么办,那假设在开发 组件的时能报把所有的 ` Promise copy` 到 ` _Promise` 对象上,然后组件里都用 ` _Promise` ,是不是就和外界做了层隔离,互不影响，哈哈完美,这个思路我们在开发设计中也是可以学习套用的,那 `Babel` 里面针对 这种场景 出现了`@babel/runtime`, `@babel/plugin-transform-runtime`
首先 执行下,这2个一个都不能少,都是必须的
```
// .babelrc
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "debug": true,
                "useBuiltIns": "usage",
                "targets":{
                    "browsers":["> 1%", "last 2 versions", "not ie <= 8"]
                }
            }
        ]
    ],
    "plugins": [
        [
            "@babel/plugin-transform-runtime",
            {
                "corejs": 2 // 参考官方文档
              }
        ]
    ],
}
npm install --save @babel/runtime
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime-corejs2 --save  // 官方文档 说这个可以不加，我试了不加，没起作用
```

上面代码 会转换成如下

![](https://user-gold-cdn.xitu.io/2019/3/4/1694454fae37a614?w=1702&h=1090&f=png&s=233503)

可以看到 `Promise, Array.isArray,Object.assign`，都对应的转换了
但是 图片里的 `Array.prototype.includes` 原型方法是没有转换的(网上文章讲到这都是一笔带过，压根没讲为什么会这样设计)，为啥 `Babel` 的作者为什么这样设计，其实是因为他无能为力,要实现 这个功能 需要在 把所有数组包裹起来,例如下面这样
```
let arry = [1，2，3,4]   转换成

let array = function(){
    return new _Array(1,2,3,4) // 假设是这个样子
}
```
但是 `Javascript` 是个弱类型语言，在 `AST` 层面无法解析到判断某个变量是不是一个数组,所以很无奈, `runtime` 也不是包治百病，需要配合 `@babel/polyfill` 配合转换 原型链上的方法
 
OK,可算写完了,总结下, `Babel` 只是转换 `syntax` 层语法,所有需要 `@babel/polyfill` 来处理API兼容,又因为 `polyfill` 体积太大，所以通过 `preset`的 `useBuiltIns` 来实现按需加载,再接着为了满足 npm 组件开发的需要 出现了 `@babel/runtime` 来做隔离

基本上这篇是大部分人在开发中常遇到，希望读者都能掌握，看到这眼睛离开手机,会议下整篇文章。

大家可以看到我写的东西都不是按照网上的 直接上代码，说明某个语法是干嘛的，那样非常好写，但是缺乏生命, 看了就过了，很容易忘记

站在作者的角度思考为什么这样实现，感觉是一种隔着屏幕和网线那端作者对话,整个知识是流动了，不用强行记忆，就能记住某个配置的具体含义。推荐大家在学习新的东西时候也可以用这种方法，开始会慢些，但是基本不会忘记。

[demo地址](https://github.com/hucheng91/frontend-note/tree/master/%E5%89%8D%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%8C%96/babelLearn)














[1]: https://mp.weixin.qq.com/s?__biz=MzAwOTkzNDc0Mg==&mid=2247483745&idx=1&sn=3ad02c5981127907840a3c3c9d0fb86c&chksm=9b594398ac2eca8e5b5c8473ae617e49e968d9b75db8242512ad0df6d4b6e8ad1d5aef9b9d86#rd
[2]: https://mp.weixin.qq.com/s?__biz=MzAwOTkzNDc0Mg==&mid=2247483750&idx=1&sn=c90e95159199ac7aa2612207e89e9182&chksm=9b59439fac2eca89bc558fd2a360408bf8e8a928688963f7f21a5e17ae2ae678f8265a8003aa#rd
[3]: https://mp.weixin.qq.com/s?__biz=MzAwOTkzNDc0Mg==&mid=2247483764&idx=1&sn=ccc0da501c249e7f6933c1068b8440b4&chksm=9b59438dac2eca9b186a04cad9085d3fb1e4de56fc5726cb26da57d5cb21c22c090e5e8ef751&token=824736612&lang=zh_CN#rd