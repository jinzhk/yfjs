# YFjs

YF（Young Front）是一个由几个“年轻”但热爱前端技术的前端人组成的兴趣小组，寄意于“年轻有活力”。

YFjs是一个组件库，其中大部分是一些第三方的库（感谢众多前端大神），比如jQuery、Requirejs、Bootstrap等开源库和框架是这个组件库的核心依赖，我们基于这些库和框架做了一些前端“轮子”，并按照 Requirejs 的模块加载规则进行了规范和整理，使众多前端组件更易使用。

另外，这个组件库里还包含一个我们精心设计的前端框架 yfjs/spa。顾名思义，它是一个 SPA（Single Page Application 单页面应用）框架，风格简洁，配置和约定共同驱动，文档内详细介绍了这个框架，欢迎试用。

总之，YFjs能够帮助我们快速使用弹出框、美化后的下拉框和单/复选框、滚动条等UI组件，也能使用JSON转换、Cookie处理、日期格式处理等工具组件，更能配合我们的 SPA 框架快速构建一个单页面应用系统，让我们的前端开发更便捷。

## 开始使用

YFjs组件库的编译和文档运行依赖于 Node.js 环境。如果您本地没有安装过 Node.js，请先访问 [下载 | nodejs中文网](http://nodejs.cn/download/) 网站下载适合您系统的版本进行安装。

Node.js 自 `0.6.x` 系列版本开始集成了 NPM (Node Package Manager, Node.js 的包管理工具)，建议下载最新版本的 Node.js 使用。

### 准备编译环境

目前组件库使用 Grunt 工具编译各组件模块。

首先，为了更方便执行编译命令，请在全局环境下安装 Grunt 的命令行接口插件：

    npm install -g grunt-cli

在组件库的工程根目录下，安装组件库依赖：

    npm install

### 运行文档

组件库的文档可以在项目网站 <http://jinzhk.github.io/yfjs/> 上查阅。

如果您在调试某（些）组件，并想查看调试结果，可以运行文档。

从 `0.8.2` 版本开始，组件库的文档改用 Markdown 进行编写，并通过自行修改后的文档生成插件 [idoc](http://jaywcjlove.github.io/idoc/) 编译生成静态 HTML 文件进行浏览。

当然，仍旧支持 HTTP 方式访问。在组件库的工程根目录下运行

    npm start

即可启动文档页面。访问地址为 <http://localhost:3000/>

如果您是第一次启动文档页面，需要先运行

    npm run build

如果您更改了文档内容，想要查看更改效果，运行

    npm run idoc build

重新编译生成文档静态页面即可。

### 编译完整包

在组件库的工程根目录下，运行：

    grunt build
  
会在 `build/lib` 目录下生成编译后的代码文件。

**minified** 目录下是混淆压缩后的代码文件；**original** 目录下是经过合并未压缩的代码文件；`yfjs.js` 为组件库的入口 JS 文件。

另外，我们也提供了编译好后的 YFjs Zip 包，点击 [这里](https://github.com/jinzhk/yfjs-compiled/archive/master.zip) 下载最新版本或访问 [编译包](https://github.com/jinzhk/yfjs-compiled) 地址自行选择下载。

### 使用组件库

将组件库编译生成的文件拷贝至自己所开发的工程的固定目录下即可使用。

然后在页面中引入组件库的入口 JS 文件 `yfjs.js` 即可，如：

```html
<!DOCTYPE html>
<html class="no-js">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="renderer" content="webkit">
    <title>Web Title</title>
    <!-- YFjs Lib -->
    <script src="[yfjs-lib path]/yfjs.js?v=0.8.2"></script>
  </head>
  <body>
  </body>
</html>
```

组件库中各组件通过 RequireJS 工具加载，各组件的使用方式请查阅文档。

#### 异步延迟引入

如果您项目中的入口文件是异步加载，并且没有通过使用内置的 SPA 框架访问页面，同时又希望直接使用组件库中的组件，则需要将代码包含在 `YFjs.ready()` 方法内，如以下情况：

```html
<!DOCTYPE html>
<html class="no-js">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="renderer" content="webkit">
    <title>Web Title</title>
  </head>
  <body>
    <script type="text/javascript">
      var yfjsScript = document.createElement("script");
      yfjsScript.setAttribute('src', "[yfjs-lib path]/yfjs.js?v=0.8.2");
      document.head.appendChild(yfjsScript);
      yfjsScript.addEventListener("load", function() {
        YFjs.ready(function() {
          require(['moduleName'], function() {
            // do something
          });
        });
      }, false);
    </script>
  </body>
</html>
```

当然，我们一般情况下很少会使用这种写法，我们也建议若非是当前需求，请在 `head` 标签最开始引入资源的地方引入组件库的入口文件。

### 单元测试

组件库已加入了单元测试脚本。在 `test` 目录下直接在浏览器中打开 index.html 文件即可。

组件库的单元测试使用了 [mocha](https://mochajs.org/) 框架，断言库使用的是基于 BDD 模式的 [should](http://shouldjs.github.io/) 工具插件。