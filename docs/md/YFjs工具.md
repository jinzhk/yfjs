# 概述

在核心库文件 `yfjs-core.js` 中，从上至下依次为整个组件库依赖的第三方插件RequireJS、jQuery、jQuery 插件，以及模块相关的初始化配置。而入口文件 `yfjs.js` 中包含组件库的全局对象 YFjs。这些第三方插件以及 YFjs 对象暴露在全局环境中，可直接使用。

## RequireJS

<p class="lead">
  [RequireJS](http://www.requirejs.cn/) 是一个工具库，主要用于客户端的模块管理。它可以让客户端的代码分成一个个模块，实现异步或动态加载，从而提高代码的性能和可维护性。它的模块管理遵守 [AMD规范](https://github.com/amdjs/amdjs-api/wiki/AMD)（Asynchronous Module Definition）。
</p>

### 为什么选择 RequireJS

大多数前端开发者都用过第三方的 JavaScript 插件，那么用插件之前我们首先要把插件对应的 JS 文件加载进页面，然后在之后的 JS 代码之中才可以使用插件相关功能。这里面我们知道了两个道理，一个是我们不能把所有 JS 代码都放到一个文件里，有些东西可以单独提出来成为一个模块，比如 jQuery 库；另外一个道理，一部分 JS 是依赖另一部分 JS 的，比如 jQuery 扩展插件要依赖 jQuery 库文件的载入。

简单总结一下，上述两种情况其实就涉及到了 JS 代码的 **模块化** 和 **依赖管理**。

随着网站功能逐渐丰富，网页中的 JS 也变得越来越复杂和臃肿，原有通过 `script` 标签来导入一个个的 JS 文件这种方式已经不能满足现在互联网的开发模式，我们需要团队协作、模块复用、单元测试等等一系列复杂的需求。

我们需要一种能够 **自动处理模块加载和依赖管理** 的 JS 脚本加载工具。

[RequireJS](http://www.requirejs.cn/) 是一个非常小巧的 JavaScript 模块载入框架，写法简单，便于在标准化的过渡期使用。它的基本思想是，通过 `define` 方法，将代码定义为模块；通过 `require` 方法，实现代码的模块加载。同时，`define` 和 `require` 方法自带闭包特性，避免了模块内部变量污染全局环境。

### 定义模块：define

`define` 方法用于定义模块，包含以下参数：

* <mark>id</mark>: 字符串类型。模块标识ID，可选。省略时为匿名模块。

* <mark>dependencies</mark>: 字符串数组类型。模块依赖数组，可选。省略时为独立模块。

* <mark>factory</mark>: 对象或函数类型。必选。模块内容。

#### 独立模块

如果被定义的模块是一个独立模块，不需要依赖任何其他模块，可以直接用 `define` 方法生成。

```javascript
//定义对象
define({
    method1: function() {},
    method2: function() {}
});
```

上面代码生成了一个拥有method1、method2两个方法的模块。

另一种等价的写法是，把对象写成一个函数，该函数的返回值就是输出的模块。

```javascript
//定义方法
define(function () {
    return {
        method1: function() {},
        method2: function() {}
    };
});
```

后一种写法的自由度更高一点，可以在函数体内写一些模块初始化代码。

值得指出的是，define定义的模块可以返回任何值，不限于对象。

#### 非独立模块

如果被定义的模块需要依赖其他模块，则define方法必须采用下面的格式。

```javascript
define(['module1', 'module2'], function(m1, m2) {
    ...
});
```

`define` 方法的第一个参数是一个数组时，它的成员是当前模块所依赖的模块。比如，`['module1', 'module2']` 表示我们定义的这个新模块依赖于 module1 模块和 module2 模块，只有先加载这两个模块，新模块才能正常运行。

`define` 方法的第二个参数是一个函数，当前面数组的所有成员加载成功后，它将被调用。它的参数与数组的成员一一对应，比如 `function(m1, m2)` 就表示，这个函数的第一个参数 `m1` 对应 module1 模块，第二个参数 `m2` 对应 module2 模块。这个函数必须返回一个对象，供其他模块调用。

下面是一个依赖项实际运用的例子。

```javascript
define(['module1', 'module2'], function(m1, m2) {

    return {
        method: function() {
            m1.methodA();
            m2.methodB();
        }
    };

});
```

上面代码表示新模块返回一个对象，该对象的 method 方法就是外部调用的接口，method 方法内部调用了 m1 模块的 methodA 方法和 m2 模块的 methodB 方法。

有时，依赖模块可能会非常多：

```javascript
define(
    ['dep1', 'dep2', 'dep3', 'dep4', 'dep5', 'dep6', 'dep7', 'dep8'],
    function(dep1, dep2, dep3, dep4, dep5, dep6, dep7, dep8){
        ...
    }
);
```

这时，可以使用以下等效写法：

```javascript
define(
    function (require) {
        var dep1 = require('dep1'),
            dep2 = require('dep2'),
            dep3 = require('dep3'),
            dep4 = require('dep4'),
            dep5 = require('dep5'),
            dep6 = require('dep6'),
            dep7 = require('dep7'),
            dep8 = require('dep8');

            ...
    }
});
```

#### 具名模块

当省略参数 `id` 参数时，定义的模块为匿名模块。一个文件只能含有一个匿名模块，如果含有多个匿名模块，最后定义的匿名模块才能被外部引用。

如果想在一个文件内保存多个可供外部调用的模块，应为每个模块定义其标识 ID。模块 ID 在上下文环境下必须是唯一的。

```javascript
// 定义具名模块
define('moduleID', ['module1', 'module2'], function(m1, m2) {

    return {
        method: function() {
            m1.methodA();
            m2.methodB();
        }
    };

});
```

### 调用模块：require

`require` 方法用于调用模块。它的参数与 `define` 方法类似。

```javascript
require(['foo', 'bar'], function (foo, bar) {
    foo.doSomething();
});
```

上面方法表示加载 foo 和 bar 两个模块，当这两个模块都加载成功后，执行一个回调函数。该回调函数就用来完成具体的任务。

我们也可以在定义模块时使用 `require` 方法动态加载模块。

```javascript
define(function (require) {
    var isReady = false, foobar;

    require(['foo', 'bar'], function (foo, bar) {
        isReady = true;
        foobar = foo() + bar();
    });

    return {
        isReady: isReady,
        foobar: foobar
    };
});
```

`require` 方法允许添加第三个参数，即错误处理的回调函数。

```javascript
require(
    ["backbone"],
    function ( Backbone ) {
        return Backbone.View.extend({ /* ... */ });
    },
    function (err) {
        // ...
    }
);
```

`require` 方法的第三个参数，即处理错误的回调函数，接受一个 error 对象作为参数。

`require` 对象还允许指定一个全局性的 Error 事件的监听函数。所有没有被上面的方法捕获的错误，都会被触发这个监听函数。

```javascript
requirejs.onError = function (err) {
    // ...
};
```

## jQuery

<p class="lead">
  [jQuery](http://jquery.com/) 是一个高效、精简并且功能丰富的 JavaScript 工具库。它提供的 API 易于使用且兼容众多浏览器，这让诸如 HTML 文档遍历和操作、事件处理、动画和 Ajax 操作更加简单。
</p>

[jQuery](http://jquery.com/) 极大地简化了 JavaScript 编程。其选择器引擎功能是它最为出众的地方，也是我们选择 [jQuery](http://jquery.com/) 的原因所在。

查看 [jQuery中文文档](http://www.jquery123.com/)。

### 1.9版本说明

YFjs 内使用的 jQuery 版本是 <mark>1.9.1</mark>，相对于1.9之前的版本改变了很多东西，在使用时需要注意以下更新内容：

#### 移除了 `.toggle` 方法

这个方法绑定两个或多个处理程序到匹配的元素，用来执行交替的点击事件。它不应该被混同于显示或隐藏匹配元素的 `.toggle()` 方法，因为它没有过时。前者被删除，以减少混乱和提高模块化程度。

#### 移除了 `browser` 方法

`jQuery.browser()` 方法从jQuery 1.3开始已经过时了，在1.9中被删除。若想要特征检测，请使用 `Modernizr` 库。

#### 移除了 `.live` 方法

`.live()` 方法从jQuery 1.7开始已经过时了，在1.9中被删除。建议使用 `.on()` 方法来替换升级你的代码。

如旧代码：

```javascript
$("a.foo").live("click", fn);
```

可改写为：

```javascript
$(document).on("click", "a.foo", fn);
```

下面的写法原理是基于事件的冒泡，如果您理解事件冒泡的原理，应该知道绑定在 `document` 元素上不是必须的，我们可以将事件绑定在任意在文档中已存在的上层元素上。即：

```javascript
$("#wrapper").on("click", "a.foo", fn);
```

有关详细信息，请参阅 [.on()文档](http://www.jquery123.com/on/)。

#### 移除了 `.die` 方法

`.die()` 方法从jQuery 1.7开始已经过时了，在1.9中被删除。建议使用 `.off()` 方法来替换升级你的代码。

如旧代码：

```javascript
$("a.foo").die("click");
```

可改写为：

```javascript
$(document).off("click", "a.foo");
```

有关详细信息，请参阅 [.off()文档](http://www.jquery123.com/off/)。

#### 移除了 `sub` 方法

`jQuery.sub()` 方法用以创建 jQuery 副本，该方法因使用频率过低，从jQuery 1.7开始已经过时了，在1.9中被删除。

#### 更改 `.add` 方法

`.add()` 方法返回的结果总是按照节点在document（文档）中的顺序排列。在1.9之前，如果上下文或输入的集合中任何一个以脱离文档的节点（未在文档中）开始，使用 `.add()` 方法节点不会按照document（文档）中的顺序排序。现在，返回的节点按照文档中的顺序排序，并且脱离文档的节点被放置在集合的末尾。

#### `.addBack` 替换 `.andSelf`

从jQuery1.8开始，`.andSelf()` 方法已经被标注过时，在jQuery1.8和更高版本中应使用 `.addBack()`。

我们认为对于“添加并返回”以前的结果集合这是一个更好的名字。新方法可以接受一个可选的选择器，该选择器可以用来过滤之前集合，将它添加到当前集合并返回。如代码：

```javascript
$("section, aside").children("ul").addBack("aside");
```

会根据他们在文档中的顺序，得到 `section` 与 `aside` 下所有 `ul` 子元素，外加所有 `aside` 元素。虽然 `.addSelf()` 在1.9中仍然可以使用，我们建议您尽快修改名称。

#### `.after`、`.before` 和 `.replaceWith` 使用脱离文档的节点

1.9以前，`.after()`, `.before()`, 和 `.replaceWith()` 将尝试在当前的jQuery集合中添加或改变节点，如果在当前的jQuery集的节点未连接到文档（注：即脱离文档的节点），在这种情况下，返回一个新的jQuery集合，而不是原来的那个集合。这将产生一些前后矛盾和彻底的错误 – 该方法可能会，也可能不会返回一个新的结果，这取决于它的参数！从1.9开始，这些方法总是返回原始未修改集并且试图在一个没有父节点的节点上使用`.after()`, `.before()`, or `.replaceWith()` 有没有任何效果 – 即这个集或它包含的节点两者都不被改变。

#### `.appendTo`、`.insertBefore`、`.insertAfter` 和 `.replaceAll`

在1.9中，这些方法总是返回一个新的集合，使他们可以使用的链式调用和 `.end()` 方法。1.9之前，只有当他们是一个单独的目标元素时，他们将返回旧的集合。需要注意的是这些方法总是返回所有元素附加到目标元素的聚合集合。如果没有元素被目标选择器选中（例如，$(elements).appendTo(“#not_found”)）那么返回的集合是空的。

#### 全局 Ajax 事件需要绑定到 `document`

在jQuery 1.9中， 全局的 Ajax 事件(ajaxStart, ajaxStop, ajaxSend, ajaxComplete, ajaxError, and ajaxSuccess) 只能在 `document` 元素上触发。修改 Ajax 事件监听程序到 `document` 元素上。例如，如果目前的代码看起来像这样：

```javascript
$("#status").ajaxStart(function(){
    $(this).text("Ajax started");
});
```

修改成：

```javascript
$(document).ajaxStart(function(){
    $("#status").text("Ajax started");
});
```

#### `.trigger()` `"click"` 事件时 checkbox/radio 的状态

当用户点击一个复选框或单选按钮时，如果节点上没调用 `event.preventDefault()`，事件处理程序中会根据复选框或单选按的当前状态判断并且得到它的新状态。因此，例如，如果用户点击一个未选中的checkbox，事件处理程序将选中（checked）这个checkbox。1.9之前，`.trigger("click")` 或 `.click()` 任何一个将触发一个合成事件，根据用户点击行为，我们可以看到checkbox与实际checked属性相反的状态。在1.9中修复了这个bug，用户行为会得到相应的状态。

#### focus事件触发顺序

当用户在表单元素上点击或者按 <kbd>tab</kbd> 键，使元素获取焦点，浏览器首先在焦点元素上触发一个 blur (失去焦点)事件，然后在新元素上触发一个 focus (获取焦点)事件。在1.9之前，使用 `.trigger("focus")` 或 `.focus()` 绑定一个 focus 事件，新元素将触发一个 focus 事件，然后触发先前焦点元素的 blur 事件，1.9已修正此问题。

如果目标元素没有获取焦点并且可以成功的获取焦点（比如 disabled 被禁用的表单元素获取不到焦点），那么使用 DOM 原生的 focus 事件，浏览器只访问 focus 事件处理程序。jQuery 总是调用 `.trigger("focus")` 或 `.focus()` 绑定的处理程序，无论元素是否获取焦点。在jQuery 1.9中还是这样处理的。和 DOM 的 `.focus()` 方法不同之处在于，在许多情况下，元素已经获取焦点或者元素被禁用，DOM 的 `.focus()` 方法不会调用事件处理程序。

不幸的是，所有版本的Internet Explorer（6-10）触发焦点事件是异步的。当你在 IE 中使用 `.trigger("focus")`，jQuery 无法“预知”异步 focus 事件以后会发生什么。所以它总是会触发一个自己的 focus 事件，以确保功能正常。这可能会造成 focus 事件重覆执行，建议改用 DOM 内建的 `focus()` 较单纯，例如:

```javascript
$("#boo").get(0).focus();
```

#### `jQuery(htmlString)` 与 `jQuery(selectorString)`

在1.9以前，如果一个字符串中有任何 HTML 标签，那么这个字符串将被认为是一个 HTML 字符串。这有可能造成意外的代码执行和拒绝有效的选择器字符串。1.9开始，以一个小于号（“<”）字符开头的字符串才被认为是 HTML 字符串。

如果一个字符串被认为是 HTML，但可能会以不是一个 HTML 标签的任意文本开始，将它传递给 `jQuery.parseHTML()` 将返回一个 DOM 节点数组表示的标记。我们可以通过它来创建一个 jQuery 集合，例如：`jQuery(jQuery.parseHTML(htmlString))`。例如，在处理 HTML 模板方面这被认为是最佳实践。简单使用文字字符串，如 `jQuery("<p>Testing</p>").appendTo("body")` 不会受此影响。

总之：HTML 字符串传递给 `jQuery()`，除了以一个小于号（“<”）字符开始以外的其他字符串都将被解释为一个选择器。因为字符串通常不能被解释为一个选择器，最有可能的结果是 Sizzle 选择器引擎错误抛出的“无效的选择器语法”。使用 `jQuery.parseHTML()` 来解析任意的HTML。

#### `.data`方法中名称参数包含点(“.”)改变

`.data()` 有一个未公开并且令人难以置信的非高性能监控值的设置和获取，1.9中被移除。这已经影响到了包含点的数据名称的解析。从1.9开始，调用 `.data("abc.def")` 只能通过名称为 "abc.def" 检索数据，原本还可以通过 "abc" 取得的技巧已被取消。需要注意的是较低级别的 `jQuery.data()` 方法不支持事件，所以它并没有改变。即使使用[jQuery Migrate（迁移）插件](组件模块.html#t2-0_jQuery+迁移+jq/migrate)也恢复不到原来的行为。

#### 脱离文档节点在jQuery集合中的顺序

对于许多版本，几乎所有的 jQuery 的方法，返回一组新的节点集合，这个集合是一个使用他们在文档中顺序排序的结果集。（有几个方法，如 `.parents()` 返回的结果是他们在文档反向顺序排序，但在1.9中这些例外情况已经记录并没有改变。）

在1.9之前，若 jQuery 集合中混杂 DOM 的节点及未放进 DOM 的脱离文档节点，则可能出现不可预期的随机排序。从1.9开始，在文档中的连接节点都总是按文档顺序放置在集合的开头，脱离文档节点被放置在他们的后面。即使使用[jQuery Migrate（迁移）插件](组件模块.html#t2-0_jQuery+迁移+jq/migrate)也恢复不到原来的行为。

#### 加载并且执行HTML内容中的scripts

在1.9之前，任何接受 HTML 字符串的方法（例如，`jQuery()`、`.append()`、`.wrap()`）会执行 HTML 字符串中所包含的Script，并且将它们从文档中移除，以防止他们再次被执行。在特殊情况下，使用这些方法一个脚本可能会被移除并重新插入到文档中，比如 `.wrap()`。从1.9开始，插入到文档的脚本会执行，但仍然保留在文档中并且标记为已经被执行过的，这样它们就不会被再次执行，即使它们被删除并重新插入。

尽管这种变化，在 HTML 标记中混合可执行的 JavaScript 是非常不好的习惯；它对设计，安全性，可靠性和性能有影响。例如，外部脚本标签包含在 HTML 中同步地取出，然后评估执行，这可能需要大量的时间。没有任何接口通知这些脚本何时何地加载，或者当有错误产生的时候获得纠正提示。

试图通过克隆一个现有的脚本标签加载和注入脚本，克隆到文档将不再起作用，因为克隆的脚本标记已经被标记为已执行。要加载一个新的脚本，建议使用 `jQuery.getScript()` 代替。

#### `.attr` 和 `.prop` 对比

jQuery 1.6 介绍了 `.prop()` 方法设置或获取节点上的对象属性（property），并且不建议使用 `.attr()` 方法设置对象属性（property）。然而版本一直到1.9，在某些特殊情况下继续支持使用 `.attr()` 方法。当选择器是用来区分标签属性（attributes）和对象属性（properties）时，这种行为在向后兼容的命名方面会引起混乱。

例如，一个复选框的布尔标签属性（attributes），如 checked 和 disabled 受到这种变化的影响。`"input[checked]"` 的正确行为是选择有 checked 属性的复选框，不管是它的字符串值，还是它当前的状态。与此相反，`"input:checked"` 选择当前 checked 属性的布尔值（true 或 false）为 true 的复选框，例如当用户单击复选框时，会受到影响。1.9之前版本这些选择器有时不选择正确的节点。

这里有一些例子，当在复选框上设置一个 checked 属性时正确的和不正确的使用方法；同样的规则也适用于 disabled 属性。请注意只有对象属性（property）在所有的浏览器始终反映和更新的复选框的当前状态；你很少会需要设置的属性（attribute）。

```javascript
// Correct if changing the attribute is desired
$(elem).attr("checked", "checked");
// Correct for checking the checkbox
$(elem).prop("checked", true);
// Correct if removing the attribute is desired
$(elem).removeAttr("checked");
// Correct for clearing the checkbox
$(elem).prop("checked", false);
```

那么什么时候使用 `.attr()` 什么时候使用 `.prop()`:

1. 添加属性名称该属性就会生效应该使用 `.prop()`;
2. 是有 true|false 两个属性使用 `.prop()`;
3. 其他则使用 `.attr()`;

以下是官方建议 `.attr()`, `.prop()`的使用：

<table class="table table-bordered">
  <tbody>
    <tr><th>Attribute/Property</th><th>.attr()</th><th>.prop()</th></tr>
    <tr class="alt">
      <td>accesskey</td>
      <td>√</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>align</td>
      <td>√</td>
      <td>&nbsp;</td>
    </tr>
    <tr class="alt">
      <td>async</td>
      <td>√</td>
      <td>√</td>
    </tr>
    <tr>
      <td>autofocus</td>
      <td>√</td>
      <td>√</td>
    </tr>
    <tr class="alt">
      <td>checked</td>
      <td>√</td>
      <td>√</td>
    </tr>
    <tr>
      <td>class</td>
      <td>√</td>
      <td>&nbsp;</td>
    </tr>
    <tr class="alt">
      <td>contenteditable</td>
      <td>√</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>draggable</td>
      <td>√</td>
      <td>&nbsp;</td>
    </tr>
    <tr class="alt">
      <td>href</td>
      <td>√</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>id</td>
      <td>√</td>
      <td>&nbsp;</td>
    </tr>
    <tr class="alt">
      <td>label</td>
      <td>√</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>location ( i.e. window.location )</td>
      <td>√</td>
      <td>√</td>
    </tr>
    <tr class="alt">
      <td>multiple</td>
      <td>√</td>
      <td>√</td>
    </tr>
    <tr>
      <td>readOnly</td>
      <td>√</td>
      <td>√</td>
    </tr>
    <tr class="alt">
      <td>rel</td>
      <td>√</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>selected</td>
      <td>√</td>
      <td>√</td>
    </tr>
    <tr class="alt">
      <td>src</td>
      <td>√</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>tabindex</td>
      <td>√</td>
      <td>&nbsp;</td>
    </tr>
    <tr class="alt">
      <td>title</td>
      <td>√</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td>type</td>
      <td>√</td>
      <td>&nbsp;</td>
    </tr>
    <tr class="alt">
      <td>width ( if needed over&nbsp;.width()&nbsp;)</td>
      <td>√</td>
      <td>&nbsp;</td>
    </tr>
  </tbody>
</table>

#### 老IE中的 `jQuery("input").attr("type", newValue)`

在1.9版之前，在所有的浏览器中，任何企图设置一个 input 或者 button 元素的类型（type属性），jQuery都将抛出一个异常。这样做时为了符合最低标准的兼容；因为如果你试图改变 input 元素的类型，IE6/7/8抛出一个错误。从 jQuery 1.9 开始，如果浏览器允许的话，我们允许您设置元素的类型。但是，你需要知道自己的代码，在老IE（IE6/7/8）下试图做到这一点还是会抛出一个错误。当你试图设置类型属性时，[jQuery Migrate（迁移）插件](组件模块.html#t2-0_jQuery+迁移+jq/migrate)会发出警告，但不会抛出一个 JavaScript 错误。

#### `"hover"` 伪事件

从1.9开始，事件名称字符串 `"hover"` 不再支持为 "mouseenter mouseleave" 的代名词缩写。允许应用程序绑定和触发自定义的 "hover" 事件。修改现有的代码是一个简单的查找/替换。

#### jQuery对象上的 `.selector` 属性

jQuery 对象上过时的 `selector` 属性保留的目的是为了支持过时的 `.live()` 事件。在1.9中，jQuery 不再试图在链方法上保留这个属性，因为1.9已经移除了 `.live()` 事件。不要使用 jQuery 对象的 `.selector` 属性。[jQuery Migrate（迁移）插件](组件模块.html#t2-0_jQuery+迁移+jq/migrate)也没支持这个属性。

#### 移除了 `jQuery.attr` 方法

1.9版移除了 jQuery.attr(elem, name, value, pass) 方法，用[jQuery Migrate（迁移）插件](组件模块.html#t2-0_jQuery+迁移+jq/migrate)可恢复这个方法。

#### `jQuery.ajax` 返回一个空字符串的JSON结果

1.9之前，一个 Ajax 调用预期返回 JSON 或 JSONP 的数据类型，当返回值是一个空字符串时会被认为是成功的状态，但返回一个 null 给 success 处理程序或延迟对象（promise）。从1.9开始，JSON 数据返回一个空字符串被认为是畸形的JSON（因为它本来就是）;这将抛出一个错误。这种情况下，使用error（错误）处理程序捕获。

#### 更改 `jQuery.proxy` 方法

1.9版前，`jQuery.proxy(null, fn)`、`jQuery.proxy(undefined, fn)` 的 this 会指向 window，而 `jQuery.proxy(false, fn)` 的 this 则指向 `new Boolean(false)`；1.9起若 context 传入 null/undefined/false，函数的 this 会维持原先 context，不被改变。

#### 更改 `.data("events")` 方法

1.9以前,如果没有其他的代码定义一个名称为 `"events"` 的数据元素，`.data("events")` 可以用来检索一个元素上，jQuery未公开的内部事件数据结构。这种特殊的情况，在1.9中已被删除。没有公共的接口来获取这个内部数据结构。

它是不公开的。[jQuery Migrate（迁移）插件](组件模块.html#t2-0_jQuery+迁移+jq/migrate)可以恢复原来的行为。

#### 移除Event对象的部分属性

Event 对象的 attrChange、attrName、realtedNote 和 srcElement 属性自1.7版因无法跨浏览器已被宣告过时；从jQuery 1.9开始，它们不再被复制到Event对象传递给事件处理程序。在jQuery所有版本中，这些属性依然可以在支持他们的浏览器上通过 event.orginalEvent 存取，以取代 event。[jQuery Migrate（迁移）插件](组件模块.html#t2-0_jQuery+迁移+jq/migrate)在 Event 对象有加回了这些属性。

#### API方法未公开的参数

1.9之前，几个API方法未公开改变了他们的行为的参数，并存在潜在的意外误用。这些参数已经被删除。受影响的方法包括 `jQuery.data()`，`jQuery.removeData()`，和 `jQuery.attr()`。[jQuery Migrate（迁移）插件](组件模块.html#t2-0_jQuery+迁移+jq/migrate)也不支持的代码。

#### 其他未公开的属性和方法

下面的内部属性和方法从未被收入到文档，并已在1.9中删除。

* jQuery.deletedIds

* jQuery.uuid

* jQuery.attrFn

* jQuery.clean()

* jQuery.event.handle()

* jQuery.offset.bodyOffset()

## jQuery插件

<p class="lead">
  YFjs 组件库默认载入了几个基础、精巧且使用率较高 jQuery 扩展插件，无需引入即可直接使用。
</p>

### .serializeObject

与 jQuery 的 `.serialize()` 和 `.serializeArray()` 方法类似，`.serializeObject()` 方法也是对表单内容序列化（忽略 file、image、button、submit、reset 等元素类型）。

不同之处在于，`.serialize()` 返回结果是类似于 `param1=value1&amp;param2=value2` 的字符串；`.serializeArray()` 返回结果是类似于 `[{name: "param1", value: value1}, {name: "param2", value: value2}]` 的数组；而 `.serializeObject()` 返回结果是类似于 `{param1: value1, param2: value2}` 的 JSON 对象。

### jQuery.parseQuery

简单来说，`jQuery.parseQuery()` 方法是 `jQuery.param()` 方法的逆向处理：解析 URL 中的参数为 JSON 对象。

下面是一个使用例子。

```javascript
$.parseQuery("file.js?a=1&b[c]=3.0&b[d]=four&a_false_value=false&a_null_value=null")
// returns {"a":1,"b":{"c":3,"d":"four"},"a_false_value":false,"a_null_value":null}
```

另外，也支持解析更深层次的数组类型值。

```javascript
$.parseQuery("file.js?a[b]=1&a[c]=2&d[]=3&d[]=4&d[2][e]=5")
// returns {"a":{"b":1,"c":2},"d":[3,4,{"e":5}]}
```

### .mousewheel

组件库默认加入了对鼠标滚轮事件的支持插件。可以通过 `.mousewheel()` 添加滚轮事件监听，以及 `.unmousewheel()` 移除滚轮事件监听。

### 过渡效果 <small>transition</small>

即 [Bootstrap 3 的 `transition.js` 插件](http://v3.bootcss.com/javascript/#transitions)。是针对 `transitionEnd` 事件的一个基本辅助工具，也是对 CSS 过渡效果的模拟。它被其它插件用来检测当前浏览器对是否支持 CSS 的过渡效果。组件库默认即加入了该插件。

通过下面的 JavaScript 代码可以在全局范围禁用过渡效果：

```javascript
$.support.transition = false;
```

### 下拉菜单 <small>dropdown</small>

即 [Bootstrap 3 的下拉菜单插件](http://v3.bootcss.com/javascript/#dropdowns)。

#### 实例

你可以通过这个简单的插件将下拉式的菜单添加到就近的任何地方，包括导航条、标签页和胶囊是标签页。

##### 添加到导航条

<div class="example-box">
  <nav id="navbar-example" class="navbar navbar-default navbar-static">
    <div class="container-fluid">
      <div class="navbar-header">
        <button class="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target=".bs-example-js-navbar-collapse">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#">Project Name</a>
      </div>
      <div class="collapse navbar-collapse bs-example-js-navbar-collapse">
        <ul class="nav navbar-nav">
          <li class="dropdown">
            <a id="drop1" href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
              Dropdown
              <span class="caret"></span>
            </a>
            <ul class="dropdown-menu" aria-labelledby="drop1">
              <li><a href="#">Action</a></li>
              <li><a href="#">Another action</a></li>
              <li><a href="#">Something else here</a></li>
              <li role="separator" class="divider"></li>
              <li><a href="#">Separated link</a></li>
            </ul>
          </li>
          <li class="dropdown">
            <a id="drop2" href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
              Dropdown
              <span class="caret"></span>
            </a>
            <ul class="dropdown-menu" aria-labelledby="drop2">
              <li><a href="#">Action</a></li>
              <li><a href="#">Another action</a></li>
              <li><a href="#">Something else here</a></li>
              <li role="separator" class="divider"></li>
              <li><a href="#">Separated link</a></li>
            </ul>
          </li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li id="fat-menu" class="dropdown">
            <a id="drop3" href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
              Dropdown
              <span class="caret"></span>
            </a>
            <ul class="dropdown-menu" aria-labelledby="drop3">
              <li><a href="#">Action</a></li>
              <li><a href="#">Another action</a></li>
              <li><a href="#">Something else here</a></li>
              <li role="separator" class="divider"></li>
              <li><a href="#">Separated link</a></li>
            </ul>
          </li>
        </ul>
      </div><!-- /.nav-collapse -->
    </div><!-- /.container-fluid -->
  </nav> <!-- /navbar-example -->
</div>

##### 添加到胶囊式标签页

<div class="example-box">
  <ul class="nav nav-pills" role="tablist">
    <li role="presentation" class="active"><a href="#">Regular link</a></li>
    <li role="presentation" class="dropdown">
      <a id="drop4" href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
        Dropdown
        <span class="caret"></span>
      </a>
      <ul id="menu1" class="dropdown-menu" aria-labelledby="drop4">
        <li><a href="#">Action</a></li>
        <li><a href="#">Another action</a></li>
        <li><a href="#">Something else here</a></li>
        <li role="separator" class="divider"></li>
        <li><a href="#">Separated link</a></li>
      </ul>
    </li>
    <li role="presentation" class="dropdown">
      <a id="drop5" href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
        Dropdown
        <span class="caret"></span>
      </a>
      <ul id="menu2" class="dropdown-menu" aria-labelledby="drop5">
        <li><a href="#">Action</a></li>
        <li><a href="#">Another action</a></li>
        <li><a href="#">Something else here</a></li>
        <li role="separator" class="divider"></li>
        <li><a href="#">Separated link</a></li>
      </ul>
    </li>
    <li role="presentation" class="dropdown">
      <a id="drop6" href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
        Dropdown
        <span class="caret"></span>
      </a>
      <ul id="menu3" class="dropdown-menu" aria-labelledby="drop6">
        <li><a href="#">Action</a></li>
        <li><a href="#">Another action</a></li>
        <li><a href="#">Something else here</a></li>
        <li role="separator" class="divider"></li>
        <li><a href="#">Separated link</a></li>
      </ul>
    </li>
  </ul> <!-- /pills -->
</div>

#### 用法

通过 data 属性或 JavaScript 初始化下拉菜单，下拉菜单插件通过切换列表项父元素的样式类 `.open` 控制内容（下拉菜单）的隐藏切换。

在手机设备上，需要为打开的下拉菜单添加一个样式类 `.dropdown-backdrop`，这将作为一个触摸区域以在菜单外面触摸屏幕时关闭下拉菜单，同时支持 iOS 设备。<strong class="text-danger">这意味着在手机屏幕上从一个打开的下拉菜单切换另一个不同的下拉菜单时需要在额外的区域上点击。</strong>

注意：属性 `data-toggle="dropdown"` 用以在程序处理中关联一个关闭的下拉菜单，所以建议经常使用它。

##### 通过 data 属性调用

为一个链接或一个按钮添加属性 `data-toggle="dropdown"` 用以切换一个下拉菜单。

```html
<div class="dropdown">
  <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Dropdown trigger
    <span class="caret"></span>
  </button>
  <ul class="dropdown-menu" aria-labelledby="dLabel">
    ...
  </ul>
</div>
```

如果想要保持一个链接按钮原本的链接地址不变，可以使用属性 `data-target` 代替 `href="#"`。

```html
<div class="dropdown">
  <a id="dLabel" data-target="#" href="http://example.com" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
    Dropdown trigger
    <span class="caret"></span>
  </a>

  <ul class="dropdown-menu" aria-labelledby="dLabel">
    ...
  </ul>
</div>
```

##### 通过 JavaScript 调用

通过 JavaScript 调用下拉菜单插件：

```javascript
$('.dropdown-toggle').dropdown();
```

<div class="callout callout-info">
  <h4>依然需要属性 `data-toggle="dropdown"`</h4>
  <p>不管是通过 JavaScript 或是通过使用 data-api 的方式调用的下拉菜单插件，属性 `data-toggle="dropdown"` 始终是需要设置关联下拉菜单的触发元素的。</p>
</div>

#### 方法

##### `$().dropdown('toggle')`

切换一个导航条或标签页上的下拉菜单。

#### 事件

所有的下拉菜单事件都在 `.dropdown-menu` 的父层元素上触发。

所有的下拉菜单事件都有一个 `relatedTarget` 属性，其值为触发菜单切换显示的锚元素。

<div class="table-responsive">
  <table class="table table-bordered table-striped bs-events-table">
    <thead>
      <tr>
        <th>事件类型</th>
        <th>描述</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>show.bs.dropdown</td>
        <td>在下拉菜单实例的 `show` 方法调用后立即触发。</td>
      </tr>
      <tr>
        <td>shown.bs.dropdown</td>
        <td>在下拉菜单内容显示出来后立即触发（CSS 动画过渡效果完成后）。</td>
      </tr>
      <tr>
        <td>hide.bs.dropdown</td>
        <td>在下拉菜单实例的 `hide` 方法调用后立即触发。</td>
      </tr>
      <tr>
        <td>hidden.bs.dropdown</td>
        <td>在下拉菜单内容隐藏起来后立即触发（CSS 动画过渡效果完成后）。</td>
      </tr>
    </tbody>
  </table>
</div>

```javascript
$('#myDropdown').on('show.bs.dropdown', function () {
  // do something…
});
```

### 滚动监听 <small>scrollspy</small>

即 [Bootstrap 3 的滚动监听插件](http://v3.bootcss.com/javascript/#scrollspy)。

#### 导航条实例

滚动监听插件是用来根据滚动条所处的位置来自动更新导航项的。如下所示，滚动导航条下面的区域并关注导航项的变化。下拉菜单中的条目也会自动高亮显示。

<div class="example-box">
  <nav id="navbar-example2" class="navbar navbar-default navbar-static">
    <div class="container-fluid">
      <div class="navbar-header">
        <button class="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target=".bs-example-js-navbar-scrollspy">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#">Project Name</a>
      </div>
      <div class="collapse navbar-collapse bs-example-js-navbar-scrollspy">
        <ul class="nav navbar-nav">
          <li class=""><a href="#fat">@fat</a></li>
          <li class=""><a href="#mdo">@mdo</a></li>
          <li class="dropdown active">
            <a href="#" id="navbarDrop1" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>
            <ul class="dropdown-menu" aria-labelledby="navbarDrop1">
              <li class=""><a href="#one">one</a></li>
              <li class=""><a href="#two">two</a></li>
              <li role="separator" class="divider"></li>
              <li class="active"><a href="#three">three</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div data-spy="scroll" data-target="#navbar-example2" data-offset="0" class="scrollspy-example">
    <h4 id="fat" style="">@fat</h4>
    <p>Ad leggings keytar, brunch id art party dolor labore. Pitchfork yr enim lo-fi before they sold out qui. Tumblr farm-to-table bicycle rights whatever. Anim keffiyeh carles cardigan. Velit seitan mcsweeney's photo booth 3 wolf moon irure. Cosby sweater lomo jean shorts, williamsburg hoodie minim qui you probably haven't heard of them et cardigan trust fund culpa biodiesel wes anderson aesthetic. Nihil tattooed accusamus, cred irony biodiesel keffiyeh artisan ullamco consequat.</p>
    <h4 id="mdo" style="">@mdo</h4>
    <p>Veniam marfa mustache skateboard, adipisicing fugiat velit pitchfork beard. Freegan beard aliqua cupidatat mcsweeney's vero. Cupidatat four loko nisi, ea helvetica nulla carles. Tattooed cosby sweater food truck, mcsweeney's quis non freegan vinyl. Lo-fi wes anderson +1 sartorial. Carles non aesthetic exercitation quis gentrify. Brooklyn adipisicing craft beer vice keytar deserunt.</p>
    <h4 id="one" style="">one</h4>
    <p>Occaecat commodo aliqua delectus. Fap craft beer deserunt skateboard ea. Lomo bicycle rights adipisicing banh mi, velit ea sunt next level locavore single-origin coffee in magna veniam. High life id vinyl, echo park consequat quis aliquip banh mi pitchfork. Vero VHS est adipisicing. Consectetur nisi DIY minim messenger bag. Cred ex in, sustainable delectus consectetur fanny pack iphone.</p>
    <h4 id="two" style="">two</h4>
    <p>In incididunt echo park, officia deserunt mcsweeney's proident master cleanse thundercats sapiente veniam. Excepteur VHS elit, proident shoreditch +1 biodiesel laborum craft beer. Single-origin coffee wayfarers irure four loko, cupidatat terry richardson master cleanse. Assumenda you probably haven't heard of them art party fanny pack, tattooed nulla cardigan tempor ad. Proident wolf nesciunt sartorial keffiyeh eu banh mi sustainable. Elit wolf voluptate, lo-fi ea portland before they sold out four loko. Locavore enim nostrud mlkshk brooklyn nesciunt.</p>
    <h4 id="three" style="">three</h4>
    <p>Ad leggings keytar, brunch id art party dolor labore. Pitchfork yr enim lo-fi before they sold out qui. Tumblr farm-to-table bicycle rights whatever. Anim keffiyeh carles cardigan. Velit seitan mcsweeney's photo booth 3 wolf moon irure. Cosby sweater lomo jean shorts, williamsburg hoodie minim qui you probably haven't heard of them et cardigan trust fund culpa biodiesel wes anderson aesthetic. Nihil tattooed accusamus, cred irony biodiesel keffiyeh artisan ullamco consequat.</p>
    <p>Keytar twee blog, culpa messenger bag marfa whatever delectus food truck. Sapiente synth id assumenda. Locavore sed helvetica cliche irony, thundercats you probably haven't heard of them consequat hoodie gluten-free lo-fi fap aliquip. Labore elit placeat before they sold out, terry richardson proident brunch nesciunt quis cosby sweater pariatur keffiyeh ut helvetica artisan. Cardigan craft beer seitan readymade velit. VHS chambray laboris tempor veniam. Anim mollit minim commodo ullamco thundercats.
    </p>
  </div>
</div>

#### 用法

<div class="callout callout-warning">
  <h4>依赖 Bootstrap 的导航组件</h4>
  <p>滚动监听插件依赖 [Bootstrap 的导航组件](Base样式.html#t1-5_导航) 用于高亮显示当前激活的链接。</p>
</div>

<div class="callout callout-danger">
  <h4>需要指定有效的 ID 目标对象</h4>
  <p>导航条链接必须拥有有效的 id 目标对象。比如，一个链接 `<a href="#home">home</a>` 必须正确关联到类似于 `<div id="home"></div>` 的一个 DOM 元素。</p>
</div>

<div class="callout callout-info">
  <h4>非 `:visible` 元素是被忽略的</h4>
  <p>非可视目标元素 [通过 jQuery 设置 `:visible`](http://api.jquery.com/visible-selector/) 将被忽略并且它们关联的导航项不会被高亮显示。</p>
</div>

##### 需要相对定位（relative positioning）

无论何种实现方式，滚动监听都需要被监听的组件是 `position: relative;` 即相对定位方式。大多数时候是监听 `<body>` 元素。在监听滚动 `<body>` 之外的元素时，需要确认元素设置了高度 `height` 并且设置了样式 `overflow-y: scroll;`。

##### 通过 data 属性调用

为了方便地为顶部导航条添加滚动监听行为，需要为想要监听的元素添加属性 `data-spy="scroll"`（很多时候是监听在元素 `<body>` 上）。然后添加属性 `data-target` 用以通过 ID 或 class 类关联任意的 `.nav` 组件。

```scss
body {
  position:relative;
}
```

```html
<body data-spy="scroll" data-target="#navbar-example">
  ...
  <div id="navbar-example">
    <ul class="nav nav-tabs" role="tablist">
      ...
    </ul>
  </div>
  ...
</body>
```

##### 通过 JavaScript 调用

在 CSS 中添加 `position: relative;` 之后，通过 JavaScript 代码启动滚动监听插件：

```javascript
$('body').scrollspy({ target: '#navbar-example' });
```

#### 方法

##### `.scrollspy('refresh')`

当使用滚动监听插件的同时在 DOM 中添加或删除元素后，你需要像下面这样调用此刷新（ refresh） 方法：

```javascript
$('[data-spy="scroll"]').each(function () {
  var $spy = $(this).scrollspy('refresh')
});
```

#### 参数

可以通过 data 属性或 JavaScript 传递参数。对于 data 属性，其名称是将参数名附着到 `data-` 后面组成，例如 `data-offset=""`。

<div class="table-responsive">
  <table class="table table-bordered table-striped js-options-table">
    <thead>
      <tr>
        <th>名称</th>
        <th>类型</th>
        <th>默认值</th>
        <th>描述</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>offset</td>
        <td>number</td>
        <td>10</td>
        <td>计算滚动位置时相对于顶部的偏移量（像素数）。</td>
      </tr>
    </tbody>
  </table>
</div>

#### 事件

<div class="table-responsive">
  <table class="table table-bordered table-striped bs-events-table">
    <thead>
      <tr>
        <th>事件类型</th>
        <th>描述</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>activate.bs.scrollspy</td>
        <td>每当一个新条目被激活后都将由滚动监听插件触发此事件。</td>
      </tr>
    </tbody>
  </table>
</div>

### 固定元素 <small>affix</small>

即 [Bootstrap 3 的 Affix 插件](http://v3.bootcss.com/javascript/#affix)。

#### 实例

affix 插件动态添加和移除样式 `position: fixed;`，类似于 [`position: sticky;`](https://developer.mozilla.org/en-US/docs/Web/CSS/position#Sticky_positioning) 计算并设置位置的效果。右侧的导航菜单就是使用 affix 插件的一个例子。

#### 用法

通过 data 属性或手动调用 JavaScript 的方式使用 affix 插件。<strong class="text-danger">这两种情况下，都必须通过 CSS 设置位置和固定内容的宽度。</strong>

注意：不要在一个包含在相对定位的容器中的元素上使用 affix 插件，比如一个 pulled 或 pushed 的列中，查看问题 [Safari rendering bug](https://github.com/twbs/bootstrap/issues/12126)。

##### 通过 CSS 定位

The affix plugin toggles between three classes, each representing a particular state: `.affix`, `.affix-top`, and `.affix-bottom`. You must provide the styles, with the exception of `position: fixed`; on `.affix`, for these classes yourself (independent of this plugin) to handle the actual positions.

以下是 affix 插件的工作过程：

1. To start, the plugin adds `.affix-top` to indicate the element is in its top-most position. At this point no CSS positioning is required.
2. Scrolling past the element you want affixed should trigger the actual affixing. This is where `.affix` replaces `.affix-top` and sets `position: fixed;` (provided by Bootstrap's CSS).
3. If a bottom offset is defined, scrolling past it should replace `.affix` with `.affix-bottom`. Since offsets are optional, setting one requires you to set the appropriate CSS. In this case, add `position: absolute;` when necessary. The plugin uses the data attribute or JavaScript option to determine where to position the element from there.

Follow the above steps to set your CSS for either of the usage options below.

##### 通过 data 属性调用

想要简单地为任意元素添加固定行为，只需要为想要监听的元素添加属性 `data-spy="affix"` 即可。使用偏移量定义切换固定元素的状态时的相对偏移位置。

```html
<div data-spy="affix" data-offset-top="60" data-offset-bottom="200">
  ...
</div>
```

##### 通过 JavaScript 调用

通过 JavaScript 调用 affix 插件：

```javascript
$('#myAffix').affix({
  offset: {
    top: 100,
    bottom: function () {
      return (this.bottom = $('.footer').outerHeight(true))
    }
  }
});
```

#### 参数

可以通过 data 属性或 JavaScript 传递配置项参数。对于 data 属性，需要将配置项参数名附着到 `data-` 后面，例如 `data-offset-top="200"`。

<div class="table-responsive">
  <table class="table table-bordered table-striped js-options-table">
    <thead>
      <tr>
        <th>名称</th>
        <th>类型</th>
        <th>默认值</th>
        <th>描述</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>offset</td>
        <td>number | function | object</td>
        <td>10</td>
        <td>设置计算定位时的滚动偏移量（单位 像素）。如果设为一个数字，将同时应用到 top 和 bottom 方向上的偏移位置。如果想单一设置 bottom 或 top 方向上的偏移位置，需要设为一个对象，如 `offset: { top: 10 }` 或 `offset: { top: 10, bottom: 5 }`。设为 function 时需要返回动态计算后的偏移位置。</td>
      </tr>
      <tr>
        <td>target</td>
        <td>selector | node | jQuery element</td>
        <td>`window` 对象</td>
        <td>设置固定的相对对象元素</td>
      </tr>
    </tbody>
  </table>
</div>

#### 方法

##### `.affix(options)`

激活固定元素。接受一个自定义的 `object` 参数。

```javascript
$('#myAffix').affix({
  offset: 15
})
```

##### `.affix('checkPosition')`

重新计算固定元素的状态位置。The `.affix`, `.affix-top`, and `.affix-bottom` classes are added to or removed from the affixed content according to the new state. This method needs to be called whenever the dimensions of the affixed content or the target element are changed, to ensure correct positioning of the affixed content.

```javascript
$('#myAffix').affix('checkPosition')
```

#### 事件

affix 插件在样式 class 改变时会自动触发一些事件，通过监听这些事件可以实现自己的一些处理。

<div class="table-responsive">
  <table class="table table-bordered table-striped bs-events-table">
    <thead>
      <tr>
        <th>事件类型</th>
        <th>描述</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>affix.bs.affix</td>
        <td>在元素将要固定位置时立即触发。</td>
      </tr>
      <tr>
        <td>affixed.bs.affix</td>
        <td>在元素固定位置后立即触发。</td>
      </tr>
      <tr>
        <td>affix-top.bs.affix</td>
        <td>在元素将要在顶部固定时立即触发。</td>
      </tr>
      <tr>
        <td>affixed-top.bs.affix</td>
        <td>在元素固定在顶部后立即触发。</td>
      </tr>
      <tr>
        <td>affix-bottom.bs.affix</td>
        <td>在元素将要在底部固定时立即触发。</td>
      </tr>
      <tr>
        <td>affixed-bottom.bs.affix</td>
        <td>在元素固定在底部后立即触发。</td>
      </tr>
    </tbody>
  </table>
</div>

### 加载中效果 <small>loader</small>

#### 实例

为一个 `div` 元素添加 `loader` 类，并设置属性 `data-spy="loader"`，就可以实现一个加载中的等待动画效果。

<div class="example-box">
  <div class="loader" data-spy="loader"></div>
</div>

```html
<div class="loader" data-spy="loader"></div>
```

#### 用法

##### 通过 JavaScript 调用

可以通过 JavaScript 调用 loader 插件。

```javascript
$('#myLoader').loader();
```

##### 通过 data 属性调用

除了设置属性 `data-spy="loader"` 触发 loader 插件自动初始化外，还有以下属性设置项：

* <mark>data-begin</mark>：从[1, 7]区间选择的数字，动画显示开始的位置。

* <mark>data-end</mark>：从[1, 7]区间选择的数字，动画显示结束的位置。不能小于 begin 设置。

* <mark>data-delay</mark>：Number整数类型，单位 ms，动画显示延迟时间/频率。

* <mark>data-frame</mark>：从[1, 7]区间选择的数字，动画开始的位置。

#### 方法

##### `.loader('destroy')`

移除所有的动画、jQuery绑定数据，并从 DOM 结构中移除，返回插件标记字符串。

### 单选按钮/复选框美化 <small>iCheck</small>

#### 复选框实例

##### 基本效果

Supports bootstrap brand colors: `.icheckbox-primary`, `.icheckbox-info` etc.

<div class="example-box example-box-icheck">
  <div class="checkbox">
    <label>
      <input id="checkbox1" type="checkbox" checked="checked" data-spy="iCheck">
      Default
    </label>
  </div>
  <div class="checkbox">
    <label>
      <input class="icheckbox-primary" id="checkbox2" type="checkbox" checked="checked" data-spy="iCheck">
      Primary
    </label>
  </div>
  <div class="checkbox">
    <label>
      <input class="icheckbox-success" id="checkbox3" type="checkbox" checked="checked" data-spy="iCheck">
      Success
    </label>
  </div>
  <div class="checkbox">
    <label>
      <input class="icheckbox-info" id="checkbox4" type="checkbox" data-spy="iCheck">
      Info
    </label>
  </div>
  <div class="checkbox">
    <label>
      <input class="icheckbox-warning" id="checkbox5" type="checkbox" checked="checked" data-spy="iCheck">
      Warning
    </label>
  </div>
  <div class="checkbox">
    <label>
      <input class="icheckbox-danger" id="checkbox6" type="checkbox" checked="checked" data-spy="iCheck">
      Check me out
    </label>
  </div>
</div>

```html
<div class="checkbox">
  <label>
    <input id="checkbox1" type="checkbox" checked="checked" data-spy="iCheck">
    Default
  </label>
</div>
<div class="checkbox">
  <label>
    <input class="icheckbox-primary" id="checkbox2" type="checkbox" checked="checked" data-spy="iCheck">
    Primary
  </label>
</div>
<div class="checkbox">
  <label>
    <input class="icheckbox-success" id="checkbox3" type="checkbox" checked="checked" data-spy="iCheck">
    Success
  </label>
</div>
<div class="checkbox">
  <label>
    <input class="icheckbox-info" id="checkbox4" type="checkbox" data-spy="iCheck">
    Info
  </label>
</div>
<div class="checkbox">
  <label>
    <input class="icheckbox-warning" id="checkbox5" type="checkbox" checked="checked" data-spy="iCheck">
    Warning
  </label>
</div>
<div class="checkbox">
  <label>
    <input class="icheckbox-danger" id="checkbox6" type="checkbox" checked="checked" data-spy="iCheck">
    Check me out
  </label>
</div>
```

Checkboxes without label text

<div class="example-box example-box-icheck">
  <div class="checkbox">
    <label>
      <input id="singleCheckbox1" type="checkbox" checked="checked" value="option1" aria-label="Single checkbox One" data-spy="iCheck">
    </label>
  </div>
  <div class="checkbox">
    <label>
      <input class="icheckbox-primary" id="singleCheckbox2" type="checkbox" checked="checked" value="option2" aria-label="Single checkbox Two" data-spy="iCheck">
    </label>
  </div>
</div>

```html
<div class="checkbox">
  <label>
    <input id="singleCheckbox1" type="checkbox" checked="checked" value="option1" aria-label="Single checkbox One" data-spy="iCheck">
  </label>
</div>
<div class="checkbox">
  <label>
    <input class="icheckbox-primary" id="singleCheckbox2" type="checkbox" checked="checked" value="option2" aria-label="Single checkbox Two" data-spy="iCheck">
  </label>
</div>
```

Inline checkboxes

<div class="example-box">
  <label class="checkbox-inline">
    <input id="inlineCheckbox1" value="option1" type="checkbox" data-spy="iCheck"> Inline One
  </label>
  <label class="checkbox-inline">
    <input class="icheckbox-success" id="inlineCheckbox2" value="option1" checked="checked" type="checkbox" data-spy="iCheck"> Inline Two
  </label>
  <label class="checkbox-inline">
    <input id="inlineCheckbox3" value="option1" type="checkbox" data-spy="iCheck"> Inline Three
  </label>
</div>

```html
<label class="checkbox-inline">
  <input id="inlineCheckbox1" value="option1" type="checkbox" data-spy="iCheck"> Inline One
</label>
<label class="checkbox-inline">
  <input class="icheckbox-success" id="inlineCheckbox2" value="option1" checked="checked" type="checkbox" data-spy="iCheck"> Inline Two
</label>
<label class="checkbox-inline">
  <input id="inlineCheckbox3" value="option1" type="checkbox" data-spy="iCheck"> Inline Three
</label>
```

##### 更大尺寸的复选框

`.icheckbox-lg` for bigger checkbox.

<div class="example-box example-box-icheck">
  <div class="checkbox">
    <label>
      <input class="icheckbox-lg" type="checkbox" data-spy="iCheck">
      Default & Bigger
    </label>
  </div>
  <div class="checkbox">
    <label>
      <input class="icheckbox-primary icheckbox-lg" checked="checked" type="checkbox" data-spy="iCheck">
      Primary & Bigger
    </label>
  </div>
  <div class="checkbox">
    <label>
      <input class="icheckbox-success icheckbox-lg" checked="checked" type="checkbox" data-spy="iCheck">
      Success & Bigger
    </label>
  </div>
  <div class="checkbox">
    <label>
      <input class="icheckbox-info icheckbox-lg" type="checkbox" data-spy="iCheck">
      Info & Bigger
    </label>
  </div>
  <div class="checkbox">
    <label>
      <input class="icheckbox-warning icheckbox-lg" checked="checked" type="checkbox" data-spy="iCheck">
      Warning & Bigger
    </label>
  </div>
  <div class="checkbox">
    <label>
      <input class="icheckbox-danger icheckbox-lg" checked="checked" type="checkbox" data-spy="iCheck">
      Danger & Bigger
    </label>
  </div>
</div>

```html
<div class="checkbox">
  <label>
    <input class="icheckbox-lg" type="checkbox" data-spy="iCheck">
    Default & Bigger
  </label>
</div>
<div class="checkbox">
  <label>
    <input class="icheckbox-primary icheckbox-lg" checked="checked" type="checkbox" data-spy="iCheck">
    Primary & Bigger
  </label>
</div>
<div class="checkbox">
  <label>
    <input class="icheckbox-success icheckbox-lg" checked="checked" type="checkbox" data-spy="iCheck">
    Success & Bigger
  </label>
</div>
<div class="checkbox">
  <label>
    <input class="icheckbox-info icheckbox-lg" type="checkbox" data-spy="iCheck">
    Info & Bigger
  </label>
</div>
<div class="checkbox">
  <label>
    <input class="icheckbox-warning icheckbox-lg" checked="checked" type="checkbox" data-spy="iCheck">
    Warning & Bigger
  </label>
</div>
<div class="checkbox">
  <label>
    <input class="icheckbox-danger icheckbox-lg" checked="checked" type="checkbox" data-spy="iCheck">
    Danger & Bigger
  </label>
</div>
```

##### 圆形复选框

`.icheckbox-radio` for roundness.

<div class="example-box example-box-icheck">
  <div class="checkbox">
    <input class="icheckbox-radio" id="checkbox7" type="checkbox" data-spy="iCheck">
    <label for="checkbox7">
      Simply Rounded
    </label>
  </div>
  <div class="checkbox">
    <input class="icheckbox-info icheckbox-radio" id="checkbox8" type="checkbox" checked="checked" data-spy="iCheck">
    <label for="checkbox8">
      Me too
    </label>
  </div>
</div>

```html
<div class="checkbox">
  <input class="icheckbox-radio" id="checkbox7" type="checkbox" data-spy="iCheck">
  <label for="checkbox7">
    Simply Rounded
  </label>
</div>
<div class="checkbox">
  <input class="icheckbox-info icheckbox-radio" id="checkbox8" type="checkbox" checked="checked" data-spy="iCheck">
  <label for="checkbox8">
    Me too
  </label>
</div>
```

##### 灰色背景

`.iradio-bg-gray` for gray backgound.

<div class="example-box example-box-icheck">
  <label>
    <input class="icheckbox-lg icheckbox-bg-gray" name="checkbox6" value="option6" type="checkbox" data-spy="iCheck">
  </label>
  <label>
    <input class="icheckbox-primary icheckbox-lg icheckbox-bg-gray" name="checkbox6" value="option6" checked="checked" type="checkbox" data-spy="iCheck">
  </label>
  <label>
    <input class="icheckbox-success icheckbox-lg icheckbox-bg-gray" name="checkbox6" value="option6" checked="checked" type="checkbox" data-spy="iCheck">
  </label>
  <label>
    <input class="icheckbox-info icheckbox-lg icheckbox-bg-gray" name="checkbox6" value="option6" checked="checked" type="checkbox" data-spy="iCheck">
  </label>
  <label>
    <input class="icheckbox-warning icheckbox-lg icheckbox-bg-gray" name="checkbox6" value="option6" checked="checked" type="checkbox" data-spy="iCheck">
  </label>
  <label>
    <input class="icheckbox-danger icheckbox-lg icheckbox-bg-gray" name="checkbox6" value="option6" checked="checked" type="checkbox" data-spy="iCheck">
  </label>
</div>

```html
<label>
  <input class="icheckbox-lg icheckbox-bg-gray" name="checkbox6" value="option6" type="checkbox" data-spy="iCheck">
</label>
<label>
  <input class="icheckbox-primary icheckbox-lg icheckbox-bg-gray" name="checkbox6" value="option6" checked="checked" type="checkbox" data-spy="iCheck">
</label>
<label>
  <input class="icheckbox-success icheckbox-lg icheckbox-bg-gray" name="checkbox6" value="option6" checked="checked" type="checkbox" data-spy="iCheck">
</label>
<label>
  <input class="icheckbox-info icheckbox-lg icheckbox-bg-gray" name="checkbox6" value="option6" checked="checked" type="checkbox" data-spy="iCheck">
</label>
<label>
  <input class="icheckbox-warning icheckbox-lg icheckbox-bg-gray" name="checkbox6" value="option6" checked="checked" type="checkbox" data-spy="iCheck">
</label>
<label>
  <input class="icheckbox-danger icheckbox-lg icheckbox-bg-gray" name="checkbox6" value="option6" checked="checked" type="checkbox" data-spy="iCheck">
</label>
```

##### 禁用状态

iCheck 插件会自动响应复选框的 `disabled` （禁用）属性。

<div class="example-box example-box-icheck">
  <div class="checkbox">
    <label>
      <input id="checkbox9" type="checkbox" disabled="disabled" data-spy="iCheck">
      Can't check this
    </label>
  </div>
  <div class="checkbox">
    <label>
      <input id="checkbox10" type="checkbox" disabled="disabled" checked="checked" data-spy="iCheck">
      This too
    </label>
  </div>
  <div class="checkbox">
    <label>
      <input class="icheckbox-success" id="checkbox11" type="checkbox" disabled="disabled" checked="checked" data-spy="iCheck">
      And this
    </label>
  </div>
  <div class="checkbox">
    <label>
      <input class="icheckbox-lg" type="checkbox" disabled="disabled" checked="checked" data-spy="iCheck">
      Disabled & Bigger
    </label>
  </div>
  <div class="checkbox">
    <label>
      <input class="icheckbox-success icheckbox-lg" id="checkbox12" type="checkbox" disabled="disabled" checked="checked" data-spy="iCheck">
      Disabled & !Default & Bigger
    </label>
  </div>
</div>

```html
<div class="checkbox">
  <label>
    <input id="checkbox9" type="checkbox" disabled="disabled" data-spy="iCheck">
    Can't check this
  </label>
</div>
<div class="checkbox">
  <label>
    <input id="checkbox10" type="checkbox" disabled="disabled" checked="checked" data-spy="iCheck">
    This too
  </label>
</div>
<div class="checkbox">
  <label>
    <input class="icheckbox-success" id="checkbox11" type="checkbox" disabled="disabled" checked="checked" data-spy="iCheck">
    And this
  </label>
</div>
<div class="checkbox">
  <label>
    <input class="icheckbox-lg" type="checkbox" disabled="disabled" checked="checked" data-spy="iCheck">
    Disabled & Bigger
  </label>
</div>
<div class="checkbox">
  <label>
    <input class="icheckbox-success icheckbox-lg" id="checkbox12" type="checkbox" disabled="disabled" checked="checked" data-spy="iCheck">
    Disabled & !Default & Bigger
  </label>
</div>
```

#### 单选按钮实例

##### 基本效果

Supports bootstrap brand colors: `.iradio-primary`, `.iradio-danger` etc.

<div class="example-box example-box-icheck">
  <div class="radio">
    <label>
      <input name="radio1" id="radio1" value="option1" checked="checked" type="radio" data-spy="iCheck">
      Default
    </label>
  </div>
  <div class="radio">
    <label>
      <input class="iradio-success" name="radio1" id="radio2" value="option2" type="radio" data-spy="iCheck">
      Success
    </label>
  </div>
  <div class="radio">
    <label>
      <input class="iradio-info" name="radio1" id="radio3" value="option3" type="radio" data-spy="iCheck">
      Info
    </label>
  </div>
  <div class="radio">
    <label>
      <input class="iradio-warning" name="radio1" id="radio4" value="option3" type="radio" data-spy="iCheck">
      Warning
    </label>
  </div>
  <div class="radio">
    <label>
      <input class="iradio-danger" name="radio1" id="radio5" value="option3" type="radio" data-spy="iCheck">
      Danger
    </label>
  </div>
</div>

```html
<div class="radio">
  <label>
    <input name="radio1" id="radio1" value="option1" checked="checked" type="radio" data-spy="iCheck">
    Default
  </label>
</div>
<div class="radio">
  <label>
    <input class="iradio-success" name="radio1" id="radio2" value="option2" type="radio" data-spy="iCheck">
    Success
  </label>
</div>
<div class="radio">
  <label>
    <input class="iradio-info" name="radio1" id="radio3" value="option3" type="radio" data-spy="iCheck">
    Info
  </label>
</div>
<div class="radio">
  <label>
    <input class="iradio-warning" name="radio1" id="radio4" value="option3" type="radio" data-spy="iCheck">
    Warning
  </label>
</div>
<div class="radio">
  <label>
    <input class="iradio-danger" name="radio1" id="radio5" value="option3" type="radio" data-spy="iCheck">
    Danger
  </label>
</div>
```

Radios without label text

<div class="example-box example-box-icheck">
  <div class="radio">
    <label>
      <input id="singleRadio1" type="radio" value="option1" name="radioSingle1" aria-label="Single radio One" data-spy="iCheck">
    </label>
  </div>
  <div class="radio">
    <label>
      <input class="iradio-success" id="singleRadio2" type="radio" value="option2" name="radioSingle1" checked="checked" aria-label="Single radio Two" data-spy="iCheck">
    </label>
  </div>
</div>

```html
<div class="radio">
  <label>
    <input id="singleRadio1" type="radio" value="option1" name="radioSingle1" aria-label="Single radio One" data-spy="iCheck">
  </label>
</div>
<div class="radio">
  <label>
    <input class="iradio-success" id="singleRadio2" type="radio" value="option2" name="radioSingle1" checked="checked" aria-label="Single radio Two" data-spy="iCheck">
  </label>
</div>
```

Inline radios

<div class="example-box example-box-icheck">
  <label class="radio-inline">
    <input class="iradio-info" id="inlineRadio1" name="radioInline" type="radio" value="option1" checked="checked" data-spy="iCheck"> Inline One
  </label>
  <label class="radio-inline">
    <input id="inlineRadio2" name="radioInline" value="option2" type="radio" data-spy="iCheck"> Inline Two
  </label>
</div>

```html
<label class="radio-inline">
  <input class="iradio-info" id="inlineRadio1" name="radioInline" type="radio" value="option1" checked="checked" data-spy="iCheck"> Inline One
</label>
<label class="radio-inline">
  <input id="inlineRadio2" name="radioInline" value="option2" type="radio" data-spy="iCheck"> Inline Two
</label>
```

##### 更大尺寸的单选按钮

`.iradio-lg` for bigger radio.

<div class="example-box example-box-icheck">
  <div class="radio">
    <label>
      <input class="iradio-lg" name="radio2" value="option1" checked="checked" type="radio" data-spy="iCheck">
      Default & Bigger
    </label>
  </div>
  <div class="radio">
    <label>
      <input class="iradio-success iradio-lg" name="radio2" value="option2" type="radio" data-spy="iCheck">
      Success & Bigger
    </label>
  </div>
  <div class="radio">
    <label>
      <input class="iradio-info iradio-lg" name="radio2" value="option3" type="radio" data-spy="iCheck">
      Info & Bigger
    </label>
  </div>
  <div class="radio">
    <label>
      <input class="iradio-warning iradio-lg" name="radio2" value="option3" type="radio" data-spy="iCheck">
      Warning & Bigger
    </label>
  </div>
  <div class="radio">
    <label>
      <input class="iradio-danger iradio-lg" name="radio2" value="option3" type="radio" data-spy="iCheck">
      Danger & Bigger
    </label>
  </div>
</div>

```html
<div class="radio">
  <label>
    <input class="iradio-lg" name="radio2" value="option1" checked="checked" type="radio" data-spy="iCheck">
    Default & Bigger
  </label>
</div>
<div class="radio">
  <label>
    <input class="iradio-success iradio-lg" name="radio2" value="option2" type="radio" data-spy="iCheck">
    Success & Bigger
  </label>
</div>
<div class="radio">
  <label>
    <input class="iradio-info iradio-lg" name="radio2" value="option3" type="radio" data-spy="iCheck">
    Info & Bigger
  </label>
</div>
<div class="radio">
  <label>
    <input class="iradio-warning iradio-lg" name="radio2" value="option3" type="radio" data-spy="iCheck">
    Warning & Bigger
  </label>
</div>
<div class="radio">
  <label>
    <input class="iradio-danger iradio-lg" name="radio2" value="option3" type="radio" data-spy="iCheck">
    Danger & Bigger
  </label>
</div>
```

##### 方形单选按钮

`.iradio-checkbox` for squareness.

<div class="example-box example-box-icheck">
  <div class="radio">
    <label>
      <input class="iradio-lg iradio-checkbox" name="radio7" value="option7" checked="checked" type="radio" data-spy="iCheck">
      Simply Squared
    </label>
  </div>
  <div class="radio">
    <label>
      <input class="iradio-primary iradio-lg iradio-checkbox" name="radio7" value="option7" type="radio" data-spy="iCheck">
      Me too
    </label>
  </div>
</div>

```html
<div class="radio">
  <label>
    <input class="iradio-lg iradio-checkbox" name="radio7" value="option7" checked="checked" type="radio" data-spy="iCheck">
    Simply Squared
  </label>
</div>
<div class="radio">
  <label>
    <input class="iradio-primary iradio-lg iradio-checkbox" name="radio7" value="option7" type="radio" data-spy="iCheck">
    Me too
  </label>
</div>
```

##### 灰色背景

`.iradio-bg-gray` for gray background.

<div class="example-box example-box-icheck">
  <label>
    <input class="iradio-lg iradio-bg-gray" name="radio6" value="option6" checked="checked" type="radio" data-spy="iCheck">
  </label>
  <label>
    <input class="iradio-primary iradio-lg iradio-bg-gray" name="radio6" value="option6" type="radio" data-spy="iCheck">
  </label>
  <label>
    <input class="iradio-success iradio-lg iradio-bg-gray" name="radio6" value="option6" type="radio" data-spy="iCheck">
  </label>
  <label>
    <input class="iradio-info iradio-lg iradio-bg-gray" name="radio6" value="option6" type="radio" data-spy="iCheck">
  </label>
  <label>
    <input class="iradio-warning iradio-lg iradio-bg-gray" name="radio6" value="option6" type="radio" data-spy="iCheck">
  </label>
  <label>
    <input class="iradio-danger iradio-lg iradio-bg-gray" name="radio6" value="option6" type="radio" data-spy="iCheck">
  </label>
</div>

```html
<label>
  <input class="iradio-lg iradio-bg-gray" name="radio6" value="option6" checked="checked" type="radio" data-spy="iCheck">
</label>
<label>
  <input class="iradio-primary iradio-lg iradio-bg-gray" name="radio6" value="option6" type="radio" data-spy="iCheck">
</label>
<label>
  <input class="iradio-success iradio-lg iradio-bg-gray" name="radio6" value="option6" type="radio" data-spy="iCheck">
</label>
<label>
  <input class="iradio-info iradio-lg iradio-bg-gray" name="radio6" value="option6" type="radio" data-spy="iCheck">
</label>
<label>
  <input class="iradio-warning iradio-lg iradio-bg-gray" name="radio6" value="option6" type="radio" data-spy="iCheck">
</label>
<label>
  <input class="iradio-danger iradio-lg iradio-bg-gray" name="radio6" value="option6" type="radio" data-spy="iCheck">
</label>
```

##### 禁用状态

iCheck 插件会自动响应单选按钮的 `disabled` （禁用）属性。

<div class="example-box example-box-icheck">
  <div class="radio">
    <label>
      <input name="radio3" value="option1" disabled="disabled" type="radio" data-spy="iCheck">
      Next
    </label>
  </div>
  <div class="radio">
    <label>
      <input name="radio3" value="option2" checked="checked" disabled="disabled" type="radio" data-spy="iCheck">
      One
    </label>
  </div>
  <div class="radio">
    <label>
      <input class="iradio-lg" name="radio3" value="option1" disabled="disabled" type="radio" data-spy="iCheck">
      Next & Bigger
    </label>
  </div>
  <div class="radio">
    <label>
      <input class="iradio-lg" name="radio3" value="option2" checked="checked" disabled="disabled" type="radio" data-spy="iCheck">
      One & Bigger
    </label>
  </div>
</div>

```html
<div class="radio">
  <label>
    <input name="radio3" value="option1" disabled="disabled" type="radio" data-spy="iCheck">
    Next
  </label>
</div>
<div class="radio">
  <label>
    <input name="radio3" value="option2" checked="checked" disabled="disabled" type="radio" data-spy="iCheck">
    One
  </label>
</div>
<div class="radio">
  <label>
    <input class="iradio-lg" name="radio3" value="option1" disabled="disabled" type="radio" data-spy="iCheck">
    Next & Bigger
  </label>
</div>
<div class="radio">
  <label>
    <input class="iradio-lg" name="radio3" value="option2" checked="checked" disabled="disabled" type="radio" data-spy="iCheck">
    One & Bigger
  </label>
</div>
```

#### 用法

##### 通过 data 属性调用

通过上面例子我们可以知道，添加属性 `data-spy="iCheck"`，页面加载后会自动调用插件。

另外还可以通过添加 `data-opt-*` 形式的属性的方式设置其他配置项。

<div class="example-box example-box-icheck">
  <label>
    <input name="radio4" value="option4" checked="checked" type="radio" data-spy="iCheck">
  </label>
  <label>
    <input name="radio4" value="option4" type="radio" data-spy="iCheck" data-opt-radioclass="iradio-primary">
  </label>
  <label>
    <input name="radio4" value="option4" type="radio" data-spy="iCheck" data-opt-radioclass="iradio-success">
  </label>
  <label>
    <input name="radio4" value="option4" type="radio" data-spy="iCheck" data-opt-radioclass="iradio-info">
  </label>
  <label>
    <input name="radio4" value="option4" type="radio" data-spy="iCheck" data-opt-radioclass="iradio-warning">
  </label>
  <label>
    <input name="radio4" value="option4" type="radio" data-spy="iCheck" data-opt-radioclass="iradio-danger">
  </label>
</div>

```html
<label>
  <input name="radio4" value="option4" checked="checked" type="radio" data-spy="iCheck">
</label>
<label>
  <input name="radio4" value="option4" type="radio" data-spy="iCheck" data-opt-radioclass="iradio-primary">
</label>
<label>
  <input name="radio4" value="option4" type="radio" data-spy="iCheck" data-opt-radioclass="iradio-success">
</label>
<label>
  <input name="radio4" value="option4" type="radio" data-spy="iCheck" data-opt-radioclass="iradio-info">
</label>
<label>
  <input name="radio4" value="option4" type="radio" data-spy="iCheck" data-opt-radioclass="iradio-warning">
</label>
<label>
  <input name="radio4" value="option4" type="radio" data-spy="iCheck" data-opt-radioclass="iradio-danger">
</label>
```

##### 通过 JavaScript 调用

可以通过 JavaScript 调用 iCheck 插件。

```javascript
// JavaScript
$('input[type="checkbox"], input[type="radio"]').iCheck({
    checkboxClass: "icheckbox-primary icheckbox-lg",
    radioClass: "iradio-primary iradio-lg"
});
```

#### 方法

##### `.iCheck("destroy")`

移除复选框或单选按钮的美化效果。

#### 参数

调用 iCheck 插件时可以使用以下参数配置项：

* <mark>checkboxClass</mark>：base class added to customized checkboxes. base on "icheckbox".

* <mark>radioClass</mark>：base class added to customized radios. base on "iradio".

## YFjs对象

<p class="lead">
  YFjs 组件库创建了一个全局对象 `YFjs` （模块 ID 为 `yfjs`）来完成辅助模块加载和初始化一些浏览器的响应内容的工作，同时，提供了一些您可能用得到的属性和方法。
</p>

### 属性

#### 判断浏览器版本

jQuery 1.9.1 版本已移除了 `$.browser` 对象，而推荐使用 `$.support` 根据功能特性来判断浏览器的支持情况。如果您仍想获取浏览器版本，可以通过 YFjs 对象的 `browser` 属性来获取当前浏览器的版本。

<figure id="example-box-yfjs-browser">
  <pre><code class="json" data-lang="json"></code></pre>
</figure>

#### 其他属性

* <mark>bCache</mark>: 布尔类型值，是否开启了全局缓存

* <mark>bDebug</mark>: 布尔类型值，是否开启了调试

* <mark>bDebugCss</mark>: 布尔类型值，是否开启了基本样式调试

* <mark>bDebugModule</mark>: 布尔类型值，是否开启了模块调试

* <mark>bBaseCss</mark>: 布尔类型值，是否引入基本样式

* <mark>bCompatible</mark>: 布尔类型值，是否自动检测并引入兼容脚本

* <mark>bCompatibleModernizr</mark>: 布尔类型值，是否引入 Modernizr 兼容脚本

* <mark>bCompatibleRespond</mark>: 布尔类型值，是否引入 respond 兼容脚本

* <mark>bCompatibleHtml5</mark>: 布尔类型值，是否引入 html5shiv 兼容脚本

* <mark>bCompatibleES5</mark>: 布尔类型值，是否引入 es5 兼容脚本

* <mark>bCompatibleES6</mark>: 布尔类型值，是否引入 es6 兼容脚本

* <mark>bCompatibleJSON</mark>: 布尔类型值，是否引入 JSON 兼容脚本

* <mark>baseUrl</mark>: 字符串类型值，应用基路径

* <mark>baseMd</mark>: 字符串类型值，组件库模块基路径

* <mark>baseRq</mark>: 字符串类型值，自定义模块基路径

### 方法

#### ready()

定义 YFjs 核心库准备好后的回调方法。

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
      yfjsScript.setAttribute('src', "[yfjs-lib path]/yfjs.js?v=0.8.1");
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
