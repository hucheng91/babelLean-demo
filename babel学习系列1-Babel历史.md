
学习框架/库的时候，我喜欢把框架/库的历史发展弄清楚，然后弄清架构设计，最后看语法，有大版本更新的时候
会去看看作者的 twitter , 这样我会感觉代码是活的，更容易明白这个框架/库是解决什么问题出现的，心里比较踏实

前端的蓬勃发展 得益于 Google的V8引擎(2008年出现), Node.js 的诞生(2009年出现,npm 10年出现); V8引擎把 Javascript 的运行速度提上来了(有兴趣的可以看下 Chrome 第一次出现的时候，大家对网页加载速度惊叹),有了 Node.js
前端出现了打包,编译, 变得工程化,前端一下子从石器时代进入到了工业化时代 这样才使得使用 Javascript 使用量一直排在第一 ，吊打排名第二的Java
前几年 大家都吐槽 Javascript 变化的非常快,各种框架/工具 百花齐放；但到 17年后明显平稳了些。
为什么？因为那会啥也没有，没有好用的轮子，没有好有的框架，没有标准，大家迫切的通过各种方式来提高开发效率，慢慢的这些问题都解决了，前端发展就平稳了很多。所以从历史发展的角度看问题,会更清晰。

说到前端编译,打包就离不开 Babel，Webpack,都是开发的基石，以上装逼完毕，下面聊聊 Babel

# what is Babel
简单讲 Babel 是 Javascript 编译器 ,将 ES6,ES7 ,ES8 转换成 浏览器都支持 的ES5 语法,并提供一些插件来兼容浏览器API的工具。是怎么实现的勒, Babel 会将源码转换 AST(抽象语法树) 之后，通过便利AST树，对树做一些修改，然后再将AST转成code，即成源码,通俗讲就是整了个容，浏览器觉得挺漂亮的,让代码在浏览器上耍撒
```javascript
// 这种箭头函数浏览器肯定是识别不了的
[1, 2, 3].map((n) => n + 1);

// Babel 转换了下 啾的一下 就变成了下面的代码,类似 .Java 转换成 .Class 字节码
[1, 2, 3].map(function(n) {
  return n + 1;
});
```


# what is Babel
简单讲 Babel 是 Javascript 编译器 ,将 ES6,ES7 ,ES8 转换成 浏览器都支持 的ES5 语法,并提供一些插件来兼容浏览器API的工具。是怎么实现的勒, Babel 会将源码转换 AST(抽象语法树) 之后，通过便利AST树，对树做一些修改，然后再将AST转成code，即成源码,通俗讲就是整了个容，浏览器觉得挺漂亮的,让代码在浏览器上耍撒

![carbon (5).png-107.6kB](https://user-gold-cdn.xitu.io/2019/2/24/1691b1ad5ef88688?w=1276&h=580&f=png&s=110153)


# Babel 的诞生
Babel 的前身是 `6to5` 这个库， `6to5`的作者 是Facebook 的澳大利亚的工程师 [Sebastian McKenzie](https://twitter.com/sebmck?lang=zh-cn), `6to5` 是 2014 年 发布的，主要功能是 就是 ES6 转成 ES5 , 它使用 转换AST的引擎不是自己写的 ，fork了 一个更古老的库 `acorn` ,在2015年 1月份 `6to5` 和 `Esnext` 库(这个是 Ember cli 用的，Ember也是一个很出名的框架,国内用的人比较少)的团队决定一起开发 `6to5`,并改名为 `Babel` ,解析引擎改名为 `Babylon` ,再后来  `Babylon` 移入 到 `@babel/parser`

#  Babel, Babylon 含义
 - Babylon 读出来是 巴比伦 的意思，指的是巴比伦文明
 - Babel 指的是 通天塔，是巴比伦文明里面的 通天塔
   > 当时地上的人们都说同一种语言，当人们离开东方之后，他们来到了示拿之地。在那里，人们想方设法烧砖好让他们能够造出一座城和一座高耸入云的塔来传播自己的名声，以免他们分散到世界各地。上帝来到人间后看到了这座城和这座塔，说一群只说一种语言的人以后便没有他们做不成的事了；于是上帝将他们的语言打乱，这样他们就不能听懂对方说什么了，还把他们分散到了世界各地，这座城市也停止了修建。这座城市就被称为“巴别城”。
      -- 《创世记》

真是要感叹下，Babel 这个名字起的是真好，贴切的很,这些人代码写的好不说，还这么有文化，还让不让人活了,每次小编要给个项目取名字，都是抓破脑袋，流下了没有文化的泪水

#  Babel 版本
- 2015-02-15，6to5重命名为babel
- 2015-03-31，babel 5.0发布
- 2015-10-30，babel 6.0发布
- 2018-08-27, babel 7.0发布

# Babel 团队状态

Sebastian McKenzie 后来参与开发就少了，目前主要是 [Henry Zhu](https://twitter.com/left_pad),全职维护(看这个人得名字和照片,看起来像个亚裔),收入来源是社区捐赠 

Babel 发展历史简单的概括了下，下篇讲它的设计，常用方法.

参考资料:

- [Babel文档](https://babeljs.io/);
- [Babel,Babylon维基百科](https://zh.wikipedia.org/wiki/%E5%B7%B4%E5%88%A5%E5%A1%94)
- [6to5 + EsNext]([https://zh.wikipedia.org/wiki/%E5%B7%B4%E5%88%A5%E5%A1%94](http://hzoo.github.io/babel.github.io/blog/2015/01/12/6to5-esnext))
- [Henry Zhu 在 dev.io 上发的贴子]([[https://zh.wikipedia.org/wiki/%E5%B7%B4%E5%88%A5%E5%A1%94](http://hzoo.github.io/babel.github.io/blog/2015/01/12/6to5-esnext)](https://dev.to/hzoo/im-the-maintainer-of-babel-ask-me-anything-282))
- [Henry Zhu github history](https://github.com/case-studies/hzoo)