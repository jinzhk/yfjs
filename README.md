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

组件库的文档使用了 Express(4) 框架进行编写，在组件库的工程根目录下运行

    npm start

即可启动文档页面。访问地址为 <http://localhost:3000/>

某（些）组件被更改后，如果想要在文档中查看更改效果，需要在组件库根目录下执行编译命令

    grunt
  
重新刷新页面后，就可以查看和应用更改后组件的内容了。

### 编译完整包

在组件库的工程根目录下，运行：

    grunt build
  
会在 `build/lib` 目录下生成编译后的代码文件。

**minified** 目录下是混淆压缩后的代码文件；**original** 目录下是经过合并未压缩的代码文件；`yfjs.js` 为组件库的入口 JS 文件。

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
    <script src="[yfjs-lib path]/yfjs.js?v=0.8.1"></script>
  </head>
  <body>
  </body>
</html>
```

组件库中各组件通过 RequireJS 工具加载，各组件的使用方式请查阅文档。

如果您没有通过使用内置的 SPA 框架访问页面，而是希望直接使用组件库中的组件，需要将代码包含在 `YFjs.ready()` 方法内，如：

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
    <script src="[yfjs-lib path]/yfjs.js?v=0.8.1"></script>
  </head>
  <body>
    <script type="text/javascript">
      YFjs.ready(function() {
        require(['moduleName'], function() {
          // do something
        });
      });
    </script>
  </body>
</html>
```

## 更新说明

### 版本号

1. 当前组件库版本号为 `0.8.1`
2. 当前组件库内置的 SPA 框架的版本号为 `1.0.0-rc.1`

### 库更新

1. 加入了单元测试脚本。测试框架使用 Mocha (BDD)，断言库使用 should。
2. 为配合单元测试，调整了模块编译方式。加入了 `build.js` 和 `build.json` 用以处理模块的编译。
3. YFjs的核心库进行了调整，去除了默认加入的 `Modernizr`，支持自动检测并加入兼容脚本。

### 组件更新

1. 双列框选择组件 `jq/multiselect` 更名为 `jq/multipicker`，同时 jQuery 扩展名称由 `multiSelect` 更名为 `multiPicker`。因为 multiselect 名称概念易和 multiple 的 select 控件混淆
2. 加密解密工具库 `crypto-js` 更名为 `crypto`
3. 表格组件 dataTables 删除了 `dataTables-jui` 和 `dataTables-foundation` 相关样式。为了表格组件样式的统一设置。
4. 修复了引入图表组件 `echarts2/chart/wordCloud` 时依赖出错的问题。

### SPA 框架更新

1. 视图和布局的配置项 `styles` 更名为 `style`。为了与整体配置项风格一致。
2. 视图和布局实例的 `load` 方法增强：支持自动查找元素容器下引入（include）的子页面了。
3. 布局模板内的 `{{body}}` 写法更改为 `{{{body}}}`（由两个大括号更改为三个）。解决了无法向布局模板内传入自定义的 body 变量数据的问题。
