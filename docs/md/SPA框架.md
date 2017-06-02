## 介绍

<p class="lead">
  YFjs 组件库包含了一款我们精心设计的 Web 渲染框架 `yfjs/spa`。它是一款采用单页面形式渲染的前端框架，在设计上借鉴了目前流行的轻量级前端框架 [Vue](http://cn.vuejs.org/)，同样只关注视图层、渐进式设计等。同时，参考了 Node.js 环境下的框架 [Express](http://www.expressjs.com.cn/) 的部分特性，模板语法、回调参数形式、布局的使用等迎合前端大流，便于您快速入手。
</p>

### 特性

目前 `yfjs/spa` 框架尚处于起步阶段，功能上固然离 [Angular](https://angularjs.org/)、[Vue](http://cn.vuejs.org/)、[React](https://facebook.github.io/react/) 等著名框架相差甚远，但不妨花两分钟浏览下框架的一些特性介绍，决定是否值得做下尝试：

* 框架采用 AMD 规范组织模块，无需关心 `module.exports`、`exports` 等写法，且依赖在头部声明，便于非专业前端开发人员理解。
* 在 jQuery 库基础上提供丰富的扩展工具插件，同时优化了众多常用的第三方库，以更少的代码实现复杂功能。
* 框架层次简洁明了，自底向上增量开发，提高功能代码重用率。
* 丰富页面片段功能，各页面着重模块化，提高页面重用率。
* 提供页面布局功能，布局可动态指定，一页多用。
* 配置项可全局渗透，且可动态计算，简约并便于维护。
* 各功能组件完全配置化，参照文档即可快速使用。
* ... ...

<div class="callout callout-warning">
  <h4>您应当具备的基础知识</h4>
  <p>
    在继续下面的教程之前，您需要确定自己对 HTML 和 JavaScript 的知识有基本的了解，使用过 [jQuery](https://jquery.com/) 更佳。如果您对这些知识（特别是 JavaScript）还是一知半解的状态，使用此框架会处于很艰难的状况，推荐前往 [w3school](http://www.w3school.com.cn/) 或其他前端学习网站学习 HTML 和 JavaScript 的相关知识。
  </p>
</div>

## Hello World

<p class="lead">
  通过创建一个 Hello World 基本应用，简单认识一下 `yfjs/spa` 框架。
</p>

### 准备

在创建 Hello World 应用之前，请确保入口页面已按照 [开始使用 / 使用说明](../index.html#t1_使用说明) 章节介绍的内容准备好了组件库资源的引入。

那么，目前我们的入口页面（index）内容应该类似于下面：

```html
<!DOCTYPE html>
<html class="no-js">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="renderer" content="webkit">
    <title>Web Title</title>
    <!-- base context -->
    <base href="/">
    <!-- yfjs Lib -->
    <script src="/yfjs-lib/yfjs.js"></script>
  </head>
  <body>
  </body>
</html>
```

<strong class="text-danger">如果入口页面存在访问上下文（如 `http://example.com/context/` 的访问上下文是 `/context/`）</strong>，则 `head` 标签内的 `base` 标签应设为：

```html
<base href="/context/">
```

接下来，经过简单三步就可以快速创建一个基本的 Hello World 应用。

### 第一步：配置应用入口

在引入 `yfjs.js` 文件的 Script 标签上添加属性 `data-main` 和 `data-base-require`。

* <mark>data-main</mark>: 应用的入口 JS 文件。建议为 `app`。

* <mark>data-base-require</mark>: 引入本地资源的基路径。建议为 `app`。

另外，还有属性 `data-cache`，用来设置是否开启缓存。调试阶段建议关闭缓存。

* <mark>data-cache</mark>: 全局缓存开关，控制模板文件、JS 文件等是否缓存。默认开启缓存，设置为 `false` 则关闭缓存。

设置属性后的 Script 标签类似于：

```html
<script src="/yfjs-lib/yfjs.js"
        data-main="app"
        data-base-require="app"
        data-cache="false">
</script>
```

<div class="callout callout-danger">
  <h4>版本不兼容提示</h4>
  <p>在 0.8.1 版本之前，本地资源的基路径配置属性为 `data-require-base`，自 0.8.1 版本开始，为统一命名规范，更改为 `data-base-require`。</p>
</div>

### 第二步：构建应用目录

在访问根目录下，创建 `data-base-require` 属性指定的目录名（下文称为 <mark>应用目录</mark>）：

```
+ app/     <-- 应用目录
index.html <-- 表示应用目录应在访问根目录下，并不意味着要与index入口文件同层
```

在应用目录下，创建 `data-main` 属性指定的应用入口文件 `app.js`:

```
- app/
  app.js   <-- 应用入口文件
index.html
```

在应用目录下，创建视图目录 `views`、布局目录 `layouts`、视图模板目录 `templates`、布局模板目录 `templates/layouts`:

```
- app/
  + layouts/     <-- 布局目录
  - templates/   <-- 视图模板目录
      + layouts/ <-- 布局模板目录
  + views/       <-- 视图目录
  app.js
index.html
```

### 第三步：编写首页内容

编写应用入口文件内容，引入框架 `yfjs/spa`：

```javascript
define(['yfjs/spa'], function(SPA) {
    SPA.create();
});
```

在视图目录下创建文件 `home.js`，并编写内容：

```javascript
define(['App'], function(App) {
    return App.View();
});
```

在视图模板目录下创建文件 `home.html`，并编写内容：

```html
<div class="container">
  <h1>Hello World!</h1>
</div>
```

此时，应用目录结构应类似于：

```
- app/
  + layouts/
  - templates/
      + layouts/
      home.html <-- 首页模板
  - views/
      home.js   <-- 首页入口
  app.js
index.html
```

将当前工程在 HTTP 环境下运行起来，直接访问入口页面（即默认首页 /），即可看到 Hello World! 内容。

### 使用布局

<p class="lead">
  **布局** 是 `yfjs/spa` 框架的一大特色，我们可以将页面的公共部分抽离成布局，提升页面渲染效率。
</p>

接下来，我们在上面的 Hello World 应用基础上，使用布局改写。

首先，改写首页视图入口文件 `views/home.js`：

```javascript
define(['App'], function(App) {
    return App.View({
        layout: "default"
    });
});
```

其次，在布局目录下创建布局文件 `default.js`，并编写内容：

```javascript
define(['App'], function(App) {
    return App.Layout();
});
```

然后，改写首页默认模板文件 `templates/home.html`：

```html
<h1>Hello World! - layout "default" used.</h1>
```

最后，在布局模板目录下创建文件 `default.html`，并编写内容：

```html
<div class="container">
  {{{body}}}
</div>
```

<div class="callout callout-danger">
  <h4>版本不兼容提示</h4>
  <p>在 0.8.1 版本之前，布局中的 body 占位符还是作为一个变量由两个大括号包括，即 `{{body}}`，自 0.8.1 版本开始，为了不污染模板变量 `body`，去除了这种方式，效仿 Express 框架改为三个大括号包含的关键字符，即 `{{{body}}}`。</p>
</div>

此时，应用目录结构应类似于：

```
- app/
  - layouts/
      default.js       <-- default布局入口
  - templates/
      - layouts/
          default.html <-- default布局模板
      home.html        <-- 首页模板
  - views/
      home.js          <-- 首页入口
  app.js
index.html
```

刷新页面，即可看到改用布局后的结果。

### 完整示例

您可以通过 <a href="../static/demo/spa/" target="_blank">SPA Demo</a> 页面查看一个比较完整地使用 SPA 框架的示例。这个示例包含登录过滤器、引入第三方组件、以及使用页面片段等内容。

接下来的内容会帮助您更好地理解这个示例。

## 约定与配置

<p class="lead">
  正如在 [介绍](../index.html#t0_介绍) 章节我们提到过：`yfjs/spa` 框架是一个 **配置和约定共同驱动** 的框架。配置的是功能接口，约定的是路由等规则。下面分别介绍约定和配置的相关内容。
</p>

### 约定规则

#### 路由约定

框架内置了页面路由，页面的定向遵守框架既定规则：

* 页面的路由在 URL 上默认体现为 hash 模式。即形如 `http://127.0.0.1/#/path?param1=value1`，则页面路径为 `/path`，其后内容为页面的参数。
* 页面路径对应<mark>视图目录 <span class="text-danger">views</span></mark>下的同路径同名的 JavaScript 文件。
* 页面的默认模板对应<mark>模板目录 <span class="text-danger">templates</span></mark>下的同路径同名的 HTML 文件。
* 页面使用的布局（若存在）对应<mark>布局目录 <span class="text-danger">layouts</span></mark>下的同路径同名的 JavaScript 文件。
* 页面布局的默认模板对应<mark>布局模板目录 <span class="text-danger">templates/layouts</span></mark>下的同路径同名的 HTML 文件。

#### 分层渲染

为了充分体现单页面应用的局部加载、按需加载的特性，框架将页面内容进行了区段划分，并由上至下分层渲染。

框架将当前页面窗口定义为 App 层（应用层），页面主体内容定义为 View 层（视图层），页面外层布局定义为 Layout 层（布局层）。其中 View 层可任意嵌套并定义加载时机，在最上层的 View 层可指定采用的 Layout 层。App 层则负责整体状态切换、页面路由等。

整体分层可参看下图：

<p id="img-spa-widgets">
  ![框架分层示意图](static/images/spa-widgets.png)
</p>

### 配置和扩展

在创建当前应用时，可以为当前应用指定一些配置项：

```javascript
SPA.create({
    baseUrl: {
        style: "/assets/css",  // 设置样式文件基路径
        resource: "/assets"    // 设置其他资源基路径
    }
});
```

同时，也可以添加一些扩展功能方法：

```javascript
SPA.create({
    // 配置项 baseUrl
    baseUrl: {
        style: "/assets/css",
        resource: "/assets"
    },
    // 扩展功能
    doSomething: function() {
        return "do " + this.getSomething();
    },
    getSomething: function() {
        return "something.";
    }
});
```

在使用应用实例 `App` 创建一个视图实例时，可以使用 `App` 实例的扩展功能（方法或属性）：

```javascript
App.View({
    // 配置项 layout 布局
    layout: "default",
    // 配置项 ready 页面渲染后执行
    ready: function() {
        console.log(
            this.doSomething()
        );
    },
    // 扩展功能
    doSomething: function() {
        // 调用 App 实例的扩展功能
        App.doSomething();
    }
});
```

<div class="callout callout-danger">
  <h4>扩展功能注意事项</h4>
  <p>
    目前应用实例或视图/布局实例的配置项和扩展功能（方法或属性）在同等位置上定义，使用时应注意扩展方法或属性名称不能与实例的固有配置项和属性、方法等重名。<strong class="text-danger">与实例的属性、方法重名的扩展属性或方法将被忽略并产生错误提示</strong>。
  </p>
</div>

## 应用层

<p class="lead">
  框架结构顶层称为应用（App）层。应用层主要负责路由自动切换、维护全局状态、提供全局功能等。应用开始启动后，框架将自动生成一个应用实例来负责应用层的一应事务。
</p>

在通过框架的 `.create()` 方法接口创建一个应用实例时，框架会默认指定 `App` 作为所创建应用实例的模块 ID，并自动启动访问应用页面。

### 生命周期

<div class="callout callout-warning">
  <p>
    生命周期章节只是为了便于您理解框架的一些运行原理，对于使用框架并不是必须掌握的内容。在了解了常用的生命周期钩子后，您可以选择跳过此章节，等使用过框架一段时间后再回头理解这些内容。
  </p>
</div>

应用实例从页面开始初次加载时创建，一直存在到页面顶层窗口关闭。期间页面内容的更新由内置的路由器（Router）自动加载视图层进行处理。这个过程称为**应用实例生命周期**。

#### 生命周期图示

概括来看，应用实例的生命周期分为四个阶段：

<p id="img-spa-lifecycle-desc-app">
  ![应用实例生命周期阶段图](static/images/spa-lifecycle-desc-app.png)
</p>

在设计上，应用实例详细的生命周期过程为：

<p id="img-spa-lifecycle-app">
  ![应用实例生命周期示意图](static/images/spa-lifecycle-app.png)
</p>

#### 生命周期钩子

框架提供了相应的钩子方法（hook）以在应用实例生命周期变化时做动态处理：

##### statechange

> Function

在状态改变时调用（优先于其他状态钩子）。

##### 参数：

* _prevState_ - 状态改变前的上一次状态对象。

##### beforeCreate

> Function

在应用实例初始化之前调用。

##### 参数：

* _state_ - 当前状态对象。

##### created

> Function

在应用实例初始化完成后调用。

##### beforeReady

> Function

在应用实例初始化完成，事件绑定等执行之前调用。

##### ready

> Function

在应用实例初始化完成，事件绑定等执行之后调用。

##### beforeLoad

> Function

在加载当前视图实例之前调用。

##### loaded

> Function

在当前视图实例加载并准备完成之后调用。

##### beforeDestroy

> Function

在准备关闭当前标签页，销毁应用实例之前调用。

##### 返回：

返回非 `undefined|null` 值时不关闭页面，并将返回值作为提示信息内容。

##### destroyed

> Function

在销毁应用实例之后，关闭当前标签页时调用。

每个钩子方法的 *this* 指针都指向当前的应用实例。

使用示例：

```javascript
SPA.create({
    statechange: function(prevState) {
        var curState = this.getState();
        if (!curState) {
            curState = prevState;
            prevState = null;
        }
        console.log(
          'app statechange - current: [' + curState.label + ']' + 
          (prevState ? ', previous: [' + prevState.label +']' : '')
        );
    },
    beforeCreate: function(state) {
        console.log('app state: ' + state.label);
    },
    created: function() {
        console.log('app state: ' + this.getState('label'));
    },
    beforeReady: function() {
        console.log('app state: ' + this.getState('label'));
    },
    ready: function() {
        console.log('app state: ' + this.getState('label'));
    },
    beforeLoad: function() {
        console.log('app state: ' + this.getState('label'));
    },
    loaded: function() {
        console.log('app state: ' + this.getState('label'));
    },
    beforeDestroy: function() {
        console.log('app state: ' + this.getState('label'));
    },
    destroyed: function() {
        console.log('app state: ' + this.getState('label'));
    }
});
```

### 配置项

应用实例除了钩子方法外，还提供以下配置项

#### container

> String | Node | jQuery | Function

默认值: `"body"`

放置当前应用 HTML 内容的容器元素。可为 HTML 元素节点对象、选择器字符串、jQuery元素对象。默认会作为容器元素的第一个子节点。

为 Function 类型时执行并获取返回结果，其 *this* 指针指向当前应用实例。

使用示例：

```javascript
SPA.create({
  container: "#container-id"
});
```

<p class="lead-code">
等效于：
</p>

```javascript
SPA.create({
  container: function() {
    return "#container-id";
  }
});
```

#### baseUrl

> String | PlainObject | Function

默认值：

```javascript
{
  resource: "/",
  style: "/",
  view: "views",
  layout: "layouts",
  template: "templates"
}
```

当前应用资源的相对路径。

为 String 类型时，等同于设置 [baseUrl.root](#t3-1-1-0_baseUrl.root)，即同 `{root: [baseUrl]}`。

为 PlainObject 类型时，包含以下配置项属性：

##### baseUrl.root

> String

应用的访问根路径。规则为：

* 若以双斜杠（如 //example.com）或资源协议（如 http: https: 等）开头，则为指定的远程地址
* 非远程地址时，则和当前域名连接作为应用根路径
* 默认情况下，设置为 `base` 标签的值，若不存在 `base` 标签，默认为当前域名

##### baseUrl.resource

> String

默认值：`"/"`

静态资源引入的相对路径。规则为：

* 若以双斜杠（如 //example.com）或资源协议（如 http: https: 等）开头，则为指定的远程地址
* 若以斜杠开头，则相对于应用根路径（root），否则，相对于入口（data-main）JS文件所在的目录
* 默认值情况下，相对于应用的根路径

##### baseUrl.style

> String

默认值：`"/"`

样式文件的相对路径。规则为：

* 若以双斜杠（如 //example.com）或资源协议（如 http: https: 等）开头，则为指定的远程地址
* 若以斜杠开头，则相对于应用根路径（root），否则，相对入口（data-main）JS文件所在的目录
* 默认值情况下，相对于应用的根路径

##### baseUrl.view

> String

默认值：`"views"`

视图的脚本文件的相对路径。规则为：

* 若以双斜杠（如 //example.com）或资源协议（如 http: https: 等）开头，则为指定的远程地址
* 若以斜杠开头，则相对于应用根路径（root），否则，相对入口（data-main）JS文件所在的目录
* 默认值情况下，相对于入口（data-main）JS文件所在目录下的 views 目录

##### baseUrl.layout

> String

默认值：`"layouts"`

布局的脚本文件的相对路径。规则为：

* 若以双斜杠（如 //example.com）或资源协议（如 http: https: 等）开头，则为指定的远程地址
* 若以斜杠开头，则相对于应用根路径（root），否则，相对入口（data-main）JS文件所在的目录
* 默认值情况下，相对于入口（data-main）JS文件所在目录下的 layouts 目录

##### baseUrl.template

> String

默认值：`"templates"`

模板文件的相对路径。规则为：

* 若以双斜杠（如 //example.com）或资源协议（如 http: https: 等）开头，则为指定的远程地址
* 若以斜杠开头，则相对于应用根路径（root），否则，相对入口（data-main）JS文件所在的目录
* 模板的加载使用了 Ajax 技术，若为跨域远程地址，需自行处理跨域问题
* 默认值情况下，相对于入口（data-main）JS文件所在目录下的 templates 目录

配置项 `baseUrl` 为 Function 类型时执行并获取返回结果，其 *this* 指针指向当前应用实例。

使用示例：

```javascript
baseUrl: {
  resource: "/assets",
  style: "/assets/css"
}
```

#### index

> String | Function

默认值：`"/home"`

应用默认首页（访问路径）。

为 Function 类型时执行并获取返回结果，其 *this* 指针指向当前应用实例。

#### cssPrefix

> PlainObject | Function

默认值：

```javascript
{
  view: "app-view_",
  layout: "app-layout_",
  include: "app-include_"
}
```

在页面的 `html` 标签上当前视图和布局实例的 class 样式标记的前缀。

为 PlainObject 类型时，包含以下配置项属性：

##### cssPrefix.view

> String

默认值：`"app-view_"`

当前视图的 class 样式标记的前缀。

##### cssPrefix.layout

> String

默认值：`"app-layout_"`

当前布局的 class 样式标记的前缀。

##### cssPrefix.include

> String

默认值：`"app-include_"`

子页面（实例）元素容器的 class 样式标记的前缀。

为 Function 类型时执行并获取返回结果，其 *this* 指针指向当前应用实例。

#### loading

> PlainObject | Function

默认值：

```javascript
{
  html: '<div class="loader"></div>',
  ready: function($container) {
    $(".loader", $container).loader();
    return this;
  },
  destroy: function($container) {
    $(".loader", $container).loader('destroy');
    return this;
  }
}
```

设置（子）页面加载中的效果。默认情况下，加载效果使用 [loader](YFjs工具.html#t0-2-7_加载中效果+loader) 组件实现。

为 PlainObject 类型时，包含以下配置项属性：

##### loading.html

> String | Function

默认值：`'<div class="loader"></div>'`

加载效果对应的 HTML 字符串。

为 Function 类型时执行并获取返回结果，其 *this* 指针指向当前应用实例。

##### loading.ready

> Function

默认值：

```javascript
function($container) {
  $(".loader", $container).loader();
  return this;
}
```

触发加载效果的执行方法。

##### 参数：

* _$container_ - 加载中内容的元素容器的 jQuery 对象

方法的 *this* 指针指向当前应用实例。

##### loading.destroy

> Function

默认值：

```javascript
function($container) {
  $(".loader", $container).loader('destroy');
  return this;
}
```

销毁加载效果的执行方法。

##### 参数：

* _$container_ - 加载中内容的元素容器的 jQuery 对象

方法的 *this* 指针指向当前应用实例。

配置项 `loading` 为 Function 类型时执行并获取返回结果，其 *this* 指针指向当前应用实例。

#### filter

> PlainObject | Array | Function

默认值：`undefined`

配置应用访问过滤器。

为 PlainObject 类型时，包含以下配置项属性：

##### filter.name

> String

过滤器名称。不设置时，默认以 `'filter-1'`, `'filter-2'` 的格式生成。常用于应用实例的 [App.getFilter()](#t3-3-3_getFilter%28%29) 方法的参数，以获取指定的应用过滤器实例。

##### filter.access

> Function

过滤器执行过滤判断的方法。方法的 *this* 指针指向当前应用实例。

##### 参数：

* _state_ - 当前状态对象。

##### 返回：

必须返回 Boolean 类型（等效于 `true` 或 `false` 的值亦可）。`true` 代表通过了过滤，`false` 反之。

**注：**该方法暂不支持延迟处理，后续版本会考虑加上。

##### filter.do

> Function

过滤器执行过滤效果的方法。方法的 *this* 指针指向当前应用实例。

##### 参数：

* _state_ - 当前状态对象。

##### filter.includes

> String | RegExp | Array

过滤器黑名单（需要拦截的页面的路径）。规则为：

+ 支持正则表达式字符串形式和对象形式

+ 为正则表达式字符串时，需要注意以下规则：

  - 通配符 `'*'` 表示匹配所有路径;
  
  - 默认从头开始匹配，不匹配结尾。匹配结尾则在末尾添加 <mark>$</mark> 符号标记，如 `'/home$'`;
  
  - 合法的文件名字符包括: 字母/数字/下划线/小数点/短横线;
  
  - 合法的路径分隔符为斜杠"/";
  
  - 星号"*"代表0个或多个文件名字符;
  
  - 问号"?"代表1个文件名字符;
  
  - 连续两个星号"**"代表0个或多个文件名字符或路径分隔符;
  
  - 不能连续出现3个星号"***";
  
  - 不能连续出现2个路径分隔符;
  
  - 连续两个星号"**"的前后只能是路径分隔符.
  
+ 为正则表达式对象时，直接执行匹配

+ 多个拦截路径可写成数组（Array）形式

##### filter.excludes

> String | RegExp | Array

过滤器白名单（不需要拦截的页面的路径）。规则同 [](filter.includes)。

配置多个过滤器时，配置项 `filter` 可写成数组（Array）形式。

配置项 `filter` 为 Function 类型时执行并获取返回结果，其 *this* 指针指向当前应用实例。

配置一个登录过滤器的示例：

```javascript
filter: {
  // 自定义过滤器名称
  name: "login",
  // 执行过滤器判断
  access: function() {
    // 根据过滤器名称获取过滤器实例（this 指向当前应用实例）
    var loginFilter = this.getFilter('login');
    // 1. 判断当前访问路径是否在登录过滤器白名单中
    // 2. 判断是否已登录
    return loginFilter.exclude(this.getPath()) || this.hasLogin();
  },
  // access 返回 false 时，执行过滤结果
  do: function() {
    // 未登录且需要登录时，跳转至登录页面（this 指向当前应用实例）
    var curUrl = this.getState('url');
    this.go(this.getUrl('/login', {callback: curUrl}));
  },
  // 过滤器黑名单 - 对所有访问路径都执行过滤判断
  includes: ['*'],
  // 过滤器白名单 - 登录页面不需要登录
  excludes: ['/login$']
},
hasLogin: function() {
  // 简单根据 cookie 中信息判断是否已登录
  return !!this.cookie.get('user');
}
```

#### binds

> Array | Function

默认值：`undefined`

事件预绑定配置。

为数组（Array）类型时，每项亦为数组类型，配置项按次序依次为：

##### binds[i][0] - eventName

> String

事件名称，多个事件名称时以空格间隔。必选。

##### binds[i][1] - element

> String | Node | jQuery

事件绑定元素。可选。省略时为 `document` 元素。绑定在 `window` 上时，可写为字符串 `'window'`。

##### binds[i][2] - data

> Object

事件绑定数据。可选。

##### binds[i][3] - handler

> Function

事件绑定回调方法。必选。方法的 *this* 指针指向当前应用实例。

##### binds[i][4] - one

> Number

设为 1 时只绑定一次事件。可选。

配置项 `binds` 为 Function 类型时执行并获取返回结果，其 *this* 指针指向当前应用实例。

使用示例：

```javascript
binds: [
  [
    'viewchange', 'window', function(evt, curState, prevState) {
      // view changed
      console.log("view changed: from " + prevState.path + " to " + curState.path);
    }
  ]
],
```

#### cache

> Boolean | Function

默认值：`true`

全局缓存开关配置。设置远程模板、样式文件等是否开启缓存。默认使用引入组件库入口文件时的 `data-cache` 属性设置。

为 Function 类型时执行并获取返回结果，其 *this* 指针指向当前应用实例。

#### template

> PlainObject | Function

默认值：`null`

模板引擎的全局配置。更详细内容可参考 [模板引擎 Template](#t5-4_模板引擎+Template) 工具组件的介绍。 

为 PlainObject 类型时，参考 [Template 配置项](#t5-4-0_配置项) 章节。

为 Function 类型时执行并获取返回结果，其 *this* 指针指向当前应用实例。

#### styleLoader

> PlainObject | Function

默认值：`null`

样式文件加载器全局配置。更详细内容可参考 [样式加载器 StyleLoader](#t5-5_样式加载器+StyleLoader) 工具组件的介绍。 

为 PlainObject 类型时，参考 [StyleLoader 配置项](#t5-5-0_配置项) 章节。

为 Function 类型时执行并获取返回结果，其 *this* 指针指向当前应用实例。

#### mode

> String | Function

默认值：`null`

全局环境模式配置项。模式名称可自定义，一些推荐名称：

* __"mock"__ - 模拟阶段
* __"test"__ - 测试阶段
* __"dev"__ - 开发阶段
* __"pro"__ - 产品阶段

为 Function 类型时执行并获取返回结果，其 *this* 指针指向当前应用实例。

#### ajax

> PlainObject | Function

默认值：`{ ... }`

应用实例的 Ajax 工具配置项。更详细内容可参考 [Ajax](#t5-0_Ajax) 工具组件的介绍。 

为 PlainObject 类型时，参考 [Ajax 配置项](#t5-0-0_配置项) 章节。

为 Function 类型时执行并获取返回结果，其 *this* 指针指向当前应用实例。

#### websocket

> PlainObject | Function

默认值：`{ ... }`

应用实例的 WebSocket 工具配置项。更详细内容可参考 [WebSocket](#t5-2_WebSocket) 工具组件的介绍。

为 PlainObject 类型时，参考 [WebSocket 配置项](#t5-2-0_配置项) 章节。

为 Function 类型时执行并获取返回结果，其 *this* 指针指向当前应用实例。

#### cookie

> PlainObject | Function

全局的 cookie 工具方法增强配置项。更详细内容可参考 [Cookie](#t5-1_Cookie) 工具组件的介绍。

为 PlainObject 类型时，键值分别为 `[方法名称] : [方法实现]`。增强 Cookie 方法的 *this* 指针指向当前 cookie 工具实例。

为 Function 类型时执行并获取返回结果，其 *this* 指针指向当前应用实例。

#### error

> String | PlainObject | Remote | Function

默认值：

```html
<div class="container">
  <h1>Error</h1>
  {{if isArray(error)}}
  <dl>
  {{each error as err}}
    {{if err}}
    <dt>&amp;diams;&ensp;{{err.type}}</dt>
    <dd>{{err.message}}</dd>
    {{/if}}
  {{/each}}
  </dl>
  {{else if error}}
  <dl>
    <dt>&amp;diams;&ensp;{{error.type}}</dt>
    <dd>{{error.message}}</dd>
  </dl>
  {{/if}}
</div>
```

错误页面配置。触发页面（PAGE）级错误时按此配置项加载错误页面。

为 String 类型时作为错误信息的模板文本内容。

为 PlainObject 类型时作为错误页面配置。除了可配置所有 [视图实例配置项](#t4-1_配置项) 外，包含以下配置项属性：

##### error.path

> String

错误页面视图路径。

为 Remote 类型（即通过 `App.remote()` 方法生成的对象类型），如果传入参数为 String 类型，同配置项 [error.path](#t3-1-14-0_error.path)；如果传入参数为 PlainObject 类型，同 PlainObject 类型的配置项。

为 Function 类型时执行并获取返回结果，其 *this* 指针指向当前应用实例。

#### errorFilter

> Function

默认值：`null`

全局错误过滤处理方法。

发生错误时，会优先调用此配置方法进行处理。

处理过程中可结合使用实例的以下错误处理方法进行处理：

* [`getError`](#t4-3-40_.getError%28%29) - 获取错误对象

* [`assignError`](#t4-3-47_.assignError%28%29) - 设置错误对象属性值

* [`addError`](#t4-3-41_.addError%28%29) - 添加错误对象并向上抛出

* [`removeError`](#t4-3-42_.removeError%28%29) - 移除错误对象不再抛出

方法的 *this* 指针根据实际调用情况动态指向当前应用或视图/布局实例。

#### onError

> Function

默认值：`null`

应用层监控到错误触发时的处理方法。

错误抛至应用层时，会调用此配置方法进行处理。

处理过程中可结合使用应用实例的以下错误处理方法进行处理：

* [`getError`](#t3-3-29_.getError%28%29) - 获取错误对象

* [`assignError`](#t3-3-32_.assignError%28%29) - 设置错误对象属性值

* [`addError`](#t3-3-30_.addError%28%29) - 添加错误对象并向上抛出

* [`removeError`](#t3-3-31_.removeError%28%29) - 移除错误对象不再抛出

方法的 *this* 指针指向当前应用实例。

#### Widget

> PlainObject | Function

默认值：`null`

为 PlainObject 类型时，作为 [视图层/布局层](#t4-1_配置项) 共用的默认配置项。

为 Function 类型时执行并获取返回结果，其 *this* 指针指向当前应用实例。

#### Layout

> PlainObject | Function

默认值：`null`

为 PlainObject 类型时，作为 [布局层](#t4-1_配置项) 的默认配置项。

为 Function 类型时执行并获取返回结果，其 *this* 指针指向当前应用实例。

#### View

> PlainObject | Function

默认值：`null`

为 PlainObject 类型时，作为 [视图层](#t4-1_配置项) 的默认配置项。

为 Function 类型时执行并获取返回结果，其 *this* 指针指向当前应用实例。

### 实例属性

应用实例在创建时会自动初始化一些默认的工具类属性。

<strong class="text-danger">应用实例的默认属性值不可修改。</strong>

#### .json

全局 JSON 工具。用以将 JSON 字符串转换为 JSON 对象（`.json.parse()`）或将 JSON 对象序列化为 JSON 字符串（`.json.stringify()`）。

**注：**框架默认引入了 JSON 兼容脚本，使用框架时<strong class="text-danger">不必</strong>再引入 [json](组件模块.html#t3-1_JSON兼容+json) 组件模块了。

使用示例：

在创建 App 实例时使用

```javascript
SPA.create({
  getSomething: function() {
    return this.json.stringify({a: 1});
  }
});
```

在编写一个视图页面脚本时使用

```javascript
App.View({
  getSomething: function() {
    return App.json.stringify({a: 1});
  }
});
```

#### .cookie

全局 Cookie 工具。通过 `.cookie` 属性可以调用的方法请参考 [Cookie 方法](#t5-1-1_方法) 章节和 [cookie](#t3-1-13_cookie) 配置项中自定义的增强方法。

全局 Cookie 工具的操作路径 path 默认为根目录 `"/"`。

使用示例：

创建 App 实例时自定义了 hasLogin 方法

```javascript
hasLogin: function() {
  return !!this.cookie.get('user');
}
```

#### .url

> PlainObject

应用资源基路径对象。包含以下属性值：

* __root__ - 应用访问基路径。
* __resource__ - 引入静态资源的基路径。
* __style__ - 引入样式文件的基路径。
* __view__ - 引入视图脚本文件的基路径。
* __layout__ - 引入布局脚本文件的基路径。
* __template__ - 引入模板文件的基路径。

**注：**以上每种路径值都以斜杠 `"/"` 结尾。

使用示例：

创建 App 实例时定义了 getImgUrl 方法

```javascript
getImgUrl: function() {
  return this.url.resource + 'images/';
}
```

#### .container

> String | Node | jQuery

应用层的容器元素。对应配置项 [container](#t3-1-0_container)。

#### .rootContext

当前应用实例对象。等效于 *this*。常用于兼容模板辅助方法的默认处理。

#### .mode

> String

当前全局环境模式参数。

#### .remote

> Function

生成远程资源声明类型的方法。

使用示例：

创建 App 实例时指定默认错误页面由 error.js 视图脚本处理

```javascript
error: function() {
  return this.remote('/error');
}
```

在初始化一个视图页面时指定远程数据源

```javascript
App.View({
  data: App.remote('/data_url')
});
```

#### .template

应用实例的模板工具对象。通过 `.template` 属性可以调用的方法请参考 [Template 方法](#t5-4-1_方法) 章节。

#### .ajax

应用实例的 Ajax 工具对象。通过 `.ajax` 属性可以调用的方法请参考 [Ajax 方法](#t5-0-1_方法) 章节。

#### .ws

应用实例的 WebSocket 工具对象。通过 `.ws` 属性可以调用的方法请参考 [WebSocket 方法](#t5-2-1_方法) 章节。

#### .styleLoader

应用实例的样式加载器工具对象。通过 `.styleLoader` 属性可以调用的方法请参考 [StyleLoader 方法](#t5-5-1_方法) 章节。

### 实例方法

#### get()

获取某个配置项或自定义属性（方法）的值。

##### 参数：

* _key_ - 配置项或自定义属性（方法）的名称。String 类型。

##### 返回：

指定的配置项或自定义属性（方法）对应的值。

#### set()

设置某个配置项或自定义属性（方法）。

##### 参数：

* _key_ - 配置项或自定义属性（方法）的名称。String 类型。
* _value_ - 配置项或自定义属性（方法）的值。任意类型。

##### 返回：

当前 App 实例。

#### getOptions()

获取所有配置项。

##### 参数：

_无_

##### 返回：

含有所有配置项的对象。

#### getFilter()

获取某个过滤器对象。

##### 参数：

* _name_ - 过滤器的名称。String 类型。

##### 返回：

过滤器名称对应的过滤器对象。

过滤器对象可以操作的方法请参考 [Filter](#t5-6_过滤器+Filter) 工具组件章节。

#### getFilters()

获取所有过滤器。

##### 参数：

_无_

##### 返回：

所有的过滤器对象数组。数组顺序对应配置过滤器时顺序。

#### getCache()

获取应用层的缓存。

##### 参数：

* _key_ - 缓存的键名称。String 类型。

##### 返回：

指定的缓存名称对应的值。

**注：**框架内目前对自定义缓存的处理是存在内存中，之后版本将实现其他形式的缓存。

#### setCache()

设置应用层的缓存。

##### 参数：

* _key_ - 缓存的键名称。String 类型。
* _value_ - 缓存的键对应的值。任意类型。

##### 返回：

当前 App 实例。

#### removeCache()

移除应用层的缓存。

##### 参数：

* _key_ - 要移除的缓存的键名称。String 类型。

省略参数 _key_ 将移除所有的缓存。

##### 返回：

当前 App 实例。

#### getCookie()

获取 Cookie 数据。当然，也可通过 [.cookie](#t3-2-1_.cookie) 属性的 `get()` 方法获取。

##### 参数：

* _name_ - Cookie 的键名称。String 类型。

##### 返回：

指定的 Cookie 的键名称对应的值。

#### setCookie()

设置 Cookie 数据。当然，也可通过 [.cookie](#t3-2-1_.cookie) 属性的 `set()` 方法设置。

##### 参数：

* _name_ - Cookie 的键名称。String 类型。
* _value_ - Cookie 的键对应的值。任意类型。

##### 返回：

当前 App 实例。

#### removeCookie()

删除 Cookie 数据。当然，也可通过 [.cookie](#t3-2-1_.cookie) 属性的 `remove()` 方法删除。

##### 参数：

* _name_ - 要删除的 Cookie 的键名称。String 类型。

##### 返回：

删除成功返回 true，否则 fasle。

#### getRootUrl()

获取相对于应用访问根路径的访问路径。

##### 参数：

* _path_ - 相对于应用访问根路径的相对路径。String 类型。可选。
* _params_ - 路径参数。Object 类型。可选。

##### 返回：

访问路径地址。省略参数 _path_ 时将返回应用访问根路径。

#### getResourceUrl()

获取相对于应用资源根路径的访问路径。

##### 参数：

* _path_ - 相对于应用资源根路径的相对路径。String 类型。可选。
* _params_ - 路径参数。Object 类型。可选。

##### 返回：

访问路径地址。省略参数 _path_ 时将返回应用资源访问根路径。

#### getStyleUrl()

获取相对于应用样式文件的访问路径。

##### 参数：

* _path_ - 相对于应用样式文件根路径的相对路径。String 类型。可选。
* _params_ - 路径参数。Object 类型。可选。

##### 返回：

访问路径地址。省略参数 _path_ 时将返回应用样式文件访问根路径。

#### getFullUrl()

根据相对路径获取完整的路径。

##### 参数：

* _path_ - 相对路径地址。String 类型。可选。
* _params_ - 路径地址参数。Object 类型。可选。
* _relativePath_ - 要相对的路径地址。Object 类型。可选。该参数省略时默认为应用访问根路径。

##### 返回：

相对于指定路径地址的完整路径。

#### getUrl()

获取（视图）页面的访问路径。

##### 参数：

* _path_ - （视图）页面路径地址，为相对路径（以 `'./'` 或 `'../'` 开头）时相对于当前页面路径。String 类型。
* _params_ - 路径地址参数。Object 类型。可选。

##### 返回：

（视图）页面的访问路径地址。

#### go()

页面跳转。

##### 参数：

* _reloadPage_ - 指定是否重新加载整个页面（包括布局内容）。Boolean 类型。可选。默认为 `false`。
* _url_ - 要跳转的（视图）页面的地址。String 类型。可选。省略该参数时将刷新（重新加载）当前页面。

##### 返回：

当前 App 实例。

示例：

重新加载当前页面（包括布局内容）

```javascript
App.go(true);
```

#### back()

页面回退到上一个（视图）页面。

##### 参数：

_无_

##### 返回：

当前 App 实例。

**注：**第一次加载页面，回退时应刷新当前页面，目前是会回退到空标签页。之后版本会添加该功能。

#### forward()

页面前进到下一个（视图）页面。

##### 参数：

_无_

##### 返回：

当前 App 实例。

**注：**第一次加载页面，前进时应刷新当前页面，目前是会前进到空标签页。之后版本会添加该功能。

#### helper()

添加全局模板辅助方法。等同于在 [template](#t3-1-8_template) 配置项中配置 `helpers`。

##### 参数：

* _name_ - 要添加的辅助方法的名称。String 类型。
* _fn_ - 要添加的辅助方法的实体。Function 类型。方法内的 *this* 指针根据模板实际使用情况动态地指向当前的应用/布局/视图实例。

##### 返回：

当前 App 实例。

#### helpers()

批量添加全局模板辅助方法。如果一次动态添加多个模板辅助方法，可考虑使用此方法。

##### 参数：

* _helpers_ - 批量添加的模板辅助方法对象。PlainObject 类型。键值对为 `[方法名称] : [方法实体]`，即同 [helper()](#t3-3-19_helper%28%29) 方法的参数。

##### 返回：

当前 App 实例。

#### bind()

绑定应用层的事件。应用层的事件会一直保持监听，直到手动解绑或关闭顶层的浏览窗口（或当前浏览标签页）。

##### 参数：

* _eventName_ - 事件名称，多个事件名称时以空格间隔。String 类型。必选。
* _element_ - 事件绑定元素。String|Node|jQuery 类型。可选。省略时为 `document` 元素。绑定在 `window` 上时，可写为字符串 `'window'`。
* _data_ - 事件绑定数据。任意类型。可选。
* _handler_ - 事件绑定回调方法。Function 类型。必选。方法的 *this* 指针指向当前应用实例。
* _one_ - 设为 1 时只绑定一次事件。Number 类型。可选。

##### 返回：

当前 App 实例。

#### on()

同 [.bind()](#t3-3-21_bind%28%29) 方法，为兼容 jQuery 的写法。

#### one()

绑定应用层的事件并只生效一次。

##### 参数：

* _eventName_ - 事件名称，多个事件名称时以空格间隔。String 类型。必选。
* _element_ - 事件绑定元素。String|Node|jQuery 类型。可选。省略时为 `document` 元素。绑定在 `window` 上时，可写为字符串 `'window'`。
* _data_ - 事件绑定数据。任意类型。可选。
* _handler_ - 事件绑定回调方法。Function 类型。必选。方法的 *this* 指针指向当前应用实例。

##### 返回：

当前 App 实例。

#### unbind()

解绑应用层的事件。

##### 参数：

* _eventName_ - 要解绑的事件名称，多个事件名称时以空格间隔。String 类型。必选。
* _element_ - 要解绑的事件绑定元素。String|Node|jQuery 类型。可选。省略时为 `document` 元素。绑定在 `window` 上时，可写为字符串 `'window'`。
* _handler_ - 要解绑的事件绑定回调方法（指针）。Function 类型。可选。

##### 返回：

当前 App 实例。

#### off()

同 [.unbind()](#t3-3-24_unbind%28%29) 方法，为兼容 jQuery 的写法。

#### trigger()

触发应用层的事件。

##### 参数：

* _eventName_ - 要触发的事件名称。String 类型。
* _data_ - 触发事件时为事件对象绑定的数据。任意类型。可选。
* _element_ - 触发事件的元素。String|Node|jQuery 类型。可选。默认为 `document` 元素。触发在 `window` 上时，可写为字符串 `'window'`。

##### 返回：

当前 App 实例。

#### makeError()

创建应用层的错误对象。应用层的错误对象默认级别即为 `APP`。

##### 参数：

* _id_ - 错误标识字符串。String 类型。
* _option_ - 创建的错误对象的自定义配置。PlainObject|Array 类型。为 Array 类型时等同于 `{args: [option]}`。为 PlainObject 类型时，可包含以下配置项内容：
  
  - _level_ - 错误级别，不限大小写。String 类型。可选为 `'page'`, `'app'`, `'widget'`, `'console'`。默认为 `'app'`。
  
  - _args_ - 错误信息编译参数。Object|Array 类型。
  
  - _message_ - 自定义错误信息。String 类型。
  
* _originalError_ - 原错误对象。Error 类型。

##### 返回：

创建的错误对象。

#### setError()

设置应用层的错误对象信息（将覆盖之前的内容）。

##### 参数：

* _err_ - 要设置的错误信息对象。Error|Array 类型。多个错误对象时可写成数组。省略该参数时将清空应用层的所有错误信息对象。

##### 返回：

当前 App 实例。

#### getError()

获取应用层的错误对象信息。

##### 参数：

* _filter_ - 过滤条件。PlainObject 类型。规则如下：
  - 键值分别为要查找的错误对象的键和值
  - 若值为正则表达式，则根据正则的匹配结果过滤
  - 键以叹号(!)开头时，则对匹配结果取非
  - 不传入此参数时返回所有错误信息对象

##### 返回：

要获取的错误对象数组。没有错误对象信息时为空数组。

#### addError()

添加应用层的错误对象。

##### 参数：

* _err_ - 要添加的错误信息对象。Error|Array 类型。多个错误对象时可写成数组。

##### 返回：

当前 App 实例。

#### removeError()

删除应用层的错误对象。

##### 参数：

* _err_ - 要删除的错误信息对象。Error|Array 类型。多个错误对象时可写成数组。

##### 返回：

当前 App 实例。

#### assignError()

更改应用层的错误对象的属性值。

##### 参数：

* _err_ - 要更改的错误信息对象。Error|Array 类型。多个错误对象时可写成数组。
* _props_ - 新的属性值。PlainObject 类型，可包含以下配置项内容：
  
  - _level_ - 错误级别，不限大小写。String 类型。可选为 `'page'`, `'app'`, `'widget'`, `'console'`。默认为 `'app'`。
  
  - _args_ - 错误信息编译参数。Object|Array 类型。
  
  - _message_ - 自定义错误信息。String 类型。

* _descriptor_ 属性描述符。PlainObject 类型，同 Object.defineProperty 的 descriptor 参数，可包含以下配置项内容：
  
  - _writable_ - 如果为 `false`，属性的值就不能被重写。
  
  - _enumerable_ - 是否能在 for...in 循环中遍历出来或在 Object.keys 中列举出来。
  
  - _configurable_ - 如果为 `false`，则任何尝试删除目标属性或修改属性以下特性（writable, configurable, enumerable）的行为将被无效化。

##### 返回：

当前 App 实例。

#### includeError()

筛选在应用层错误缓冲区中的错误对象。

##### 参数：

* _bRemove_ - 是否同时删除在错误缓冲区内的错误对象。Boolean 类型。可选。默认为 `false`。
* _err_ - 要筛选的错误信息对象。Error|Array 类型。多个错误对象时可写成数组。

##### 返回：

筛选出来的错误对象数组。

#### excludeError()

筛选不在应用层错误缓冲区中的错误对象。

##### 参数：

* _bRemove_ - 是否同时删除在错误缓冲区内的错误对象。Boolean 类型。可选。默认为 `false`。
* _err_ - 要筛选的错误信息对象。Error|Array 类型。多个错误对象时可写成数组。

##### 返回：

筛选出来的错误对象数组。

#### inError()

获取指定的错误对象在应用层错误对象缓存中的位置。

##### 参数：

* _err_ - 要查找的错误信息对象。Error|Array 类型。多个错误对象时可写成数组。

##### 返回：

单个错误信息对象参数时。不存在则返回 -1，否则返回对应位置（从 0 开始）。

多个错误信息对象参数时。若有一个不在，则返回 -1；否则，返回第一个错误对象所在的位置（从 0 开始）。

#### onError()

为应用层的错误对象添加触发后的处理方法。

##### 参数：

* _err_ - 要处理的错误信息对象。Error|Array 类型。多个错误对象时可写成数组。
* _handler_ - 自定义错误回调方法。Function 类型。传入当前错误对象参数。方法的 *this* 指针指向当前 App 实例。

##### 返回：

当前 App 实例。

#### getState()

获取当前正在运行的视图实例的状态对象数据。

##### 参数：

* _key_ - 要获取的状态数据的属性键名。String 类型。可选。

##### 返回：

参数 _key_ 对应的状态值。省略参数时返回当前正在运行的视图实例的整个状态对象。

#### getStateIndex()

获取当前应用实例的状态索引。

##### 参数：

* *label\_or\_index* - 状态标签或索引。String|Integer 类型。状态的标签和索引对应数组：
  
  - `['BEFORE_CREATE', 'CREATED', 'BEFORE_READY', 'READY', 'BEFORE_LOAD', 'LOADED', 'BEFORE_DESTROY', 'DESTROYED']`
  
  - 不区分大小写。`'BEFORE_READY'` 可省略下划线，写为 `'beforeReady'`

##### 返回：

存在参数对应的状态时，返回状态索引；否则，返回 `undefined`。

#### inState()

判断当前应用实例是否正处于某状态下。

##### 参数：

* *label\_or\_index* - 状态标签或索引。String|Integer 类型。写法规则参考 [getStateIndex()](#t3-3-37_getStateIndex%28%29) 方法。

##### 返回：

参数状态和当前状态对应时，返回 `true`；否则，返回 `false`。

#### beforeState()

判断当前应用实例是否正处于某状态之前的状态。

##### 参数：

* *label\_or\_index* - 状态标签或索引。String|Integer 类型。写法规则参考 [getStateIndex()](#t3-3-37_getStateIndex%28%29) 方法。

##### 返回：

参数状态在当前状态之前时，返回 `true`；否则，返回 `false`。

#### afterState()

判断当前应用实例是否正处于某状态之后的状态。

##### 参数：

* *label\_or\_index* - 状态标签或索引。String|Integer 类型。写法规则参考 [getStateIndex()](#t3-3-37_getStateIndex%28%29) 方法。

##### 返回：

参数状态在当前状态之后时，返回 `true`；否则，返回 `false`。

#### isBeforeCreate()

判断当前应用实例是否正处于 beforeCreate 状态。

##### 参数：

_无_

##### 返回：

当前状态为 `'BEFORE_CREATE'` 时，返回 `true`；否则，返回 `false`。

#### isCreated()

判断当前应用实例是否正处于 created 状态。

##### 参数：

_无_

##### 返回：

当前状态为 `'CREATED'` 时，返回 `true`；否则，返回 `false`。

#### isBeforeReady()

判断当前应用实例是否正处于 beforeReady 状态。

##### 参数：

_无_

##### 返回：

当前状态为 `'BEFORE_READY'` 时，返回 `true`；否则，返回 `false`。

#### isReady()

判断当前应用实例是否正处于 ready 状态。

##### 参数：

_无_

##### 返回：

当前状态为 `'READY'` 时，返回 `true`；否则，返回 `false`。

#### isBeforeLoad()

判断当前应用实例是否正处于 beforeLoad 状态。

##### 参数：

_无_

##### 返回：

当前状态为 `'BEFORE_LOAD'` 时，返回 `true`；否则，返回 `false`。

#### isLoaded()

判断当前应用实例是否正处于 loaded 状态。

##### 参数：

_无_

##### 返回：

当前状态为 `'LOADED'` 时，返回 `true`；否则，返回 `false`。

#### isBeforeDestroy()

判断当前应用实例是否正处于 beforeDestroy 状态。

##### 参数：

_无_

##### 返回：

当前状态为 `'BEFORE_DESTROY'` 时，返回 `true`；否则，返回 `false`。

#### isDestroyed()

判断当前应用实例是否正处于 destroyed 状态。

##### 参数：

_无_

##### 返回：

当前状态为 `'DESTROYED'` 时，返回 `true`；否则，返回 `false`。

#### View()

生成一个视图实例。

##### 参数：

* _options_ - 视图实例配置项。PlainObject 类型。可参考 [视图/布局层配置项](#t4-1_配置项)。

##### 返回：

视图实例。

#### Layout()

生成一个布局实例。

##### 参数：

* _options_ - 布局实例配置项。PlainObject 类型。可参考 [视图/布局层配置项](#t4-1_配置项)。

##### 返回：

布局实例。

#### getView()

获取当前正在运行的视图实例。

##### 参数：

_无_

##### 返回：

布局实例。

#### getPath()

获取相对于当前正在运行的视图实例路径的相对路径。

##### 参数：

* _path_ - 相对路径。String 类型。可选。

##### 返回：

相对路径地址。省略参数 _path_ 时，返回当前正在运行的视图实例的路径。

#### getPathId()

获取相对于当前正在运行的视图实例路径的相对路径的ID。

框架内使用路径的 ID 作为当前视图在 DOM 上的元素的 ID，常用来标识引入的静态子模板。

##### 参数：

* _path_ - 相对路径。String 类型。可选。

##### 返回：

相对路径地址的ID。省略参数 _path_ 时，返回当前正在运行的视图实例的路径的ID。

#### getParam()

获取当前正在运行的视图实例的参数。

##### 参数：

* _name_ - 参数名称。String 类型。

##### 返回：

当前正在运行的视图实例中参数名称对应的参数值。

#### getParams()

获取当前正在运行的视图实例的所有参数。

##### 参数：

_无_

##### 返回：

保存当前正在运行的视图实例所有参数的对象。

#### prevState()

获取上一个视图实例的状态数据。

##### 参数：

* _key_ - 要获取的状态数据的属性键名。String 类型。可选。

##### 返回：

参数 _key_ 对应的状态值。省略参数时返回上一个视图实例的整个状态对象。

#### prevPath()

获取相对于上一个视图实例路径的相对路径。

##### 参数：

* _path_ - 相对路径。String 类型。可选。

##### 返回：

相对路径地址。省略参数 _path_ 时，返回上一个视图实例的路径。

#### prevPathId()

获取相对于上一个视图实例路径的相对路径的ID。

##### 参数：

* _path_ - 相对路径。String 类型。可选。

##### 返回：

相对路径地址的ID。省略参数 _path_ 时，返回上一个视图实例的路径的ID。

#### prevParam()

获取上一个视图实例的参数。

##### 参数：

* _name_ - 参数名称。String 类型。

##### 返回：

上一个视图实例中参数名称对应的参数值。

#### prevParams()

获取上一个视图实例的所有参数。

##### 参数：

_无_

##### 返回：

保存上一个视图实例所有参数的对象。

## 视图/布局层

<p class="lead">
  在框架下渲染每个页面的层级结构称为视图（View）层。视图层可以定义自己的布局（Layout）层，布局层主要负责实现多个视图层共有的渲染效果（如公用的 header 页头，banner 图，footer 页脚等）。多个视图层可以共用一个布局层。
</p>

在设计上，视图层和布局层拥有同样的生命周期，大部分类似的配置项和行为，故视图层和布局层在框架中抽离为了页面功能片段（Widget）。下面会一起介绍视图层和布局层，特殊的区别会加以说明。

### 生命周期

上面我们已经知道，页面的访问由 url 中的 hash 部分自动触发。应用层会通过内置的页面路由监控这个触发事件，并开始路由页面。每个页面视图脚本从被加载到开始，到自身内容从页面中移除的过程，称为 **视图实例生命周期**。

视图页面内容加载完成后，如果定义了布局层，会继续加载布局层内容。布局层脚本从被加载到开始，到布局内容从页面中移除的过程，称为 **布局实例生命周期**。

#### 生命周期图示

概括来看，视图/布局实例的生命周期同样分为四个阶段：

<p id="img-spa-lifecycle-desc-view">
  ![视图实例生命周期阶段图](static/images/spa-lifecycle-desc-view.png)
</p>

在设计上，视图/布局实例详细的生命周期过程为：

<p id="img-spa-lifecycle-view">
  ![视图实例生命周期示意图](static/images/spa-lifecycle-view.png)
</p>

#### 生命周期钩子

同样地，框架提供了相应的钩子方法（hook）以在视图/布局实例生命周期变化时做动态处理：

##### statechange

> Function

在状态改变时调用（优先于每个状态钩子）。

##### 参数：

* _prevState_ - 状态改变前的上一次状态对象。

##### beforeCreate

> Function

在当前实例初始化之前调用。

##### 参数：

* _state_ - 当前状态对象。

##### created

> Function

在当前实例初始化完成后调用。

##### beforeLoad

> Function

在当前实例开始加载之前调用。

##### loaded

> Function

在当前实例加载完成后调用。

##### beforeReady

> Function

在当前实例对应的 DOM 已准备好，事件绑定、创建子实例等执行之前调用。

##### ready

> Function

在当前实例对应的 DOM 已准备好，事件绑定、创建子实例等执行之后调用。

##### beforeDestroy

> Function

在当前实例销毁之前调用。视图实例优先于当前的布局实例调用。

##### 返回：

返回非 `undefined|null` 值时不切换当前最上层的视图，并将返回值作为提示信息内容。

##### destroyed

> Function

在当前实例销毁后，页面切换后调用。

每个钩子方法的 _this_ 指针都指向当前的视图/布局实例。

使用示例：

```javascript
App.View({
    statechange: function(prevState) {
        var curState = this.getState();
        if (!curState) {
            curState = prevState;
            prevState = null;
        }
        console.log(
          '['+curState.name+'] statechange - current: [' + curState.label + ']' + 
          (prevState ? ', previous: [' + prevState.label +']' : '')
        );
    },
    beforeCreate: function(state) {
        console.log('['+state.name+'] state: ' + state.label);
    },
    created: function() {
        console.log('['+this.getState('name')+'] state: ' + this.getState('label'));
    },
    beforeLoad: function() {
        console.log('['+this.getState('name')+'] state: ' + this.getState('label'));
    },
    loaded: function() {
        console.log('['+this.getState('name')+'] state: ' + this.getState('label'));
    },
    beforeReady: function() {
        console.log('['+this.getState('name')+'] state: ' + this.getState('label'));
    },
    ready: function() {
        console.log('['+this.getState('name')+'] state: ' + this.getState('label'));
    },
    beforeDestroy: function() {
        console.log('['+this.getState('name')+'] state: ' + this.getState('label'));
    },
    destroyed: function() {
        console.log('['+this.getState('name')+'] state: ' + this.getState('label'));
    }
});
```

### 配置项

视图/布局实例除了钩子方法外，还提供以下配置项

#### title

> String | Function

默认值：`null`

当前实例渲染时的页面标题。

* 当前最上层的视图实例和其布局实例（如果有）配置有效。
* 若当前视图实例和布局实例均配置了标题，则视图实例的配置优先。

为 Function 类型时动态执行并获取返回结果。其 *this* 指针指向当前实例。

#### layout

> String | Function

默认值：`null`

设定视图页面使用的布局。只在视图实例下有效。

* 相对于 [baseUrl.layout](#t3-1-1-4_baseUrl.layout)（layouts） 目录。
* 只有最上层视图（View）的 `layout` 配置项才会起作用。

为 Function 类型时动态执行并获取返回结果。其 *this* 指针指向当前视图实例。

#### template

> String | PlainObject | Remote | Function

默认值：`undefined`

当前实例渲染时使用的模板和模板配置项。

默认为 [baseUrl.template](#t3-1-1-5_baseUrl.template)（templates） 目录下与当前实例的 js 脚本文件同路径同名的 html 文件。

设为 `null` 时不使用模板（不渲染内容）。

为 String 类型时作为模板的文本内容。

为 PlainObject 类型时，除了可设置模板对象的默认配置项外（参考 [Template 配置项](#t5-4-0_配置项) 章节），还可设置以下配置项属性：

##### template.url

> String

模板文件路径。以斜杠 `"/"` 开头时相对于 [baseUrl.template](#t3-1-1-5_baseUrl.template)（templates） 目录；否则，相对于当前实例的脚本文件所在目录。

另外，框架扩展了相对路径写法：`"+/"` 会将当前脚本文件名字作为一层目录，与文件之前路径一起作为相对路径。譬如，在视图脚本文件 `/home.js` 中将配置项 `template.url` 设为 `"+/sub_page.html"`，则 `"+/sub_page.html"` 地址对应模板目录下的文件 `"/home/sub_page.html"`。

##### template.source

> String

模板文本内容。

##### template.data

> Object | Remote

模板使用的数据。详细参考 [data](#t4-1-3_data) 配置项。

##### template.dataFilter

> Function

模板数据格式化处理方法。详细参考 [dataFilter](#t4-1-4_dataFilter) 配置项。

为 Remote 类型时，若 remote 参数为 String 类型，则同 `{url: [template]}`，即作为远程模板地址；为 Object 类型时，同 PlainObject 类型。

为 Function 类型时动态执行并获取返回结果。其 *this* 指针指向当前实例。

示例：

定义模板字符串

```javascript
App.View({
  template: "<h2>Template Content.</h2>"
});
```

定义其他名字或路径的远程模板

```javascript
App.View({
  template: App.remote("/other_path/other_name.html")
});
```

不使用模板

```javascript
App.View({
  template: null
});
```

#### data

> Object | Remote | Function

默认值：`{}`

当前实例渲染时使用的数据。若同时存在 [template.data](#t4-1-2-2_template.data) 配置项，则忽略之。

为 Object 类型时，作为渲染数据（Array 类型数据会自动转换为 PlainObject 类型，键为 `data`）。

为 Remote 类型时，remote 的参数作为 ajax 的参数远程获取数据。可参考 [Ajax 配置项](#t5-0-0_配置项) 章节。

为 Function 类型时动态执行并获取返回结果。其 *this* 指针指向当前实例。

示例：

指定数据源为一个含有相应参数的远程地址

```javascript
App.View({
  data: function() {
    return App.remote('/example-api/' + this.getParam('id'));
  }
});
```

#### dataFilter

> Function

默认值：`null`

模板编译前对传入数据的格式化处理。若同时存在 [template.dataFilter](#t4-1-2-3_template.dataFilter) 配置项，则忽略之。

##### 参数：

* _err_ - 错误信息对象。Error|Array 类型。存在多个错误信息对象时为数组类型。不存在错误信息对象时为 `undefined`。
* _data_ - 将要用以编译模板的数据。Object 类型。
* _xhr_ - 如果数据是通过 Ajax 远程获取的，则存在此参数；否则，不存在该参数。

##### 返回：

需返回处理后（用以编译模板）的数据。

示例：

对远程数据进一步处理，以适应模板内容

```javascript
App.View({
  data: function() {
    return App.remote('/example-api/' + this.getParam('id'));
  },
  dataFilter: function(err, data, xhr) {
    var defaults = {};
    if (err) {
      data = defaults;
    } else {
      data = $.extend(defaults, data);
    }
    return data;
  }
});
```

#### rendered

> Function

默认值：`null`

模板编译输出结果处理方法。若同时存在 [template.rendered](#t5-3-0-4_rendered) 配置项，则忽略之。

详细用法请参考 [Template rendered 配置项](#t5-3-0-4_rendered) 说明。

#### style

> String | Array | Function

默认值：`null`

当前实例渲染时使用的样式文件（地址）。多个样式文件时可写为数组（Array）形式。

为 Function 类型时动态执行并获取返回结果。其 *this* 指针指向当前实例。

<div class="callout callout-danger">
  <h4>版本不兼容提示</h4>
  <p>在 0.8.1 版本之前，样式文件的配置项名称为 `styles`，自 0.8.1 版本开始，为符合框架整体配置项风格，去除复数写法，更名为 `style`，用法不变。</p>
</div>

#### binds

> Array | Function

默认值：`null`

事件预绑定。

为数组（Array）类型时，每项亦为数组类型，配置项按次序依次为：

##### binds[i][0] - eventName

> String

事件名称，多个事件名称时以空格间隔。必选。

##### binds[i][1] - element

> String | Node | jQuery

事件绑定元素。可选。省略时为 `document` 元素。绑定在 `window` 上时，可写为字符串 `'window'`。

##### binds[i][2] - data

> Object

事件绑定数据。可选。

##### binds[i][3] - handler

> Function

事件绑定回调方法。必选。方法的 *this* 指针指向当前实例。

##### binds[i][4] - one

> Number

设为 1 时只绑定一次事件。可选。

配置项 `binds` 为 Function 类型时动态执行并获取返回结果。其 *this* 指针指向实例。

#### loading

> PlainObject | Function

默认值: 

```javascript
{
  html: '<div class="loader center-block"></div>',
  ready: function($container) {
    $(".loader", $container).loader();
    return this;
  },
  destroy: function($container) {
    $(".loader", $container).loader('destroy');
    return this;
  }
}
```

设置（子）页面加载中的效果。默认情况下，加载效果使用 [loader](YFjs工具.html#t0-2-7_加载中效果+loader) 组件实现。

为 PlainObject 类型时，包含以下配置项属性：

##### loading.html

> String | Function

默认值：`'<div class="loader center-block"></div>'`

加载效果对应的 HTML 字符串。

为 Function 类型时执行并获取返回结果，其 *this* 指针指向当前实例。

##### loading.ready

> Function

默认值：

```javascript
function($container) {
  $(".loader", $container).loader();
  return this;
}
```

触发加载效果的执行方法。

##### 参数：

* _$container_ - 加载中内容的元素容器的 jQuery 对象

方法的 *this* 指针指向当前实例。

##### loading.destroy

> Function

默认值：

```javascript
function($container) {
  $(".loader", $container).loader('destroy');
  return this;
}
```

销毁加载效果的执行方法。

##### 参数：

* _$container_ - 加载中内容的元素容器的 jQuery 对象

方法的 *this* 指针指向当前实例。

配置项 `loading` 为 Function 类型时动态执行并获取返回结果。其 *this* 指针指向当前实例。

#### cache

> Boolean | Function

默认值：`true`

当前实例下远程模板、样式文件缓存开关。默认情况下继承应用层的 [cache](#t3-1-7_cache) 配置值。

为 Function 类型时动态执行并获取返回结果。其 *this* 指针指向当前实例。

#### styleLoader

> PlainObject | Function

默认值：`null`

当前实例下样式文件加载器配置。更详细内容可参考 [样式加载器 StyleLoader](#t5-5_样式加载器+StyleLoader) 工具组件的介绍。

为 PlainObject 类型时，参考 [StyleLoader 配置项](#t5-5-0_配置项) 章节。

为 Function 类型时动态执行并获取返回结果。其 *this* 指针指向当前实例。

#### mode

> String | Function

默认值：`null`

当前实例下环境模式参数。默认情况下继承应用层 [mode](#t3-1-10_mode) 配置值。

为 Function 类型时动态执行并获取返回结果。其 *this* 指针指向当前实例。

#### ajax

> PlainObject | Function

默认值：`{ ... }`

当前实例下 ajax 配置项。更详细内容可参考 [Ajax](#t5-0_Ajax) 工具组件的介绍。

为 PlainObject 类型时，参考 [Ajax 配置项](#t5-0-0_配置项) 章节。

为 Function 类型时动态执行并获取返回结果。其 *this* 指针指向当前实例。

#### websocket

> Object | Function

默认值：`{ ... }`

当前实例下 webSocket 配置项。更详细内容可参考 [WebSocket](#t5-2_WebSocket) 工具组件的介绍。

为 PlainObject 类型时，参考 [WebSocket 配置项](#t5-2-0_配置项) 章节。

为 Function 类型时动态执行并获取返回结果。其 *this* 指针指向当前实例。

#### cookie

> Object | Function

默认值：`null`

当前实例下 cookie 工具方法增强配置项。更详细内容可参考 [Cookie](#t5-1_Cookie) 工具组件的介绍。

为 PlainObject 类型时，键值分别为 `[方法名称] : [方法实现]`。增强 Cookie 方法的 *this* 指针指向当前 cookie 工具实例。

为 Function 类型时动态执行并获取返回结果。其 *this* 指针指向当前实例。

#### errorFilter

> Function

默认值：`null`

当前实例的错误过滤处理方法。

发生错误时，会优先调用此配置方法进行处理。

处理过程中可结合使用实例的以下错误处理方法进行处理：

* [`getError`](#t4-3-38_getError%28%29) - 获取错误对象

* [`assignError`](#t4-3-41_assignError%28%29) - 设置错误对象属性值

* [`addError`](#t4-3-39_addError%28%29) - 添加错误对象并向上抛出

* [`removeError`](#t4-3-40_removeError%28%29) - 移除错误对象不再抛出

方法的 *this* 指针指向当前实例。

#### onError

> Function

默认值：`null`

当前实例监控到错误触发时的处理方法。

处理过程中可结合使用实例的以下错误处理方法进行处理：

* [`getError`](#t4-3-38_getError%28%29) - 获取错误对象

* [`assignError`](#t4-3-41_assignError%28%29) - 设置错误对象属性值

* [`addError`](#t4-3-39_addError%28%29) - 添加错误对象并向上抛出

* [`removeError`](#t4-3-40_removeError%28%29) - 移除错误对象不再抛出

方法的 *this* 指针指向当前实例。

### 实例属性

#### .container

> String

当前实例的容器元素选择器。

#### .rootContext

指向当前应用（App）实例。

#### .context

指向上一层实例。如果当前实例已经是最上层的视图/布局实例，则等效于 [.rootContext](#t4-2-1_.rootContext) 属性。

#### .template

当前实例的模板工具对象。通过 `.template` 属性可以调用的方法请参考 [Template 方法](#t5-4-1_方法) 章节。

#### .mode

当前实例使用的环境模式参数。

#### .ajax

当前实例的 Ajax 工具对象。通过 `.ajax` 属性可以调用的方法请参考 [Ajax 方法](#t5-0-1_方法) 章节。

#### .ws

当前实例的 WebSocket 工具对象。通过 `.ws` 属性可以调用的方法请参考 [WebSocket 方法](#t5-2-1_方法) 章节。

#### .styleLoader

当前实例的 StyleLoader 工具对象。通过 `.styleLoader` 属性可以调用的方法请参考 [StyleLoader 方法](#t5-5-1_方法) 章节。

#### .cookie

当前实例的 Cookie 工具。通过 `.cookie` 属性可以调用的方法请参考 [Cookie 方法](#t5-1-1_方法) 章节和 [cookie](#t4-1-14_cookie) 配置项中自定义的增强方法。

当前实例的 Cookie 工具的操作路径 path 默认为当前实例的访问路径。

**注：**如果操作的 Cookie 路径在根目录下，应使用应用实例的 [.cookie](#t3-2-1_.cookie) 属性工具，即 `App.cookie`。

### 实例方法

#### get()

获取当前实例的某个配置项或自定义属性（方法）的值。

##### 参数：

* _key_ - 配置项或自定义属性（方法）的名称。String 类型。

##### 返回：

指定的配置项或自定义属性（方法）对应的值。

#### set()

设置当前实例的某个配置项或自定义属性（方法）。

##### 参数：

* _key_ - 配置项或自定义属性（方法）的名称。String 类型。
* _value_ - 配置项或自定义属性（方法）的值。任意类型。

##### 返回：

当前视图/布局实例。

#### getOptions()

获取当前实例的所有配置项。

##### 参数：

_无_

##### 返回：

含有所有配置项的对象。

#### getState()

获取当前实例的状态对象数据。

##### 参数：

* _key_ - 要获取的状态数据的属性键名。String 类型。可选。

##### 返回：

参数 _key_ 对应的状态值。省略参数时返回当前正在运行的视图实例的整个状态对象。

#### getStateIndex()

设置当前实例的状态索引。

##### 参数：

* *label\_or\_index* - 状态标签或索引。String|Integer 类型。状态的标签和索引对应数组：

  - `['BEFORE_CREATE', 'CREATED', 'BEFORE_LOAD', 'LOADED', 'BEFORE_READY', 'READY', 'BEFORE_DESTROY', 'DESTROYED']`

  - 不区分大小写。`'BEFORE_READY'` 可省略下划线，写为 `'beforeReady'`

##### 返回：

存在参数对应的状态时，返回状态索引；否则，返回 `undefined`。

#### inState()

判断当前实例是否正处于指定状态下。

##### 参数：

* *label\_or\_index* - 状态标签或索引。String|Integer 类型。写法规则参考 [getStateIndex()](#t4-3-4_getStateIndex%28%29) 方法。

##### 返回：

参数状态和当前状态对应时，返回 `true`；否则，返回 `false`。

#### beforeState()

判断当前实例是否正处于指定状态之前的状态。

##### 参数：

* *label\_or\_index* - 状态标签或索引。String|Integer 类型。写法规则参考 [getStateIndex()](#t4-3-4_getStateIndex%28%29) 方法。

##### 返回：

参数状态在当前状态之前时，返回 `true`；否则，返回 `false`。

#### afterState()

判断当前实例是否正处于指定状态之后的状态。

##### 参数：

* *label\_or\_index* - 状态标签或索引。String|Integer 类型。写法规则参考 [getStateIndex()](#t4-3-4_getStateIndex%28%29) 方法。

##### 返回：

参数状态在当前状态之后时，返回 `true`；否则，返回 `false`。

#### isBeforeCreate()

判断当前实例是否正处于 beforeCreate 状态。

##### 参数：

_无_

##### 返回：

当前状态为 `'BEFORE_CREATE'` 时，返回 `true`；否则，返回 `false`。

#### isCreated()

判断当前实例是否正处于 created 状态。

##### 参数：

_无_

##### 返回：

当前状态为 `'CREATED'` 时，返回 `true`；否则，返回 `false`。

#### isBeforeLoad()

判断当前实例是否正处于 beforeLoad 状态。

##### 参数：

_无_

##### 返回：

当前状态为 `'CREATED'` 时，返回 `true`；否则，返回 `false`。

#### isLoaded()

判断当前实例是否正处于 loaded 状态。

##### 参数：

_无_

##### 返回：

当前状态为 `'LOADED'` 时，返回 `true`；否则，返回 `false`。

#### isBeforeReady()

判断当前实例是否正处于 beforeReady 状态。

##### 参数：

_无_

##### 返回：

当前状态为 `'BEFORE_READY'` 时，返回 `true`；否则，返回 `false`。

#### isReady()

判断当前实例是否正处于 ready 状态。

##### 参数：

_无_

##### 返回：

当前状态为 `'READY'` 时，返回 `true`；否则，返回 `false`。

#### isBeforeDestroy()

判断当前实例是否正处于 beforeDestroy 状态。

##### 参数：

_无_

##### 返回：

当前状态为 `'BEFORE_DESTROY'` 时，返回 `true`；否则，返回 `false`。

#### isDestroyed()

判断当前实例是否正处于 destroyed 状态。

##### 参数：

_无_

##### 返回：

当前状态为 `'DESTROYED'` 时，返回 `true`；否则，返回 `false`。

#### getUrl()

获取当前实例下的页面访问链接。

##### 参数：

* _path_ - （视图）页面路径地址，为相对路径（以 './' 或 '../' 开头）时相对于当前实例的访问路径。String 类型。
* _params_ - 路径地址参数。Object 类型。可选。

##### 返回：

当前实例下的页面的访问路径地址。

#### getPath()

获取相对于当前实例路径的相对路径。

##### 参数：

* _path_ - 相对路径。String 类型。可选。

##### 返回：

相对路径地址。省略参数 _path_ 时，返回当前实例的路径。

#### getPathId()

获取相对于当前实例路径的相对路径的ID。

框架内使用路径的 ID 作为当前视图在 DOM 上的元素的 ID，常用来标识引入的静态子模板。

##### 参数：

* _path_ - 相对路径。String 类型。可选。

##### 返回：

相对路径地址的ID。省略参数 _path_ 时，返回当前实例的路径的ID。

#### getParam()

获取当前实例的参数。

##### 参数：

* _name_ - 参数名称。String 类型。

##### 返回：

当前实例中参数名称对应的参数值。

#### getParams()

获取当前实例的所有参数。

##### 参数：

_无_

##### 返回：

保存当前实例所有参数的对象。

#### getData()

获取当前实例模板编译使用的数据值。

##### 参数：

* _key_ - 要获取的数据属性名称。String 类型。可选。

##### 返回：

属性名称参数对应的属性值。省略参数 _key_ 时，返回所有数据对象。

#### setData()

设置当前实例模板编译使用的数据。

##### 参数：

* _key_ - 要设置的数据属性名称。String 类型。
* _value_ - 要设置的数据属性名称对应的值。任意类型。

##### 返回：

当前实例。

#### getCache()

获取当前实例的缓存。

##### 参数：

* _key_ - 缓存的键名称。String 类型。

##### 返回：

指定的缓存名称对应的值。

#### setCache()

设置当前实例的缓存。

##### 参数：

* _key_ - 缓存的键名称。String 类型。
* _value_ - 缓存的键对应的值。任意类型。

##### 返回：

当前实例。

**注：**切换视图页面后原视图实例的缓存不会消失。

#### removeCache()

移除当前实例的缓存。

##### 参数：

* _key_ - 要移除的缓存的键名称。String 类型。

省略参数 _key_ 将移除所有的缓存。

##### 返回：

当前实例。

#### findInclude()

查找指定元素容器下的子模块元素。

##### 参数：

* _wrapper_ - 要查找子模块元素的父容器元素。String|Node|jQuery 类型。可选。省略时为当前实例的容器元素（即为 [container](#t4-2-0_.container)）。
* _index_ - 要查找的子模块元素次序。Integer 类型，从 0 开始计数。可选。省略时查找所有子模块元素。

##### 返回：

包含指定元素容器下的子模块元素的 jQuery 对象。

#### firstInclude()

查找指定元素容器下的第一个子模块元素。

##### 参数：

* _wrapper_ - 要查找子模块元素的父容器元素。String|Node|jQuery 类型。可选。省略时为当前实例的容器元素（即为 [container](#t4-2-0_.container)）。

##### 返回：

包含指定元素容器下的第一个子模块元素的 jQuery 对象。

#### lastInclude()

查找指定元素容器下的最后一个子模块元素。

##### 参数：

* _wrapper_ - 要查找子模块元素的父容器元素。String|Node|jQuery 类型。可选。省略时为当前实例的容器元素 [container](#t4-2-0_.container)。

##### 返回：

包含指定元素容器下的最后一个子模块元素的 jQuery 对象。

#### $()

根据选择器参数获取当前容器下的 jQuery 对象，并屏蔽子模块容器元素。

##### 参数：

* _selector_ - 元素的 CSS 选择器字符串。String 类型。可选。省略时默认为当前实例的容器元素 [container](#t4-2-0_.container)。

##### 返回：

要查找的当前实例下的元素的 jQuery 对象。

#### bind()

绑定当前实例下的事件。当前实例下的事件在实例销毁后会自动解绑。

##### 参数：

* _eventName_ - 事件名称，多个事件名称时以空格间隔。String 类型。必选。
* _element_ - 事件绑定元素。String|Node|jQuery 类型。可选。省略时为 `document` 元素。绑定在 `window` 上时，可写为字符串 `'window'`。
* _data_ - 事件绑定数据。任意类型。可选。
* _handler_ - 事件绑定回调方法。Function 类型。必选。方法的 this 指针指向当前实例。
* _one_ - 设为 1 时只绑定一次事件。Number 类型。可选。

##### 返回：

当前实例。

#### on()

同 [.bind()](#t4-3-30_bind%28%29) 方法，为兼容 jQuery 的写法。

#### one()

绑定当前实例下的事件并只生效一次。

##### 参数：

* _eventName_ - 事件名称，多个事件名称时以空格间隔。String 类型。必选。
* _element_ - 事件绑定元素。String|Node|jQuery 类型。可选。省略时为 `document` 元素。绑定在 `window` 上时，可写为字符串 `'window'`。
* _data_ - 事件绑定数据。任意类型。可选。
* _handler_ - 事件绑定回调方法。Function 类型。必选。方法的 this 指针指向当前实例。

##### 返回：

当前实例。

#### unbind()

解绑当前实例下的事件。

##### 参数：

* _eventName_ - 要解绑的事件名称，多个事件名称时以空格间隔。String 类型。必选。
* _element_ - 要解绑的事件绑定元素。String|Node|jQuery 类型。可选。省略时为 `document` 元素。绑定在 `window` 上时，可写为字符串 `'window'`。
* _handler_ - 要解绑的事件绑定回调方法（指针）。Function 类型。可选。

##### 返回：

当前实例。

#### off()

同 [.unbind()](#t4-3-33_unbind%28%29) 方法，为兼容 jQuery 的写法。

#### trigger()

触发当前实例下的事件。

##### 参数：

* _eventName_ - 要触发的事件名称。String 类型。
* _data_ - 触发事件时为事件对象绑定的数据。任意类型。可选。
* _element_ - 触发事件的元素。String|Node|jQuery 类型。可选。默认为 `document` 元素。触发在 `window` 上时，可写为字符串 `'window'`。

##### 返回：

当前实例。

#### makeError()

创建当前实例下的错误对象。应用层的错误对象默认级别为 `WIDGET`。

##### 参数：

* _id_ - 错误标识字符串。String 类型。
* _option_ - 创建的错误对象的自定义配置。PlainObject|Array 类型。为 Array 类型时等同于 `{args: [option]}`。为 PlainObject 类型时，可包含以下配置项内容：

  - _level_ - 错误级别，不限大小写。String 类型。可选为 `'page'`, `'app'`, `'widget'`, `'console'`。默认为 `'app'`。

  - _args_ - 错误信息编译参数。Object|Array 类型。

  - _message_ - 自定义错误信息。String 类型。

* _originalError_ - 原错误对象。Error 类型。

##### 返回：

创建的错误对象。

#### setError()

设置当前实例下的错误缓冲区中的错误对象（将覆盖之前的内容）。

##### 参数：

* _err_ - 要设置的错误信息对象。Error|Array 类型。多个错误对象时可写成数组。省略该参数时将清空当前实例的所有错误信息对象。

##### 返回：

当前实例。

#### getError()

获取当前实例下的错误缓冲区中的错误对象。

##### 参数：

* _filter_ - 过滤条件。PlainObject 类型。规则如下：
  - 键值分别为要查找的错误对象的键和值
  - 若值为正则表达式，则根据正则的匹配结果过滤
  - 键以叹号(!)开头时，则对匹配结果取非
  - 不传入此参数时返回所有错误信息对象

##### 返回：

要获取的错误对象数组。没有错误对象信息时为空数组。

#### addError()

向当前实例下的错误缓冲区内添加错误信息对象。

##### 参数：

* _err_ - 要添加的错误信息对象。Error|Array 类型。多个错误对象时可写成数组。

##### 返回：

当前实例。

#### removeError()

从当前实例下的错误缓冲区中删除错误信息对象。

##### 参数：

* _err_ - 要删除的错误信息对象。Error|Array 类型。多个错误对象时可写成数组。

##### 返回：

当前实例。

#### assignError()

设置错误对象的属性值。

##### 参数：

* _err_ - 要更改的错误信息对象。Error|Array 类型。多个错误对象时可写成数组。
* _props_ - 新的属性值。PlainObject 类型，可包含以下配置项内容：

  - _level_ - 错误级别，不限大小写。String 类型。可选为 `'page'`, `'app'`, `'widget'`, `'console'`。默认为 `'widget'`。

  - _args_ - 错误信息编译参数。Object|Array 类型。

  - _message_ - 自定义错误信息。String 类型。

* _descriptor_ 属性描述符。PlainObject 类型，同 Object.defineProperty 的 descriptor 参数，可包含以下配置项内容：

  - _writable_ - 如果为 `false`，属性的值就不能被重写。

  - _enumerable_ - 是否能在 for...in 循环中遍历出来或在 Object.keys 中列举出来。

  - _configurable_ - 如果为 `false`，则任何尝试删除目标属性或修改属性以下特性（writable, configurable, enumerable）的行为将被无效化。

##### 返回：

当前实例。

#### includeError()

筛选在当前实例下的错误缓冲区内的错误对象。

##### 参数：

* _bRemove_ - 是否同时删除在错误缓冲区内的错误对象。Boolean 类型。可选。默认为 `false`。
* _err_ - 要筛选的错误信息对象。Error|Array 类型。多个错误对象时可写成数组。

##### 返回：

筛选出来的错误对象数组。

#### excludeError()

筛选不在当前实例下的错误缓冲区内的错误对象。

##### 参数：

* _bRemove_ - 是否同时删除在错误缓冲区内的错误对象。Boolean 类型。可选。默认为 false。
* _err_ - 要筛选的错误信息对象。Error|Array 类型。多个错误对象时可写成数组。

##### 返回：

筛选出来的错误对象数组。

#### inError()

获取错误对象在当前实例下的错误缓冲区内的位置。

##### 参数：

* _err_ - 要查找的错误信息对象。Error|Array 类型。多个错误对象时可写成数组。

##### 返回：

单个错误信息对象参数时。不存在则返回 -1，否则返回对应位置（从 0 开始）。

多个错误信息对象参数时。若有一个不在，则返回 -1；否则，返回第一个错误对象所在的位置（从 0 开始）。

#### onError()

为当前实例下的错误对象添加触发后的处理方法。

##### 参数：

* _err_ - 要处理的错误信息对象。Error|Array 类型。多个错误对象时可写成数组。
* _handler_ - 自定义错误回调方法。Function 类型。传入当前错误对象参数。方法的 *this* 指针指向当前实例。

##### 返回：

当前实例。

#### render()

加载远程模板内容并渲染。

##### 参数：

* _template_ - 模板配置项。String|PlainObject|Remote 类型。参考 [template](#t4-1-2_template) 配置项。

  - 为 String 类型时，作为模板文本内容。
  
  - 为 PlainObject 类型时，可包含以下配置项属性：
  
    + _url_ - 远程模板文件地址。String类型。以斜杠 `"/"` 开头时相对于 [baseUrl.template](#t3-1-1-5_baseUrl.template)（templates） 目录，否则，相对于当前实例的脚本文件所在目录。
    
    + _source_ - 模板文本内容，若存在 url 属性，则忽略此属性。String 类型。
    
    + _data_ - 模板编译时传入的数据。Object|Remote 类型。同下面的 `data` 参数。
    
    + _dataFilter_ - 模板编译前对传入数据的预处理方法。Function 类型。同下面的 `dataFilter` 参数。
    
    + _callback_ - 模板编译后的回调方法。Function 类型。同下面的 `callback` 参数。
    
  - 为 Remote 类型时，若 remote 参数为字符串，则作为远程模板地址，否则，同 PlainObject 类型。

* _data_ - 模板编译时传入的数据。Object|Remote 类型。可选。常用于 `template` 参数为简单形式（String 类型或远程模板地址）的情况。如果存在此参数，则忽略 `template` 参数下的 data 属性值（如果存在）。参考配置项 [data](#t4-1-3_data)。

* _dataFilter_ - 模板编译前对传入数据的预处理方法。Function 类型。可选。常用于 `template` 参数为简单形式（String 类型或远程模板地址）的情况。如果存在此参数，则忽略 `template` 参数下的 dataFilter 属性值（如果存在）。参考配置项 [dataFilter](#t4-1-4_dataFilter)。

* _callback_ - 模板编译后的回调方法。Function 类型。可选。传入参数为：

  - _err_ - 编译错误信息对象。Error|Array 类型。存在多个错误时，为数组形式。不存在错误信息时，为 `undefined`。
  
  - _htmlText_ - 模板编译后的字符串文本。String 类型。
  
  - _data_ - 模板编译使用的数据。Object 类型。
  
  - _source_ - 模板原文本内容。String 类型。

##### 返回：

当前实例。

##### 使用示例：

渲染静态模板文本

```javascript
App.View({
  someMethod: function() {
    this.render('<p>{{name}}</p>', {name: "example_name"}, function(err, htmlText, data, source) {
      console.log("render done.");
    });
  }
});
```

渲染远程相对路径模板

```javascript
App.View({
  someMethod: function() {
    this.render(App.remote('./template.html'), {name: "example_name"}, function(err, htmlText, data, source) {
      console.log("render done.");
    });
  }
});
```

渲染远程模板和使用远程数据

```javascript
App.View({
  someMethod: function() {
    this.render(App.remote('/template.html'), App.remote("/api" + this.getParam('id')), function(err, htmlText, data, source) {
      console.log("render done.");
    });
  }
});
```

<p class="lead-code">
  等同于单个配置项参数的写法：
</p>

```javascript
App.View({
  someMethod: function() {
    this.render({
      url: "/template.html",
      data: App.remote("/api" + this.getParam('id')),
      callback: function() {
        console.log("render done.");
      }
    });
  }
});
```

#### load()

（重新）加载通过 include 方式引入的子页面/模板。

##### 参数

* _filter_ - 查找子（实例）页面/模板的方式。String|jQuery|PlainObject 类型。
  - 为 String 类型时，作为子（实例）页面/模板的容器元素的 id。
  - 为 jQuery 对象类型时，获取其 id 作为子（实例）页面/模板的容器元素的 id。
  - 为 PlainObject 类型时，为过滤条件，可包含以下属性：
    + _id_ - 容器元素的 id。String|jQuery 类型。
    + _mode_ - 引入模式。String|Array 类型。可选为 `['include', 'lazy', 'trigger']` 中的一项或多项。
* _params_ - （重新）加载子（实例）页面时传入的参数（会覆盖原来已存在的参数）。

##### 返回：

当前实例。

## 工具组件

<p class="lead">
  框架以模块的方式将内部的一些公共功能抽离成了一个个的工具组件模块。这些工具组件模块将以实例化的方式运用到应用层和视图/布局层的各个实例中。
</p>

### Ajax

目前 Ajax 组件模块的内部实现还是依托于 [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) 的，模块内部主要对实例化，统一错误处理，适应 RESTful Api等做了进一步的封装。

#### 配置项

除了支持 [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) 的所有配置项外，还支持以下配置项属性：

##### base

> String

请求地址的基路径。默认继承应用层配置项 [baseUrl.root](#t3-1-1-0_baseUrl.root) 的值。

##### respFilter

> Function

响应数据的预处理方法。

##### 参数：

* _err_ - 错误信息对象。不存在请求错误时为 `undefined`。
* _resp_ - 请求响应的数据。
* _xhr_ - 异步请求对象。

##### 返回：

必须返回数组（Array）类型。第 0 项为错误信息对象（可修改错误信息），第 1 项和第 2 项分别为经过处理后的响应数据和 xhr 对象。

##### mode

> String

发送请求时对应的当前环境参数。默认继承应用层配置项 [mode](#t3-1-10_mode) 的值。常与 [urls](#t5-0-0-5_urls) 配置项配合使用。

##### urls

> PlainObject

配置请求地址的别名。键值分别为 `[别名] : [各模式下的请求地址]`。发送请求时 `url` 参数可使用此配置项定义的别名代替。

例如：

```javascript
{
  "examples.get": {
    "mock": "...",
    "pro": "..."
  },
  "examples.delete": {
    "mock": "...",
    "pro": "..."
  }
}
```

<p class="lead-code">
  发送请求时的替代写法为：
</p>

```javascript
ajax.get('examples.get');
ajax.delete('examples.delete');
```
    
其请求地址会自动根据当前的 [mode](#t5-0-0-4_mode) 配置项对应查找。

##### args

> PlainObject | Array

配置 RESTful 接口地址中的动态参数。

为 PlainObject 类型时按键名索引。如：

```javascript
{
  "url":  "/api/example/page/{page}/{pageLen}",
  "args": {
    "page": 1,
    "pageLen": 10
  }
}
```
   
为 Array 类型时按数字索引替换。如：

```javascript
{
  "url":  "/api/example/page/{0}/{1}",
  "args": [1, 10]
}
```

#### 方法

模块进一步封装了以下方法，以适应对 RESTful 风格的接口的请求，通过实例化后的 ajax 对象即可以调用。

##### setOption()

设置当前 ajax 实例的配置项。

###### 参数：

* _key_ - 要设置配置项的属性名称。String 类型。
* _value_ - 要设置配置项的属性对应的值。任意类型。

###### 返回：

当前 ajax 实例对象。

##### getOption()

获取当前 ajax 实例的配置项值。

###### 参数：

* _key_ - 要获取配置项值的属性名称。String 类型。

###### 返回：

配置项属性名称对应的值。

##### getOptions()

获取当前 ajax 实例的所有配置项。

###### 参数：

_无_

###### 返回：

当前 ajax 实例的所有配置项对象。

##### getContext()

获取当前 ajax 实例所属的应用层或视图/布局层实例。

###### 参数：

_无_

###### 返回：

当前 ajax 实例的所属的应用层或视图/布局层实例对象。

##### send()

发送 Ajax 请求。

###### 参数：

* _options_ 请求配置项。String|PlainObject|Array 类型。

  - 为 String 类型时作为 Ajax 请求地址。
  
  - 同时发送多个请求时可写成配置项数组的形式。
  
  - 如果想要将请求参数自动转换为 JSON 字符串，可将配置项属性 *contentType* 设为 `"text/json"`。
  
* _data_ - 请求参数。Object 类型。可选。

* _callback_ - 默认回调函数。Function 类型。传入以下参数：

  - _err_ - 请求错误信息对象。Error|Array 类型。存在多个请求错误时为数组（Array）形式。不存在错误信息对象时为 `undefined`。
  
  - _resp_ - 请求响应数据。任意类型。
  
  - _xhr_ - 异步请求对象。Object 类型。

###### 返回：

当前 ajax 实例对象。

###### 使用示例:

发送多个请求

```javascript
ajax.send(
  ["/api-example", {type: "post", url: "/api-example2"}],
  function(err, resp, xhr) {
    // ajax responsed
  }
);
```

##### get()

发送 GET 形式的请求。

###### 参数：

* _options_ 请求配置项。String|PlainObject|Array 类型。

  - 为 String 类型时作为 Ajax 请求地址。
  
  - 同时发送多个请求时可写成配置项数组的形式。
  
  - 如果想要将请求参数自动转换为 JSON 字符串，可将配置项属性 *contentType* 设为 `"text/json"`。
  
* _data_ - 请求参数。Object 类型。可选。

* _callback_ - 默认回调函数。Function 类型。传入以下参数：

  - _err_ - 请求错误信息对象。Error|Array 类型。存在多个请求错误时为数组（Array）形式。不存在错误信息对象时为 `undefined`。
  
  - _resp_ - 请求响应数据。任意类型。
  
  - _xhr_ - 异步请求对象。Object 类型。

###### 返回：

当前 ajax 实例对象。

##### post()

发送 POST 形式的请求。

###### 参数：

* _options_ 请求配置项。String|PlainObject|Array 类型。

  - 为 String 类型时作为 Ajax 请求地址。
  
  - 同时发送多个请求时可写成配置项数组的形式。
  
  - 如果想要将请求参数自动转换为 JSON 字符串，可将配置项属性 *contentType* 设为 `"text/json"`。
  
* _data_ - 请求参数。Object 类型。可选。

* _callback_ - 默认回调函数。Function 类型。传入以下参数：

  - _err_ - 请求错误信息对象。Error|Array 类型。存在多个请求错误时为数组（Array）形式。不存在错误信息对象时为 `undefined`。
  
  - _resp_ - 请求响应数据。任意类型。
  
  - _xhr_ - 异步请求对象。Object 类型。

###### 返回：

当前 ajax 实例对象。

##### postJSON()

发送 POST 形式的请求，并自动将参数转换为 JSON 字符串。

###### 参数：

* _options_ 请求配置项。String|PlainObject|Array 类型。

  - 为 String 类型时作为 Ajax 请求地址。
  
  - 同时发送多个请求时可写成配置项数组的形式。
  
* _data_ - 请求参数。Object 类型。可选。

* _callback_ - 默认回调函数。Function 类型。传入以下参数：

  - _err_ - 请求错误信息对象。Error|Array 类型。存在多个请求错误时为数组（Array）形式。不存在错误信息对象时为 `undefined`。
  
  - _resp_ - 请求响应数据。任意类型。
  
  - _xhr_ - 异步请求对象。Object 类型。

###### 返回：

当前 ajax 实例对象。

##### put()

发送 PUT 形式的请求。

###### 参数：

* _options_ 请求配置项。String|PlainObject|Array 类型。

  - 为 String 类型时作为 Ajax 请求地址。
  
  - 同时发送多个请求时可写成配置项数组的形式。
  
  - 如果想要将请求参数自动转换为 JSON 字符串，可将配置项属性 *contentType* 设为 `"text/json"`。
  
* _data_ - 请求参数。Object 类型。可选。

* _callback_ - 默认回调函数。Function 类型。传入以下参数：

  - _err_ - 请求错误信息对象。Error|Array 类型。存在多个请求错误时为数组（Array）形式。不存在错误信息对象时为 `undefined`。
  
  - _resp_ - 请求响应数据。任意类型。
  
  - _xhr_ - 异步请求对象。Object 类型。

###### 返回：

当前 ajax 实例对象。

##### putJSON()

发送 PUT 形式的请求，并自动将参数转换为 JSON 字符串。

###### 参数：

* _options_ 请求配置项。String|PlainObject|Array 类型。

  - 为 String 类型时作为 Ajax 请求地址。
  
  - 同时发送多个请求时可写成配置项数组的形式。
  
* _data_ - 请求参数。Object 类型。可选。

* _callback_ - 默认回调函数。Function 类型。传入以下参数：

  - _err_ - 请求错误信息对象。Error|Array 类型。存在多个请求错误时为数组（Array）形式。不存在错误信息对象时为 `undefined`。
  
  - _resp_ - 请求响应数据。任意类型。
  
  - _xhr_ - 异步请求对象。Object 类型。

###### 返回：

当前 ajax 实例对象。

##### delete()

发送 DELETE 形式的请求。

###### 参数：

* _options_ 请求配置项。String|PlainObject|Array 类型。

  - 为 String 类型时作为 Ajax 请求地址。
  
  - 同时发送多个请求时可写成配置项数组的形式。
  
  - 如果想要将请求参数自动转换为 JSON 字符串，可将配置项属性 *contentType* 设为 `"text/json"`。
  
* _data_ - 请求参数。Object 类型。可选。

* _callback_ - 默认回调函数。Function 类型。传入以下参数：

  - _err_ - 请求错误信息对象。Error|Array 类型。存在多个请求错误时为数组（Array）形式。不存在错误信息对象时为 `undefined`。
  
  - _resp_ - 请求响应数据。任意类型。
  
  - _xhr_ - 异步请求对象。Object 类型。

###### 返回：

当前 ajax 实例对象。

##### head()

发送 HEAD 形式的请求。

###### 参数：

* _options_ 请求配置项。String|PlainObject|Array 类型。

  - 为 String 类型时作为 Ajax 请求地址。
  
  - 同时发送多个请求时可写成配置项数组的形式。
  
  - 如果想要将请求参数自动转换为 JSON 字符串，可将配置项属性 *contentType* 设为 `"text/json"`。
  
* _data_ - 请求参数。Object 类型。可选。

* _callback_ - 默认回调函数。Function 类型。传入以下参数：

  - _err_ - 请求错误信息对象。Error|Array 类型。存在多个请求错误时为数组（Array）形式。不存在错误信息对象时为 `undefined`。
  
  - _resp_ - 请求响应数据。任意类型。
  
  - _xhr_ - 异步请求对象。Object 类型。

###### 返回：

当前 ajax 实例对象。

### Cookie

框架封装了 Cookie 工具模块，用以处理 Cookie 的读取、写入和移除。

#### 配置项

##### domain

> String

默认值：当前域名

Cookie 的有效域（二级域）。

根据浏览器同源策略，cookie 默认是不支持跨一级域的。如果需要跨一级域，可以在后台通过设置 P3P HTTP Header 来实现第三方 cookie 的共享。如: 

```java
// java
response.setHeader("P3P", "CP='CURa ADMa DEVa PSAo PSDo OUR BUS UNI PUR INT DEM STA PRE COM NAV OTC NOI DSP COR'");
```

跨二级域时须以 "." 开头，如 `".example.com"`。

##### path

> String

默认值：`"/"`

Cookie 的有效路径。

##### expires

> Number | Date

默认值：当前 session 存在时间

Cookie 的有效时间。

为 Number 类型时，单位为天。半天可以设为 0.5。

**注：**IE 不支持设置 max-age。

##### secure

> Boolean

默认值：`false`

安全策略。设为 `true` 时，获取 cookie 时需要 https 协议。

##### encode

> Boolean

默认值：`false`

是否对要设置的 cookie 的键和值进行编码。

#### 方法

通过每个 Cookie 的实例化对象可以调用以下方法：

##### setOption()

设置当前 cookie 实例的配置项。

###### 参数：

* _key_ - 要设置配置项的属性名称。String 类型。
* _value_ - 要设置配置项的属性对应的值。任意类型。

###### 返回：

当前 cookie 实例对象。

##### getOption()

获取当前 cookie 实例的配置项值。

###### 参数：

* _key_ - 要获取配置项值的属性名称。String 类型。

###### 返回：

配置项属性名称对应的值。

##### getOptions()

获取当前 cookie 实例的所有配置项。

###### 参数：

_无_

###### 返回：

当前 cookie 实例的所有配置项对象。

##### getContext()

获取当前 cookie 实例所属的应用层或视图/布局层实例。

###### 参数：

_无_

###### 返回：

当前 cookie 实例的所属的应用层或视图/布局层实例对象。

##### getAll()

获取所有的 cookie 信息。

###### 参数：

_无_

###### 返回：

包含所有 cookie 信息的键值对对象。

##### get()

获取某个 cookie 的值。

###### 参数：

* _key_ - 要获取的 cookie 的名称。String 类型。
* _converter_ 定义转换类型。Function 类型。如 `set('foo', '42')`，获取 `get('foo', Number)`，会自动转换为数字值。

###### 返回：

名称参数 _key_ 对应的值。

##### set()

设置 cookie 值。

###### 参数：

* _key_ - 要设置的 cookie 的名称。String 类型。
* _value_ - 要设置的 cookie 的值。undefined 和 Function 类型除外的任意值。
* _options_ 额外的配置项参数。PlainObject 类型。可选。参考 [配置项](#t5-1-0_配置项)。

###### 返回：

当前 cookie 实例对象。

##### remove()

删除 cookie 值。

###### 参数：

* _key_ - 要删除的 cookie 的名称。String 类型。
* _options_ 额外的配置项参数。PlainObject 类型。可选。参考 [配置项](#t5-1-0_配置项)。

###### 返回：

删除成功返回 `true`；否则返回 `false`。

##### setDomain()

设置有效域名。

###### 参数：

* _domain_ - 要设置的有效域名。String 类型。参考 [配置项 domain](#t5-1-0-0_domain)。

###### 返回：

当前 cookie 实例对象。

##### setPath()

设置有效路径。

###### 参数：

* _path_ - 要设置的有效路径。String 类型。参考 [配置项 path](#t5-1-0-1_path)。

###### 返回：

当前 cookie 实例对象。

##### setExpires()

设置有效时间。

###### 参数：

* _expires_ - 要设置的有效时间。Number|Date 类型。参考 [配置项 expires](#t5-1-0-2_expires)。

###### 返回：

当前 cookie 实例对象。

### WebSocket

WebSocket 组件模块在浏览器的 WebSocket API 基础上简单封装了 WebSocket 功能，目前还没有实现兼容低版本浏览器的功能（如 IE8 不支持 WebSocket）。

#### 配置项

和 [Ajax](#t5-0_Ajax) 类似，WebSocket 提供了如请求基路径等配置项。

##### base

> String

WebSocket 请求地址的基路径。默认继承应用层配置项 [baseUrl.root](#t3-1-1-0_baseUrl.root) 的值。

##### respFilter

> Function

响应数据的预处理方法。

###### 参数：

* _err_ - 错误信息对象。Error|Array 类型。存在多个错误时为数组（Array）形式。不存在请求错误时为 `undefined`。
* _resp_ - 请求响应的数据。任意类型。
* _ws_ - 当前 WebSocket 对象。

###### 返回：

必须返回数组（Array）类型。第 0 项为错误信息对象（可修改错误信息），第 1 项和第 2 项分别为经过处理后的响应数据和 ws 对象。

##### mode

> String

发送 WebSocket 请求时对应的当前环境参数。默认继承应用层配置项 [mode](#t3-1-10_mode) 的值。常与 [urls](#t5-2-0-3_urls) 配置项配合使用。

##### urls

> PlainObject

配置 WebSocket 请求地址别名。键值分别为 `[别名] : [各模式下的请求地址]`。发送请求时 `url` 参数可使用此配置项定义的别名代替。

例如：

```javascript
{
  "examples.update": {
    "mock": "...",
    "pro": "..."
  }
}
```

<p class="lead-code">
  发送请求时的替代写法为：
</p>

```javascript
ws.open("examples.update");
```

其请求地址会自动根据当前的 [mode](#t5-2-0-2_mode) 配置项对应查找。

#### 方法

##### setOption()

设置当前 websocket 实例的配置项。

###### 参数：

* _key_ - 要设置配置项的属性名称。String 类型。
* _value_ - 要设置配置项的属性对应的值。任意类型。

###### 返回：

当前 websocket 实例对象。

##### getOption()

获取当前 websocket 实例的配置项值。

###### 参数：

* _key_ - 要获取配置项值的属性名称。String 类型。

###### 返回：

配置项属性名称对应的值。

##### getOptions()

获取当前 websocket 实例的所有配置项。

###### 参数：

_无_

###### 返回：

当前 websocket 实例的所有配置项对象。

##### getContext()

获取当前 websocket 实例所属的应用层或视图/布局层实例。

###### 参数：

_无_

###### 返回：

当前 websocket 实例的所属的应用层或视图/布局层实例对象。

##### open()

使用当前 websocket 实例打开一个 WebSocket 连接。

###### 参数：

* _options_ - WebSocket 请求配置项。String|PlainObject|Array 类型。

  - 为 String 类型时作为请求 WebSocket 地址（`ws://` 协议可以不写，组件会自动转换）。
  
  - 同时发送多个请求时可写成配置项数组的形式。

* _callback_ - WebSocket 请求的回调方法，在有数据信息响应时自动调用。Function 类型。传入参数（经过 [respFilter](#t5-2-0-1_respFilter) 处理后的）：

  - _err_ - 错误信息对象。Error|Array 类型。存在多个错误时为数组（Array）形式。不存在请求错误时为 `undefined`。
  
  - _resp_ - 请求响应的数据。任意类型。
  
  - _ws_ - 当前 WebSocket 对象。

###### 返回：

当前 websocket 实例对象。

##### close()

关闭某个打开着的 WebSocket 连接。

###### 参数：

* _ws_ - 要关闭 WebSocket 的实例对象。

###### 返回：

_undefined_

### 模板引擎 Template

模板引擎（Template）模块主要负责将 HTML 模板和数据结合编译成 HTML 字符串以渲染到页面上。该模块的核心代码实现借鉴了腾讯的 [artTemplate](https://github.com/aui/art-template) js 模板引擎，另外主要扩展 include 功能，使支持引入子（视图）页面、静态模板、样式文件等。

#### 配置项

##### cache

> Boolean

是否开启模板缓存。默认继承应用层的配置项 [cache](#t3-1-7_cache) 的值。

##### escape

> Boolean

默认值：`true`

是否编码输出变量的 HTML 字符。

##### comment

> Boolean

默认值：`true`

是否显示 HTML 注释（`<!-- ... -->`）内容。设为 `false` 则忽略 HTML 注释标签。

##### compress

> Boolean

默认值：`false`

是否压缩输出。

##### rendered

> Function

输出内容预处理方法。方法的 *this* 指针指向当前应用实例。

##### 参数：

* _err_ - 编译错误信息对象。没有错误时为 `undefined`。
* _htmlText_ - 编译后的输出内容字符串。

##### 返回：

必须返回数组（Array）类型。第 0 项为错误信息（可对错误对象进行处理）；第 1 项为处理后的输出内容。

##### helpers

> PlainObject

定义模板辅助方法。键值对为 `[方法名称] : [方法实现]`。定义的模板辅助方法可以在 HTML 模板中作为方法使用。

辅助方法的 *this* 指针指向当前视图/布局实例。

示例：

```javascript
template: {
  helpers: {
    getLoginName: function() {
      // this 指向当前视图/布局实例
      var loginUser = this.rootContext.cookie.get('user');
      return loginUser ? loginUser.name : '';
    }
  }
}
```

##### remote

> String | PlainObject

默认值：

```javascript
{
  headers: {
    'Content-Type': "application/x-www-form-urlencoded; charset=utf-8"
  },
  dataType: "text"
}
```

加载远程模板时的 Ajax 配置项。可参考 [Ajax 配置项](#t5-0-0_配置项) 章节。

#### 实例方法

##### setOption()

设置当前 template 实例的配置项。

###### 参数：

* _key_ - 要设置配置项的属性名称。String 类型。
* _value_ - 要设置配置项的属性对应的值。任意类型。

###### 返回：

当前 template 实例对象。

##### getOption()

获取当前 template 实例的配置项值。

###### 参数：

* _key_ - 要获取配置项值的属性名称。String 类型。

###### 返回：

配置项属性名称对应的值。

##### getOptions()

获取当前 template 实例的所有配置项。

###### 参数：

_无_

###### 返回：

当前 template 实例的所有配置项对象。

##### getContext()

获取当前 template 实例所属的应用层或视图/布局层实例。

###### 参数：

_无_

###### 返回：

当前 template 实例的所属的应用层或视图/布局层实例对象。

##### helper()

添加模板辅助方法。

###### 参数：

* _name_ - 辅助方法名称。String 类型。
* _fn_ - 辅助方法实现。Function 类型。方法的 *this* 指针指向当前 template 实例的所属的应用层或视图/布局层实例对象。

###### 返回：

当前 template 实例对象。

##### helpers()

批量添加模板辅助方法。

###### 参数：

* _helpers_ - 包含辅助方法名称和实现的对象。PlainObject 类型。键值对分别对应辅助方法名称和实现。

###### 返回：

当前 template 实例对象。

##### render()

渲染静态模板。

###### 参数：

* _source_ - 模板文本内容。String 类型。必选。

* _data_ - 模板编译使用的数据。Object 类型。可选。

* _filename_ - 模板对应的文件名。String 类型。可选。

* _callback_ - 模板编译后的回调方法。Function 类型。可选。传入参数：
  
  - _err_ - 编译错误信息对象。Error|Array 类型。存在多个错误时，为数组形式。不存在错误信息时，为 undefined。

  - _htmlText_ - 模板编译后的字符串文本。String 类型。

  - _data_ - 模板编译使用的数据。Object 类型。

  - _source_ - 模板原文本内容。String 类型。

###### 返回：

String|Error 类型。不存在错误时返回渲染后的模板字符串，否则返回错误信息对象。

#### 辅助方法

辅助方法的使用很简单，例如，在一个模板文本中：

```html
<p>{{methodName(methodParam1, methodParam2, ...)}}</p>
```

模板编译时会自动执行辅助方法并替换为辅助方法的返回字符串值。

需要注意的是，模板输出会自动转义 HTML 标签，如果你想输出 HTML 内容，需要在方法名字前添加 `#` 号。如：

```html
<p>{{#methodHtml(methodParam1, methodParam2, ...)}}</p>
```

Template 组件模块提供了一些默认的辅助方法：

##### trim()

去掉指定字符串的前后空格。

###### 参数：

* _str_ - 要操作的字符串。String 类型。

###### 返回：

去除掉前后空格的字符串。

##### trimLeft()

去掉指定字符串的前面的空格。

###### 参数：

* _str_ - 要操作的字符串。String 类型。

###### 返回：

去除掉前面空格的字符串。

##### trimRight()

去掉指定字符串的后面的空格。

###### 参数：

* _str_ - 要操作的字符串。String 类型。

###### 返回：

去除掉后面空格的字符串。

##### otype()

判断指定对象的具体类型。

###### 参数：

* _obj_ - 要判断类型的对象。任意类型。

###### 返回：

根据参数类型返回 `'string'`, `'number'`, `'function'`, `'array'` `'object'` 等小写字符串。

##### is$()

判断参数是否是 jQuery 对象。

###### 参数：

* _obj_ - 要判断的对象。任意类型。

###### 返回：

是则返回 `true`，否则返回 `false`。

##### isUndef()

判断参数是否是 undefined。

###### 参数：

* _obj_ - 要判断的对象。任意类型。

###### 返回：

是则返回 `true`，否则返回 `false`。

##### eqNull()

判断参数是否恒等于 null。

###### 参数：

* _obj_ - 要判断的对象。任意类型。

###### 返回：

是则返回 `true`，否则返回 `false`。

##### isNull()

判断参数是否等于 null（undefined 或 null）。

###### 参数：

* _obj_ - 要判断的对象。任意类型。

###### 返回：

是则返回 `true`，否则返回 `false`。

##### notNull()

判断参数是否不等于 null（undefined 或 null）。

###### 参数：

* _obj_ - 要判断的对象。任意类型。

###### 返回：

是则返回 `true`，否则返回 `false`。

##### isNumber()

判断参数是否是数字类型。

###### 参数：

* _obj_ - 要判断的对象。任意类型。

###### 返回：

是则返回 `true`，否则返回 `false`。

##### isBoolean()

判断参数是否是布尔类型。

###### 参数：

* _obj_ - 要判断的对象。任意类型。

###### 返回：

是则返回 `true`，否则返回 `false`。

##### isString()

判断参数是否是字符串类型。

###### 参数：

* _obj_ - 要判断的对象。任意类型。

###### 返回：

是则返回 `true`，否则返回 `false`。

##### isObject()

判断参数是否是对象类型（包括 null）。

###### 参数：

* _obj_ - 要判断的对象。任意类型。

###### 返回：

是则返回 `true`，否则返回 `false`。

##### isPlainObject()

判断参数是否是 PlainObject 类型。

###### 参数：

* _obj_ - 要判断的对象。任意类型。

###### 返回：

是则返回 `true`，否则返回 `false`。

##### isArray()

判断参数是否是数组类型。

###### 参数：

* _obj_ - 要判断的对象。任意类型。

###### 返回：

是则返回 `true`，否则返回 `false`。

##### isFunction()

判断参数是否是一个方法。

###### 参数：

* _obj_ - 要判断的对象。任意类型。

###### 返回：

是则返回 `true`，否则返回 `false`。

##### isEmpty()

判断参数是否是一个空字符串、空数组或空对象。

###### 参数：

* _obj_ - 要判断的对象。任意类型。

###### 返回：

是则返回 `true`，否则返回 `false`。

##### inArray()

判断一个元素在数组中的位置。

###### 参数：

* _item_ - 要判断位置的元素。任意的简单类型。
* _arr_ - 要判断的数组。Array 类型。

###### 返回：

元素不在数组中返回 -1，否则返回在数组中的位置索引（从 0 开始）。

##### stringify()

将一个对象转换为 json 字符串。

###### 参数：

* _obj_ - 要转换的对象。PlainObject 类型。

###### 返回：

转换后的 json 字符串。

##### parseJSON()

讲一个 JSON 字符串转换为 JSON 对象

###### 参数：

* _str_ - 要转换的 JSON 字符串。String 类型。

###### 返回：

转换后的 json 对象。

##### getCookie()

获取应用层的 Cookie 信息。参考 [Cookie.get()](#t5-1-1-5_get%28%29) 方法。

##### getRootUrl()

获取访问路径。参考 [App.getRootUrl()](#t3-3-11_getRootUrl%28%29) 方法。

##### getResourceUrl()

获取静态资源访问路径。参考 [App.getResourceUrl()](#t3-3-12_getResourceUrl%28%29) 方法。

##### getStyleUrl()

获取样式文件访问路径。参考 [App.getStyleUrl()](#t3-3-13_getStyleUrl%28%29) 方法。

##### getFullUrl()

获取基于相对路径额完整访问路径。参考 [App.getFullUrl()](#t3-3-14_getFullUrl%28%29) 方法。

##### getUrl()

获取（视图）页面的访问路径。参考 [App.getUrl()](#t3-3-15_getUrl%28%29) 方法。

##### include()

引入子示例页面或模板或样式文件。

###### 参数：

* _path_ - 引入文件路径。String 类型。必选。规则如下：

  - 不含后缀名或含有后缀名 `.js` 时引入子实例页面。
  
  - 含有 `.css` 后缀时引入样式文件。
  
  - 含有其他后缀名时作为子模板引入。子模板不会编译，会作为静态模板加到页面中，以 path 的 id 标识（可通过应用层或视图/布局层的 [getPathId()](#t4-3-18_getPathId%28%29) 方法生成）。
  
  - 以斜杠 `"/"` 开头时根据引入类型相对于相应的资源根路径；以 `"+/"` 开头会将当前模板文件名字作为一层目录，与文件之前路径一起作为相对路径。譬如，在模板文件 `/home.html` 中使用 include 辅助方法 `{{include('+/sub_page')}}`，则 `"+/sub_page"` 地址对应视图目录下的文件 `"/home/sub_page.js"`。
  
* _mode_ - 引入模式。String 类型。可选。包括：

  - __include__ - 默认引入模式。页面渲染前即已引入。
  
  - __lazy__ - 懒加载模式。页面渲染后第一时间自动加载引入。
  
  - __trigger__ - 手动触发模式。页面渲染后需要自行手动调用视图/布局实例的 [load()](#t4-3-47_load%28%29) 方法进行加载引入。

* _params_ - 加载子示例页面时的自定义参数。Object 类型。可选。键值对分别对应参数的名称和值。

### 样式加载器 StyleLoader

<p class="lead">
  框架实现了样式加载器 StyleLoader 以对每个页面单独的样式文件进行加载（页面移除后会自动去除相关的样式内容）。
</p>

为了去除因样式标签 link 异步加载过程导致的样式闪烁效果，StyleLoader 会加载具体的样式文件内容并以 `style` 标签的形式在 head 下面添加内联样式。如果你定义了一个远程跨域的样式文件，StyleLoader 会自动以 link 标签的形式加载该样式文件。

#### 配置项

##### cache

> Boolean

是否开启样式文件缓存。默认继承应用层配置项 [cache](#t3-1-7_cache) 的值。

##### remote

> String | PlainObject

默认值：

```javascript
{
  headers: {
    'Content-Type': "application/x-www-form-urlencoded; charset=utf-8"
  },
  dataType: "text"
}
```

加载远程模板时的 Ajax 配置项。可参考 [Ajax 配置项](#t5-0-0_配置项) 章节。

#### 方法

##### setOption()

设置当前 styleLoader 实例的配置项。

###### 参数：

* _key_ - 要设置配置项的属性名称。String 类型。
* _value_ - 要设置配置项的属性对应的值。任意类型。

###### 返回：

当前 styleLoader 实例对象。

##### getOption()

获取当前 styleLoader 实例的配置项值。

###### 参数：

* _key_ - 要获取配置项值的属性名称。String 类型。

###### 返回：

配置项属性名称对应的值。

##### getOptions()

获取当前 styleLoader 实例的所有配置项。

###### 参数：

_无_

###### 返回：

当前 styleLoader 实例的所有配置项对象。

##### getContext()

获取当前 styleLoader 实例所属的应用层或视图/布局层实例。

###### 参数：

_无_

###### 返回：

当前 styleLoader 实例的所属的应用层或视图/布局层实例对象。

##### load()

手动加载样式文件。

###### 参数：

* _filepath_ - 样式文件路径。String 类型。相对于 [baseUrl.style](#t3-1-1-2_baseUrl.style) 配置的路径。
* _callback_ - 样式文件加载后的回调方法。Function 类型。传入参数：
  - _err_ - 加载样式文件过程中发生的错误信息对象。Error|Array 类型。多个错误对象时为数组（Array）形式。不存在错误信息对象时为 `undefined`。
  - _res_ - 加载结果。PlainObject 类型。含有属性 *filename* 和 *source*，分别对应加载文件名称和文件文本内容。

###### 返回：

延迟对象 promise。