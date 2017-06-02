# 全局CSS样式

设置全局 CSS 样式。包含 Bootstrap 3 的栅格系统；辅助类、表单、表格、按钮、图片、响应式工具类等全局样式。

## 概览

<p class="lead">
  深入了解 Bootstrap 底层结构的关键部分，包括我们让 web 开发变得更好、更快、更强壮的最佳实践。
</p>

### HTML5 文档类型

Bootstrap 使用到的某些 HTML 元素和 CSS 属性需要将页面设置为 HTML5 文档类型。在你项目中的每个页面都要参照下面的格式进行设置。

```html
<!DOCTYPE html>
<html lang="zh-CN">
  ...
</html>
```

### 移动设备优先

在 Bootstrap 2 中，Bootstrap 对框架中的某些关键部分增加了对移动设备友好的样式。而在 Bootstrap 3 中，Bootstrap 重写了整个框架，使其一开始就是对移动设备友好的。这次不是简单的增加一些可选的针对移动设备的样式，而是直接融合进了框架的内核中。也就是说，**Bootstrap 是移动设备优先的**。针对移动设备的样式融合进了框架的每个角落，而不是增加一个额外的文件。

为了确保适当的绘制和触屏缩放，需要在 `<head>` 之中 **添加 viewport 元数据标签**。

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

在移动设备浏览器上，通过为视口（viewport）设置 meta 属性为 `user-scalable=no` 可以禁用其缩放（zooming）功能。这样禁用缩放功能后，用户只能滚动屏幕，就能让你的网站看上去更像原生应用的感觉。注意，这种方式我们并不推荐所有网站使用，还是要看你自己的情况而定！

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```

### 排版与链接

Bootstrap 排版、链接样式设置了基本的全局样式。分别是：

* 为 `body` 元素设置 `background-color: #fff;``
* 使用 `@font-family-base`、`@font-size-base` 和 `@line-height-base` 变量作为排版的基本参数
* 为所有链接设置了基本颜色 `@link-color` ，并且当链接处于 `:hover` 状态时才添加下划线
* 这些样式都能在 `scaffolding.less` 文件中找到对应的源码。

### Normalize.css

为了增强跨浏览器表现的一致性，我们使用了 [Normalize.css](http://necolas.github.io/normalize.css/)，这是由 [Nicolas Gallagher](https://twitter.com/necolas) 和 [Jonathan Neal](https://twitter.com/jon_neal) 维护的一个CSS 重置样式库。

### 布局容器

Bootstrap 需要为页面内容和栅格系统包裹一个 `.container` 容器。我们提供了两个作此用处的类。注意，由于 `padding` 等属性的原因，这两种容器类不能互相嵌套。

`.container` 类用于固定宽度并支持响应式布局的容器。

```html
<div class="container">
  ...
</div>
```

`.container-fluid` 类用于 100% 宽度，占据全部视口（viewport）的容器。

```html
<div class="container-fluid">
  ...
</div>
```

## 栅格系统

<p class="lead">
  Bootstrap 提供了一套响应式、移动设备优先的流式栅格系统，随着屏幕或视口（viewport）尺寸的增加，系统会自动分为最多12列。它包含了易于使用的 [预定义类](#t0-1-3_实例：从堆叠到水平排列)，还有强大的 [mixin 用于生成更具语义的布局](#t0-1-12_Less+mixin+和变量)。
</p>

### 简介

栅格系统用于通过一系列的行（row）与列（column）的组合来创建页面布局，你的内容就可以放入这些创建好的布局中。下面就介绍一下 Bootstrap 栅格系统的工作原理：

* “行（row）”必须包含在 `.container` （固定宽度）或 `.container-fluid` （100% 宽度）中，以便为其赋予合适的排列（aligment）和内补（padding）。

* 通过“行（row）”在水平方向创建一组“列（column）”。

* 你的内容应当放置于“列（column）”内，并且，只有“列（column）”可以作为行（row）”的直接子元素。

* 类似 `.row` 和 `.col-xs-4` 这种预定义的类，可以用来快速创建栅格布局。Bootstrap 源码中定义的 mixin 也可以用来创建语义化的布局。

* 通过为“列（column）”设置 `padding` 属性，从而创建列与列之间的间隔（gutter）。通过为 `.row` 元素设置负值 `margin` 从而抵消掉为 `.container` 元素设置的 `padding`，也就间接为“行（row）”所包含的“列（column）”抵消掉了 `padding`。

* 负值的 margin 就是下面的示例为什么是向外突出的原因。在栅格列中的内容排成一行。
* 栅格系统中的列是通过指定1到12的值来表示其跨越的范围。例如，三个等宽的列可以使用三个 `.col-xs-4` 来创建。

* 如果一“行（row）”中包含了的“列（column）”大于 12，多余的“列（column）”所在的元素将被作为一个整体另起一行排列。

* 栅格类适用于与屏幕宽度大于或等于分界点大小的设备 ， 并且针对小屏幕设备覆盖栅格类。 因此，在元素上应用任何 `.col-md-*` 栅格类适用于与屏幕宽度大于或等于分界点大小的设备 ， 并且针对小屏幕设备覆盖栅格类。 因此，在元素上应用任何 `.col-lg-*` 不存在， 也影响大屏幕设备。

通过研究后面的实例，可以将这些原理应用到你的代码中。

### 媒体查询

在栅格系统中，我们在 Less 文件中使用以下媒体查询（media query）来创建关键的分界点阈值。

```scss
/* 超小屏幕（手机，小于 768px） */
/* 没有任何媒体查询相关的代码，因为这在 Bootstrap 中是默认的（还记得 Bootstrap 是移动设备优先的吗？） */

/* 小屏幕（平板，大于等于 768px） */
@media (min-width: @screen-sm-min) { ... }

/* 中等屏幕（桌面显示器，大于等于 992px） */
@media (min-width: @screen-md-min) { ... }

/* 大屏幕（大桌面显示器，大于等于 1200px） */
@media (min-width: @screen-lg-min) { ... }
```

我们偶尔也会在媒体查询代码中包含 `max-width` 从而将 CSS 的影响限制在更小范围的屏幕大小之内。

```scss
@media (max-width: @screen-xs-max) { ... }
@media (min-width: @screen-sm-min) and (max-width: @screen-sm-max) { ... }
@media (min-width: @screen-md-min) and (max-width: @screen-md-max) { ... }
@media (min-width: @screen-lg-min) { ... }
```

### 栅格参数

通过下表可以详细查看 Bootstrap 的栅格系统是如何在多种屏幕设备上工作的。

<table class="table table-bordered table-striped">
  <thead>
  <tr>
    <th></th>
    <th>
      超小屏幕
      <small>手机 (&lt;768px)</small>
    </th>
    <th>
      小屏幕
      <small>平板 (≥768px)</small>
    </th>
    <th>
      中等屏幕
      <small>桌面显示器 (≥992px)</small>
    </th>
    <th>
      大屏幕
      <small>大桌面显示器 (≥1200px)</small>
    </th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <th class="text-nowrap" scope="row">栅格系统行为</th>
    <td>总是水平排列</td>
    <td colspan="3">开始是堆叠在一起的，当大于这些阈值时将变为水平排列C</td>
  </tr>
  <tr>
    <th class="text-nowrap" scope="row">`.container` 最大宽度</th>
    <td>None （自动）</td>
    <td>750px</td>
    <td>970px</td>
    <td>1170px</td>
  </tr>
  <tr>
    <th class="text-nowrap" scope="row">类前缀</th>
    <td>`.col-xs-`</td>
    <td>`.col-sm-`</td>
    <td>`.col-md-`</td>
    <td>`.col-lg-`</td>
  </tr>
  <tr>
    <th class="text-nowrap" scope="row">列（column）数</th>
    <td colspan="4">12</td>
  </tr>
  <tr>
    <th class="text-nowrap" scope="row">最大列（column）宽</th>
    <td class="text-muted">自动</td>
    <td>~62px</td>
    <td>~81px</td>
    <td>~97px</td>
  </tr>
  <tr>
    <th class="text-nowrap" scope="row">槽（gutter）宽</th>
    <td colspan="4">30px （每列左右均有 15px）</td>
  </tr>
  <tr>
    <th class="text-nowrap" scope="row">可嵌套</th>
    <td colspan="4">是</td>
  </tr>
  <tr>
    <th class="text-nowrap" scope="row">偏移（Offsets）</th>
    <td colspan="4">是</td>
  </tr>
  <tr>
    <th class="text-nowrap" scope="row">列排序</th>
    <td colspan="4">是</td>
  </tr>
  </tbody>
</table>

### 实例：从堆叠到水平排列

使用单一的一组 `.col-md-*` 栅格类，就可以创建一个基本的栅格系统，在手机和平板设备上一开始是堆叠在一起的（超小屏幕到小屏幕这一范围），在桌面（中等）屏幕设备上变为水平排列。所有“列（column）必须放在 `.row` 内。

<div class="row show-grid">
  <div class="col-md-1 text-nowrap">.col-md-1</div>
  <div class="col-md-1 text-nowrap">.col-md-1</div>
  <div class="col-md-1 text-nowrap">.col-md-1</div>
  <div class="col-md-1 text-nowrap">.col-md-1</div>
  <div class="col-md-1 text-nowrap">.col-md-1</div>
  <div class="col-md-1 text-nowrap">.col-md-1</div>
  <div class="col-md-1 text-nowrap">.col-md-1</div>
  <div class="col-md-1 text-nowrap">.col-md-1</div>
  <div class="col-md-1 text-nowrap">.col-md-1</div>
  <div class="col-md-1 text-nowrap">.col-md-1</div>
  <div class="col-md-1 text-nowrap">.col-md-1</div>
  <div class="col-md-1 text-nowrap">.col-md-1</div>
</div>
<div class="row show-grid">
  <div class="col-md-8">.col-md-8</div>
  <div class="col-md-4">.col-md-4</div>
</div>
<div class="row show-grid">
  <div class="col-md-4">.col-md-4</div>
  <div class="col-md-4">.col-md-4</div>
  <div class="col-md-4">.col-md-4</div>
</div>
<div class="row show-grid">
  <div class="col-md-6">.col-md-6</div>
  <div class="col-md-6">.col-md-6</div>
</div>

```html
<div class="row">
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
  <div class="col-md-1">.col-md-1</div>
</div>
<div class="row">
  <div class="col-md-8">.col-md-8</div>
  <div class="col-md-4">.col-md-4</div>
</div>
<div class="row">
  <div class="col-md-4">.col-md-4</div>
  <div class="col-md-4">.col-md-4</div>
  <div class="col-md-4">.col-md-4</div>
</div>
<div class="row">
  <div class="col-md-6">.col-md-6</div>
  <div class="col-md-6">.col-md-6</div>
</div>
```

### 实例：流式布局容器

将最外面的布局元素 `.container` 修改为 `.container-fluid`，就可以将固定宽度的栅格布局转换为 100% 宽度的布局。

```html
<div class="container-fluid">
  <div class="row">
    ...
  </div>
</div>
```

### 实例：移动设备和桌面屏幕

是否不希望在小屏幕设备上所有列都堆叠在一起？那就使用针对超小屏幕和中等屏幕设备所定义的类吧，即 `.col-xs-*` 和 `.col-md-*`。请看下面的实例，研究一下这些是如何工作的。

<div class="row show-grid">
  <div class="col-xs-12 col-md-8">.col-xs-12 .col-md-8</div>
  <div class="col-xs-6 col-md-4">.col-xs-6 .col-md-4</div>
</div>
<div class="row show-grid">
  <div class="col-xs-6 col-md-4">.col-xs-6 .col-md-4</div>
  <div class="col-xs-6 col-md-4">.col-xs-6 .col-md-4</div>
  <div class="col-xs-6 col-md-4">.col-xs-6 .col-md-4</div>
</div>
<div class="row show-grid">
  <div class="col-xs-6">.col-xs-6</div>
  <div class="col-xs-6">.col-xs-6</div>
</div>

```html
<!-- Stack the columns on mobile by making one full-width and the other half-width -->
<div class="row">
  <div class="col-xs-12 col-md-8">.col-xs-12 .col-md-8</div>
  <div class="col-xs-6 col-md-4">.col-xs-6 .col-md-4</div>
</div>

<!-- Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop -->
<div class="row">
  <div class="col-xs-6 col-md-4">.col-xs-6 .col-md-4</div>
  <div class="col-xs-6 col-md-4">.col-xs-6 .col-md-4</div>
  <div class="col-xs-6 col-md-4">.col-xs-6 .col-md-4</div>
</div>

<!-- Columns are always 50% wide, on mobile and desktop -->
<div class="row">
  <div class="col-xs-6">.col-xs-6</div>
  <div class="col-xs-6">.col-xs-6</div>
</div>
```

### 实例：手机、平板、桌面

在上面案例的基础上，通过使用针对平板设备的 `.col-sm-*` 类，我们来创建更加动态和强大的布局吧。

<div class="row show-grid">
  <div class="col-xs-12 col-sm-6 col-md-8">.col-xs-12 .col-sm-6 .col-md-8</div>
  <div class="col-xs-6 col-md-4">.col-xs-6 .col-md-4</div>
</div>
<div class="row show-grid">
  <div class="col-xs-6 col-sm-4">.col-xs-6 .col-sm-4</div>
  <div class="col-xs-6 col-sm-4">.col-xs-6 .col-sm-4</div>
  <!-- Optional: clear the XS cols if their content doesn't match in height -->
  <div class="clearfix visible-xs-block"></div>
  <div class="col-xs-6 col-sm-4">.col-xs-6 .col-sm-4</div>
</div>

```html
<div class="row">
  <div class="col-xs-12 col-sm-6 col-md-8">.col-xs-12 .col-sm-6 .col-md-8</div>
  <div class="col-xs-6 col-md-4">.col-xs-6 .col-md-4</div>
</div>
<div class="row">
  <div class="col-xs-6 col-sm-4">.col-xs-6 .col-sm-4</div>
  <div class="col-xs-6 col-sm-4">.col-xs-6 .col-sm-4</div>
  <!-- Optional: clear the XS cols if their content doesn't match in height -->
  <div class="clearfix visible-xs-block"></div>
  <div class="col-xs-6 col-sm-4">.col-xs-6 .col-sm-4</div>
</div>
```

### 实例：多余的列（column）将另起一行排列

如果在一个 `.row` 内包含的列（column）大于12个，包含多余列（column）的元素将作为一个整体单元被另起一行排列。

<div class="row show-grid">
  <div class="col-xs-9">.col-xs-9</div>
  <div class="col-xs-4">.col-xs-4<br>Since 9 + 4 = 13 > 12, this 4-column-wide div gets wrapped onto a new line as one contiguous unit.</div>
  <div class="col-xs-6">.col-xs-6<br>Subsequent columns continue along the new line.</div>
</div>

```html
<div class="row">
  <div class="col-xs-9">.col-xs-9</div>
  <div class="col-xs-4">.col-xs-4<br>Since 9 + 4 = 13 > 12, this 4-column-wide div gets wrapped onto a new line as one contiguous unit.</div>
  <div class="col-xs-6">.col-xs-6<br>Subsequent columns continue along the new line.</div>
</div>
```

### 响应式列重置

即便有上面给出的四组栅格class，你也不免会碰到一些问题，例如，在某些阈值时，某些列可能会出现比别的列高的情况。为了克服这一问题，建议联合使用 `.clearfix` 和 [响应式工具类](#t0-9_响应式工具)。

<div class="row show-grid">
  <div class="col-xs-6 col-sm-3">
    .col-xs-6 .col-sm-3
    <br>
    Resize your viewport or check it out on your phone for an example.
  </div>
  <div class="col-xs-6 col-sm-3">.col-xs-6 .col-sm-3</div>
  <!-- Add the extra clearfix for only the required viewport -->
  <div class="clearfix visible-xs-block"></div>
  <div class="col-xs-6 col-sm-3">.col-xs-6 .col-sm-3</div>
  <div class="col-xs-6 col-sm-3">.col-xs-6 .col-sm-3</div>
</div>

```html
<div class="row">
  <div class="col-xs-6 col-sm-3">.col-xs-6 .col-sm-3</div>
  <div class="col-xs-6 col-sm-3">.col-xs-6 .col-sm-3</div>

  <!-- Add the extra clearfix for only the required viewport -->
  <div class="clearfix visible-xs-block"></div>

  <div class="col-xs-6 col-sm-3">.col-xs-6 .col-sm-3</div>
  <div class="col-xs-6 col-sm-3">.col-xs-6 .col-sm-3</div>
</div>
```

除了列在分界点清除响应， 您可能需要 **重置偏移, 后推或前拉某个列**。请看此 [栅格实例](http://v3.bootcss.com/examples/grid/)。

```html
<div class="row">
  <div class="col-sm-5 col-md-6">.col-sm-5 .col-md-6</div>
  <div class="col-sm-5 col-sm-offset-2 col-md-6 col-md-offset-0">.col-sm-5 .col-sm-offset-2 .col-md-6 .col-md-offset-0</div>
</div>

<div class="row">
  <div class="col-sm-6 col-md-5 col-lg-6">.col-sm-6 .col-md-5 .col-lg-6</div>
  <div class="col-sm-6 col-md-5 col-md-offset-2 col-lg-6 col-lg-offset-0">.col-sm-6 .col-md-5 .col-md-offset-2 .col-lg-6 .col-lg-offset-0</div>
</div>
```

### 列偏移

使用 `.col-md-offset-*` 类可以将列向右侧偏移。这些类实际是通过使用 * 选择器为当前元素增加了左侧的边距（margin）。例如，`.col-md-offset-4` 类将 `.col-md-4` 元素向右侧偏移了4个列（column）的宽度。

<div class="row show-grid">
  <div class="col-md-4">.col-md-4</div>
  <div class="col-md-4 col-md-offset-4">.col-md-4 .col-md-offset-4</div>
</div>
<div class="row show-grid">
  <div class="col-md-3 col-md-offset-3">.col-md-3 .col-md-offset-3</div>
  <div class="col-md-3 col-md-offset-3">.col-md-3 .col-md-offset-3</div>
</div>
<div class="row show-grid">
  <div class="col-md-6 col-md-offset-3">.col-md-6 .col-md-offset-3</div>
</div>

```html
<div class="row">
  <div class="col-md-4">.col-md-4</div>
  <div class="col-md-4 col-md-offset-4">.col-md-4 .col-md-offset-4</div>
</div>
<div class="row">
  <div class="col-md-3 col-md-offset-3">.col-md-3 .col-md-offset-3</div>
  <div class="col-md-3 col-md-offset-3">.col-md-3 .col-md-offset-3</div>
</div>
<div class="row">
  <div class="col-md-6 col-md-offset-3">.col-md-6 .col-md-offset-3</div>
</div>
```

您也可以通过使用 `.col-*-offset-0` 类在更小的屏幕设备上重设列偏移。

```html
<div class="row">
  <div class="col-xs-6 col-sm-4">
  </div>
  <div class="col-xs-6 col-sm-4">
  </div>
  <div class="col-xs-6 col-xs-offset-3 col-sm-4 col-sm-offset-0">
  </div>
</div>
```

### 嵌套列

为了使用内置的栅格系统将内容再次嵌套，可以通过添加一个新的 `.row` 元素和一系列 `.col-sm-*` 元素到已经存在的 `.col-sm-*` 元素内。被嵌套的行（row）所包含的列（column）的个数不能超过12（其实，没有要求你必须占满12列）。

<div class="row show-grid">
  <div class="col-sm-9">
    Level 1: .col-sm-9
    <div class="row show-grid">
      <div class="col-xs-8 col-sm-6">
        Level 2: .col-xs-8 .col-sm-6
      </div>
      <div class="col-xs-4 col-sm-6">
        Level 2: .col-xs-4 .col-sm-6
      </div>
    </div>
  </div>
</div>

```html
<div class="row">
  <div class="col-sm-9">
    Level 1: .col-sm-9
    <div class="row">
      <div class="col-xs-8 col-sm-6">
        Level 2: .col-xs-8 .col-sm-6
      </div>
      <div class="col-xs-4 col-sm-6">
        Level 2: .col-xs-4 .col-sm-6
      </div>
    </div>
  </div>
</div>
```

### 列排序

通过使用 `.col-md-push-*` 和 `.col-md-pull-*` 类就可以很容易的改变列（column）的顺序。

<div class="row show-grid">
  <div class="col-md-9 col-md-push-3">.col-md-9 .col-md-push-3</div>
  <div class="col-md-3 col-md-pull-9">.col-md-3 .col-md-pull-9</div>
</div>

```html
<div class="row">
  <div class="col-md-9 col-md-push-3">.col-md-9 .col-md-push-3</div>
  <div class="col-md-3 col-md-pull-9">.col-md-3 .col-md-pull-9</div>
</div>
```

### Less mixin 和变量

除了用于快速布局的 [预定义栅格类](#t0-1-3_实例：从堆叠到水平排列)，Bootstrap 还包含了一组 Less 变量和 mixin 用于帮你生成简单、语义化的布局。

#### 变量

通过变量来定义列数、槽（gutter）宽、媒体查询阈值（用于确定合适让列浮动）。我们使用这些变量生成预定义的栅格类，如上所示，还有如下所示的定制 mixin。

```scss
@grid-columns:              12;
@grid-gutter-width:         30px;
@grid-float-breakpoint:     768px;
```

#### mixin

mixin 用来和栅格变量一同使用，为每个列（column）生成语义化的 CSS 代码。

```scss
// Creates a wrapper for a series of columns
.make-row(@gutter: @grid-gutter-width) {
  // Then clear the floated columns
  .clearfix();

  @media (min-width: @screen-sm-min) {
    margin-left:  (@gutter / -2);
    margin-right: (@gutter / -2);
  }

  // Negative margin nested rows out to align the content of columns
  .row {
    margin-left:  (@gutter / -2);
    margin-right: (@gutter / -2);
  }
}

// Generate the extra small columns
.make-xs-column(@columns; @gutter: @grid-gutter-width) {
  position: relative;
  // Prevent columns from collapsing when empty
  min-height: 1px;
  // Inner gutter via padding
  padding-left:  (@gutter / 2);
  padding-right: (@gutter / 2);

  // Calculate width based on number of columns available
  @media (min-width: @grid-float-breakpoint) {
    float: left;
    width: percentage((@columns / @grid-columns));
  }
}

// Generate the small columns
.make-sm-column(@columns; @gutter: @grid-gutter-width) {
  position: relative;
  // Prevent columns from collapsing when empty
  min-height: 1px;
  // Inner gutter via padding
  padding-left:  (@gutter / 2);
  padding-right: (@gutter / 2);

  // Calculate width based on number of columns available
  @media (min-width: @screen-sm-min) {
    float: left;
    width: percentage((@columns / @grid-columns));
  }
}

// Generate the small column offsets
.make-sm-column-offset(@columns) {
  @media (min-width: @screen-sm-min) {
    margin-left: percentage((@columns / @grid-columns));
  }
}
.make-sm-column-push(@columns) {
  @media (min-width: @screen-sm-min) {
    left: percentage((@columns / @grid-columns));
  }
}
.make-sm-column-pull(@columns) {
  @media (min-width: @screen-sm-min) {
    right: percentage((@columns / @grid-columns));
  }
}

// Generate the medium columns
.make-md-column(@columns; @gutter: @grid-gutter-width) {
  position: relative;
  // Prevent columns from collapsing when empty
  min-height: 1px;
  // Inner gutter via padding
  padding-left:  (@gutter / 2);
  padding-right: (@gutter / 2);

  // Calculate width based on number of columns available
  @media (min-width: @screen-md-min) {
    float: left;
    width: percentage((@columns / @grid-columns));
  }
}

// Generate the medium column offsets
.make-md-column-offset(@columns) {
  @media (min-width: @screen-md-min) {
    margin-left: percentage((@columns / @grid-columns));
  }
}
.make-md-column-push(@columns) {
  @media (min-width: @screen-md-min) {
    left: percentage((@columns / @grid-columns));
  }
}
.make-md-column-pull(@columns) {
  @media (min-width: @screen-md-min) {
    right: percentage((@columns / @grid-columns));
  }
}

// Generate the large columns
.make-lg-column(@columns; @gutter: @grid-gutter-width) {
  position: relative;
  // Prevent columns from collapsing when empty
  min-height: 1px;
  // Inner gutter via padding
  padding-left:  (@gutter / 2);
  padding-right: (@gutter / 2);

  // Calculate width based on number of columns available
  @media (min-width: @screen-lg-min) {
    float: left;
    width: percentage((@columns / @grid-columns));
  }
}

// Generate the large column offsets
.make-lg-column-offset(@columns) {
  @media (min-width: @screen-lg-min) {
    margin-left: percentage((@columns / @grid-columns));
  }
}
.make-lg-column-push(@columns) {
  @media (min-width: @screen-lg-min) {
    left: percentage((@columns / @grid-columns));
  }
}
.make-lg-column-pull(@columns) {
  @media (min-width: @screen-lg-min) {
    right: percentage((@columns / @grid-columns));
  }
}
```

## 排版

### 标题

HTML 中的所有标题标签，`<h1>` 到 `<h6>` 均可使用。另外，还提供了 `.h1` 到 `.h6` 类，为的是给内联（inline）属性的文本赋予标题的样式。

<div class="example-box example-box-type">
  <table class="table">
    <tbody>
      <tr>
        <td><h1>h1. Bootstrap heading</h1></td>
        <td class="type-info">Semibold 36px</td>
      </tr>
      <tr>
        <td><h2>h2. Bootstrap heading</h2></td>
        <td class="type-info">Semibold 30px</td>
      </tr>
      <tr>
        <td><h3>h3. Bootstrap heading</h3></td>
        <td class="type-info">Semibold 24px</td>
      </tr>
      <tr>
        <td><h4>h4. Bootstrap heading</h4></td>
        <td class="type-info">Semibold 18px</td>
      </tr>
      <tr>
        <td><h5>h5. Bootstrap heading</h5></td>
        <td class="type-info">Semibold 14px</td>
      </tr>
      <tr>
        <td><h6>h6. Bootstrap heading</h6></td>
        <td class="type-info">Semibold 12px</td>
      </tr>
    </tbody>
  </table>
</div>

```html
<h1>h1. Bootstrap heading</h1>
<h2>h2. Bootstrap heading</h2>
<h3>h3. Bootstrap heading</h3>
<h4>h4. Bootstrap heading</h4>
<h5>h5. Bootstrap heading</h5>
<h6>h6. Bootstrap heading</h6>
```

在标题内还可以包含 `<small>` 标签或赋予 `.small` 类的元素，可以用来标记副标题。

<div class="example-box example-box-type">
  <table class="table">
    <tbody>
      <tr>
        <td><h1>h1. Bootstrap heading <small>Secondary text</small></h1></td>
      </tr>
      <tr>
        <td><h2>h2. Bootstrap heading <small>Secondary text</small></h2></td>
      </tr>
      <tr>
        <td><h3>h3. Bootstrap heading <small>Secondary text</small></h3></td>
      </tr>
      <tr>
        <td><h4>h4. Bootstrap heading <small>Secondary text</small></h4></td>
      </tr>
      <tr>
        <td><h5>h5. Bootstrap heading <small>Secondary text</small></h5></td>
      </tr>
      <tr>
        <td><h6>h6. Bootstrap heading <small>Secondary text</small></h6></td>
      </tr>
    </tbody>
  </table>
</div>

```html
<h1>h1. Bootstrap heading <small>Secondary text</small></h1>
<h2>h2. Bootstrap heading <small>Secondary text</small></h2>
<h3>h3. Bootstrap heading <small>Secondary text</small></h3>
<h4>h4. Bootstrap heading <small>Secondary text</small></h4>
<h5>h5. Bootstrap heading <small>Secondary text</small></h5>
<h6>h6. Bootstrap heading <small>Secondary text</small></h6>
```

### 页面主体

Bootstrap 将全局 `font-size` 设置为 **14px**，`line-height` 设置为 **1.428**。这些属性直接赋予 &lt;body&gt; 元素和所有段落元素。另外，&lt;p&gt;（段落）元素还被设置了等于 1/2 行高（即 10px）的底部外边距（margin）。

<div class="example-box">
  <p>Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam id dolor id nibh ultricies vehicula.</p>
  <p>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec ullamcorper nulla non metus auctor fringilla. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Donec ullamcorper nulla non metus auctor fringilla.</p>
  <p>Maecenas sed diam eget risus varius blandit sit amet non magna. Donec id elit non mi porta gravida at eget metus. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>
</div>

```html
<p>...</p>
```

### 中心内容

通过添加 `.lead` 类可以让段落突出显示。

<div class="example-box">
  <p class="lead">Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus.</p>
</div>
      
```html
<p class="lead">...</p>
```

### 使用 Less 工具构建

**variables.less** 文件中定义的两个 Less 变量决定了排版尺寸：`@font-size-base` 和 `@line-height-base`。第一个变量定义了全局 font-size 基准，第二个变量是 line-height 基准。我们使用这些变量和一些简单的公式计算出其它所有页面元素的 margin、 padding 和 line-height。自定义这些变量即可改变 Bootstrap 的默认样式。

### 内联文本元素

#### Marked text

For highlighting a run of text due to its relevance in another context, use the `<mark>` tag.

<div class="example-box">
  <p>
    You can use the mark tag to <mark>highlight</mark> text.
  </p>
</div>

```html
You can use the mark tag to <mark>highlight</mark> text.
```

#### 被删除的文本

对于被删除的文本使用 `<del>` 标签。

<div class="example-box">
  <p>
    <del>This line of text is meant to be treated as deleted text.</del>
  </p>
</div>

```html
<del>This line of text is meant to be treated as deleted text.</del>
```

#### 无用文本

对于没用的文本使用 `<s>` 标签。

<div class="example-box">
  <p>
    <s>This line of text is meant to be treated as no longer accurate.</s>
  </p>
</div>

```html
<s>This line of text is meant to be treated as no longer accurate.</s>
```

#### 插入文本

额外插入的文本使用 `<ins>` 标签

<div class="example-box">
  <p>
    <ins>This line of text is meant to be treated as an addition to the document.</ins>
  </p>
</div>

```html
<ins>This line of text is meant to be treated as an addition to the document.</ins>
```

#### 带下划线的文本

为文本添加下划线，使用 `<u>` 标签

<div class="example-box">
  <p>
    <u>This line of text will render as underlined</u>
  </p>
</div>

```html
<u>This line of text will render as underlined</u>
```

#### 小号文本

对于不需要强调的inline或block类型的文本，使用 `<small>` 标签包裹，其内的文本将被设置为父容器字体大小的 85%。标题元素中嵌套的 `<small>` 元素被设置不同的 `font-size` 。

你还可以为行内元素赋予 `.small` 类以代替任何 `<small>` 元素。

<div class="example-box">
  <p>
    <small>This line of text is meant to be treated as fine print.</small>
  </p>
</div>

```html
<small>This line of text is meant to be treated as fine print.</small>
```

#### 着重

通过增加 font-weight 值强调一段文本。

<div class="example-box">
  <p>
    The following snippet of text is **rendered as bold text**.
  </p>
</div>

```html
<strong>rendered as bold text</strong>
```

#### 斜体

用斜体强调一段文本。

<div class="example-box">
  <p>
    The following snippet of text is <em>rendered as italicized text</em>.
  </p>
</div>

```html
<em>rendered as italicized text</em>
```

<div class="callout callout-info">
  <h4>Alternate elements</h4>
  <p>在 HTML5 中可以放心使用 `<b>` 和 `<i>` 标签。`<b>` 用于高亮单词或短语，不带有任何着重的意味；而 `<i>` 标签主要用于发言、技术词汇等。</p>
</div>

### 对齐

通过文本对齐类，可以简单方便的将文字重新对齐。

<div class="example-box">
  <p class="text-left">Left aligned text.</p>
  <p class="text-center">Center aligned text.</p>
  <p class="text-right">Right aligned text.</p>
  <p class="text-justify">Justified text.</p>
  <p class="text-nowrap">No wrap text.</p>
</div>

```html
<p class="text-left">Left aligned text.</p>
<p class="text-center">Center aligned text.</p>
<p class="text-right">Right aligned text.</p>
<p class="text-justify">Justified text.</p>
<p class="text-nowrap">No wrap text.</p>
```

### 改变大小写

通过这几个类可以改变文本的大小写。

<div class="example-box">
  <p class="text-lowercase">Lowercased text.</p>
  <p class="text-uppercase">Uppercased text.</p>
  <p class="text-capitalize">Capitalized text.</p>
</div>

```html
<p class="text-lowercase">Lowercased text.</p>
<p class="text-uppercase">Uppercased text.</p>
<p class="text-capitalize">Capitalized text.</p>
```

### 缩略语

当鼠标悬停在缩写和缩写词上时就会显示完整内容，Bootstrap 实现了对 HTML 的 `<abbr>` 元素的增强样式。缩略语元素带有 `title` 属性，外观表现为带有较浅的虚线框，鼠标移至上面时会变成带有“问号”的指针。如想看完整的内容可把鼠标悬停在缩略语上（对使用辅助技术的用户也可见）, 但需要包含 `title` 属性。

#### 基本缩略语

<div class="example-box">
  <p>An abbreviation of the word attribute is <abbr title="attribute">attr</abbr>.</p>
</div>

```html
<abbr title="attribute">attr</abbr>
```

#### 首字母缩略语

<div class="example-box">
  <p><abbr title="HyperText Markup Language" class="initialism">HTML</abbr> is the best thing since sliced bread.</p>
</div>

```html
<abbr title="HyperText Markup Language" class="initialism">HTML</abbr>
```

### 地址

让联系信息以最接近日常使用的格式呈现。在每行结尾添加 `<br>` 可以保留需要的样式。

<div class="example-box">
  <address>
    **Twitter, Inc.**<br>
    1355 Market Street, Suite 900<br>
    San Francisco, CA 94103<br>
    <abbr title="Phone">P:</abbr> (123) 456-7890
  </address>
  <address>
    **Full Name**<br>
    <a href="mailto:#">first.last@example.com</a>
  </address>
</div>

```html
<address>
  <strong>Twitter, Inc.</strong><br>
  1355 Market Street, Suite 900<br>
  San Francisco, CA 94103<br>
  <abbr title="Phone">P:</abbr> (123) 456-7890
</address>

<address>
  <strong>Full Name</strong><br>
  <a href="mailto:#">first.last@example.com</a>
</address>
```

### 引用

在你的文档中引用其他来源的内容。

#### 默认样式的引用

将任何 HTML 元素包裹在 `<blockquote>` 中即可表现为引用样式。对于直接引用，我们建议用 `<p>` 标签。

<div class="example-box">
  <blockquote>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
  </blockquote>
</div>

```html
<blockquote>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
</blockquote>
```

#### 多种引用样式

对于标准样式的 `<blockquote>`，可以通过几个简单的变体就能改变风格和内容。

##### 命名来源

添加 `<footer>` 用于标明引用来源。来源的名称可以包裹进 `<cite>` 标签中。

<div class="example-box">
  <blockquote>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
    <footer>Someone famous in <cite title="Source Title">Source Title</cite></footer>
  </blockquote>
</div>

```html
<blockquote>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
  <footer>Someone famous in <cite title="Source Title">Source Title</cite></footer>
</blockquote>
```

##### 另一种展示风格

通过赋予 `.blockquote-reverse` 类可以让引用呈现内容右对齐的效果。

<div class="example-box">
  <blockquote class="blockquote-reverse">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
    <footer>Someone famous in <cite title="Source Title">Source Title</cite></footer>
  </blockquote>
</div>

```html
<blockquote class="blockquote-reverse">
  ...
</blockquote>
```

### 列表

#### 无序列表

排列顺序<em>无关紧要</em>的一列元素。

<div class="example-box">
  <ul>
    <li>Lorem ipsum dolor sit amet</li>
    <li>Consectetur adipiscing elit</li>
    <li>Integer molestie lorem at massa</li>
    <li>Facilisis in pretium nisl aliquet</li>
    <li>Nulla volutpat aliquam velit
      <ul>
        <li>Phasellus iaculis neque</li>
        <li>Purus sodales ultricies</li>
        <li>Vestibulum laoreet porttitor sem</li>
        <li>Ac tristique libero volutpat at</li>
      </ul>
    </li>
    <li>Faucibus porta lacus fringilla vel</li>
    <li>Aenean sit amet erat nunc</li>
    <li>Eget porttitor lorem</li>
  </ul>
</div>

```html
<ul>
  <li>...</li>
</ul>
```

#### 有序列表

顺序<em>至关重要</em>的一组元素。

<div class="example-box">
  <ol>
    <li>Lorem ipsum dolor sit amet</li>
    <li>Consectetur adipiscing elit</li>
    <li>Integer molestie lorem at massa</li>
    <li>Facilisis in pretium nisl aliquet</li>
    <li>Nulla volutpat aliquam velit</li>
    <li>Faucibus porta lacus fringilla vel</li>
    <li>Aenean sit amet erat nunc</li>
    <li>Eget porttitor lorem</li>
  </ol>
</div>

```html
<ol>
  <li>...</li>
</ol>
```

#### 无样式列表

移除了默认的 `list-style` 样式和左侧外边距的一组元素（只针对直接子元素）。**这是针对直接子元素的**，也就是说，你需要对所有嵌套的列表都添加这个类才能具有同样的样式。

<div class="example-box">
  <ul class="list-unstyled">
    <li>Lorem ipsum dolor sit amet</li>
    <li>Consectetur adipiscing elit</li>
    <li>Integer molestie lorem at massa</li>
    <li>Facilisis in pretium nisl aliquet</li>
    <li>Nulla volutpat aliquam velit
      <ul>
        <li>Phasellus iaculis neque</li>
        <li>Purus sodales ultricies</li>
        <li>Vestibulum laoreet porttitor sem</li>
        <li>Ac tristique libero volutpat at</li>
      </ul>
    </li>
    <li>Faucibus porta lacus fringilla vel</li>
    <li>Aenean sit amet erat nunc</li>
    <li>Eget porttitor lorem</li>
  </ul>
</div>

```html
<ul class="list-unstyled">
  <li>...</li>
</ul>
```

#### 内联列表

通过设置 `display: inline-block;` 并添加少量的内补（padding），将所有元素放置于同一行。

<div class="example-box">
  <ul class="list-inline">
    <li>Lorem ipsum</li>
    <li>Phasellus iaculis</li>
    <li>Nulla volutpat</li>
  </ul>
</div>

```html
<ul class="list-inline">
  <li>...</li>
</ul>
```

### 描述

带有描述的短语列表。

<div class="example-box">
  <dl>
    <dt>Description lists</dt>
    <dd>A description list is perfect for defining terms.</dd>
    <dt>Euismod</dt>
    <dd>Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit.</dd>
    <dd>Donec id elit non mi porta gravida at eget metus.</dd>
    <dt>Malesuada porta</dt>
    <dd>Etiam porta sem malesuada magna mollis euismod.</dd>
  </dl>
</div>

```html
<dl>
  <dt>...</dt>
  <dd>...</dd>
</dl>
```

#### 水平排列的描述

`.dl-horizontal` 可以让 `<dl>` 内的短语及其描述排在一行。开始是像 `<dl>` 的默认样式堆叠在一起，随着导航条逐渐展开而排列在一行。

<div class="example-box">
  <dl class="dl-horizontal">
    <dt>Description lists</dt>
    <dd>A description list is perfect for defining terms.</dd>
    <dt>Euismod</dt>
    <dd>Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit.</dd>
    <dd>Donec id elit non mi porta gravida at eget metus.</dd>
    <dt>Malesuada porta</dt>
    <dd>Etiam porta sem malesuada magna mollis euismod.</dd>
    <dt>Felis euismod semper eget lacinia</dt>
    <dd>Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</dd>
  </dl>
</div>

```html
<dl class="dl-horizontal">
  <dt>...</dt>
  <dd>...</dd>
</dl>
```

<div class="callout callout-info">
  <h4>自动截断</h4>
  <p>通过 `text-overflow` 属性，水平排列的描述列表将会截断左侧太长的短语。在较窄的视口（viewport）内，列表将变为默认堆叠排列的布局方式。</p>
</div>

## 代码

### 内联代码

通过 `<code>` 标签包裹内联样式的代码片段。

<div class="example-box">
  For example, `<section>` should be wrapped as inline.
</div>

```html
For example, <code>&amp;lt;section&amp;gt;</code> should be wrapped as inline.
```

### 用户输入

通过 `<kbd>` 标签标记用户通过键盘输入的内容。

<div class="example-box">
  To switch directories, type <kbd>cd</kbd> followed by the name of the directory.<br>
  To edit settings, press <kbd><kbd>ctrl</kbd> + <kbd>,</kbd></kbd>
</div>

```html
To switch directories, type <kbd>cd</kbd> followed by the name of the directory.<br>
To edit settings, press <kbd><kbd>ctrl</kbd> + <kbd>,</kbd></kbd>
```

### 代码块

多行代码可以使用 `<pre>` 标签。为了正确的展示代码，注意将尖括号做转义处理。

<div class="example-box">
  <pre><p>Sample text here...</p></pre>
</div>

```html
<pre>&amp;lt;p&amp;gt;Sample text here...&amp;lt;/p&amp;gt;</pre>
```

还可以使用 `.pre-scrollable` 类，其作用是设置 max-height 为 350px ，并在垂直方向展示滚动条。

### 变量

通过 `<var>` 标签标记变量。

<div class="example-box">
  <p>
    <var>y</var> = <var>m</var><var>x</var> + <var>b</var>
  </p>
</div>

```html
<var>y</var> = <var>m</var><var>x</var> + <var>b</var>
```

### 程序输出

通过 `<samp>` 标签来标记程序输出的内容。

<div class="example-box">
  <p>
    <samp>This text is meant to be treated as sample output from a computer program.</samp>
  </p>
</div>

```html
<samp>This text is meant to be treated as sample output from a computer program.</samp>
```

## 表格

### 基本实例

为任意 `<table>` 标签添加 `.table` 类可以为其赋予基本的样式 — 少量的内补（padding）和水平方向的分隔线。这种方式看起来很多余！？但是我们觉得，表格元素使用的很广泛，如果我们为其赋予默认样式可能会影响例如日历和日期选择之类的插件，所以我们选择将此样式独立出来。

<div class="example-box">
  <table class="table">
    <caption>Optional table caption.</caption>
    <thead>
      <tr>
        <th>#</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Username</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">1</th>
        <td>Mark</td>
        <td>Otto</td>
        <td>@mdo</td>
      </tr>
      <tr>
        <th scope="row">2</th>
        <td>Jacob</td>
        <td>Thornton</td>
        <td>@fat</td>
      </tr>
      <tr>
        <th scope="row">3</th>
        <td>Larry</td>
        <td>the Bird</td>
        <td>@twitter</td>
      </tr>
    </tbody>
  </table>
</div>

```html
<table class="table">
  ...
</table>
```

### 条纹状表格

通过 `.table-striped` 类可以给 `<tbody>` 之内的每一行增加斑马条纹样式。

<div class="callout callout-danger">
  <h4>跨浏览器兼容性</h4>
  <p>条纹状表格是依赖 `:nth-child` CSS 选择器实现的，而这一功能不被 Internet Explorer 8 支持。</p>
</div>

<div class="example-box">
  <table class="table table-striped">
    <thead>
      <tr>
        <th>#</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Username</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">1</th>
        <td>Mark</td>
        <td>Otto</td>
        <td>@mdo</td>
      </tr>
      <tr>
        <th scope="row">2</th>
        <td>Jacob</td>
        <td>Thornton</td>
        <td>@fat</td>
      </tr>
      <tr>
        <th scope="row">3</th>
        <td>Larry</td>
        <td>the Bird</td>
        <td>@twitter</td>
      </tr>
    </tbody>
  </table>
</div>

```html
<table class="table table-striped">
  ...
</table>
```

### 带边框的表格

添加 `.table-bordered` 类为表格和其中的每个单元格增加边框。

<div class="example-box">
  <table class="table table-bordered">
    <thead>
      <tr>
        <th>#</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Username</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">1</th>
        <td>Mark</td>
        <td>Otto</td>
        <td>@mdo</td>
      </tr>
      <tr>
        <th scope="row">2</th>
        <td>Jacob</td>
        <td>Thornton</td>
        <td>@fat</td>
      </tr>
      <tr>
        <th scope="row">3</th>
        <td>Larry</td>
        <td>the Bird</td>
        <td>@twitter</td>
      </tr>
    </tbody>
  </table>
</div>

```html
<table class="table table-bordered">
  ...
</table>
```

### 鼠标悬停

通过添加 `.table-hover` 类可以让 `<tbody>` 中的每一行对鼠标悬停状态作出响应。

<div class="example-box">
  <table class="table table-hover">
    <thead>
      <tr>
        <th>#</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Username</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">1</th>
        <td>Mark</td>
        <td>Otto</td>
        <td>@mdo</td>
      </tr>
      <tr>
        <th scope="row">2</th>
        <td>Jacob</td>
        <td>Thornton</td>
        <td>@fat</td>
      </tr>
      <tr>
        <th scope="row">3</th>
        <td>Larry</td>
        <td>the Bird</td>
        <td>@twitter</td>
      </tr>
    </tbody>
  </table>
</div>

```html
<table class="table table-hover">
  ...
</table>
```

### 紧缩表格

通过添加 `.table-condensed` 类可以让表格更加紧凑，单元格中的内补（padding）均会减半。

<div class="example-box">
  <table class="table table-condensed">
    <thead>
      <tr>
        <th>#</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Username</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">1</th>
        <td>Mark</td>
        <td>Otto</td>
        <td>@mdo</td>
      </tr>
      <tr>
        <th scope="row">2</th>
        <td>Jacob</td>
        <td>Thornton</td>
        <td>@fat</td>
      </tr>
      <tr>
        <th scope="row">3</th>
        <td colspan="2">Larry the Bird</td>
        <td>@twitter</td>
      </tr>
    </tbody>
  </table>
</div>

```html
<table class="table table-condensed">
  ...
</table>
```

### 状态类

通过这些状态类可以为行或单元格设置颜色。

<div class="table-responsive">
  <table class="table table-bordered table-striped">
    <colgroup>
      <col class="col-xs-1">
      <col class="col-xs-7">
    </colgroup>
    <thead>
      <tr>
        <th>Class</th>
        <th>描述</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">
          `.active`
        </th>
        <td>鼠标悬停在行或单元格上时所设置的颜色</td>
      </tr>
      <tr>
        <th scope="row">
          `.success`
        </th>
        <td>标识成功或积极的动作</td>
      </tr>
      <tr>
        <th scope="row">
          `.info`
        </th>
        <td>标识普通的提示信息或动作</td>
      </tr>
      <tr>
        <th scope="row">
          `.warning`
        </th>
        <td>标识警告或需要用户注意</td>
      </tr>
      <tr>
        <th scope="row">
          `.danger`
        </th>
        <td>标识危险或潜在的带来负面影响的动作</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="example-box">
  <table class="table">
    <thead>
      <tr>
        <th>#</th>
        <th>Column heading</th>
        <th>Column heading</th>
        <th>Column heading</th>
      </tr>
    </thead>
    <tbody>
      <tr class="active">
        <th scope="row">1</th>
        <td>Column content</td>
        <td>Column content</td>
        <td>Column content</td>
      </tr>
      <tr>
        <th scope="row">2</th>
        <td>Column content</td>
        <td>Column content</td>
        <td>Column content</td>
      </tr>
      <tr class="success">
        <th scope="row">3</th>
        <td>Column content</td>
        <td>Column content</td>
        <td>Column content</td>
      </tr>
      <tr>
        <th scope="row">4</th>
        <td>Column content</td>
        <td>Column content</td>
        <td>Column content</td>
      </tr>
      <tr class="info">
        <th scope="row">5</th>
        <td>Column content</td>
        <td>Column content</td>
        <td>Column content</td>
      </tr>
      <tr>
        <th scope="row">6</th>
        <td>Column content</td>
        <td>Column content</td>
        <td>Column content</td>
      </tr>
      <tr class="warning">
        <th scope="row">7</th>
        <td>Column content</td>
        <td>Column content</td>
        <td>Column content</td>
      </tr>
      <tr>
        <th scope="row">8</th>
        <td>Column content</td>
        <td>Column content</td>
        <td>Column content</td>
      </tr>
      <tr class="danger">
        <th scope="row">9</th>
        <td>Column content</td>
        <td>Column content</td>
        <td>Column content</td>
      </tr>
    </tbody>
  </table>
</div>

```html
<!-- On rows -->
<tr class="active">...</tr>
<tr class="success">...</tr>
<tr class="warning">...</tr>
<tr class="danger">...</tr>
<tr class="info">...</tr>

<!-- On cells (`td` or `th`) -->
<tr>
  <td class="active">...</td>
  <td class="success">...</td>
  <td class="warning">...</td>
  <td class="danger">...</td>
  <td class="info">...</td>
</tr>
```

<div class="callout callout-warning">
  <h4>向使用辅助技术的用户传达用意</h4>
  <p>通过为表格中的一行或一个单元格添加颜色而赋予不同的意义只是提供了一种视觉上的表现，并不能为使用辅助技术 -- 例如屏幕阅读器 -- 浏览网页的用户提供更多信息。因此，请确保通过颜色而赋予的不同意义可以通过内容本身来表达（即在相应行或单元格中的可见的文本内容）；或者通过包含额外的方式 -- 例如应用了 `.sr-only` 类而隐藏的文本 -- 来表达出来。 </p>
</div>
 
 ### 响应式表格

将任何 `.table` 元素包裹在 `.table-responsive` 元素内，即可创建响应式表格，其会在小屏幕设备上（小于768px）水平滚动。当屏幕大于 768px 宽度时，水平滚动条消失。

<div class="callout callout-warning">
  <h4>垂直方向的内容截断</h4>
  <p>响应式表格使用了 `overflow-y: hidden` 属性，这样就能将超出表格底部和顶部的内容截断。特别是，也可以截断下拉菜单和其他第三方组件。 </p>
</div>

<div class="callout callout-warning">
  <h4>Firefox 和 `fieldset` 元素</h4>
  <p>Firefox 浏览器对 `fieldset` 元素设置了一些影响 `width` 属性的样式，导致响应式表格出现问题。可以使用下面提供的针对 Firefox 的 hack 代码解决，但是以下代码并未集成在 Bootstrap 中：</p>
  <pre><code class="css" data-lang="css">@-moz-document url-prefix() {
  fieldset { display: table-cell; }
}</code></pre>
  <p>更多信息请参考 [this Stack Overflow answer](https://stackoverflow.com/questions/17408815/fieldset-resizes-wrong-appears-to-have-unremovable-min-width-min-content/17863685#17863685).</p>
</div>

<div class="example-box">
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Table heading</th>
          <th>Table heading</th>
          <th>Table heading</th>
          <th>Table heading</th>
          <th>Table heading</th>
          <th>Table heading</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
        </tr>
        <tr>
          <th scope="row">3</th>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
        </tr>
      </tbody>
    </table>
  </div><!-- /.table-responsive -->
  <div class="table-responsive">
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>#</th>
          <th>Table heading</th>
          <th>Table heading</th>
          <th>Table heading</th>
          <th>Table heading</th>
          <th>Table heading</th>
          <th>Table heading</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
        </tr>
        <tr>
          <th scope="row">3</th>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
        </tr>
      </tbody>
    </table>
  </div><!-- /.table-responsive -->
</div>

```html
<div class="table-responsive">
  <table class="table">
    ...
  </table>
</div>
```

## 表单

### 基本实例

单独的表单控件会被自动赋予一些全局样式。所有设置了 `.form-control` 类的 `<input>`、`<textarea>` 和 `<select>` 元素都将被默认设置宽度属性为 `width: 100%;`。 将 `label` 元素和前面提到的控件包裹在 `.form-group` 中可以获得最好的排列。

<div class="example-box">
  <form>
    <div class="form-group">
      <label for="exampleInputEmail1">Email address</label>
      <input class="form-control" id="exampleInputEmail1" placeholder="Email" type="email">
    </div>
    <div class="form-group">
      <label for="exampleInputPassword1">Password</label>
      <input class="form-control" id="exampleInputPassword1" placeholder="Password" type="password">
    </div>
    <div class="form-group">
      <label for="exampleInputFile">File input</label>
      <input id="exampleInputFile" type="file">
      <p class="help-block">Example block-level help text here.</p>
    </div>
    <div class="checkbox">
      <label>
        <input type="checkbox"> Check me out
      </label>
    </div>
    <button type="submit" class="btn btn-default">Submit</button>
  </form>
</div>

```html
<form>
  <div class="form-group">
    <label for="exampleInputEmail1">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Email">
  </div>
  <div class="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
  </div>
  <div class="form-group">
    <label for="exampleInputFile">File input</label>
    <input type="file" id="exampleInputFile">
    <p class="help-block">Example block-level help text here.</p>
  </div>
  <div class="checkbox">
    <label>
      <input type="checkbox"> Check me out
    </label>
  </div>
  <button type="submit" class="btn btn-default">Submit</button>
</form>
```

<div class="callout callout-warning">
  <h4>不要将表单组合输入框组混合使用</h4>
  <p>不要将表单组直接和 [输入框组](#t1-4_输入框组) 混合使用。建议将输入框组嵌套到表单组中使用。</p>
</div>

### 内联表单

为 `<form>` 元素添加 `.form-inline` 类可使其内容左对齐并且表现为 `inline-block` 级别的控件。**只适用于视口（viewport）至少在 768px 宽度时（视口宽度再小的话就会使表单折叠）。**

<div class="callout callout-danger">
  <h4>可能需要手动设置宽度</h4>
  <p>在 Bootstrap 中，输入框和单选/多选框控件默认被设置为 `width: 100%;` 宽度。在内联表单，我们将这些元素的宽度设置为 `width: auto;`，因此，多个控件可以排列在同一行。根据你的布局需求，可能需要一些额外的定制化组件。</p>
</div>

<div class="callout callout-warning">
  <h4>一定要添加 `label` 标签</h4>
  <p>如果你没有为每个输入控件设置 `label` 标签，屏幕阅读器将无法正确识别。对于这些内联表单，你可以通过为 `label` 设置 `.sr-only` 类将其隐藏。还有一些辅助技术提供label标签的替代方案，比如 `aria-label`、`aria-labelledby` 或 `title` 属性。如果这些都不存在，屏幕阅读器可能会采取使用 `placeholder` 属性，如果存在的话，使用占位符来替代其他的标记，但要注意，这种方法是不妥当的。</p>
</div>

<div class="example-box">
  <form class="form-inline">
    <div class="form-group">
      <label for="exampleInputName2">Name</label>
      <input class="form-control" id="exampleInputName2" placeholder="Jane Doe" type="text">
    </div>
    <div class="form-group">
      <label for="exampleInputEmail2">Email</label>
      <input class="form-control" id="exampleInputEmail2" placeholder="jane.doe@example.com" type="email">
    </div>
    <button type="submit" class="btn btn-default">Send invitation</button>
  </form>
</div>

```html
<form class="form-inline">
  <div class="form-group">
    <label for="exampleInputName2">Name</label>
    <input type="text" class="form-control" id="exampleInputName2" placeholder="Jane Doe">
  </div>
  <div class="form-group">
    <label for="exampleInputEmail2">Email</label>
    <input type="email" class="form-control" id="exampleInputEmail2" placeholder="jane.doe@example.com">
  </div>
  <button type="submit" class="btn btn-default">Send invitation</button>
</form>
```

<div class="example-box">
  <form class="form-inline">
    <div class="form-group">
      <label class="sr-only" for="exampleInputEmail3">Email address</label>
      <input class="form-control" id="exampleInputEmail3" placeholder="Email" type="email">
    </div>
    <div class="form-group">
      <label class="sr-only" for="exampleInputPassword3">Password</label>
      <input class="form-control" id="exampleInputPassword3" placeholder="Password" type="password">
    </div>
    <div class="checkbox">
      <label>
        <input type="checkbox"> Remember me
      </label>
    </div>
    <button type="submit" class="btn btn-default">Sign in</button>
  </form>
</div>

```html
<form class="form-inline">
  <div class="form-group">
    <label class="sr-only" for="exampleInputEmail3">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail3" placeholder="Email">
  </div>
  <div class="form-group">
    <label class="sr-only" for="exampleInputPassword3">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword3" placeholder="Password">
  </div>
  <div class="checkbox">
    <label>
      <input type="checkbox"> Remember me
    </label>
  </div>
  <button type="submit" class="btn btn-default">Sign in</button>
</form>
```

<div class="example-box">
  <form class="form-inline">
    <div class="form-group">
      <label class="sr-only" for="exampleInputAmount">Amount (in dollars)</label>
      <div class="input-group">
        <div class="input-group-addon">$</div>
        <input class="form-control" id="exampleInputAmount" placeholder="Amount" type="text">
        <div class="input-group-addon">.00</div>
      </div>
    </div>
    <button type="submit" class="btn btn-primary">Transfer cash</button>
  </form>
</div>

```html
<form class="form-inline">
  <div class="form-group">
    <label class="sr-only" for="exampleInputAmount">Amount (in dollars)</label>
    <div class="input-group">
      <div class="input-group-addon">$</div>
      <input type="text" class="form-control" id="exampleInputAmount" placeholder="Amount">
      <div class="input-group-addon">.00</div>
    </div>
  </div>
  <button type="submit" class="btn btn-primary">Transfer cash</button>
</form>
```

### 水平排列的表单

通过为表单添加 `.form-horizontal` 类，并联合使用 Bootstrap 预置的栅格类，可以将 `label` 标签和控件组水平并排布局。这样做将改变 `.form-group` 的行为，使其表现为栅格系统中的行（row），因此就无需再额外添加 `.row` 了。

<div class="example-box">
  <form class="form-horizontal">
    <div class="form-group">
      <label for="inputEmail3" class="col-sm-2 control-label">Email</label>
      <div class="col-sm-10">
        <input class="form-control" id="inputEmail3" placeholder="Email" type="email">
      </div>
    </div>
    <div class="form-group">
      <label for="inputPassword3" class="col-sm-2 control-label">Password</label>
      <div class="col-sm-10">
        <input class="form-control" id="inputPassword3" placeholder="Password" type="password">
      </div>
    </div>
    <div class="form-group">
      <div class="col-sm-offset-2 col-sm-10">
        <div class="checkbox">
          <label>
            <input type="checkbox"> Remember me
          </label>
        </div>
      </div>
    </div>
    <div class="form-group">
      <div class="col-sm-offset-2 col-sm-10">
        <button type="submit" class="btn btn-default">Sign in</button>
      </div>
    </div>
  </form>
</div>

```html
<form class="form-horizontal">
  <div class="form-group">
    <label for="inputEmail3" class="col-sm-2 control-label">Email</label>
    <div class="col-sm-10">
      <input type="email" class="form-control" id="inputEmail3" placeholder="Email">
    </div>
  </div>
  <div class="form-group">
    <label for="inputPassword3" class="col-sm-2 control-label">Password</label>
    <div class="col-sm-10">
      <input type="password" class="form-control" id="inputPassword3" placeholder="Password">
    </div>
  </div>
  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <div class="checkbox">
        <label>
          <input type="checkbox"> Remember me
        </label>
      </div>
    </div>
  </div>
  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <button type="submit" class="btn btn-default">Sign in</button>
    </div>
  </div>
</form>
```

### 被支持的控件

表单布局实例中展示了其所支持的标准表单控件。

#### 输入框

包括大部分表单控件、文本输入域控件，还支持所有 HTML5 类型的输入控件： `text`、`password`、`datetime`、`datetime-local`、`date`、`month`、`time`、`week`、`number`、`email`、`url`、`search`、`tel` 和 `color`。

<div class="callout callout-danger">
  <h4>必须添加类型声明</h4>
  <p>只有正确设置了 `type` 属性的输入控件才能被赋予正确的样式。</p>
</div>

<div class="example-box">
  <form>
    <input class="form-control" placeholder="Text input" type="text">
  </form>
</div>

```html
<input type="text" class="form-control" placeholder="Text input">
```

<div class="callout callout-info">
  <h4>输入控件组</h4>
  <p>如需在文本输入域 `<input>` 前面或后面添加文本内容或按钮控件，请参考 [输入控件组](#t1-4_输入框组)。</p>
</div>

#### 文本域

支持多行文本的表单控件。可根据需要改变 `rows` 属性。

<div class="example-box">
  <form>
    <textarea class="form-control" rows="3" placeholder="Textarea"></textarea>
  </form>
</div>

```html
<textarea class="form-control" rows="3"></textarea>
```

#### 多选和单选框

多选框（checkbox）用于选择列表中的一个或多个选项，而单选框（radio）用于从多个选项中只选择一个。

Disabled checkboxes and radios are supported, but to provide a "not-allowed" cursor on hover of the parent `<label>`, you'll need to add the `.disabled` class to the parent `.radio`, `.radio-inline`, `.checkbox`, or `.checkbox-inline`.

##### 默认外观（堆叠在一起）

<div class="example-box">
  <form>
    <div class="checkbox">
      <label>
        <input value="" type="checkbox">
        Option one is this and that—be sure to include why it's great
      </label>
    </div>
    <div class="checkbox disabled">
      <label>
        <input value="" disabled="" type="checkbox">
        Option two is disabled
      </label>
    </div>
    <br>
    <div class="radio">
      <label>
        <input name="optionsRadios" id="optionsRadios1" value="option1" checked="" type="radio">
        Option one is this and that—be sure to include why it's great
      </label>
    </div>
    <div class="radio">
      <label>
        <input name="optionsRadios" id="optionsRadios2" value="option2" type="radio">
        Option two can be something else and selecting it will deselect option one
      </label>
    </div>
    <div class="radio disabled">
      <label>
        <input name="optionsRadios" id="optionsRadios3" value="option3" disabled="" type="radio">
        Option three is disabled
      </label>
    </div>
  </form>
</div>

```html
<div class="checkbox">
  <label>
    <input type="checkbox" value="">
    Option one is this and that&mdash;be sure to include why it's great
  </label>
</div>
<div class="checkbox disabled">
  <label>
    <input type="checkbox" value="" disabled>
    Option two is disabled
  </label>
</div>

<div class="radio">
  <label>
    <input type="radio" name="optionsRadios" id="optionsRadios1" value="option1" checked>
    Option one is this and that&mdash;be sure to include why it's great
  </label>
</div>
<div class="radio">
  <label>
    <input type="radio" name="optionsRadios" id="optionsRadios2" value="option2">
    Option two can be something else and selecting it will deselect option one
  </label>
</div>
<div class="radio disabled">
  <label>
    <input type="radio" name="optionsRadios" id="optionsRadios3" value="option3" disabled>
    Option three is disabled
  </label>
</div>
```

##### 内联单选和多选框

通过将 `.checkbox-inline` 或 `.radio-inline` 类应用到一系列的多选框（checkbox）或单选框（radio）控件上，可以使这些控件排列在一行。

<div class="example-box">
  <form>
    <label class="checkbox-inline">
      <input id="inlineCheckbox1" value="option1" type="checkbox"> 1
    </label>
    <label class="checkbox-inline">
      <input id="inlineCheckbox2" value="option2" type="checkbox"> 2
    </label>
    <label class="checkbox-inline">
      <input id="inlineCheckbox3" value="option3" type="checkbox"> 3
    </label>
  </form>
  <br>
  <form>
    <label class="radio-inline">
      <input name="inlineRadioOptions" id="inlineRadio1" value="option1" type="radio"> 1
    </label>
    <label class="radio-inline">
      <input name="inlineRadioOptions" id="inlineRadio2" value="option2" type="radio"> 2
    </label>
    <label class="radio-inline">
      <input name="inlineRadioOptions" id="inlineRadio3" value="option3" type="radio"> 3
    </label>
  </form>
</div>

```html
<label class="checkbox-inline">
  <input type="checkbox" id="inlineCheckbox1" value="option1"> 1
</label>
<label class="checkbox-inline">
  <input type="checkbox" id="inlineCheckbox2" value="option2"> 2
</label>
<label class="checkbox-inline">
  <input type="checkbox" id="inlineCheckbox3" value="option3"> 3
</label>

<label class="radio-inline">
  <input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1"> 1
</label>
<label class="radio-inline">
  <input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2"> 2
</label>
<label class="radio-inline">
  <input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3"> 3
</label>
```

##### 不带label文本的Checkbox 和 radio

如果需要 `<label>` 内没有文字，输入框（input）正是你所期望的。 **目前只适用于非内联的 checkbox 和 radio。** 请记住，仍然需要为使用辅助技术的用户提供某种形式的 label（例如，使用 `aria-label`）。

<div class="example-box">
  <form>
    <div class="checkbox">
      <label>
        <input id="blankCheckbox" value="option1" aria-label="Checkbox without label text" type="checkbox">
      </label>
    </div>
    <div class="radio">
      <label>
        <input name="blankRadio" id="blankRadio1" value="option1" aria-label="Radio button without label text" type="radio">
      </label>
    </div>
  </form>
</div>

```html
<div class="checkbox">
  <label>
    <input type="checkbox" id="blankCheckbox" value="option1" aria-label="...">
  </label>
</div>
<div class="radio">
  <label>
    <input type="radio" name="blankRadio" id="blankRadio1" value="option1" aria-label="...">
  </label>
</div>
```

#### 下拉列表（select）

注意，很多原生选择菜单 - 即在 Safari 和 Chrome 中 - 的圆角是无法通过修改 `border-radius` 属性来改变的。

<div class="example-box">
  <form>
    <select class="form-control">
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
    </select>
  </form>
</div>

```html
<select class="form-control">
  <option>1</option>
  <option>2</option>
  <option>3</option>
  <option>4</option>
  <option>5</option>
</select>
```

对于标记了 `multiple` 属性的 `<select>` 控件来说，默认显示多选项。

<div class="example-box">
  <select multiple="" class="form-control">
    <option>1</option>
    <option>2</option>
    <option>3</option>
    <option>4</option>
    <option>5</option>
  </select>
</div>

```html
<select multiple class="form-control">
  <option>1</option>
  <option>2</option>
  <option>3</option>
  <option>4</option>
  <option>5</option>
</select>
```

### 静态控件

如果需要在表单中将一行纯文本和 `label` 元素放置于同一行，为 `<p>` 元素添加 `.form-control-static` 类即可。

<div class="example-box">
  <form class="form-horizontal">
    <div class="form-group">
      <label class="col-sm-2 control-label">Email</label>
      <div class="col-sm-10">
        <p class="form-control-static">email@example.com</p>
      </div>
    </div>
    <div class="form-group">
      <label for="inputPassword" class="col-sm-2 control-label">Password</label>
      <div class="col-sm-10">
        <input class="form-control" id="inputPassword" placeholder="Password" type="password">
      </div>
    </div>
  </form>
</div>

```html
<form class="form-horizontal">
  <div class="form-group">
    <label class="col-sm-2 control-label">Email</label>
    <div class="col-sm-10">
      <p class="form-control-static">email@example.com</p>
    </div>
  </div>
  <div class="form-group">
    <label for="inputPassword" class="col-sm-2 control-label">Password</label>
    <div class="col-sm-10">
      <input type="password" class="form-control" id="inputPassword" placeholder="Password">
    </div>
  </div>
</form>
```

<div class="example-box">
  <form class="form-inline">
    <div class="form-group">
      <label class="sr-only">Email</label>
      <p class="form-control-static">email@example.com</p>
    </div>
    <div class="form-group">
      <label for="inputPassword2" class="sr-only">Password</label>
      <input class="form-control" id="inputPassword2" placeholder="Password" type="password">
    </div>
    <button type="submit" class="btn btn-default">Confirm identity</button>
  </form>
</div>

```html
<form class="form-inline">
  <div class="form-group">
    <label class="sr-only">Email</label>
    <p class="form-control-static">email@example.com</p>
  </div>
  <div class="form-group">
    <label for="inputPassword2" class="sr-only">Password</label>
    <input type="password" class="form-control" id="inputPassword2" placeholder="Password">
  </div>
  <button type="submit" class="btn btn-default">Confirm identity</button>
</form>
```

### 焦点状态

我们将某些表单控件的默认 `outline` 样式移除，然后对 `:focus` 状态赋予 `box-shadow` 属性。

<div class="callout callout-info">
  <h4>演示`:focus` 状态</h4>
  <p>在本文档中，我们为上面实例中的输入框赋予了自定义的样式，用于演示 `.form-control` 元素的 `:focus` 状态。</p>
</div>

### 禁用状态

为输入框设置 `disabled` 属性可以禁止其与用户有任何交互（焦点、输入等）。被禁用的输入框颜色更浅，并且还添加了 `not-allowed` 鼠标状态。

<div class="example-box">
  <form>
    <input class="form-control" id="disabledInput" placeholder="Disabled input here…" disabled="" type="text">
  </form>
</div>

```html
<input class="form-control" id="disabledInput" type="text" placeholder="Disabled input here..." disabled>
```

#### 被禁用的 `fieldset`

为`<fieldset>` 设置 `disabled` 属性,可以禁用 `<fieldset>` 中包含的所有控件。

<div class="callout callout-warning">
  <h4>`<a>` 标签的链接功能不受影响</h4>
  <p>默认情况下，浏览器会将 `<fieldset disabled>` 内所有的原生的表单控件（`<input>`、`<select>` 和 `<button>` 元素）设置为禁用状态，防止键盘和鼠标与他们交互。然而，如果表单中还包含 `<a ... class="btn btn-*">` 元素，这些元素将只被赋予 `pointer-events: none` 属性。正如在关于 [禁用状态的按钮](#t0-6-4_禁用状态) 章节中（尤其是关于锚点元素的子章节中）所描述的那样，该 CSS 属性尚不规范，并且在 Opera 18 及更低版本的浏览器或 Internet Explorer 11 总没有得到全面支持，并且不会阻止键盘用户能够获取焦点或激活这些链接。所以为了安全起见，建议使用自定义 JavaScript 来禁用这些链接。</p>
</div>

<div class="callout callout-danger">
  <h4>跨浏览器兼容性</h4>
  <p>虽然 Bootstrap 会将这些样式应用到所有浏览器上，Internet Explorer 11 及以下浏览器中的 `<fieldset>` 元素并不完全支持 `disabled` 属性。因此建议在这些浏览器上通过 JavaScript 代码来禁用 `<fieldset>`。</p>
</div>

<div class="example-box">
  <form>
    <fieldset disabled="">
      <div class="form-group">
        <label for="disabledTextInput">Disabled input</label>
        <input id="disabledTextInput" class="form-control" placeholder="Disabled input" type="text">
      </div>
      <div class="form-group">
        <label for="disabledSelect">Disabled select menu</label>
        <select id="disabledSelect" class="form-control">
          <option>Disabled select</option>
        </select>
      </div>
      <div class="checkbox">
        <label>
          <input type="checkbox"> Can't check this
        </label>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </fieldset>
  </form>
</div>

```html
<form>
  <fieldset disabled>
    <div class="form-group">
      <label for="disabledTextInput">Disabled input</label>
      <input type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input">
    </div>
    <div class="form-group">
      <label for="disabledSelect">Disabled select menu</label>
      <select id="disabledSelect" class="form-control">
        <option>Disabled select</option>
      </select>
    </div>
    <div class="checkbox">
      <label>
        <input type="checkbox"> Can't check this
      </label>
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  </fieldset>
</form>
```

### 只读状态

为输入框设置 `readonly` 属性可以禁止用户修改输入框中的内容。处于只读状态的输入框颜色更浅（就像被禁用的输入框一样），但是仍然保留标准的鼠标状态。

<div class="example-box">
  <form>
    <input class="form-control" placeholder="Readonly input here…" readonly="" type="text">
  </form>
</div>

```html
<input class="form-control" type="text" placeholder="Readonly input here…" readonly>
```

### Help text

Block level help text for form controls.

<div class="callout callout-info">
  <h4>Associating help text with form controls</h4>
  <p>Help text should be explicitly associated with the form control it relates to using the `aria-describedby` attribute. This will ensure that assistive technologies &ndash; such as screen readers &ndash; will announce this help text when the user focuses or enters the control.</p>
</div>

<div class="example-box">
  <form>
    <div class="form-group">
      <label for="inputHelpBlock">Input with help text</label>
      <input id="inputHelpBlock" class="form-control" aria-describedby="helpBlock" type="text">
    </div>
    <span id="helpBlock" class="help-block">A block of help text that breaks onto a new line and may extend beyond one line.</span>
  </form>
</div>

```html
<label class="sr-only" for="inputHelpBlock">Input with help text</label>
<input type="text" id="inputHelpBlock" class="form-control" aria-describedby="helpBlock">
...
<span id="helpBlock" class="help-block">A block of help text that breaks onto a new line and may extend beyond one line.</span>
```

### 校验状态

Bootstrap 对表单控件的校验状态，如 error、warning 和 success 状态，都定义了样式。使用时，添加 `.has-warning`、`.has-error` 或 `.has-success` 类到这些控件的父元素即可。任何包含在此元素之内的 `.control-label`、`.form-control` 和 `.help-block` 元素都将接受这些校验状态的样式。

<div class="callout callout-warning">
  <h4>将验证状态传达给辅助设备和盲人用户</h4>
  <p>使用这些校验样式只是为表单控件提供一个可视的、基于色彩的提示，但是并不能将这种提示信息传达给使用辅助设备的用户 - 例如屏幕阅读器 - 或者色盲用户。</p>
  <p>为了确保所有用户都能获取正确信息，Bootstrap 还提供了另一种提示方式。例如，你可以在表单控件的 `<label>` 标签上以文本的形式显示提示信息（就像下面代码中所展示的）；包含一个 [Glyphicon 字体图标](#t1-0_Glyphicons+字体图标) （还有赋予 `.sr-only` 类的文本信息 - 参考 [Glyphicon 字体图标实例](#t1-0-2_实例)）；或者提供一个额外的 [辅助信息](#t0-5-8_Help+text) 块。另外，对于使用辅助设备的用户，无效的表单控件还可以赋予一个 `aria-invalid="true"` 属性。</p>
</div>

<div class="example-box">
  <form>
    <div class="form-group has-success">
      <label class="control-label" for="inputSuccess1">Input with success</label>
      <input class="form-control" id="inputSuccess1" aria-describedby="helpBlock2" type="text">
      <span id="helpBlock2" class="help-block">A block of help text that breaks onto a new line and may extend beyond one line.</span>
    </div>
    <div class="form-group has-warning">
      <label class="control-label" for="inputWarning1">Input with warning</label>
      <input class="form-control" id="inputWarning1" type="text">
    </div>
    <div class="form-group has-error">
      <label class="control-label" for="inputError1">Input with error</label>
      <input class="form-control" id="inputError1" type="text">
    </div>
    <div class="has-success">
      <div class="checkbox">
        <label>
          <input id="checkboxSuccess" value="option1" type="checkbox">
          Checkbox with success
        </label>
      </div>
    </div>
    <div class="has-warning">
      <div class="checkbox">
        <label>
          <input id="checkboxWarning" value="option1" type="checkbox">
          Checkbox with warning
        </label>
      </div>
    </div>
    <div class="has-error">
      <div class="checkbox">
        <label>
          <input id="checkboxError" value="option1" type="checkbox">
          Checkbox with error
        </label>
      </div>
    </div>
  </form>
</div>

```html
<div class="form-group has-success">
  <label class="control-label" for="inputSuccess1">Input with success</label>
  <input type="text" class="form-control" id="inputSuccess1" aria-describedby="helpBlock2">
  <span id="helpBlock2" class="help-block">A block of help text that breaks onto a new line and may extend beyond one line.</span>
</div>
<div class="form-group has-warning">
  <label class="control-label" for="inputWarning1">Input with warning</label>
  <input type="text" class="form-control" id="inputWarning1">
</div>
<div class="form-group has-error">
  <label class="control-label" for="inputError1">Input with error</label>
  <input type="text" class="form-control" id="inputError1">
</div>
<div class="has-success">
  <div class="checkbox">
    <label>
      <input type="checkbox" id="checkboxSuccess" value="option1">
      Checkbox with success
    </label>
  </div>
</div>
<div class="has-warning">
  <div class="checkbox">
    <label>
      <input type="checkbox" id="checkboxWarning" value="option1">
      Checkbox with warning
    </label>
  </div>
</div>
<div class="has-error">
  <div class="checkbox">
    <label>
      <input type="checkbox" id="checkboxError" value="option1">
      Checkbox with error
    </label>
  </div>
</div>
```

#### 添加额外的图标

你还可以针对校验状态为输入框添加额外的图标。只需设置相应的 `.has-feedback` 类并添加正确的图标即可。

<strong class="text-danger">反馈图标（feedback icon）只能使用在文本输入框 `<input class="form-control">` 元素上。</strong>

<div class="callout callout-warning">
  <h4>图标、`label`  和输入控件组</h4>
  <p>对于不带有 `label` 标签的输入框以及右侧带有附加组件的 [输入框组](#t1-4_输入框组)，需要手动为其图标定位。为了让所有用户都能访问你的网站，我们强烈建议为所有输入框添加 `label` 标签。如果你不希望将 `label` 标签展示出来，可以通过添加 `.sr-only` 类来实现。如果的确不能添加 `label` 标签，请调整图标的 `top` 值。对于输入框组，请根据你的实际情况调整 `right` 值。</p>
</div>

<div class="callout callout-warning">
  <h4>向辅助技术设备传递图标的含义</h4>
  <p>为了确保辅助技术- 如屏幕阅读器 - 正确传达一个图标的含义，额外的隐藏的文本应包含在 `.sr-only` 类中，并明确关联使用了 `aria-describedby` 的表单控件。或者，以某些其他形式（例如，文本输入字段有一个特定的警告信息）传达含义，例如改变与表单控件实际相关联的 `<label>` 的文本。</p>
  <p>虽然下面的例子已经提到各自表单控件本身的 `<label>` 文本的验证状态，上述技术（使用 `.sr-only` 文本 和 `aria-describedby`) ）已经包括了需要说明的目的。</p>
</div>

<div class="example-box">
  <form>
    <div class="form-group has-success has-feedback">
      <label class="control-label" for="inputSuccess2">Input with success</label>
      <input class="form-control" id="inputSuccess2" aria-describedby="inputSuccess2Status" type="text">
      <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
      <span id="inputSuccess2Status" class="sr-only">(success)</span>
    </div>
    <div class="form-group has-warning has-feedback">
      <label class="control-label" for="inputWarning2">Input with warning</label>
      <input class="form-control" id="inputWarning2" aria-describedby="inputWarning2Status" type="text">
      <span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true"></span>
      <span id="inputWarning2Status" class="sr-only">(warning)</span>
    </div>
    <div class="form-group has-error has-feedback">
      <label class="control-label" for="inputError2">Input with error</label>
      <input class="form-control" id="inputError2" aria-describedby="inputError2Status" type="text">
      <span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
      <span id="inputError2Status" class="sr-only">(error)</span>
    </div>
    <div class="form-group has-success has-feedback">
      <label class="control-label" for="inputGroupSuccess1">Input group with success</label>
      <div class="input-group">
        <span class="input-group-addon">@</span>
        <input class="form-control" id="inputGroupSuccess1" aria-describedby="inputGroupSuccess1Status" type="text">
      </div>
      <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
      <span id="inputGroupSuccess1Status" class="sr-only">(success)</span>
    </div>
  </form>
</div>

```html
<div class="form-group has-success has-feedback">
  <label class="control-label" for="inputSuccess2">Input with success</label>
  <input type="text" class="form-control" id="inputSuccess2" aria-describedby="inputSuccess2Status">
  <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
  <span id="inputSuccess2Status" class="sr-only">(success)</span>
</div>
<div class="form-group has-warning has-feedback">
  <label class="control-label" for="inputWarning2">Input with warning</label>
  <input type="text" class="form-control" id="inputWarning2" aria-describedby="inputWarning2Status">
  <span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true"></span>
  <span id="inputWarning2Status" class="sr-only">(warning)</span>
</div>
<div class="form-group has-error has-feedback">
  <label class="control-label" for="inputError2">Input with error</label>
  <input type="text" class="form-control" id="inputError2" aria-describedby="inputError2Status">
  <span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
  <span id="inputError2Status" class="sr-only">(error)</span>
</div>
<div class="form-group has-success has-feedback">
  <label class="control-label" for="inputGroupSuccess1">Input group with success</label>
  <div class="input-group">
    <span class="input-group-addon">@</span>
    <input type="text" class="form-control" id="inputGroupSuccess1" aria-describedby="inputGroupSuccess1Status">
  </div>
  <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
  <span id="inputGroupSuccess1Status" class="sr-only">(success)</span>
</div>
```

##### 为水平排列的表单和内联表单设置可选的图标

<div class="example-box">
  <form class="form-horizontal">
    <div class="form-group has-success has-feedback">
      <label class="control-label col-sm-3" for="inputSuccess3">Input with success</label>
      <div class="col-sm-9">
        <input class="form-control" id="inputSuccess3" aria-describedby="inputSuccess3Status" type="text">
        <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
        <span id="inputSuccess3Status" class="sr-only">(success)</span>
      </div>
    </div>
    <div class="form-group has-success has-feedback">
      <label class="control-label col-sm-3" for="inputGroupSuccess2">Input group with success</label>
      <div class="col-sm-9">
        <div class="input-group">
          <span class="input-group-addon">@</span>
          <input class="form-control" id="inputGroupSuccess2" aria-describedby="inputGroupSuccess2Status" type="text">
        </div>
        <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
        <span id="inputGroupSuccess2Status" class="sr-only">(success)</span>
      </div>
    </div>
  </form>
</div>

```html
<form class="form-horizontal">
  <div class="form-group has-success has-feedback">
    <label class="control-label col-sm-3" for="inputSuccess3">Input with success</label>
    <div class="col-sm-9">
      <input type="text" class="form-control" id="inputSuccess3" aria-describedby="inputSuccess3Status">
      <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
      <span id="inputSuccess3Status" class="sr-only">(success)</span>
    </div>
  </div>
  <div class="form-group has-success has-feedback">
    <label class="control-label col-sm-3" for="inputGroupSuccess2">Input group with success</label>
    <div class="col-sm-9">
      <div class="input-group">
        <span class="input-group-addon">@</span>
        <input type="text" class="form-control" id="inputGroupSuccess2" aria-describedby="inputGroupSuccess2Status">
      </div>
      <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
      <span id="inputGroupSuccess2Status" class="sr-only">(success)</span>
    </div>
  </div>
</form>
```

<div class="example-box">
  <form class="form-inline">
    <div class="form-group has-success has-feedback">
      <label class="control-label" for="inputSuccess4">Input with success</label>
      <input class="form-control" id="inputSuccess4" aria-describedby="inputSuccess4Status" type="text">
      <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
      <span id="inputSuccess4Status" class="sr-only">(success)</span>
    </div>
  </form>
  <br>
  <form class="form-inline">
    <div class="form-group has-success has-feedback">
      <label class="control-label" for="inputGroupSuccess3">Input group with success</label>
      <div class="input-group">
        <span class="input-group-addon">@</span>
        <input class="form-control" id="inputGroupSuccess3" aria-describedby="inputGroupSuccess3Status" type="text">
      </div>
      <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
      <span id="inputGroupSuccess3Status" class="sr-only">(success)</span>
    </div>
  </form>
</div>

```html
<form class="form-inline">
  <div class="form-group has-success has-feedback">
    <label class="control-label" for="inputSuccess4">Input with success</label>
    <input type="text" class="form-control" id="inputSuccess4" aria-describedby="inputSuccess4Status">
    <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
    <span id="inputSuccess4Status" class="sr-only">(success)</span>
  </div>
</form>
<form class="form-inline">
  <div class="form-group has-success has-feedback">
    <label class="control-label" for="inputGroupSuccess3">Input group with success</label>
    <div class="input-group">
      <span class="input-group-addon">@</span>
      <input type="text" class="form-control" id="inputGroupSuccess3" aria-describedby="inputGroupSuccess3Status">
    </div>
    <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
    <span id="inputGroupSuccess3Status" class="sr-only">(success)</span>
  </div>
</form>
```

##### 可选的图标与设置 `.sr-only` 类的 `label`

如果你使用 `.sr-only` 类来隐藏表单控件的 `<label>` （而不是使用其它标签选项，如 `aria-label` 属性）， 一旦它被添加，Bootstrap 会自动调整图标的位置。

<div class="example-box">
  <div class="form-group has-success has-feedback">
    <label class="control-label sr-only" for="inputSuccess5">Hidden label</label>
    <input class="form-control" id="inputSuccess5" aria-describedby="inputSuccess5Status" type="text">
    <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
    <span id="inputSuccess5Status" class="sr-only">(success)</span>
  </div>
  <div class="form-group has-success has-feedback">
    <label class="control-label sr-only" for="inputGroupSuccess4">Input group with success</label>
    <div class="input-group">
      <span class="input-group-addon">@</span>
      <input class="form-control" id="inputGroupSuccess4" aria-describedby="inputGroupSuccess4Status" type="text">
    </div>
    <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
    <span id="inputGroupSuccess4Status" class="sr-only">(success)</span>
  </div>
</div>

```html
<div class="form-group has-success has-feedback">
  <label class="control-label sr-only" for="inputSuccess5">Hidden label</label>
  <input type="text" class="form-control" id="inputSuccess5" aria-describedby="inputSuccess5Status">
  <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
  <span id="inputSuccess5Status" class="sr-only">(success)</span>
</div>
<div class="form-group has-success has-feedback">
  <label class="control-label sr-only" for="inputGroupSuccess4">Input group with success</label>
  <div class="input-group">
    <span class="input-group-addon">@</span>
    <input type="text" class="form-control" id="inputGroupSuccess4" aria-describedby="inputGroupSuccess4Status">
  </div>
  <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
  <span id="inputGroupSuccess4Status" class="sr-only">(success)</span>
</div>
```

### 控件尺寸

通过 `.input-lg` 类似的类可以为控件设置高度，通过 `.col-lg-*` 类似的类可以为控件设置宽度。

#### 高度尺寸

创建大一些或小一些的表单控件以匹配按钮尺寸。

<div class="example-box example-box-control-sizing">
  <form>
    <div class="controls">
      <input class="form-control input-lg" placeholder=".input-lg" type="text">
      <input class="form-control" placeholder="Default input" type="text">
      <input class="form-control input-sm" placeholder=".input-sm" type="text">

      <select class="form-control input-lg">
        <option value="">.input-lg</option>
      </select>
      <select class="form-control">
        <option value="">Default select</option>
      </select>
      <select class="form-control input-sm">
        <option value="">.input-sm</option>
      </select>
    </div>
  </form>
</div>

```html
<input class="form-control input-lg" type="text" placeholder=".input-lg">
<input class="form-control" type="text" placeholder="Default input">
<input class="form-control input-sm" type="text" placeholder=".input-sm">

<select class="form-control input-lg">...</select>
<select class="form-control">...</select>
<select class="form-control input-sm">...</select>
```

#### 水平排列的表单组的尺寸

通过添加 `.form-group-lg` 或 `.form-group-sm` 类，为 `.form-horizontal` 包裹的 `label` 元素和表单控件快速设置尺寸。

<div class="example-box">
  <form class="form-horizontal">
    <div class="form-group form-group-lg">
      <label class="col-sm-2 control-label" for="formGroupInputLarge">Large label</label>
      <div class="col-sm-10">
        <input class="form-control" id="formGroupInputLarge" placeholder="Large input" type="text">
      </div>
    </div>
    <div class="form-group form-group-sm">
      <label class="col-sm-2 control-label" for="formGroupInputSmall">Small label</label>
      <div class="col-sm-10">
        <input class="form-control" id="formGroupInputSmall" placeholder="Small input" type="text">
      </div>
    </div>
  </form>
</div>

```html
<form class="form-horizontal">
  <div class="form-group form-group-lg">
    <label class="col-sm-2 control-label" for="formGroupInputLarge">Large label</label>
    <div class="col-sm-10">
      <input class="form-control" type="text" id="formGroupInputLarge" placeholder="Large input">
    </div>
  </div>
  <div class="form-group form-group-sm">
    <label class="col-sm-2 control-label" for="formGroupInputSmall">Small label</label>
    <div class="col-sm-10">
      <input class="form-control" type="text" id="formGroupInputSmall" placeholder="Small input">
    </div>
  </div>
</form>
```

#### 调整列（column）尺寸

用栅格系统中的列（column）包裹输入框或其任何父元素，都可很容易的为其设置宽度。

<div class="example-box">
  <form>
    <div class="row">
      <div class="col-xs-2">
        <input class="form-control" placeholder=".col-xs-2" type="text">
      </div>
      <div class="col-xs-3">
        <input class="form-control" placeholder=".col-xs-3" type="text">
      </div>
      <div class="col-xs-4">
        <input class="form-control" placeholder=".col-xs-4" type="text">
      </div>
    </div>
  </form>
</div>

```html
<div class="row">
  <div class="col-xs-2">
    <input type="text" class="form-control" placeholder=".col-xs-2">
  </div>
  <div class="col-xs-3">
    <input type="text" class="form-control" placeholder=".col-xs-3">
  </div>
  <div class="col-xs-4">
    <input type="text" class="form-control" placeholder=".col-xs-4">
  </div>
</div>
```

## 按钮

### 可作为按钮使用的标签或元素

为 `<a>`、`<button>` 或 `<input>` 元素添加按钮类（button class）即可使用 Bootstrap 提供的样式。

<form class="example-box">
  <a class="btn btn-default" href="#" role="button">Link</a>
  <button class="btn btn-default" type="submit">Button</button>
  <input class="btn btn-default" value="Input" type="button">
  <input class="btn btn-default" value="Submit" type="submit">
</form>

```html
<a class="btn btn-default" href="#" role="button">Link</a>
<button class="btn btn-default" type="submit">Button</button>
<input class="btn btn-default" type="button" value="Input">
<input class="btn btn-default" type="submit" value="Submit">
```

<div class="callout callout-warning">
  <h4>针对组件的注意事项</h4>
  <p>虽然按钮类可以应用到 `<a>` 和 `<button>` 元素上，但是，导航和导航条组件只支持 `<button>` 元素。</p>
</div>

<div class="callout callout-warning">
  <h4>链接被作为按钮使用时的注意事项</h4>
  <p>如果 `<a>` 元素被作为按钮使用 -- 并用于在当前页面触发某些功能 -- 而不是用于链接其他页面或链接当前页面中的其他部分，那么，务必为其设置 `role="button"` 属性。</p>
</div>

<div class="callout callout-warning">
  <h4>跨浏览器展现</h4>
  <p>我们总结的最佳实践是：**强烈建议尽可能使用 `<button>` 元素**来获得在各个浏览器上获得相匹配的绘制效果。</p>
  <p>另外，我们还发现了 [Firefox 30 版本的浏览器上出现的一个 bug](https://bugzilla.mozilla.org/show_bug.cgi?id=697451)，其表现是：阻止我们为基于 `<input>` 元素所创建的按钮设置 `line-height` 属性，这就导致在 Firefox 浏览器上不能完全和其他按钮保持一致的高度。</p>
</div>

### 预定义样式

使用下面列出的类可以快速创建一个带有预定义样式的按钮。

<div class="example-box">
  <button type="button" class="btn btn-default">（默认样式）Default</button>
  <button type="button" class="btn btn-primary">（首选项）Primary</button>
  <button type="button" class="btn btn-success">（成功）Success</button>
  <button type="button" class="btn btn-info">（一般信息）Info</button>
  <button type="button" class="btn btn-warning">（警告）Warning</button>
  <button type="button" class="btn btn-danger">（危险）Danger</button>
  <button type="button" class="btn btn-link">（链接）Link</button>
</div>

```html
<!-- Standard button -->
<button type="button" class="btn btn-default">（默认样式）Default</button>

<!-- Provides extra visual weight and identifies the primary action in a set of buttons -->
<button type="button" class="btn btn-primary">（首选项）Primary</button>

<!-- Indicates a successful or positive action -->
<button type="button" class="btn btn-success">（成功）Success</button>

<!-- Contextual button for informational alert messages -->
<button type="button" class="btn btn-info">（一般信息）Info</button>

<!-- Indicates caution should be taken with this action -->
<button type="button" class="btn btn-warning">（警告）Warning</button>

<!-- Indicates a dangerous or potentially negative action -->
<button type="button" class="btn btn-danger">（危险）Danger</button>

<!-- Deemphasize a button by making it look like a link while maintaining button behavior -->
<button type="button" class="btn btn-link">（链接）Link</button>
```

<div class="callout callout-warning">
  <h4>Conveying meaning to assistive technologies</h4>
  <p>为按钮添加不同的颜色只是一种视觉上的信息表达方式，但是，对于使用辅助技术 -- 例如屏幕阅读器 -- 的用户来说，颜色是不可见的。建议，确保通过颜色表达的信息或者通过内容自身表达出来（按钮上的文字），或者通过其他方式 -- 例如通过 `.sr-only` 类隐藏的额外文本 -- 表达出来。</p>
</div>

### 尺寸

需要让按钮具有不同尺寸吗？使用 `.btn-lg`、`.btn-sm` 或 `.btn-xs` 就可以获得不同尺寸的按钮。

<div class="example-box">
  <p>
    <button type="button" class="btn btn-primary btn-lg">（大按钮）Large button</button>
    <button type="button" class="btn btn-default btn-lg">（大按钮）Large button</button>
  </p>
  <p>
    <button type="button" class="btn btn-primary">（默认尺寸）Default button</button>
    <button type="button" class="btn btn-default">（默认尺寸）Default button</button>
  </p>
  <p>
    <button type="button" class="btn btn-primary btn-sm">（小按钮）Small button</button>
    <button type="button" class="btn btn-default btn-sm">（小按钮）Small button</button>
  </p>
  <p>
    <button type="button" class="btn btn-primary btn-xs">（超小尺寸）Extra small button</button>
    <button type="button" class="btn btn-default btn-xs">（超小尺寸）Extra small button</button>
  </p>
</div>

```html
<p>
  <button type="button" class="btn btn-primary btn-lg">（大按钮）Large button</button>
  <button type="button" class="btn btn-default btn-lg">（大按钮）Large button</button>
</p>
<p>
  <button type="button" class="btn btn-primary">（默认尺寸）Default button</button>
  <button type="button" class="btn btn-default">（默认尺寸）Default button</button>
</p>
<p>
  <button type="button" class="btn btn-primary btn-sm">（小按钮）Small button</button>
  <button type="button" class="btn btn-default btn-sm">（小按钮）Small button</button>
</p>
<p>
  <button type="button" class="btn btn-primary btn-xs">（超小尺寸）Extra small button</button>
  <button type="button" class="btn btn-default btn-xs">（超小尺寸）Extra small button</button>
</p>
```

通过给按钮添加 `.btn-block` 类可以将其拉伸至父元素100%的宽度，而且按钮也变为了块级（block）元素。

<div class="example-box">
  <div class="well center-block" style="max-width: 400px;">
    <button type="button" class="btn btn-primary btn-lg btn-block">（块级元素）Block level button</button>
    <button type="button" class="btn btn-default btn-lg btn-block">（块级元素）Block level button</button>
  </div>
</div>

```html
<button type="button" class="btn btn-primary btn-lg btn-block">（块级元素）Block level button</button>
<button type="button" class="btn btn-default btn-lg btn-block">（块级元素）Block level button</button>
```

### 激活状态

当按钮处于激活状态时，其表现为被按压下去（底色更深、边框夜色更深、向内投射阴影）。对于 `<button>` 元素，是通过 `:active` 状态实现的。对于 `<a>` 元素，是通过 `.active` 类实现的。然而，你还可以将 `.active` 应用到 `<button>` 上（包含 `aria-pressed="true"` 属性)），并通过编程的方式使其处于激活状态。

#### button 元素

由于 `:active` 是伪状态，因此无需额外添加，但是在需要让其表现出同样外观的时候可以添加 `.active` 类。

<p class="example-box">
  <button type="button" class="btn btn-primary btn-lg active">Primary button</button>
  <button type="button" class="btn btn-default btn-lg active">Button</button>
</p>

```html
<button type="button" class="btn btn-primary btn-lg active">Primary button</button>
<button type="button" class="btn btn-default btn-lg active">Button</button>
```

#### 链接（`&lt;a&gt;`）元素

可以为基于 `<a>` 元素创建的按钮添加 `.active` 类。

<p class="example-box">
  <a href="#" class="btn btn-primary btn-lg active" role="button">Primary link</a>
  <a href="#" class="btn btn-default btn-lg active" role="button">Link</a>
</p>

```html
<a href="#" class="btn btn-primary btn-lg active" role="button">Primary link</a>
<a href="#" class="btn btn-default btn-lg active" role="button">Link</a>
```

### 禁用状态

通过为按钮的背景设置 `opacity` 属性就可以呈现出无法点击的效果。

#### button 元素

为 `<button>` 元素添加 `disabled` 属性，使其表现出禁用状态。

<p class="example-box">
  <button type="button" class="btn btn-primary btn-lg" disabled="disabled">Primary button</button>
  <button type="button" class="btn btn-default btn-lg" disabled="disabled">Button</button>
</p>

```html
<button type="button" class="btn btn-lg btn-primary" disabled="disabled">Primary button</button>
<button type="button" class="btn btn-default btn-lg" disabled="disabled">Button</button>
```

<div class="callout callout-danger">
  <h4>跨浏览器兼容性</h4>
  <p>如果为 `<button>` 元素添加 `disabled` 属性，Internet Explorer 9 及更低版本的浏览器将会把按钮中的文本绘制为灰色，并带有恶心的阴影，目前我们还没有解决办法。</p>
</div>

#### 链接（`&lt;a&gt;`）元素

为基于 `<a>` 元素创建的按钮添加 `.disabled` 类。

<p class="example-box">
  <a href="#" class="btn btn-primary btn-lg disabled" role="button">Primary link</a>
  <a href="#" class="btn btn-default btn-lg disabled" role="button">Link</a>
</p>

```html
<a href="#" class="btn btn-primary btn-lg disabled" role="button">Primary link</a>
<a href="#" class="btn btn-default btn-lg disabled" role="button">Link</a>
```

我们把 `.disabled` 作为工具类使用，就像 `.active` 类一样，因此不需要增加前缀。

<div class="callout callout-warning">
  <h4>链接的原始功能不受影响</h4>
  <p>上面提到的类只是通过设置 `pointer-events: none` 来禁止 `<a>` 元素作为链接的原始功能，但是，这一 CSS 属性并没有被标准化，并且 Opera 18 及更低版本的浏览器并没有完全支持这一属性，同样，Internet Explorer 11 也不支持。In addition, even in browsers that do support `pointer-events: none``, keyboard navigation remains unaffected, meaning that sighted keyboard users and users of assistive technologies will still be able to activate these links. 因此，为了安全起见，建议通过 JavaScript 代码来禁止链接的原始功能。</p>
</div>

## 图片

### 响应式图片

在 Bootstrap 版本 3 中，通过为图片添加 `.img-responsive` 类可以让图片支持响应式布局。其实质是为图片设置了 `max-width: 100%;``、 `height: auto;` 和 `display: block;` 属性，从而让图片在其父元素中更好的缩放。

如果需要让使用了 `.img-responsive` 类的图片水平居中，请使用 `.center-block` 类，不要用 `.text-center`。 [请参考助手类章节](#t0-8-5_让内容块居中) 了解更多关于 `.center-block` 的用法。

<div class="callout callout-warning">
  <h4>SVG 图像和 IE 8-10</h4>
  <p>在 Internet Explorer 8-10 中，设置为 `.img-responsive` 的 SVG 图像显示出的尺寸不匀称。为了解决这个问题，在出问题的地方添加 `width: 100% \9;` 即可。Bootstrap 并没有自动为所有图像元素设置这一属性，因为这会导致其他图像格式出现错乱。</p>
</div>

```html
<img src="..." class="img-responsive" alt="Responsive image">
```

### 图片形状

通过为 `<img>` 元素添加以下相应的类，可以让图片呈现不同的形状。

<div class="callout callout-danger">
  <h4>跨浏览器兼容性</h4>
  <p>请时刻牢记：Internet Explorer 8 不支持 CSS3 中的圆角属性。</p>
</div>

<div class="example-box">
  <img data-src="holder.js/140x140" class="img-rounded" alt="140x140" style="width: 140px; height: 140px;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDE0MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzE0MHgxNDAKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNWEzZjUxMjI3NyB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1YTNmNTEyMjc3Ij48cmVjdCB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjQzLjUiIHk9Ijc0LjgiPjE0MHgxNDA8L3RleHQ+PC9nPjwvZz48L3N2Zz4=" data-holder-rendered="true">
  <img data-src="holder.js/140x140" class="img-circle" alt="140x140" style="width: 140px; height: 140px;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDE0MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzE0MHgxNDAKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNWEzZjUxM2U4ZSB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1YTNmNTEzZThlIj48cmVjdCB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjQzLjUiIHk9Ijc0LjgiPjE0MHgxNDA8L3RleHQ+PC9nPjwvZz48L3N2Zz4=" data-holder-rendered="true">
  <img data-src="holder.js/140x140" class="img-thumbnail" alt="140x140" style="width: 140px; height: 140px;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDE0MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzE0MHgxNDAKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNWEzZjUxMWZkMyB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1YTNmNTExZmQzIj48cmVjdCB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjQzLjUiIHk9Ijc0LjgiPjE0MHgxNDA8L3RleHQ+PC9nPjwvZz48L3N2Zz4=" data-holder-rendered="true">
</div>

```html
<img src="..." alt="..." class="img-rounded">
<img src="..." alt="..." class="img-circle">
<img src="..." alt="..." class="img-thumbnail">
```

## 辅助类

### 情境文本颜色

通过颜色来展示意图，Bootstrap 提供了一组工具类。这些类可以应用于链接，并且在鼠标经过时颜色可以还可以加深，就像默认的链接一样。

<div class="example-box">
  <p class="text-muted">Fusce dapibus, tellus ac cursus commodo, tortor mauris nibh.</p>
  <p class="text-primary">Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
  <p class="text-success">Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
  <p class="text-info">Maecenas sed diam eget risus varius blandit sit amet non magna.</p>
  <p class="text-warning">Etiam porta sem malesuada magna mollis euismod.</p>
  <p class="text-danger">Donec ullamcorper nulla non metus auctor fringilla.</p>
</div>

```html
<p class="text-muted">...</p>
<p class="text-primary">...</p>
<p class="text-success">...</p>
<p class="text-info">...</p>
<p class="text-warning">...</p>
<p class="text-danger">...</p>
```

<div class="callout callout-info">
  <h4>处理差异</h4>
  <p>Sometimes emphasis classes cannot be applied due to the specificity of another selector. In most cases, a sufficient workaround is to wrap your text in a `<span>` with the class.</p>
</div>

<div class="callout callout-warning">
  <h4>Conveying meaning to assistive technologies</h4>
  <p>Using color to add meaning only provides a visual indication, which will not be conveyed to users of assistive technologies &ndash; such as screen readers. Ensure that information denoted by the color is either obvious from the content itself (the contextual colors are only used to reinforce meaning that is already present in the text/markup), or is included through alternative means, such as additional text hidden with the `.sr-only` class.</p>
</div>


### 情境背景色

和情境文本颜色类一样，使用任意情境背景色类就可以设置元素的背景。链接组件在鼠标经过时颜色会加深，就像上面所讲的情境文本颜色类一样。

<div class="example-box example-box-bg-classes">
  <p class="bg-primary">Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
  <p class="bg-success">Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
  <p class="bg-info">Maecenas sed diam eget risus varius blandit sit amet non magna.</p>
  <p class="bg-warning">Etiam porta sem malesuada magna mollis euismod.</p>
  <p class="bg-danger">Donec ullamcorper nulla non metus auctor fringilla.</p>
</div>

```html
<p class="bg-primary">...</p>
<p class="bg-success">...</p>
<p class="bg-info">...</p>
<p class="bg-warning">...</p>
<p class="bg-danger">...</p>
```

<div class="callout callout-info">
  <h4>处理差异</h4>
  <p>Sometimes contextual background classes cannot be applied due to the specificity of another selector. In some cases, a sufficient workaround is to wrap your element's content in a `<div>` with the class.</p>
</div>

<div class="callout callout-warning">
  <h4>Conveying meaning to assistive technologies</h4>
  <p>As with [contextual colors](#t0-8-0_情境文本颜色), ensure that any meaning conveyed through color is also conveyed in a format that is not purely presentational.</p>
</div>

### 关闭按钮

通过使用一个象征关闭的图标，可以让模态框和警告框消失。

<div class="example-box">
  <p>
    <button type="button" class="close" aria-label="Close"><span aria-hidden="true">×</span></button>
  </p>
</div>

```html
<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
```

### 三角符号

通过使用三角符号可以指示某个元素具有下拉菜单的功能。注意，[向上弹出式菜单](#t1-3-3_向上弹出式菜单) 中的三角符号是反方向的。

<div class="example-box">
  <span class="caret"></span>
</div>

```html
<span class="caret"></span>
```

### 快速浮动

通过添加一个类，可以将任意元素向左或向右浮动。``!important` 被用来明确 CSS 样式的优先级。这些类还可以作为 mixin（参见 less 文档） 使用。

```html
<div class="pull-left">...</div>
<div class="pull-right">...</div>
```

```scss
// Classes
.pull-left {
  float: left !important;
}
.pull-right {
  float: right !important;
}

// Usage as mixins
.element {
  .pull-left();
}
.another-element {
  .pull-right();
}
```

<div class="callout callout-warning">
  <h4>不能用于导航条组件中</h4>
  <p>排列导航条中的组件时可以使用这些工具类：`.navbar-left` 或 `.navbar-right` 。 [参见导航条文档](#t1-6-6_组件排列) 以获取更多信息。</p>
</div>

### 让内容块居中

为任意元素设置 `display: block` 属性并通过 `margin` 属性让其中的内容居中。下面列出的类还可以作为 mixin 使用。

```html
<div class="center-block">...</div>
```

```scss
// Class
.center-block {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

// Usage as a mixin
.element {
  .center-block();
}
```

### 清除浮动

**通过为父元素**添加 `.clearfix` 类可以很容易地清除浮动（`float`）。这里所使用的是 Nicolas Gallagher 创造的 [micro clearfix](http://nicolasgallagher.com/micro-clearfix-hack/) 方式。此类还可以作为 mixin 使用。

```html
<!-- Usage as a class -->
<div class="clearfix">...</div>
```

```scss
// Mixin itself
.clearfix() {
  &:before,
  &:after {
    content: " ";
    display: table;
  }
  &:after {
    clear: both;
  }
}

// Usage as a mixin
.element {
  .clearfix();
}
```

### 显示或隐藏内容

`.show` 和 `.hidden` 类可以强制任意元素显示或隐藏(**对于屏幕阅读器也能起效**)。这些类通过 `!important` 来避免 CSS 样式优先级问题，就像 [quick floats](#t0-8-4_快速浮动)一样的做法。注意，这些类只对块级元素起作用，另外，还可以作为 mixin 使用。

`.hide` 类仍然可用，但是它不能对屏幕阅读器起作用，并且从 v3.0.1 版本开始就**不建议使用**了。请使用 `.hidden` 或 `.sr-only` 。

另外，`.invisible` 类可以被用来仅仅影响元素的可见性，也就是说，元素的 `display` 属性不被改变，并且这个元素仍然能够影响文档流的排布。

```html
<div class="show">...</div>
<div class="hidden">...</div>
```

```scss
// Classes
.show {
  display: block !important;
}
.hidden {
  display: none !important;
}
.invisible {
  visibility: hidden;
}

// Usage as mixins
.element {
  .show();
}
.another-element {
  .hidden();
}
```

### 屏幕阅读器和键盘导航

`.sr-only` 类可以对**屏幕阅读器以外**的设备隐藏内容。`.sr-only` 和 `.sr-only-focusable` 联合使用的话可以在元素有焦点的时候再次显示出来（例如，使用键盘导航的用户）。对于遵循 [可访问性的最佳实践](http://v3.bootcss.com/getting-started/#accessibility) 很有必要。这个类也可以作为 mixin 使用。

```html
<a class="sr-only sr-only-focusable" href="#content">Skip to main content</a>
```

```scss
// Usage as a mixin
.skip-navigation {
  .sr-only();
  .sr-only-focusable();
}
```

### 图片替换

使用 `.text-hide` 类或对应的 mixin 可以用来将元素的文本内容替换为一张背景图。

```html
<h1 class="text-hide">Custom heading</h1>
```

```scss
// Usage as a mixin
.heading {
  .text-hide();
}
```

## 响应式工具

<p class="lead">
  为了加快对移动设备友好的页面开发工作，利用媒体查询功能并使用这些工具类可以方便的针对不同设备展示或隐藏页面内容。另外还包含了针对打印机显示或隐藏内容的工具类。
</p>

有针对性的使用这类工具类，从而避免为同一个网站创建完全不同的版本。相反，通过使用这些工具类可以在不同设备上提供不同的展现形式。
      </p>

### 可用的类

通过单独或联合使用以下列出的类，可以针对不同屏幕尺寸隐藏或显示页面内容。

<div class="table-responsive">
  <table class="table table-bordered table-striped responsive-utilities">
    <thead>
      <tr>
        <th></th>
        <th>
          超小屏幕
          <small>手机 (<768px)</small>
        </th>
        <th>
          小屏幕
          <small>平板 (≥768px)</small>
        </th>
        <th>
          中等屏幕
          <small>桌面 (≥992px)</small>
        </th>
        <th>
          大屏幕
          <small>桌面 (≥1200px)</small>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">`.visible-xs-*`</th>
        <td class="is-visible">可见</td>
        <td class="is-hidden">隐藏</td>
        <td class="is-hidden">隐藏</td>
        <td class="is-hidden">隐藏</td>
      </tr>
      <tr>
        <th scope="row">`.visible-sm-*`</th>
        <td class="is-hidden">隐藏</td>
        <td class="is-visible">可见</td>
        <td class="is-hidden">隐藏</td>
        <td class="is-hidden">隐藏</td>
      </tr>
      <tr>
        <th scope="row">`.visible-md-*`</th>
        <td class="is-hidden">隐藏</td>
        <td class="is-hidden">隐藏</td>
        <td class="is-visible">可见</td>
        <td class="is-hidden">隐藏</td>
      </tr>
      <tr>
        <th scope="row">`.visible-lg-*`</th>
        <td class="is-hidden">隐藏</td>
        <td class="is-hidden">隐藏</td>
        <td class="is-hidden">隐藏</td>
        <td class="is-visible">可见</td>
      </tr>
    </tbody>
    <tbody>
      <tr>
        <th scope="row">`.hidden-xs`</th>
        <td class="is-hidden">隐藏</td>
        <td class="is-visible">可见</td>
        <td class="is-visible">可见</td>
        <td class="is-visible">可见</td>
      </tr>
      <tr>
        <th scope="row">`.hidden-sm`</th>
        <td class="is-visible">可见</td>
        <td class="is-hidden">隐藏</td>
        <td class="is-visible">可见</td>
        <td class="is-visible">可见</td>
      </tr>
      <tr>
        <th scope="row">`.hidden-md`</th>
        <td class="is-visible">可见</td>
        <td class="is-visible">可见</td>
        <td class="is-hidden">隐藏</td>
        <td class="is-visible">可见</td>
      </tr>
      <tr>
        <th scope="row">`.hidden-lg`</th>
        <td class="is-visible">可见</td>
        <td class="is-visible">可见</td>
        <td class="is-visible">可见</td>
        <td class="is-hidden">隐藏</td>
      </tr>
    </tbody>
  </table>
</div>

从 v3.2.0 版本起，形如 `.visible-*-*` 的类针对每种屏幕大小都有了三种变体，每个针对 CSS 中不同的 `display` 属性，列表如下：

<div class="table-responsive">
  <table class="table table-bordered table-striped">
    <thead>
      <tr>
        <th>类组</th>
        <th>CSS `display`</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">`.visible-*-block`</th>
        <td>`display: block;`</td>
      </tr>
      <tr>
        <th scope="row">`.visible-*-inline`</th>
        <td>`display: inline;`</td>
      </tr>
      <tr>
        <th scope="row">`.visible-*-inline-block`</th>
        <td>`display: inline-block;`</td>
      </tr>
    </tbody>
  </table>
</div>

因此，以超小屏幕（`xs`）为例，可用的 `.visible-*-*` 类是：`.visible-xs-block`、`.visible-xs-inline` 和 `.visible-xs-inline-block`。

`.visible-xs`、`.visible-sm`、`.visible-md` 和 `.visible-lg` 类也同时存在。但是**从 v3.2.0 版本开始不再建议使用**。除了 `<table>` 相关的元素的特殊情况外，它们与 `.visible-*-block` 大体相同。

### 打印类

和常规的响应式类一样，使用下面的类可以针对打印机隐藏或显示某些内容。

<div class="table-responsive">
  <table class="table table-bordered table-striped responsive-utilities">
    <thead>
      <tr>
        <th>class</th>
        <th>浏览器</th>
        <th>打印机</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">
          `.visible-print-block`<br>
          `.visible-print-inline`<br>
          `.visible-print-inline-block`
        </th>
        <td class="is-hidden">隐藏</td>
        <td class="is-visible">可见</td>
      </tr>
      <tr>
        <th scope="row">`.hidden-print`</th>
        <td class="is-visible">可见</td>
        <td class="is-hidden">隐藏</td>
      </tr>
    </tbody>
  </table>
</div>

`.visible-print` 类也是存在的，但是从 v3.2.0 版本开始**不建议使用**。它与 `.visible-print-block` 类大致相同，除了 `<table>` 相关元素的特殊情况外。

### 测试用例

调整你的浏览器大小，或者用其他设备打开页面，都可以测试这些响应式工具类。

#### 在...上可见

带有绿色标记的元素表示其在当前浏览器视口（viewport）中是**可见的**。

<div class="row responsive-utilities-test visible-on">
  <div class="col-xs-6">
    <span class="hidden-xs">超小屏幕</span>
    <span class="visible-xs-block">✔ 在超小屏幕上可见</span>
  </div>
  <div class="col-xs-6">
    <span class="hidden-sm">小屏幕</span>
    <span class="visible-sm-block">✔ 在小屏幕上可见</span>
  </div>
  <div class="clearfix visible-xs-block"></div>
  <div class="col-xs-6">
    <span class="hidden-md">中等屏幕</span>
    <span class="visible-md-block">✔ 在中等屏幕上可见</span>
  </div>
  <div class="col-xs-6">
    <span class="hidden-lg">大屏幕</span>
    <span class="visible-lg-block">✔ 在大屏幕上可见</span>
  </div>
</div>

<div class="row responsive-utilities-test visible-on">
  <div class="col-xs-6">
    <span class="hidden-xs hidden-sm">超小屏幕和小屏幕</span>
    <span class="visible-xs-block visible-sm-block">✔ 在超小屏幕和小屏幕上可见</span>
  </div>
  <div class="col-xs-6">
    <span class="hidden-md hidden-lg">中等屏幕和大屏幕</span>
    <span class="visible-md-block visible-lg-block">✔ 在中等屏幕和大屏幕上可见</span>
  </div>
  <div class="clearfix visible-xs-block"></div>
  <div class="col-xs-6">
    <span class="hidden-xs hidden-md">超小屏幕和中等屏幕</span>
    <span class="visible-xs-block visible-md-block">✔ 在超小屏幕和中等屏幕上可见</span>
  </div>
  <div class="col-xs-6">
    <span class="hidden-sm hidden-lg">小屏幕和大屏幕</span>
    <span class="visible-sm-block visible-lg-block">✔ 在小屏幕和大屏幕上可见</span>
  </div>
  <div class="clearfix visible-xs-block"></div>
  <div class="col-xs-6">
    <span class="hidden-xs hidden-lg">超小屏幕和大屏幕</span>
    <span class="visible-xs-block visible-lg-block">✔ 在超小屏幕和大屏幕上可见</span>
  </div>
  <div class="col-xs-6">
    <span class="hidden-sm hidden-md">小屏幕和中等屏幕</span>
    <span class="visible-sm-block visible-md-block">✔ 在小屏幕和中等屏幕上可见</span>
  </div>
</div>

#### 在...上隐藏

带有绿色标记的元素表示其在当前浏览器视口（viewport）中是**隐藏的**。

<div class="row responsive-utilities-test hidden-on">
  <div class="col-xs-6 col-sm-3">
    <span class="hidden-xs">超小屏幕</span>
    <span class="visible-xs-block">✔ 在超小屏幕上隐藏</span>
  </div>
  <div class="col-xs-6 col-sm-3">
    <span class="hidden-sm">小屏幕</span>
    <span class="visible-sm-block">✔ 在小屏幕上隐藏</span>
  </div>
  <div class="clearfix visible-xs-block"></div>
  <div class="col-xs-6 col-sm-3">
    <span class="hidden-md">中等屏幕</span>
    <span class="visible-md-block">✔ 在中等屏幕上隐藏</span>
  </div>
  <div class="col-xs-6 col-sm-3">
    <span class="hidden-lg">大屏幕</span>
    <span class="visible-lg-block">✔ 在大屏幕上隐藏</span>
  </div>
</div>
<div class="row responsive-utilities-test hidden-on">
  <div class="col-xs-6">
    <span class="hidden-xs hidden-sm">超小屏幕与小屏幕</span>
    <span class="visible-xs-block visible-sm-block">✔ 在超小屏幕和小屏幕上隐藏</span>
  </div>
  <div class="col-xs-6">
    <span class="hidden-md hidden-lg">中等屏幕和大屏幕</span>
    <span class="visible-md-block visible-lg-block">✔ 在 medium 和 large 上隐藏</span>
  </div>
  <div class="clearfix visible-xs-block"></div>
  <div class="col-xs-6">
    <span class="hidden-xs hidden-md">超小屏幕和中等屏幕</span>
    <span class="visible-xs-block visible-md-block">✔ 在超小屏幕和中等屏幕上隐藏</span>
  </div>
  <div class="col-xs-6">
    <span class="hidden-sm hidden-lg">小屏幕和大屏幕</span>
    <span class="visible-sm-block visible-lg-block">✔ 在小屏幕和大屏幕上隐藏</span>
  </div>
  <div class="clearfix visible-xs-block"></div>
  <div class="col-xs-6">
    <span class="hidden-xs hidden-lg">超小屏幕和大屏幕</span>
    <span class="visible-xs-block visible-lg-block">✔ 在超小屏幕和大屏幕上隐藏</span>
  </div>
  <div class="col-xs-6">
    <span class="hidden-sm hidden-md">小屏幕和中等屏幕</span>
    <span class="visible-sm-block visible-md-block">✔ 在小屏幕和中等屏幕上隐藏</span>
  </div>
</div>

# 组件样式

Bootstrap 3 组件样式。包含 Glyphicons 字体图标；下拉菜单、按钮组、输入框组、分页、标签、警告框、弹出框、进度条等组件依赖样式。

## Glyphicons 字体图标

### 所有可用的图标

包括250多个来自 Glyphicon Halflings 的字体图标。[Glyphicons](http://glyphicons.com/) Halflings 一般是收费的，但是他们的作者允许 Bootstrap 免费使用。为了表示感谢，希望你在使用时尽量为 [Glyphicons](http://glyphicons.com/) 添加一个友情链接。

<div class="glyphicons">
  <ul class="glyphicons-list">
    <li>
      <span class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-asterisk</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-plus</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-euro" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-euro</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-eur" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-eur</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-minus" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-minus</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-cloud" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-cloud</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-envelope" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-envelope</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-pencil</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-glass" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-glass</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-music" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-music</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-search</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-heart" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-heart</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-star" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-star</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-star-empty</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-user" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-user</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-film" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-film</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-th-large" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-th-large</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-th" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-th</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-th-list" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-th-list</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-ok</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-remove</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-zoom-in</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-zoom-out" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-zoom-out</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-off" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-off</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-signal" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-signal</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-cog" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-cog</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-trash</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-home" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-home</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-file" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-file</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-time" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-time</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-road" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-road</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-download-alt" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-download-alt</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-download" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-download</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-upload" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-upload</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-inbox" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-inbox</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-play-circle" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-play-circle</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-repeat" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-repeat</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-refresh</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-list-alt</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-lock" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-lock</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-flag" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-flag</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-headphones" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-headphones</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-volume-off" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-volume-off</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-volume-down" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-volume-down</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-volume-up" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-volume-up</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-qrcode" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-qrcode</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-barcode" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-barcode</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-tag" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-tag</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-tags" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-tags</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-book" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-book</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-bookmark" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-bookmark</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-print" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-print</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-camera" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-camera</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-font" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-font</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-bold" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-bold</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-italic" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-italic</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-text-height" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-text-height</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-text-width" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-text-width</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-align-left" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-align-left</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-align-center" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-align-center</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-align-right" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-align-right</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-align-justify" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-align-justify</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-list" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-list</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-indent-left" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-indent-left</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-indent-right" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-indent-right</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-facetime-video" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-facetime-video</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-picture" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-picture</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-map-marker</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-adjust" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-adjust</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-tint" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-tint</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-edit" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-edit</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-share" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-share</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-check" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-check</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-move" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-move</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-step-backward" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-step-backward</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-fast-backward" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-fast-backward</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-backward" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-backward</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-play" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-play</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-pause" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-pause</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-stop" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-stop</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-forward" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-forward</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-fast-forward" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-fast-forward</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-step-forward" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-step-forward</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-eject" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-eject</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-chevron-left</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-chevron-right</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-plus-sign</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-minus-sign" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-minus-sign</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-remove-sign</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-ok-sign</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-question-sign</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-info-sign</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-screenshot" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-screenshot</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-remove-circle" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-remove-circle</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-ok-circle</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-ban-circle" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-ban-circle</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-arrow-left</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-arrow-right</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-arrow-up</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-arrow-down</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-share-alt</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-resize-full" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-resize-full</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-resize-small" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-resize-small</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-exclamation-sign</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-gift" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-gift</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-leaf" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-leaf</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-fire" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-fire</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-eye-open</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-eye-close</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-warning-sign</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-plane" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-plane</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-calendar" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-calendar</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-random" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-random</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-comment" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-comment</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-magnet" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-magnet</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-chevron-up" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-chevron-up</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-chevron-down</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-retweet" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-retweet</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-shopping-cart</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-folder-close" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-folder-close</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-folder-open</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-resize-vertical" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-resize-vertical</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-resize-horizontal" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-resize-horizontal</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-hdd" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-hdd</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-bullhorn" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-bullhorn</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-bell" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-bell</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-certificate" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-certificate</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-thumbs-up</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-thumbs-down</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-hand-right" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-hand-right</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-hand-left" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-hand-left</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-hand-up" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-hand-up</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-hand-down" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-hand-down</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-circle-arrow-right" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-circle-arrow-right</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-circle-arrow-left" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-circle-arrow-left</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-circle-arrow-up" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-circle-arrow-up</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-circle-arrow-down" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-circle-arrow-down</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-globe" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-globe</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-wrench" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-wrench</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-tasks" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-tasks</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-filter" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-filter</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-briefcase" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-briefcase</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-fullscreen" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-fullscreen</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-dashboard" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-dashboard</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-paperclip" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-paperclip</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-heart-empty" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-heart-empty</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-link" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-link</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-phone" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-phone</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-pushpin" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-pushpin</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-usd" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-usd</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-gbp" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-gbp</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-sort" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-sort</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-sort-by-alphabet" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-sort-by-alphabet</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-sort-by-alphabet-alt" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-sort-by-alphabet-alt</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-sort-by-order" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-sort-by-order</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-sort-by-order-alt" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-sort-by-order-alt</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-sort-by-attributes" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-sort-by-attributes</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-sort-by-attributes-alt" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-sort-by-attributes-alt</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-unchecked" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-unchecked</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-expand" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-expand</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-collapse-down" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-collapse-down</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-collapse-up" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-collapse-up</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-log-in" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-log-in</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-flash" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-flash</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-log-out" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-log-out</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-new-window" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-new-window</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-record" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-record</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-save" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-save</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-open" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-open</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-saved" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-saved</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-import" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-import</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-export" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-export</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-send" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-send</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-floppy-disk</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-floppy-saved" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-floppy-saved</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-floppy-remove" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-floppy-remove</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-floppy-save" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-floppy-save</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-floppy-open" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-floppy-open</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-credit-card" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-credit-card</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-transfer" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-transfer</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-cutlery" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-cutlery</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-header" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-header</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-compressed" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-compressed</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-earphone" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-earphone</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-phone-alt" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-phone-alt</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-tower" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-tower</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-stats" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-stats</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-sd-video" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-sd-video</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-hd-video" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-hd-video</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-subtitles" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-subtitles</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-sound-stereo" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-sound-stereo</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-sound-dolby" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-sound-dolby</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-sound-5-1" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-sound-5-1</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-sound-6-1" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-sound-6-1</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-sound-7-1" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-sound-7-1</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-copyright-mark" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-copyright-mark</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-registration-mark</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-cloud-download" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-cloud-download</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-cloud-upload" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-cloud-upload</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-tree-conifer" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-tree-conifer</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-tree-deciduous" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-tree-deciduous</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-cd" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-cd</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-save-file" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-save-file</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-open-file" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-open-file</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-level-up" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-level-up</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-copy" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-copy</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-paste" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-paste</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-alert" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-alert</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-equalizer" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-equalizer</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-king" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-king</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-queen" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-queen</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-pawn" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-pawn</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-bishop" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-bishop</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-knight" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-knight</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-baby-formula" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-baby-formula</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-tent" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-tent</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-blackboard" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-blackboard</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-bed" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-bed</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-apple" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-apple</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-erase" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-erase</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-hourglass" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-hourglass</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-lamp" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-lamp</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-duplicate" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-duplicate</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-piggy-bank" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-piggy-bank</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-scissors" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-scissors</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-bitcoin" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-bitcoin</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-btc" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-btc</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-xbt" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-xbt</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-yen" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-yen</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-jpy" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-jpy</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-ruble" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-ruble</span>
    </li>

    <li>
      <span class="glyphicon glyphicon-rub" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-rub</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-scale" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-scale</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-ice-lolly" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-ice-lolly</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-ice-lolly-tasted" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-ice-lolly-tasted</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-education" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-education</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-option-horizontal" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-option-horizontal</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-option-vertical" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-option-vertical</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-menu-hamburger</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-modal-window" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-modal-window</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-oil" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-oil</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-grain" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-grain</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-sunglasses" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-sunglasses</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-text-size" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-text-size</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-text-color" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-text-color</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-text-background" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-text-background</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-object-align-top" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-object-align-top</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-object-align-bottom" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-object-align-bottom</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-object-align-horizontal" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-object-align-horizontal</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-object-align-left" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-object-align-left</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-object-align-vertical" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-object-align-vertical</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-object-align-right" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-object-align-right</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-triangle-right</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-triangle-left" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-triangle-left</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-triangle-bottom</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-triangle-top" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-triangle-top</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-console" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-console</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-superscript" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-superscript</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-subscript" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-subscript</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-menu-left</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-menu-right</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-menu-down</span>
    </li>
    <li>
      <span class="glyphicon glyphicon-menu-up" aria-hidden="true"></span>
      <span class="glyphicon-class">glyphicon glyphicon-menu-up</span>
    </li>
  </ul>
</div>

### 如何使用

出于性能的考虑，所有图标都需要一个基类和对应每个图标的类。把下面的代码放在任何地方都可以正常使用。注意，为了设置正确的内补（padding），务必在图标和文本之间添加一个空格。

<div class="callout callout-danger">
  <h4>不要和其他组件混合使用</h4>
  <p>图标类不能和其它组件直接联合使用。它们不能在同一个元素上与其他类共同存在。应该创建一个嵌套的 `<span>` 标签，并将图标类应用到这个 `<span>` 标签上。</p>
</div>

<div class="callout callout-danger">
  <h4>只对内容为空的元素起作用</h4>
  <p>图标类只能应用在不包含任何文本内容或子元素的元素上。</p>
</div>

<div class="callout callout-info">
  <h4>改变图标字体文件的位置</h4>
  <p>Bootstrap 假定所有的图标字体文件全部位于 `../fonts/` 目录内，相对于预编译版 CSS 文件的目录。如果你修改了图标字体文件的位置，那么，你需要通过下面列出的任何一种方式来更新 CSS 文件：</p>
  <ul>
    <li>在 Less 源码文件中修改 `@icon-font-path` 和/或 `@icon-font-name` 变量。</li>
    <li>利用 Less 编译器提供的 [相对 URL 地址选项](http://lesscss.org/usage/#command-line-usage-relative-urls)。</li>
    <li>修改预编译 CSS 文件中的 `url()` 地址。</li>
  </ul>
  <p>根据你自身的情况选择一种方式即可。</p>
</div>

<div class="callout callout-warning">
  <h4>图标的可访问性</h4>
  <p>现代的辅助技术能够识别并朗读由 CSS 生成的内容和特定的 Unicode 字符。为了避免 屏幕识读设备抓取非故意的和可能产生混淆的输出内容（尤其是当图标纯粹作为装饰用途时），我们为这些图标设置了 `aria-hidden="true"` 属性。</p>
  <p>如果你使用图标是为了表达某些含义（不仅仅是为了装饰用），请确保你所要表达的意思能够通过被辅助设备识别，例如，包含额外的内容并通过 `.sr-only` 类让其在视觉上表现出隐藏的效果。</p>
  <p>如果你所创建的组件不包含任何文本内容（例如， `<button>` 内只包含了一个图标），你应当提供其他的内容来表示这个控件的意图，这样就能让使用辅助设备的用户知道其作用了。这种情况下，你可以为控件添加 `aria-label` 属性。</p>
</div>

```html
<span class="glyphicon glyphicon-search" aria-hidden="true"></span>
```

### 实例

可以把它们应用到按钮、工具条中的按钮组、导航或输入框等地方。

<div class="example-box">
  <div class="btn-toolbar" role="toolbar">
    <div class="btn-group">
      <button type="button" class="btn btn-default" aria-label="Left Align"><span class="glyphicon glyphicon-align-left" aria-hidden="true"></span></button>
      <button type="button" class="btn btn-default" aria-label="Center Align"><span class="glyphicon glyphicon-align-center" aria-hidden="true"></span></button>
      <button type="button" class="btn btn-default" aria-label="Right Align"><span class="glyphicon glyphicon-align-right" aria-hidden="true"></span></button>
      <button type="button" class="btn btn-default" aria-label="Justify"><span class="glyphicon glyphicon-align-justify" aria-hidden="true"></span></button>
    </div>
  </div>
  <div class="btn-toolbar" role="toolbar">
    <button type="button" class="btn btn-default btn-lg"><span class="glyphicon glyphicon-star" aria-hidden="true"></span> Star</button>
    <button type="button" class="btn btn-default"><span class="glyphicon glyphicon-star" aria-hidden="true"></span> Star</button>
    <button type="button" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-star" aria-hidden="true"></span> Star</button>
    <button type="button" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-star" aria-hidden="true"></span> Star</button>
  </div>
</div>

```html
<button type="button" class="btn btn-default" aria-label="Left Align">
  <span class="glyphicon glyphicon-align-left" aria-hidden="true"></span>
</button>

<button type="button" class="btn btn-default btn-lg">
  <span class="glyphicon glyphicon-star" aria-hidden="true"></span> Star
</button>
```

[alert](#t1-14_警告框) 组件中所包含的图标是用来表示这是一条错误消息的，通过添加额外的 `.sr-only` 文本就可以让辅助设备知道这条提示所要表达的意思了。

<div class="example-box">
  <div class="alert alert-danger" role="alert">
    <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
    <span class="sr-only">Error:</span>
    Enter a valid email address
  </div>
</div>

```html
<div class="alert alert-danger" role="alert">
  <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
  <span class="sr-only">Error:</span>
  Enter a valid email address
</div>
```

## 下拉菜单

<p class="lead">
  用于显示链接列表的可切换、有上下文的菜单。[下拉菜单的 JavaScript 插件](YFjs工具.html#t0-2-4_下拉菜单+dropdown) 让它具有了交互性。
</p>

### 实例

将下拉菜单触发器和下拉菜单都包裹在 `.dropdown` 里，或者另一个声明了 `position: relative;` 的元素。然后加入组成菜单的 HTML 代码。

<div class="example-box">
  <div class="dropdown clearfix">
    <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
      Dropdown
      <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
      <li><a href="#">Action</a></li>
      <li><a href="#">Another action</a></li>
      <li><a href="#">Something else here</a></li>
    </ul>
  </div>
</div>

```html
<div class="dropdown">
  <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
    Dropdown
    <span class="caret"></span>
  </button>
  <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
    <li><a href="#">Action</a></li>
    <li><a href="#">Another action</a></li>
    <li><a href="#">Something else here</a></li>
    <li role="separator" class="divider"></li>
    <li><a href="#">Separated link</a></li>
  </ul>
</div>
```

通过为下拉菜单的父元素设置 `.dropup` 类，可以让菜单向上弹出（默认是向下弹出的）。

<div class="example-box">
  <div class="dropup clearfix">
    <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      Dropup
      <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
      <li><a href="#">Action</a></li>
      <li><a href="#">Another action</a></li>
      <li><a href="#">Something else here</a></li>
    </ul>
  </div>
</div>

```html
<div class="dropup">
  <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Dropup
    <span class="caret"></span>
  </button>
  <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
    <li><a href="#">Action</a></li>
    <li><a href="#">Another action</a></li>
    <li><a href="#">Something else here</a></li>
    <li role="separator" class="divider"></li>
    <li><a href="#">Separated link</a></li>
  </ul>
</div>
```

### 对齐

默认情况下，下拉菜单自动沿着父元素的上沿和左侧被定位为 100% 宽度。 为 `.dropdown-menu` 添加 `.dropdown-menu-right` 类可以让菜单右对齐。

<div class="callout callout-warning">
  <h4>可能需要额外的定位May require additional positioning</h4>
  <p>在正常的文档流中，通过 CSS 为下拉菜单进行定位。这就意味着下拉菜单可能会由于设置了 `overflow` 属性的父元素而被部分遮挡或超出视口（viewport）的显示范围。如果出现这种问题，请自行解决。</p>
</div>

<div class="callout callout-warning">
  <h4>不建议使用 `.pull-right`</h4>
  <p>从 v3.1.0 版本开始，我们不再建议对下拉菜单使用 `.pull-right` 类。如需将菜单右对齐，请使用 `.dropdown-menu-right` 类。导航条中如需添加右对齐的导航（nav）组件，请使用 `.pull-right` 的 mixin 版本，可以自动对齐菜单。如需左对齐，请使用 `.dropdown-menu-left` 类。</p>
</div>

```html
<ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dLabel">
  ...
</ul>
```

### 标题

在任何下拉菜单中均可通过添加标题来标明一组动作。

<div class="example-box">
  <div class="dropdown clearfix">
    <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
      Dropdown
      <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenu3">
      <li class="dropdown-header">Dropdown header</li>
      <li><a href="#">Action</a></li>
      <li><a href="#">Another action</a></li>
      <li><a href="#">Something else here</a></li>
      <li class="dropdown-header">Dropdown header</li>
      <li><a href="#">Separated link</a></li>
    </ul>
  </div>
</div>

```html
<ul class="dropdown-menu" aria-labelledby="dropdownMenu3">
  ...
  <li class="dropdown-header">Dropdown header</li>
  ...
</ul>
```

### 分割线

为下拉菜单添加一条分割线，用于将多个链接分组。

<div class="example-box">
  <div class="dropdown clearfix">
    <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenuDivider" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
      Dropdown
      <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuDivider">
      <li><a href="#">Action</a></li>
      <li><a href="#">Another action</a></li>
      <li><a href="#">Something else here</a></li>
      <li role="separator" class="divider"></li>
      <li><a href="#">Separated link</a></li>
    </ul>
  </div>
</div>

```html
<ul class="dropdown-menu" aria-labelledby="dropdownMenuDivider">
  ...
  <li role="separator" class="divider"></li>
  ...
</ul>
```

### 禁用的菜单项

为下拉菜单中的 `<li>` 元素添加 `.disabled` 类，从而禁用相应的菜单项。

<div class="example-box">
  <div class="dropdown clearfix">
    <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu4" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
      Dropdown
      <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenu4">
      <li><a href="#">Regular link</a></li>
      <li class="disabled"><a href="#">Disabled link</a></li>
      <li><a href="#">Another link</a></li>
    </ul>
  </div>
</div>

```html
<ul class="dropdown-menu" aria-labelledby="dropdownMenu4">
  <li><a href="#">Regular link</a></li>
  <li class="disabled"><a href="#">Disabled link</a></li>
  <li><a href="#">Another link</a></li>
</ul>
```

## 按钮组

<p class="lead">
  通过按钮组容器把一组按钮放在同一行里。通过与 [按钮插件](组件模块.html#t1-5_按钮) 联合使用，可以设置为单选框或多选框的样式和行为。
</p>

<div class="callout callout-warning">
  <h4>按钮组中的工具提示和弹出框需要特别的设置</h4>
  <p>当为 `.btn-group` 中的元素应用工具提示或弹出框时，必须指定 `container: 'body'` 选项，这样可以避免不必要的副作用（例如工具提示或弹出框触发时，会让页面元素变宽和/或失去圆角）。</p>
</div>

<div class="callout callout-warning">
  <h4>确保设置正确的 `role` 属性并提供一个 label 标签</h4>
  <p>为了向使用辅助技术 - 如屏幕阅读器 - 的用户正确传达一正确的按钮分组，需要提供一个合适的 `role` 属性。对于按钮组合，应该是 `role="group"`，对于toolbar（工具栏）应该是 `role="toolbar"`。</p>
  <p>一个例外是按钮组合只包含一个单一的控制元素或一个下拉菜单（比如实际情况，`<button>` 元素组成的 [两端对齐排列的按钮组](#t1-2-5_两端对齐排列的按钮组) ）或下拉菜单。</p>
  <p>此外，按钮组和工具栏应给定一个明确的label标签，尽管设置了正确的 `role` 属性，但是大多数辅助技术将不会正确的识读他们。在这里提供的实例中，我们使用 `aria-label`，但是， `aria-labelledby` 也可以使用。</p>
</div>

### 基本实例

Wrap a series of buttons with `.btn` in `.btn-group`.

<div class="example-box">
  <div class="btn-group" role="group" aria-label="Basic example">
    <button type="button" class="btn btn-default">Left</button>
    <button type="button" class="btn btn-default">Middle</button>
    <button type="button" class="btn btn-default">Right</button>
  </div>
</div>

```html
<div class="btn-group" role="group" aria-label="...">
  <button type="button" class="btn btn-default">Left</button>
  <button type="button" class="btn btn-default">Middle</button>
  <button type="button" class="btn btn-default">Right</button>
</div>
```

### 按钮工具栏

把一组 `<div class="btn-group">` 组合进一个 `<div class="btn-toolbar">` 中就可以做成更复杂的组件。

<div class="example-box">
  <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
    <div class="btn-group" role="group" aria-label="First group">
      <button type="button" class="btn btn-default">1</button>
      <button type="button" class="btn btn-default">2</button>
      <button type="button" class="btn btn-default">3</button>
      <button type="button" class="btn btn-default">4</button>
    </div>
    <div class="btn-group" role="group" aria-label="Second group">
      <button type="button" class="btn btn-default">5</button>
      <button type="button" class="btn btn-default">6</button>
      <button type="button" class="btn btn-default">7</button>
    </div>
    <div class="btn-group" role="group" aria-label="Third group">
      <button type="button" class="btn btn-default">8</button>
    </div>
  </div>
</div>

```html
<div class="btn-toolbar" role="toolbar" aria-label="...">
  <div class="btn-group" role="group" aria-label="...">...</div>
  <div class="btn-group" role="group" aria-label="...">...</div>
  <div class="btn-group" role="group" aria-label="...">...</div>
</div>
```

### 尺寸

只要给 `.btn-group` 加上 `.btn-group-*` 类，就省去为按钮组中的每个按钮都赋予尺寸类了，如果包含了多个按钮组时也适用。

<div class="example-box">
  <div class="btn-group btn-group-lg" role="group" aria-label="Large button group">
    <button type="button" class="btn btn-default">Left</button>
    <button type="button" class="btn btn-default">Middle</button>
    <button type="button" class="btn btn-default">Right</button>
  </div>
  <br>
  <div class="btn-group" role="group" aria-label="Default button group">
    <button type="button" class="btn btn-default">Left</button>
    <button type="button" class="btn btn-default">Middle</button>
    <button type="button" class="btn btn-default">Right</button>
  </div>
  <br>
  <div class="btn-group btn-group-sm" role="group" aria-label="Small button group">
    <button type="button" class="btn btn-default">Left</button>
    <button type="button" class="btn btn-default">Middle</button>
    <button type="button" class="btn btn-default">Right</button>
  </div>
  <br>
  <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group">
    <button type="button" class="btn btn-default">Left</button>
    <button type="button" class="btn btn-default">Middle</button>
    <button type="button" class="btn btn-default">Right</button>
  </div>
</div>

```html
<div class="btn-group btn-group-lg" role="group" aria-label="...">...</div>
<div class="btn-group" role="group" aria-label="...">...</div>
<div class="btn-group btn-group-sm" role="group" aria-label="...">...</div>
<div class="btn-group btn-group-xs" role="group" aria-label="...">...</div>
```

### 嵌套

想要把下拉菜单混合到一系列按钮中，只须把 `.btn-group` 放入另一个 `.btn-group` 中。

<div class="example-box">
  <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
    <button type="button" class="btn btn-default">1</button>
    <button type="button" class="btn btn-default">2</button>

    <div class="btn-group" role="group">
      <button id="btnGroupDrop1" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Dropdown
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu" aria-labelledby="btnGroupDrop1">
        <li><a href="#">Dropdown link</a></li>
        <li><a href="#">Dropdown link</a></li>
      </ul>
    </div>
  </div>
</div>

```html
<div class="btn-group" role="group" aria-label="...">
  <button type="button" class="btn btn-default">1</button>
  <button type="button" class="btn btn-default">2</button>

  <div class="btn-group" role="group">
    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      Dropdown
      <span class="caret"></span>
    </button>
    <ul class="dropdown-menu">
      <li><a href="#">Dropdown link</a></li>
      <li><a href="#">Dropdown link</a></li>
    </ul>
  </div>
</div>
```

### 垂直排列

让一组按钮垂直堆叠排列显示而不是水平排列。<strong class="text-danger">分列式按钮下拉菜单不支持这种方式。</strong>

<div class="example-box">
  <div class="btn-group-vertical" role="group" aria-label="Vertical button group">
    <button type="button" class="btn btn-default">Button</button>
    <button type="button" class="btn btn-default">Button</button>
    <div class="btn-group" role="group">
      <button id="btnGroupVerticalDrop1" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Dropdown
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu" aria-labelledby="btnGroupVerticalDrop1">
        <li><a href="#">Dropdown link</a></li>
        <li><a href="#">Dropdown link</a></li>
      </ul>
    </div>
    <button type="button" class="btn btn-default">Button</button>
    <button type="button" class="btn btn-default">Button</button>
    <div class="btn-group" role="group">
      <button id="btnGroupVerticalDrop2" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Dropdown
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu" aria-labelledby="btnGroupVerticalDrop2">
        <li><a href="#">Dropdown link</a></li>
        <li><a href="#">Dropdown link</a></li>
      </ul>
    </div>
    <div class="btn-group" role="group">
      <button id="btnGroupVerticalDrop3" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Dropdown
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu" aria-labelledby="btnGroupVerticalDrop3">
        <li><a href="#">Dropdown link</a></li>
        <li><a href="#">Dropdown link</a></li>
      </ul>
    </div>
    <div class="btn-group" role="group">
      <button id="btnGroupVerticalDrop4" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Dropdown
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu" aria-labelledby="btnGroupVerticalDrop4">
        <li><a href="#">Dropdown link</a></li>
        <li><a href="#">Dropdown link</a></li>
      </ul>
    </div>
  </div>
</div>

```html
<div class="btn-group-vertical" role="group" aria-label="...">
  ...
</div>
```

### 两端对齐排列的按钮组

让一组按钮拉长为相同的尺寸，填满父元素的宽度。对于按钮组中的按钮式下拉菜单也同样适用。

<div class="callout callout-warning">
  <h4>关于边框的处理</h4>
  <p>由于对两端对齐的按钮组使用了特定的 HTML 和 CSS （即 `display: table-cell`），两个按钮之间的边框叠加在了一起。在普通的按钮组中，`margin-left: -1px` 用于将边框重叠，而没有删除任何一个按钮的边框。然而，`margin` 属性不支持 `display: table-cell`。因此，根据你对 Bootstrap 的定制，你可以删除或重新为按钮的边框设置颜色。</p>
</div>

<div class="callout callout-warning">
  <h4>IE8 和边框</h4>
  <p>Internet Explorer 8 不支持在两端对齐的按钮组中绘制边框，无论是 `<a>` 或 `<button>` 元素。为了照顾 IE8，把每个按钮放入另一个 `.btn-group` 中即可。</p>
  <p>参见 [#12476](https://github.com/twbs/bootstrap/issues/12476) 获取详细信息。</p>
</div>

#### 关于 `&lt;a&gt;` 元素

只须将一系列 `.btn` 元素包裹到 `.btn-group.btn-group-justified` 中即可。

<div class="example-box">
  <div class="btn-group btn-group-justified" role="group" aria-label="Justified button group">
    <a href="#" class="btn btn-default" role="button">Left</a>
    <a href="#" class="btn btn-default" role="button">Middle</a>
    <a href="#" class="btn btn-default" role="button">Right</a>
  </div>
  <br>
  <div class="btn-group btn-group-justified" role="group" aria-label="Justified button group with nested dropdown">
    <a href="#" class="btn btn-default" role="button">Left</a>
    <a href="#" class="btn btn-default" role="button">Middle</a>
    <div class="btn-group" role="group">
      <a href="#" class="btn btn-default dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
        Dropdown <span class="caret"></span>
      </a>
      <ul class="dropdown-menu">
        <li><a href="#">Action</a></li>
        <li><a href="#">Another action</a></li>
        <li><a href="#">Something else here</a></li>
        <li role="separator" class="divider"></li>
        <li><a href="#">Separated link</a></li>
      </ul>
    </div>
  </div>
</div>

```html
<div class="btn-group btn-group-justified" role="group" aria-label="...">
  ...
</div>
```

<div class="callout callout-warning">
  <h4>Links acting as buttons</h4>
  <p>If the `<a>` elements are used to act as buttons &ndash; triggering in-page functionality, rather than navigating to another document or section within the current page &ndash; they should also be given an appropriate `role="button"`.</p>
</div>

#### 关于 `&lt;button&gt;` 元素

为了将 `<button>` 元素用于两端对齐的按钮组中，<strong class="text-danger">必须将每个按钮包裹进一个按钮组中you must wrap each button in a button group</strong>。大部分的浏览器不能将我们的 CSS 应用到对齐的 `<button>` 元素上，但是，由于我们支持按钮式下拉菜单，我们可以解决这个问题。

<div class="example-box">
  <div class="btn-group btn-group-justified" role="group" aria-label="Justified button group">
    <div class="btn-group" role="group">
      <button type="button" class="btn btn-default">Left</button>
    </div>
    <div class="btn-group" role="group">
      <button type="button" class="btn btn-default">Middle</button>
    </div>
    <div class="btn-group" role="group">
      <button type="button" class="btn btn-default">Right</button>
    </div>
  </div>
</div>

```html
<div class="btn-group btn-group-justified" role="group" aria-label="...">
  <div class="btn-group" role="group">
    <button type="button" class="btn btn-default">Left</button>
  </div>
  <div class="btn-group" role="group">
    <button type="button" class="btn btn-default">Middle</button>
  </div>
  <div class="btn-group" role="group">
    <button type="button" class="btn btn-default">Right</button>
  </div>
</div>
```

## 按钮式下拉菜单

<p class="lead">
  把任意一个按钮放入 `.btn-group` 中，然后加入适当的菜单标签，就可以让按钮作为菜单的触发器了。
</p>

<div class="callout callout-danger">
  <h4>插件依赖</h4>
  <p>按钮式下拉菜单依赖 [下拉菜单插件](YFjs工具.html#t0-2-4_下拉菜单+dropdown) ，因此需要将此插件包含在你所使用的 Bootstrap 版本中。</p>
</div>

### 单按钮下拉菜单

只要改变一些基本的标记，就能把按钮变成下拉菜单的开关。

<div class="example-box">
  <div class="btn-group">
    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Default <span class="caret"></span></button>
    <ul class="dropdown-menu">
      <li><a href="#">Action</a></li>
      <li><a href="#">Another action</a></li>
      <li><a href="#">Something else here</a></li>
      <li role="separator" class="divider"></li>
      <li><a href="#">Separated link</a></li>
    </ul>
  </div><!-- /btn-group -->
  <div class="btn-group">
    <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Primary <span class="caret"></span></button>
    <ul class="dropdown-menu">
      <li><a href="#">Action</a></li>
      <li><a href="#">Another action</a></li>
      <li><a href="#">Something else here</a></li>
      <li role="separator" class="divider"></li>
      <li><a href="#">Separated link</a></li>
    </ul>
  </div><!-- /btn-group -->
  <div class="btn-group">
    <button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Success <span class="caret"></span></button>
    <ul class="dropdown-menu">
      <li><a href="#">Action</a></li>
      <li><a href="#">Another action</a></li>
      <li><a href="#">Something else here</a></li>
      <li role="separator" class="divider"></li>
      <li><a href="#">Separated link</a></li>
    </ul>
  </div><!-- /btn-group -->
  <div class="btn-group">
    <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Info <span class="caret"></span></button>
    <ul class="dropdown-menu">
      <li><a href="#">Action</a></li>
      <li><a href="#">Another action</a></li>
      <li><a href="#">Something else here</a></li>
      <li role="separator" class="divider"></li>
      <li><a href="#">Separated link</a></li>
    </ul>
  </div><!-- /btn-group -->
  <div class="btn-group">
    <button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Warning <span class="caret"></span></button>
    <ul class="dropdown-menu">
      <li><a href="#">Action</a></li>
      <li><a href="#">Another action</a></li>
      <li><a href="#">Something else here</a></li>
      <li role="separator" class="divider"></li>
      <li><a href="#">Separated link</a></li>
    </ul>
  </div><!-- /btn-group -->
  <div class="btn-group">
    <button type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Danger <span class="caret"></span></button>
    <ul class="dropdown-menu">
      <li><a href="#">Action</a></li>
      <li><a href="#">Another action</a></li>
      <li><a href="#">Something else here</a></li>
      <li role="separator" class="divider"></li>
      <li><a href="#">Separated link</a></li>
    </ul>
  </div><!-- /btn-group -->
</div>

```html
<!-- Single button -->
<div class="btn-group">
  <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Action <span class="caret"></span>
  </button>
  <ul class="dropdown-menu">
    <li><a href="#">Action</a></li>
    <li><a href="#">Another action</a></li>
    <li><a href="#">Something else here</a></li>
    <li role="separator" class="divider"></li>
    <li><a href="#">Separated link</a></li>
  </ul>
</div>
```

### 分裂式按钮下拉菜单

相似地，分裂式按钮下拉菜单也需要同样的改变一些标记，但只是多一个分开的按钮。

<div class="example-box">
  <div class="btn-group">
    <button type="button" class="btn btn-default">Default</button>
    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      <span class="caret"></span>
      <span class="sr-only">Toggle Dropdown</span>
    </button>
    <ul class="dropdown-menu">
      <li><a href="#">Action</a></li>
      <li><a href="#">Another action</a></li>
      <li><a href="#">Something else here</a></li>
      <li role="separator" class="divider"></li>
      <li><a href="#">Separated link</a></li>
    </ul>
  </div><!-- /btn-group -->
  <div class="btn-group">
    <button type="button" class="btn btn-primary">Primary</button>
    <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      <span class="caret"></span>
      <span class="sr-only">Toggle Dropdown</span>
    </button>
    <ul class="dropdown-menu">
      <li><a href="#">Action</a></li>
      <li><a href="#">Another action</a></li>
      <li><a href="#">Something else here</a></li>
      <li role="separator" class="divider"></li>
      <li><a href="#">Separated link</a></li>
    </ul>
  </div><!-- /btn-group -->
  <div class="btn-group">
    <button type="button" class="btn btn-success">Success</button>
    <button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      <span class="caret"></span>
      <span class="sr-only">Toggle Dropdown</span>
    </button>
    <ul class="dropdown-menu">
      <li><a href="#">Action</a></li>
      <li><a href="#">Another action</a></li>
      <li><a href="#">Something else here</a></li>
      <li role="separator" class="divider"></li>
      <li><a href="#">Separated link</a></li>
    </ul>
  </div><!-- /btn-group -->
  <div class="btn-group">
    <button type="button" class="btn btn-info">Info</button>
    <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      <span class="caret"></span>
      <span class="sr-only">Toggle Dropdown</span>
    </button>
    <ul class="dropdown-menu">
      <li><a href="#">Action</a></li>
      <li><a href="#">Another action</a></li>
      <li><a href="#">Something else here</a></li>
      <li role="separator" class="divider"></li>
      <li><a href="#">Separated link</a></li>
    </ul>
  </div><!-- /btn-group -->
  <div class="btn-group">
    <button type="button" class="btn btn-warning">Warning</button>
    <button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      <span class="caret"></span>
      <span class="sr-only">Toggle Dropdown</span>
    </button>
    <ul class="dropdown-menu">
      <li><a href="#">Action</a></li>
      <li><a href="#">Another action</a></li>
      <li><a href="#">Something else here</a></li>
      <li role="separator" class="divider"></li>
      <li><a href="#">Separated link</a></li>
    </ul>
  </div><!-- /btn-group -->
  <div class="btn-group">
    <button type="button" class="btn btn-danger">Danger</button>
    <button type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      <span class="caret"></span>
      <span class="sr-only">Toggle Dropdown</span>
    </button>
    <ul class="dropdown-menu">
      <li><a href="#">Action</a></li>
      <li><a href="#">Another action</a></li>
      <li><a href="#">Something else here</a></li>
      <li role="separator" class="divider"></li>
      <li><a href="#">Separated link</a></li>
    </ul>
  </div><!-- /btn-group -->
</div>

```html
<!-- Split button -->
<div class="btn-group">
  <button type="button" class="btn btn-danger">Action</button>
  <button type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <span class="caret"></span>
    <span class="sr-only">Toggle Dropdown</span>
  </button>
  <ul class="dropdown-menu">
    <li><a href="#">Action</a></li>
    <li><a href="#">Another action</a></li>
    <li><a href="#">Something else here</a></li>
    <li role="separator" class="divider"></li>
    <li><a href="#">Separated link</a></li>
  </ul>
</div>
```

### 尺寸

按钮式下拉菜单适用所有尺寸的按钮。

<div class="example-box">
  <div class="btn-toolbar" role="toolbar">
    <div class="btn-group">
      <button class="btn btn-default btn-lg dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Large button <span class="caret"></span>
      </button>
      <ul class="dropdown-menu">
        <li><a href="#">Action</a></li>
        <li><a href="#">Another action</a></li>
        <li><a href="#">Something else here</a></li>
        <li role="separator" class="divider"></li>
        <li><a href="#">Separated link</a></li>
      </ul>
    </div><!-- /btn-group -->
  </div><!-- /btn-toolbar -->
  <div class="btn-toolbar" role="toolbar">
    <div class="btn-group">
      <button class="btn btn-default btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Small button <span class="caret"></span>
      </button>
      <ul class="dropdown-menu">
        <li><a href="#">Action</a></li>
        <li><a href="#">Another action</a></li>
        <li><a href="#">Something else here</a></li>
        <li role="separator" class="divider"></li>
        <li><a href="#">Separated link</a></li>
      </ul>
    </div><!-- /btn-group -->
  </div><!-- /btn-toolbar -->
  <div class="btn-toolbar" role="toolbar">
    <div class="btn-group">
      <button class="btn btn-default btn-xs dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Extra small button <span class="caret"></span>
      </button>
      <ul class="dropdown-menu">
        <li><a href="#">Action</a></li>
        <li><a href="#">Another action</a></li>
        <li><a href="#">Something else here</a></li>
        <li role="separator" class="divider"></li>
        <li><a href="#">Separated link</a></li>
      </ul>
    </div><!-- /btn-group -->
  </div><!-- /btn-toolbar -->
</div>

```html
<!-- Large button group -->
<div class="btn-group">
  <button class="btn btn-default btn-lg dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Large button <span class="caret"></span>
  </button>
  <ul class="dropdown-menu">
    ...
  </ul>
</div>

<!-- Small button group -->
<div class="btn-group">
  <button class="btn btn-default btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Small button <span class="caret"></span>
  </button>
  <ul class="dropdown-menu">
    ...
  </ul>
</div>

<!-- Extra small button group -->
<div class="btn-group">
  <button class="btn btn-default btn-xs dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Extra small button <span class="caret"></span>
  </button>
  <ul class="dropdown-menu">
    ...
  </ul>
</div>
```

### 向上弹出式菜单

给父元素添加 `.dropup` 类就能使触发的下拉菜单朝上方打开。

<div class="example-box">
  <div class="btn-toolbar" role="toolbar">
    <div class="btn-group dropup">
      <button type="button" class="btn btn-default">Dropup</button>
      <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span class="caret"></span>
        <span class="sr-only">Toggle Dropdown</span>
      </button>
      <ul class="dropdown-menu">
        <li><a href="#">Action</a></li>
        <li><a href="#">Another action</a></li>
        <li><a href="#">Something else here</a></li>
        <li role="separator" class="divider"></li>
        <li><a href="#">Separated link</a></li>
      </ul>
    </div><!-- /btn-group -->
    <div class="btn-group dropup">
      <button type="button" class="btn btn-primary">Right dropup</button>
      <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span class="caret"></span>
        <span class="sr-only">Toggle Dropdown</span>
      </button>
      <ul class="dropdown-menu dropdown-menu-right">
        <li><a href="#">Action</a></li>
        <li><a href="#">Another action</a></li>
        <li><a href="#">Something else here</a></li>
        <li role="separator" class="divider"></li>
        <li><a href="#">Separated link</a></li>
      </ul>
    </div><!-- /btn-group -->
  </div>
</div>

```html
<div class="btn-group dropup">
  <button type="button" class="btn btn-default">Dropup</button>
  <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <span class="caret"></span>
    <span class="sr-only">Toggle Dropdown</span>
  </button>
  <ul class="dropdown-menu">
    <!-- Dropdown menu links -->
  </ul>
</div>
```

## 输入框组

<p class="lead">
  通过在文本输入框 `<input>` 前面、后面或是两边加上文字或按钮，可以实现对表单控件的扩展。为 `.input-group` 赋予 `.input-group-addon` 或 `.input-group-btn` 类，可以给 `.form-control` 的前面或后面添加额外的元素。
</p>

<div class="callout callout-danger">
  <h4>只支持文本输入框 `<input>`</h4>
  <p>这里请避免使用 `<select>` 元素，因为 WebKit 浏览器不能完全绘制它的样式。</p>
  <p>避免使用 `<textarea>` 元素，由于它们的 `rows` 属性在某些情况下不被支持。</p>
</div>

<div class="callout callout-warning">
  <h4>输入框组中的工具提示和弹出框需要特别的设置</h4>
  <p>为 `.input-group` 中所包含的元素应用工具提示（tooltip）或popover（弹出框）时，必须设置 `container: 'body'` 参数，为的是避免意外的副作用（例如，工具提示或弹出框被激活后，可能会让当前元素变得更宽或/和变得失去其圆角）。</p>
</div>

<div class="callout callout-warning">
  <h4>不要和其他组件混用</h4>
  <p>不要将表单组或栅格列（column）类直接和输入框组混合使用。而是将输入框组嵌套到表单组或栅格相关元素的内部。</p>
</div>

<div class="callout callout-warning">
  <h4>Always add labels</h4>
  <p>Screen readers will have trouble with your forms if you don't include a label for every input. For these input groups, ensure that any additional label or functionality is conveyed to assistive technologies.</p>
  <p>The exact technique to be used (visible `<label>` elements, `<label>` elements hidden using the `.sr-only` class, or use of the `aria-label`, `aria-labelledby`, `aria-describedby`, `title` or `placeholder` attribute) and what additional information will need to be conveyed will vary depending on the exact type of interface widget you're implementing. The examples in this section provide a few suggested, case-specific approaches.</p>
</div>

### 基本实例

在输入框的任意一侧添加额外元素或按钮。你还可以在输入框的两侧同时添加额外元素。

<strong class="text-danger">我们不支持在输入框的单独一侧添加多个额外元素（`.input-group-addon` 或 `.input-group-btn`）。</strong>

<strong class="text-danger">我们不支持在单个输入框组中添加多个表单控件。</strong>

<form class="example-box">
  <div class="input-group">
    <span class="input-group-addon" id="basic-addon1">@</span>
    <input class="form-control" placeholder="Username" aria-describedby="basic-addon1" type="text">
  </div>
  <br>
  <div class="input-group">
    <input class="form-control" placeholder="Recipient's username" aria-describedby="basic-addon2" type="text">
    <span class="input-group-addon" id="basic-addon2">@example.com</span>
  </div>
  <br>
  <div class="input-group">
    <span class="input-group-addon">$</span>
    <input class="form-control" aria-label="Amount (to the nearest dollar)" type="text">
    <span class="input-group-addon">.00</span>
  </div>
  <br>
  <label for="basic-url">Your vanity URL</label>
  <div class="input-group">
    <span class="input-group-addon" id="basic-addon3">https://example.com/users/</span>
    <input class="form-control" id="basic-url" aria-describedby="basic-addon3" type="text">
  </div>
</form>

```html
<div class="input-group">
  <span class="input-group-addon" id="basic-addon1">@</span>
  <input type="text" class="form-control" placeholder="Username" aria-describedby="basic-addon1">
</div>

<div class="input-group">
  <input type="text" class="form-control" placeholder="Recipient's username" aria-describedby="basic-addon2">
  <span class="input-group-addon" id="basic-addon2">@example.com</span>
</div>

<div class="input-group">
  <span class="input-group-addon">$</span>
  <input type="text" class="form-control" aria-label="Amount (to the nearest dollar)">
  <span class="input-group-addon">.00</span>
</div>

<label for="basic-url">Your vanity URL</label>
<div class="input-group">
  <span class="input-group-addon" id="basic-addon3">https://example.com/users/</span>
  <input type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3">
</div>
```

### 尺寸

为 `.input-group` 添加相应的尺寸类，其内部包含的元素将自动调整自身的尺寸。不需要为输入框组中的每个元素重复地添加控制尺寸的类。

<form class="example-box">
  <div class="input-group input-group-lg">
    <span class="input-group-addon" id="sizing-addon1">@</span>
    <input class="form-control" placeholder="Username" aria-describedby="sizing-addon1" type="text">
  </div>
  <br>
  <div class="input-group">
    <span class="input-group-addon" id="sizing-addon2">@</span>
    <input class="form-control" placeholder="Username" aria-describedby="sizing-addon2" type="text">
  </div>
  <br>
  <div class="input-group input-group-sm">
    <span class="input-group-addon" id="sizing-addon3">@</span>
    <input class="form-control" placeholder="Username" aria-describedby="sizing-addon3" type="text">
  </div>
</form>

```html
<div class="input-group input-group-lg">
  <span class="input-group-addon" id="sizing-addon1">@</span>
  <input type="text" class="form-control" placeholder="Username" aria-describedby="sizing-addon1">
</div>

<div class="input-group">
  <span class="input-group-addon" id="sizing-addon2">@</span>
  <input type="text" class="form-control" placeholder="Username" aria-describedby="sizing-addon2">
</div>

<div class="input-group input-group-sm">
  <span class="input-group-addon" id="sizing-addon3">@</span>
  <input type="text" class="form-control" placeholder="Username" aria-describedby="sizing-addon3">
</div>
```

### 作为额外元素的多选框和单选框

可以将多选框或单选框作为额外元素添加到输入框组中。

<form class="example-box">
  <div class="row">
    <div class="col-lg-6">
      <div class="input-group">
    <span class="input-group-addon">
      <input aria-label="Checkbox for following text input" type="checkbox">
    </span>
        <input class="form-control" aria-label="Text input with checkbox" type="text">
      </div><!-- /input-group -->
    </div><!-- /.col-lg-6 -->
    <div class="col-lg-6">
      <div class="input-group">
    <span class="input-group-addon">
      <input aria-label="Radio button for following text input" type="radio">
    </span>
        <input class="form-control" aria-label="Text input with radio button" type="text">
      </div><!-- /input-group -->
    </div><!-- /.col-lg-6 -->
  </div><!-- /.row -->
</form>

```html
<div class="row">
  <div class="col-lg-6">
    <div class="input-group">
      <span class="input-group-addon">
        <input type="checkbox" aria-label="...">
      </span>
      <input type="text" class="form-control" aria-label="...">
    </div><!-- /input-group -->
  </div><!-- /.col-lg-6 -->
  <div class="col-lg-6">
    <div class="input-group">
      <span class="input-group-addon">
        <input type="radio" aria-label="...">
      </span>
      <input type="text" class="form-control" aria-label="...">
    </div><!-- /input-group -->
  </div><!-- /.col-lg-6 -->
</div><!-- /.row -->
```

### 作为额外元素的按钮

为输入框组添加按钮需要额外添加一层嵌套，不是 `.input-group-addon`，而是添加 `.input-group-btn` 来包裹按钮元素。由于不同浏览器的默认样式无法被统一的重新赋值，所以才需要这样做。

<form class="example-box">
  <div class="row">
    <div class="col-lg-6">
      <div class="input-group">
    <span class="input-group-btn">
      <button class="btn btn-default" type="button">Go!</button>
    </span>
        <input class="form-control" placeholder="Search for..." type="text">
      </div><!-- /input-group -->
    </div><!-- /.col-lg-6 -->
    <div class="col-lg-6">
      <div class="input-group">
        <input class="form-control" placeholder="Search for..." type="text">
        <span class="input-group-btn">
      <button class="btn btn-default" type="button">Go!</button>
    </span>
      </div><!-- /input-group -->
    </div><!-- /.col-lg-6 -->
  </div><!-- /.row -->
</form>

```html
<div class="row">
  <div class="col-lg-6">
    <div class="input-group">
      <span class="input-group-btn">
        <button class="btn btn-default" type="button">Go!</button>
      </span>
      <input type="text" class="form-control" placeholder="Search for...">
    </div><!-- /input-group -->
  </div><!-- /.col-lg-6 -->
  <div class="col-lg-6">
    <div class="input-group">
      <input type="text" class="form-control" placeholder="Search for...">
      <span class="input-group-btn">
        <button class="btn btn-default" type="button">Go!</button>
      </span>
    </div><!-- /input-group -->
  </div><!-- /.col-lg-6 -->
</div><!-- /.row -->
```

### 作为额外元素的按钮式下拉菜单

<form class="example-box">
  <div class="row">
    <div class="col-lg-6">
      <div class="input-group">
        <div class="input-group-btn">
          <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action <span class="caret"></span></button>
          <ul class="dropdown-menu">
            <li><a href="#">Action</a></li>
            <li><a href="#">Another action</a></li>
            <li><a href="#">Something else here</a></li>
            <li role="separator" class="divider"></li>
            <li><a href="#">Separated link</a></li>
          </ul>
        </div><!-- /btn-group -->
        <input class="form-control" aria-label="Text input with dropdown button" type="text">
      </div><!-- /input-group -->
    </div><!-- /.col-lg-6 -->
    <div class="col-lg-6">
      <div class="input-group">
        <input class="form-control" aria-label="Text input with dropdown button" type="text">
        <div class="input-group-btn">
          <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action <span class="caret"></span></button>
          <ul class="dropdown-menu dropdown-menu-right">
            <li><a href="#">Action</a></li>
            <li><a href="#">Another action</a></li>
            <li><a href="#">Something else here</a></li>
            <li role="separator" class="divider"></li>
            <li><a href="#">Separated link</a></li>
          </ul>
        </div><!-- /btn-group -->
      </div><!-- /input-group -->
    </div><!-- /.col-lg-6 -->
  </div><!-- /.row -->
</form>

```html
<div class="row">
  <div class="col-lg-6">
    <div class="input-group">
      <div class="input-group-btn">
        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action <span class="caret"></span></button>
        <ul class="dropdown-menu">
          <li><a href="#">Action</a></li>
          <li><a href="#">Another action</a></li>
          <li><a href="#">Something else here</a></li>
          <li role="separator" class="divider"></li>
          <li><a href="#">Separated link</a></li>
        </ul>
      </div><!-- /btn-group -->
      <input type="text" class="form-control" aria-label="...">
    </div><!-- /input-group -->
  </div><!-- /.col-lg-6 -->
  <div class="col-lg-6">
    <div class="input-group">
      <input type="text" class="form-control" aria-label="...">
      <div class="input-group-btn">
        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action <span class="caret"></span></button>
        <ul class="dropdown-menu dropdown-menu-right">
          <li><a href="#">Action</a></li>
          <li><a href="#">Another action</a></li>
          <li><a href="#">Something else here</a></li>
          <li role="separator" class="divider"></li>
          <li><a href="#">Separated link</a></li>
        </ul>
      </div><!-- /btn-group -->
    </div><!-- /input-group -->
  </div><!-- /.col-lg-6 -->
</div><!-- /.row -->
```

### 作为额外元素的分裂式按钮下拉菜单

<form class="example-box">
  <div class="row">
    <div class="col-lg-6">
      <div class="input-group">
        <div class="input-group-btn">
          <button type="button" class="btn btn-default">Action</button>
          <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span class="caret"></span>
            <span class="sr-only">Toggle Dropdown</span>
          </button>
          <ul class="dropdown-menu">
            <li><a href="#">Action</a></li>
            <li><a href="#">Another action</a></li>
            <li><a href="#">Something else here</a></li>
            <li role="separator" class="divider"></li>
            <li><a href="#">Separated link</a></li>
          </ul>
        </div>
        <input class="form-control" aria-label="Text input with segmented button dropdown" type="text">
      </div><!-- /.input-group -->
    </div><!-- /.col-lg-6 -->
    <div class="col-lg-6">
      <div class="input-group">
        <input class="form-control" aria-label="Text input with segmented button dropdown" type="text">
        <div class="input-group-btn">
          <button type="button" class="btn btn-default">Action</button>
          <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span class="caret"></span>
            <span class="sr-only">Toggle Dropdown</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-right">
            <li><a href="#">Action</a></li>
            <li><a href="#">Another action</a></li>
            <li><a href="#">Something else here</a></li>
            <li role="separator" class="divider"></li>
            <li><a href="#">Separated link</a></li>
          </ul>
        </div>
      </div><!-- /.input-group -->
    </div><!-- /.col-lg-6 -->
  </div><!-- /.row -->
</form>

```html
<div class="input-group">
  <div class="input-group-btn">
    <!-- Button and dropdown menu -->
  </div>
  <input type="text" class="form-control" aria-label="...">
</div>

<div class="input-group">
  <input type="text" class="form-control" aria-label="...">
  <div class="input-group-btn">
    <!-- Button and dropdown menu -->
  </div>
</div>
```

### Multiple buttons

While you can only have one add-on per side, you can have multiple buttons inside a single `.input-group-btn`.

<form class="example-box">
  <div class="row">
    <div class="col-lg-6">
      <div class="input-group">
        <div class="input-group-btn">
          <button type="button" class="btn btn-default" aria-label="Bold"><span class="glyphicon glyphicon-bold"></span></button>
          <button type="button" class="btn btn-default" aria-label="Italic"><span class="glyphicon glyphicon-italic"></span></button>
        </div>
        <input class="form-control" aria-label="Text input with multiple buttons" type="text">
      </div><!-- /.input-group -->
    </div><!-- /.col-lg-6 -->
    <div class="col-lg-6">
      <div class="input-group">
        <input class="form-control" aria-label="Text input with multiple buttons" type="text">
        <div class="input-group-btn">
          <button type="button" class="btn btn-default" aria-label="Help"><span class="glyphicon glyphicon-question-sign"></span></button>
          <button type="button" class="btn btn-default">Action</button>
        </div>
      </div><!-- /.input-group -->
    </div><!-- /.col-lg-6 -->
  </div><!-- /.row -->
</form>

```html
<div class="input-group">
  <div class="input-group-btn">
    <!-- Buttons -->
  </div>
  <input type="text" class="form-control" aria-label="...">
</div>

<div class="input-group">
  <input type="text" class="form-control" aria-label="...">
  <div class="input-group-btn">
    <!-- Buttons -->
  </div>
</div>
```

## 导航

<p class="lead">
  Bootstrap 中的导航组件都依赖同一个 `.nav` 类，状态类也是共用的。改变修饰类可以改变样式。
</p>

<div class="callout callout-info">
  <h4>在标签页上使用导航需要依赖 JavaScript 标签页插件</h4>
  <p>由于标签页需要控制内容区的展示，因此，你必须使用 [标签页组件的 JavaScript 插件](组件模块.html#t1-1_标签页)。另外还要添加 `role` 和 ARIA 属性 &ndash; 详细信息请参考该插件的 [实例](组件模块.html#t1-1_标签页)。</p>
</div>

<div class="callout callout-warning">
  <h4>确保导航组件的可访问性</h4>
  <p>如果你在使用导航组件实现导航条功能，务必在 `<ul>` 的最外侧的逻辑父元素上添加 `role="navigation"` 属性，或者用一个 `<nav>` 元素包裹整个导航组件。不要将 role 属性添加到 `<ul>` 上，因为这样可以被辅助设备（残疾人用的）上被识别为一个真正的列表。</p>
</div>

### 标签页

注意 `.nav-tabs` 类依赖 `.nav` 基类。

<div class="example-box">
  <ul class="nav nav-tabs">
    <li role="presentation" class="active"><a href="#">Home</a></li>
    <li role="presentation"><a href="#">Profile</a></li>
    <li role="presentation"><a href="#">Messages</a></li>
  </ul>
</div>

```html
<ul class="nav nav-tabs">
  <li role="presentation" class="active"><a href="#">Home</a></li>
  <li role="presentation"><a href="#">Profile</a></li>
  <li role="presentation"><a href="#">Messages</a></li>
</ul>
```

### 胶囊式标签页

HTML 标记相同，但使用 `.nav-pills` 类：

<div class="example-box">
  <ul class="nav nav-pills">
    <li role="presentation" class="active"><a href="#">Home</a></li>
    <li role="presentation"><a href="#">Profile</a></li>
    <li role="presentation"><a href="#">Messages</a></li>
  </ul>
</div>

```html
<ul class="nav nav-pills">
  <li role="presentation" class="active"><a href="#">Home</a></li>
  <li role="presentation"><a href="#">Profile</a></li>
  <li role="presentation"><a href="#">Messages</a></li>
</ul>
```

胶囊是标签页也是可以垂直方向堆叠排列的。只需添加 `.nav-stacked` 类。

<div class="example-box">
  <ul class="nav nav-pills nav-stacked nav-pills-stacked-example">
    <li role="presentation" class="active"><a href="#">Home</a></li>
    <li role="presentation"><a href="#">Profile</a></li>
    <li role="presentation"><a href="#">Messages</a></li>
  </ul>
</div>

```html
<ul class="nav nav-pills nav-stacked">
  ...
</ul>
```

### 两端对齐的标签页

在大于 768px 的屏幕上，通过 `.nav-justified` 类可以很容易的让标签页或胶囊式标签呈现出同等宽度。在小屏幕上，导航链接呈现堆叠样式。

<strong class="text-danger">两端对齐的导航条导航链接已经被弃用了。</strong>

<div class="callout callout-warning">
  <h4>Safari 和响应式两端对齐导航</h4>
  <p>从 v9.1.2 版本开始，Safari 有一个bug：对于两端对齐的导航，水平改变浏览器大小将引起绘制错误。此bug可以在 <a href="http://v3.bootcss.com/examples/justified-nav/" target="_blank">两端对齐的导航实例</a> 中得到重现。</p>
</div>

<div class="example-box">
  <ul class="nav nav-tabs nav-justified">
    <li role="presentation" class="active"><a href="#">Home</a></li>
    <li role="presentation"><a href="#">Profile</a></li>
    <li role="presentation"><a href="#">Messages</a></li>
  </ul>
  <br>
  <ul class="nav nav-pills nav-justified">
    <li role="presentation" class="active"><a href="#">Home</a></li>
    <li role="presentation"><a href="#">Profile</a></li>
    <li role="presentation"><a href="#">Messages</a></li>
  </ul>
</div>

```html
<ul class="nav nav-tabs nav-justified">
  ...
</ul>
<ul class="nav nav-pills nav-justified">
  ...
</ul>
```

### 禁用的链接

对任何导航组件（标签页、胶囊式标签页），都可以添加 `.disabled` 类，从而实现**链接为灰色且没有鼠标悬停效果**。

<div class="callout callout-warning">
  <h4>链接功能不受到影响</h4>
  <p>这个类只改变 `<a>` 的外观，不改变功能。可以自己写 JavaScript 禁用这里的链接。</p>
</div>

<div class="example-box">
  <ul class="nav nav-pills">
    <li role="presentation"><a href="#">Clickable link</a></li>
    <li role="presentation"><a href="#">Clickable link</a></li>
    <li role="presentation" class="disabled"><a href="#">Disabled link</a></li>
  </ul>
</div>

```html
<ul class="nav nav-pills">
  ...
  <li role="presentation" class="disabled"><a href="#">Disabled link</a></li>
  ...
</ul>
```

### 添加下拉菜单

用一点点额外 HTML 代码并加入 [下拉菜单插件的 JavaScript 插件](<YFjs工具.html#t0-2-4_下拉菜单+dropdown) 即可。

#### 带下拉菜单的标签页

<div class="example-box">
  <ul class="nav nav-tabs">
    <li role="presentation" class="active"><a href="#">Home</a></li>
    <li role="presentation"><a href="#">Help</a></li>
    <li role="presentation" class="dropdown">
      <a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
        Dropdown <span class="caret"></span>
      </a>
      <ul class="dropdown-menu">
        <li><a href="#">Action</a></li>
        <li><a href="#">Another action</a></li>
        <li><a href="#">Something else here</a></li>
        <li role="separator" class="divider"></li>
        <li><a href="#">Separated link</a></li>
      </ul>
    </li>
  </ul>
</div>

```html
<ul class="nav nav-tabs">
  ...
  <li role="presentation" class="dropdown">
    <a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
      Dropdown <span class="caret"></span>
    </a>
    <ul class="dropdown-menu">
      ...
    </ul>
  </li>
  ...
</ul>
```

#### 带下拉菜单的胶囊式标签页

<div class="example-box">
  <ul class="nav nav-pills">
    <li role="presentation" class="active"><a href="#">Home</a></li>
    <li role="presentation"><a href="#">Help</a></li>
    <li role="presentation" class="dropdown">
      <a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
        Dropdown <span class="caret"></span>
      </a>
      <ul class="dropdown-menu">
        <li><a href="#">Action</a></li>
        <li><a href="#">Another action</a></li>
        <li><a href="#">Something else here</a></li>
        <li role="separator" class="divider"></li>
        <li><a href="#">Separated link</a></li>
      </ul>
    </li>
  </ul>
</div>

```html
<ul class="nav nav-pills">
  ...
  <li role="presentation" class="dropdown">
    <a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
      Dropdown <span class="caret"></span>
    </a>
    <ul class="dropdown-menu">
      ...
    </ul>
  </li>
  ...
</ul>
```

## 导航条

### 默认样式的导航条

导航条是在您的应用或网站中作为导航页头的响应式基础组件。它们在移动设备上可以折叠（并且可开可关），且在视口（viewport）宽度增加时逐渐变为水平展开模式。

<strong class="text-danger">两端对齐的导航条导航链接已经被弃用了。</strong>

<div class="callout callout-warning">
  <h4>导航条内所包含元素溢出</h4>
  <p>由于 Bootstrap 并不知道你在导航条内放置的元素需要占据多宽的空间，你可能会遇到导航条中的内容折行的情况（也就是导航条占据两行）。解决办法如下：</p>
  <ol type="a">
    <li>减少导航条内所有元素所占据的宽度。</li>
    <li>在某些尺寸的屏幕上（利用 [响应式工具类](#t0-9_响应式工具)）隐藏导航条内的一些元素。</li>
    <li>修改导航条在水平排列和折叠排列互相转化时，触发这个转化的最小屏幕宽度值。可以通过修改 `@grid-float-breakpoint` 变量实现，或者自己重写相关的媒体查询代码，覆盖 Bootstrap 的默认值。</li>
  </ol>
</div>

<div class="callout callout-danger">
  <h4>依赖 JavaScript 插件</h4>
  <p>如果 JavaScript 被禁用，并且视口（viewport）足够窄，致使导航条折叠起来，导航条将不能被打开，`.navbar-collapse` 内所包含的内容也将不可见。</p>
  <p>响应式导航条依赖 [collapse 插件](组件模块.html#t1-6_折叠插件)，定制 Bootstrap 的话时候必将其包含。</p>
</div>

<div class="callout callout-info">
  <h4>修改视口的阈值，从而影响导航条的排列模式</h4>
  <p>当浏览器视口（viewport）的宽度小于  `@grid-float-breakpoint` 值时，导航条内部的元素变为折叠排列，也就是变现为移动设备展现模式；当浏览器视口（viewport）的宽度大于  `@grid-float-breakpoint` 值时，导航条内部的元素变为水平排列，也就是变现为非移动设备展现模式。通过调整源码中的这个值，就可以控制导航条何时堆叠排列，何时水平排列。默认值是 `768px` （小屏幕 -- 或者说是平板 --的最小值，或者说是平板）。</p>
</div>

<div class="callout callout-warning">
  <h4>导航条的可访问性</h4>
  <p>务必使用 `<nav>` 元素，或者，如果使用的是通用的 `<div>` 元素的话，务必为导航条设置 `role="navigation"` 属性，这样能够让使用辅助设备的用户明确知道这是一个导航区域。</p>
</div>

<div class="example-box">
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <!-- Brand and toggle get grouped for better mobile display -->
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#">Brand</a>
      </div>
      <!-- Collect the nav links, forms, and other content for toggling -->
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul class="nav navbar-nav">
          <li class="active"><a href="#">Link <span class="sr-only">(current)</span></a></li>
          <li><a href="#">Link</a></li>
          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>
            <ul class="dropdown-menu">
              <li><a href="#">Action</a></li>
              <li><a href="#">Another action</a></li>
              <li><a href="#">Something else here</a></li>
              <li role="separator" class="divider"></li>
              <li><a href="#">Separated link</a></li>
              <li role="separator" class="divider"></li>
              <li><a href="#">One more separated link</a></li>
            </ul>
          </li>
        </ul>
        <form class="navbar-form navbar-left">
          <div class="form-group">
            <input class="form-control" placeholder="Search" type="text">
          </div>
          <button type="submit" class="btn btn-default">Submit</button>
        </form>
        <ul class="nav navbar-nav navbar-right">
          <li><a href="#">Link</a></li>
          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>
            <ul class="dropdown-menu">
              <li><a href="#">Action</a></li>
              <li><a href="#">Another action</a></li>
              <li><a href="#">Something else here</a></li>
              <li role="separator" class="divider"></li>
              <li><a href="#">Separated link</a></li>
            </ul>
          </li>
        </ul>
      </div><!-- /.navbar-collapse -->
    </div><!-- /.container-fluid -->
  </nav>
</div>

```html
<nav class="navbar navbar-default">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#">Brand</a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
        <li class="active"><a href="#">Link <span class="sr-only">(current)</span></a></li>
        <li><a href="#">Link</a></li>
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a href="#">Action</a></li>
            <li><a href="#">Another action</a></li>
            <li><a href="#">Something else here</a></li>
            <li role="separator" class="divider"></li>
            <li><a href="#">Separated link</a></li>
            <li role="separator" class="divider"></li>
            <li><a href="#">One more separated link</a></li>
          </ul>
        </li>
      </ul>
      <form class="navbar-form navbar-left">
        <div class="form-group">
          <input type="text" class="form-control" placeholder="Search">
        </div>
        <button type="submit" class="btn btn-default">Submit</button>
      </form>
      <ul class="nav navbar-nav navbar-right">
        <li><a href="#">Link</a></li>
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a href="#">Action</a></li>
            <li><a href="#">Another action</a></li>
            <li><a href="#">Something else here</a></li>
            <li role="separator" class="divider"></li>
            <li><a href="#">Separated link</a></li>
          </ul>
        </li>
      </ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>
```

### 品牌图标

将导航条内放置品牌标志的地方替换为  `<img>` 元素即可展示自己的品牌图标。由于 `.navbar-brand` 已经被设置了内补（padding）和高度（height），你需要根据自己的情况添加一些 CSS 代码从而覆盖默认设置。

<div class="example-box">
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <div class="navbar-header">
        <a class="navbar-brand" href="#">
          <img alt="Brand" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAB+0lEQVR4AcyYg5LkUBhG+1X2PdZGaW3btm3btm3bHttWrPomd1r/2Jn/VJ02TpxcH4CQ/dsuazWgzbIdrm9dZVd4pBz4zx2igTaFHrhvjneVXNHCSqIlFEjiwMyyyOBilRgGSqLNF1jnwNQdIvAt48C3IlBmHCiLQHC2zoHDu6zG1iXn6+y62ScxY9AODO6w0pvAqf23oSE4joOfH6OxfMoRnoGUm+de8wykbFt6wZtA07QwtNOqKh3ZbS3Wzz2F+1c/QJY0UCJ/J3kXWJfv7VhxCRRV1jGw7XI+gcO7rEFFRvdYxydwcPsVsC0bQdKScngt4iUTD4Fy/8p7PoHzRu1DclwmgmiqgUXjD3oTKHbAt869qdJ7l98jNTEblPTkXMwetpvnftA0LLHb4X8kiY9Kx6Q+W7wJtG0HR7fdrtYz+x7iya0vkEtUULIzCjC21wY+W/GYXusRH5kGytWTLxgEEhePPwhKYb7EK3BQuxWwTBuUkd3X8goUn6fMHLyTT+DCsQdAEXNzSMeVPAJHdF2DmH8poCREp3uwm7HsGq9J9q69iuunX6EgrwQVObjpBt8z6rdPfvE8kiiyhsvHnomrQx6BxYUyYiNS8f75H1w4/ISepDZLoDhNJ9cdNUquhRsv+6EP9oNH7Iff2A9g8h8CLt1gH0Qf9NMQAFnO60BJFQe0AAAAAElFTkSuQmCC" width="20" height="20">
        </a>
      </div>
    </div>
  </nav>
</div>

```html
<nav class="navbar navbar-default">
  <div class="container-fluid">
    <div class="navbar-header">
      <a class="navbar-brand" href="#">
        <img alt="Brand" src="...">
      </a>
    </div>
  </div>
</nav>
```

### 表单

将表单放置于 `.navbar-form` 之内可以呈现很好的垂直对齐，并在较窄的视口（viewport）中呈现折叠状态。 使用对齐选项可以规定其在导航条上出现的位置。

注意，`.navbar-form` 和 `.form-inline` 的大部分代码都一样，内部实现使用了 mixin。 <strong class="text-danger">某些表单组件，例如输入框组，可能需要设置一个固定宽度，从而在导航条内有合适的展现。**

<div class="example-box">
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-2" aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#">Brand</a>
      </div>
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-2">
        <form class="navbar-form navbar-left">
          <div class="form-group">
            <input class="form-control" placeholder="Search" type="text">
          </div>
          <button type="submit" class="btn btn-default">Submit</button>
        </form>
      </div>
    </div>
  </nav>
</div>

```html
<form class="navbar-form navbar-left" role="search">
  <div class="form-group">
    <input type="text" class="form-control" placeholder="Search">
  </div>
  <button type="submit" class="btn btn-default">Submit</button>
</form>
```

<div class="callout callout-warning">
  <h4>移动设备上的注意事项</h4>
  <p>在移动设备上，对于在 fixed 定位的元素内使用表单控件的情况有一些注意事项。[请参考我们提供的浏览器支持情况相关的文档](http://v3.bootcss.com/getting-started/#support-fixed-position-keyboards) 。</p>
</div>

<div class="callout callout-warning">
  <h4>为输入框添加 `label` 标签</h4>
  <p>如果你没有为输入框添加 `label` 标签，屏幕阅读器将会遇到问题。对于导航条内的表单，可以通过添加 `.sr-only` 类隐藏 `label` 标签。</p>
</div>

### 按钮

对于不包含在 `<form>` 中的 `<button>` 元素，加上 `.navbar-btn` 后，可以让它在导航条里垂直居中。有一些对于为辅助设备提供可识别标签的方法，例如， `aria-label`、`aria-labelledby` 或者 `title` 属性。如果这些方法都没有，屏幕阅读器将使用 `placeholder` 属性（如果这个属性存在的话），但是请注意，使用 `placeholder` 代替其他识别标签的方式是不推荐的。

<div class="example-box">
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-3" aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#">Brand</a>
      </div>
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-3">
        <button type="button" class="btn btn-default navbar-btn">Sign in</button>
      </div>
    </div>
  </nav>
</div>

```html
<button type="button" class="btn btn-default navbar-btn">Sign in</button>
```

<div class="callout callout-warning">
  <h4>基于情境的用法</h4>
  <p>就像标准的 [按钮类](#t0-6_按钮) 一样，`.navbar-btn` 可以被用在 `<a>` 和 `<input>` 元素上。然而，在 `.navbar-nav` 内，`.navbar-btn` 和标准的按钮类都不应该被用在 `<a>` 元素上。</p>
</div>

### 文本

把文本包裹在 `.navbar-text`中时，为了有正确的行距和颜色，通常使用 `<p>` 标签。

<div class="example-box">
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-4" aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#">Brand</a>
      </div>
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-4">
        <p class="navbar-text">Signed in as Mark Otto</p>
      </div>
    </div>
  </nav>
</div>

```html
<p class="navbar-text">Signed in as Mark Otto</p>
```

### 非导航的链接

或许你希望在标准的导航组件之外添加标准链接，那么，使用 `.navbar-link` 类可以让链接有正确的默认颜色和反色设置。

<div class="example-box">
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-5" aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#">Brand</a>
      </div>
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-5">
        <p class="navbar-text navbar-right">Signed in as <a href="#" class="navbar-link">Mark Otto</a></p>
      </div>
    </div>
  </nav>
</div>

```html
<p class="navbar-text navbar-right">Signed in as <a href="#" class="navbar-link">Mark Otto</a></p>
```

### 组件排列

通过添加 `.navbar-left` 和 `.navbar-right` 工具类让导航链接、表单、按钮或文本对齐。两个类都会通过 CSS 设置特定方向的浮动样式。例如，要对齐导航链接，就要把它们放在个分开的、应用了工具类的 `<ul>` 标签里。

这些类是 `.pull-left` 和 `.pull-right` 的 mixin 版本，但是他们被限定在了媒体查询（media query）中，这样可以更容易的在各种尺寸的屏幕上处理导航条组件。

<div class="callout callout-warning">
  <h4>向右侧对齐多个组件</h4>
  <p>导航条目前不支持多个 `.navbar-right` 类。为了让内容之间有合适的空隙，我们为最后一个 `.navbar-right` 元素使用负边距（margin）。如果有多个元素使用这个类，它们的边距（margin）将不能按照你的预期正常展现。</p>
  <p>我们将在 v4 版本中重写这个组件时重新审视这个功能。</p>
</div>

### 固定在顶部

添加 `.navbar-fixed-top` 类可以让导航条固定在顶部，还可包含一个 `.container` 或 `.container-fluid` 容器，从而让导航条居中，并在两侧添加内补（padding）。

<div class="example-box example-navbar-top">
  <nav class="navbar navbar-default navbar-fixed-top">
    <!-- We use the fluid option here to avoid overriding the fixed width of a normal container within the narrow content columns. -->
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-6" aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#">Brand</a>
      </div>
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-6">
        <ul class="nav navbar-nav">
          <li class="active"><a href="#">Home</a></li>
          <li><a href="#">Link</a></li>
          <li><a href="#">Link</a></li>
        </ul>
      </div><!-- /.navbar-collapse -->
    </div>
  </nav>
</div>

```html
<nav class="navbar navbar-default navbar-fixed-top">
  <div class="container">
    ...
  </div>
</nav>
```

<div class="callout callout-danger">
  <h4>需要为 `body` 元素设置内补（padding）</h4>
  <p>
    这个固定的导航条会遮住页面上的其它内容，除非你给  `<body>` 元素底部设置了 `padding`。用你自己的值，或用下面给出的代码都可以。提示：导航条的默认高度是 50px。
  </p>
  <pre><code class="scss">body { padding-top: 70px; }</code></pre>
  <p>Make sure to include this **after** the core Bootstrap CSS.</p>
</div>

### 固定在底部

添加 `.navbar-fixed-bottom` 类可以让导航条固定在底部，并且还可以包含一个 `.container` 或 `.container-fluid` 容器，从而让导航条居中，并在两侧添加内补（padding）。

<div class="example-box example-navbar-bottom">
  <nav class="navbar navbar-default navbar-fixed-bottom">
    <!-- We use the fluid option here to avoid overriding the fixed width of a normal container within the narrow content columns. -->
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-7" aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#">Brand</a>
      </div>
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-7">
        <ul class="nav navbar-nav">
          <li class="active"><a href="#">Home</a></li>
          <li><a href="#">Link</a></li>
          <li><a href="#">Link</a></li>
        </ul>
      </div><!-- /.navbar-collapse -->
    </div>
  </nav>
</div>

```html
<nav class="navbar navbar-default navbar-fixed-bottom">
  <div class="container">
    ...
  </div>
</nav>
```

<div class="callout callout-danger">
  <h4>需要为 `body` 元素设置内补（padding）</h4>
  <p>
    这个固定的导航条会遮住页面上的其它内容，除非你给  `<body>` 元素底部设置了 `padding`。用你自己的值，或用下面给出的代码都可以。提示：导航条的默认高度是 50px。
  </p>
  <pre><code class="scss">body { padding-bottom: 70px; }</code></pre>
  <p>Make sure to include this **after** the core Bootstrap CSS.</p>
</div>

### 静止在顶部

通过添加 `.navbar-static-top` 类即可创建一个与页面等宽度的导航条，它会随着页面向下滚动而消失。还可以包含一个 `.container` 或 `.container-fluid` 容器，用于将导航条居中对齐并在两侧添加内补（padding）。

与 `.navbar-fixed-*` 类不同的是，你不用给 `body` 添加任何内补（padding）。

<div class="example-box example-navbar-top">
  <nav class="navbar navbar-default navbar-static-top">
    <!-- We use the fluid option here to avoid overriding the fixed width of a normal container within the narrow content columns. -->
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-8" aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#">Brand</a>
      </div>
      <!-- Collect the nav links, forms, and other content for toggling -->
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-8">
        <ul class="nav navbar-nav">
          <li class="active"><a href="#">Home</a></li>
          <li><a href="#">Link</a></li>
          <li><a href="#">Link</a></li>
        </ul>
      </div><!-- /.navbar-collapse -->
    </div>
  </nav>
</div>

```html
<nav class="navbar navbar-default navbar-static-top">
  <div class="container">
    ...
  </div>
</nav>
```

### 反色的导航条

通过添加 `.navbar-inverse` 类可以改变导航条的外观。

<div class="example-box">
  <nav class="navbar navbar-inverse">
    <div class="container-fluid">
      <!-- Brand and toggle get grouped for better mobile display -->
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-9" aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#">Brand</a>
      </div>
      <!-- Collect the nav links, forms, and other content for toggling -->
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-9">
        <ul class="nav navbar-nav">
          <li class="active"><a href="#">Home</a></li>
          <li><a href="#">Link</a></li>
          <li><a href="#">Link</a></li>
        </ul>
      </div><!-- /.navbar-collapse -->
    </div><!-- /.container-fluid -->
  </nav>
</div>

```html
<nav class="navbar navbar-inverse">
  ...
</nav>
```

## 路径导航

<p class="lead">
  在一个带有层次的导航结构中标明当前页面的位置。
</p>

各路径间的分隔符已经自动通过 CSS 的 `:before` 和 `content` 属性添加了。

<div class="example-box">
  <ol class="breadcrumb">
    <li class="active">Home</li>
  </ol>
  <ol class="breadcrumb">
    <li><a href="#">Home</a></li>
    <li class="active">Library</li>
  </ol>
  <ol class="breadcrumb">
    <li><a href="#">Home</a></li>
    <li><a href="#">Library</a></li>
    <li class="active">Data</li>
  </ol>
</div>

```html
<ol class="breadcrumb">
  <li><a href="#">Home</a></li>
  <li><a href="#">Library</a></li>
  <li class="active">Data</li>
</ol>
```

## 分页

<p class="lead">
  为您的网站或应用提供带有展示页码的分页组件，或者可以使用简单的 [翻页组件](#t1-8-1_翻页)。
</p>

### 默认分页

受 Rdio 的启发，我们提供了这个简单的分页组件，用在应用或搜索结果中超级棒。组件中的每个部分都很大，优点是容易点击、易缩放、点击区域大。

<div class="example-box">
  <nav aria-label="Page navigation">
    <ul class="pagination">
      <li>
        <a href="#" aria-label="Previous">
          <span aria-hidden="true">«</span>
        </a>
      </li>
      <li><a href="#">1</a></li>
      <li><a href="#">2</a></li>
      <li><a href="#">3</a></li>
      <li><a href="#">4</a></li>
      <li><a href="#">5</a></li>
      <li>
        <a href="#" aria-label="Next">
          <span aria-hidden="true">»</span>
        </a>
      </li>
    </ul>
  </nav>
</div>

```html
<nav aria-label="Page navigation">
  <ul class="pagination">
    <li>
      <a href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <li><a href="#">1</a></li>
    <li><a href="#">2</a></li>
    <li><a href="#">3</a></li>
    <li><a href="#">4</a></li>
    <li><a href="#">5</a></li>
    <li>
      <a href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
</nav>
```

<div class="callout callout-info">
  <h4>Labelling the pagination component</h4>
  <p>The pagination component should be wrapped in a `<nav>` element to identify it as a navigation section to screen readers and other assistive technologies. In addition, as a page is likely to have more than one such navigation section already (such as the primary navigation in the header, or a sidebar navigation), it is advisable to provide a descriptive `aria-label` for the `<nav>` which reflects its purpose. For example, if the pagination component is used to navigate between a set of search results, an appropriate label could be `aria-label="Search results pages"`.</p>
</div>

#### 禁用和激活状态

链接在不同情况下可以定制。你可以给不能点击的链接添加 `.disabled` 类、给当前页添加 `.active` 类。

<div class="example-box">
  <nav aria-label="...">
    <ul class="pagination">
      <li class="disabled"><a href="#" aria-label="Previous"><span aria-hidden="true">«</span></a></li>
      <li class="active"><a href="#">1 <span class="sr-only">(current)</span></a></li>
      <li><a href="#">2</a></li>
      <li><a href="#">3</a></li>
      <li><a href="#">4</a></li>
      <li><a href="#">5</a></li>
      <li><a href="#" aria-label="Next"><span aria-hidden="true">»</span></a></li>
    </ul>
  </nav>
</div>

```html
<nav aria-label="...">
  <ul class="pagination">
    <li class="disabled"><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>
    <li class="active"><a href="#">1 <span class="sr-only">(current)</span></a></li>
    ...
  </ul>
</nav>
```

我们建议将 active 或 disabled 状态的链接（即 `<a>` 标签）替换为 `<span>` 标签，或者在向前/向后的箭头处省略`<a>` 标签，这样就可以让其保持需要的样式而不能被点击。

```html
<nav aria-label="...">
  <ul class="pagination">
    <li class="disabled">
      <span>
        <span aria-hidden="true">&laquo;</span>
      </span>
    </li>
    <li class="active">
      <span>1 <span class="sr-only">(current)</span></span>
    </li>
    ...
  </ul>
</nav>
```

#### 尺寸

想要更小或更大的分页？`.pagination-lg` 或 `.pagination-sm` 类提供了额外可供选择的尺寸。

<div class="example-box">
  <nav aria-label="...">
    <ul class="pagination pagination-lg">
      <li><a href="#" aria-label="Previous"><span aria-hidden="true">«</span></a></li>
      <li><a href="#">1</a></li>
      <li><a href="#">2</a></li>
      <li><a href="#">3</a></li>
      <li><a href="#">4</a></li>
      <li><a href="#">5</a></li>
      <li><a href="#" aria-label="Next"><span aria-hidden="true">»</span></a></li>
    </ul>
  </nav>
  <nav aria-label="...">
    <ul class="pagination">
      <li><a href="#" aria-label="Previous"><span aria-hidden="true">«</span></a></li>
      <li><a href="#">1</a></li>
      <li><a href="#">2</a></li>
      <li><a href="#">3</a></li>
      <li><a href="#">4</a></li>
      <li><a href="#">5</a></li>
      <li><a href="#" aria-label="Next"><span aria-hidden="true">»</span></a></li>
    </ul>
  </nav>
  <nav aria-label="...">
    <ul class="pagination pagination-sm">
      <li><a href="#" aria-label="Previous"><span aria-hidden="true">«</span></a></li>
      <li><a href="#">1</a></li>
      <li><a href="#">2</a></li>
      <li><a href="#">3</a></li>
      <li><a href="#">4</a></li>
      <li><a href="#">5</a></li>
      <li><a href="#" aria-label="Next"><span aria-hidden="true">»</span></a></li>
    </ul>
  </nav>
</div>

```html
<nav aria-label="..."><ul class="pagination pagination-lg">...</ul></nav>
<nav aria-label="..."><ul class="pagination">...</ul></nav>
<nav aria-label="..."><ul class="pagination pagination-sm">...</ul></nav>
```

### 翻页

用简单的标记和样式，就能做个上一页和下一页的简单翻页。用在像博客和杂志这样的简单站点上棒极了。

#### 默认实例

在默认的翻页中，链接居中对齐。

<div class="example-box">
  <nav aria-label="...">
    <ul class="pager">
      <li><a href="#">Previous</a></li>
      <li><a href="#">Next</a></li>
    </ul>
  </nav>
</div>

```html
<nav aria-label="...">
  <ul class="pager">
    <li><a href="#">Previous</a></li>
    <li><a href="#">Next</a></li>
  </ul>
</nav>
```

#### 对齐链接

你还可以把链接向两端对齐：

<div class="example-box">
  <nav aria-label="...">
    <ul class="pager">
      <li class="previous"><a href="#"><span aria-hidden="true">←</span> Older</a></li>
      <li class="next"><a href="#">Newer <span aria-hidden="true">→</span></a></li>
    </ul>
  </nav>
</div>

```html
<nav aria-label="...">
  <ul class="pager">
    <li class="previous"><a href="#"><span aria-hidden="true">&larr;</span> Older</a></li>
    <li class="next"><a href="#">Newer <span aria-hidden="true">&rarr;</span></a></li>
  </ul>
</nav>
```

#### 可选的禁用状态

`.disabled` 类也可用于翻页中的链接。

<div class="example-box">
  <nav aria-label="...">
    <ul class="pager">
      <li class="previous disabled"><a href="#"><span aria-hidden="true">←</span> Older</a></li>
      <li class="next"><a href="#">Newer <span aria-hidden="true">→</span></a></li>
    </ul>
  </nav>
</div>

```html
<nav aria-label="...">
  <ul class="pager">
    <li class="previous disabled"><a href="#"><span aria-hidden="true">&larr;</span> Older</a></li>
    <li class="next"><a href="#">Newer <span aria-hidden="true">&rarr;</span></a></li>
  </ul>
</nav>
```

## 标签

### 实例

<div class="example-box">
  <h1>Example heading <span class="label label-default">New</span></h1>
  <h2>Example heading <span class="label label-default">New</span></h2>
  <h3>Example heading <span class="label label-default">New</span></h3>
  <h4>Example heading <span class="label label-default">New</span></h4>
  <h5>Example heading <span class="label label-default">New</span></h5>
  <h6>Example heading <span class="label label-default">New</span></h6>
</div>

```html
<h3>Example heading <span class="label label-default">New</span></h3>
```

### 可用的变体

用下面的任何一个类即可改变标签的外观。

<div class="example-box">
  <span class="label label-default">Default</span>
  <span class="label label-primary">Primary</span>
  <span class="label label-success">Success</span>
  <span class="label label-info">Info</span>
  <span class="label label-warning">Warning</span>
  <span class="label label-danger">Danger</span>
</div>

```html
<span class="label label-default">Default</span>
<span class="label label-primary">Primary</span>
<span class="label label-success">Success</span>
<span class="label label-info">Info</span>
<span class="label label-warning">Warning</span>
<span class="label label-danger">Danger</span>
```

<div class="callout callout-info">
  <h4>如果标签数量很多怎么办？</h4>
  <p>如果你有大量的设置为 `inline` 属性的标签全部放在一个较窄的容器元素内，在页面上展示这些标签就会出现问题，每个标签就会有自己的一个 `inline-block` 元素（就像图标一样）。解决的办法是为每个标签都设置为 `display: inline-block;` 属性。关于这个问题以及实例，请参考 [#13219](https://github.com/twbs/bootstrap/issues/13219) 。</p>
</div>

## 徽章

<p class="lead">
  给链接、导航等元素嵌套 `<span class="badge">` 元素，可以很醒目的展示新的或未读的信息条目。
</p>

<div class="example-box">
  <a href="#">Inbox <span class="badge">42</span></a>
  <br><br>
  <button class="btn btn-primary" type="button">
    Messages <span class="badge">4</span>
  </button>
</div>

```html
<a href="#">Inbox <span class="badge">42</span></a>

<button class="btn btn-primary" type="button">
  Messages <span class="badge">4</span>
</button>
```

#### Self collapsing

如果没有新的或未读的信息条目，也就是说不包含任何内容，徽章组件能够自动隐藏（通过CSS的 `:empty` 选择符实现) 。

<div class="callout callout-danger">
  <h4>跨浏览器兼容性</h4>
  <p>徽章组件在 Internet Explorer 8 浏览器中不会自动消失，因为 IE8 不支持 `:empty` 选择符。</p>
</div>

#### 适配导航元素的激活状态

Bootstrap 提供了内置的样式，让胶囊式导航内处于激活状态的元素所包含的徽章展示相匹配的样式。

<div class="example-box">
  <ul class="nav nav-pills" role="tablist">
    <li role="presentation" class="active"><a href="#">Home <span class="badge">42</span></a></li>
    <li role="presentation"><a href="#">Profile</a></li>
    <li role="presentation"><a href="#">Messages <span class="badge">3</span></a></li>
  </ul>
</div>

```html
<ul class="nav nav-pills" role="tablist">
  <li role="presentation" class="active"><a href="#">Home <span class="badge">42</span></a></li>
  <li role="presentation"><a href="#">Profile</a></li>
  <li role="presentation"><a href="#">Messages <span class="badge">3</span></a></li>
</ul>
```

## 巨幕

这是一个轻量、灵活的组件，它能延伸至整个浏览器视口来展示网站上的关键内容。

<div class="example-box">
  <div class="jumbotron">
    <h1>Hello, world!</h1>
    <p>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
    <p><a class="btn btn-primary btn-lg" href="#" role="button">Learn more</a></p>
  </div>
</div>

```html
<div class="jumbotron">
  <h1>Hello, world!</h1>
  <p>...</p>
  <p><a class="btn btn-primary btn-lg" href="#" role="button">Learn more</a></p>
</div>
```

如果需要让巨幕组件的宽度与浏览器宽度一致并且没有圆角，请把此组件放在所有 `.container` 元素的外面，并在组件内部添加一个 `.container` 元素。

```html
<div class="jumbotron">
  <div class="container">
    ...
  </div>
</div>
```

## 页头

页头组件能够为 `h1` 标签增加适当的空间，并且与页面的其他部分形成一定的分隔。它支持 `h1` 标签内内嵌 `small` 元素的默认效果，还支持大部分其他组件（需要增加一些额外的样式）。

<div class="example-box">
  <div class="page-header">
    <h1>Example page header <small>Subtext for header</small></h1>
  </div>
</div>

```html
<div class="page-header">
  <h1>Example page header <small>Subtext for header</small></h1>
</div>
```

## 缩略图

<p class="lead">
  通过缩略图组件扩展 Bootstrap 的 [栅格系统](#t0-1_栅格系统)，可以很容易地展示栅格样式的图像、视频、文本等内容。
</p>

如果你想实现一个类似 Pinterest 的页面效果（不同高度和/宽度的缩略图顺序排列）的话，你需要使用一个第三方插件，比如 [Masonry](http://masonry.desandro.com)、[Isotope](http://isotope.metafizzy.co) 或 [Salvattore](http://salvattore.com)。

### 默认样式的实例

Boostrap 缩略图的默认设计仅需最少的标签就能展示带链接的图片。

<div class="example-box">
  <div class="row">
    <div class="col-xs-6 col-md-3">
      <a href="#" class="thumbnail">
        <img data-src="holder.js/100%x180" alt="100%x180" style="height: 180px; width: 100%; display: block;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTcxIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDE3MSAxODAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzEwMCV4MTgwCkNyZWF0ZWQgd2l0aCBIb2xkZXIuanMgMi42LjAuCkxlYXJuIG1vcmUgYXQgaHR0cDovL2hvbGRlcmpzLmNvbQooYykgMjAxMi0yMDE1IEl2YW4gTWFsb3BpbnNreSAtIGh0dHA6Ly9pbXNreS5jbwotLT48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWyNob2xkZXJfMTVhNDRlOTRhMDIgdGV4dCB7IGZpbGw6I0FBQUFBQTtmb250LXdlaWdodDpib2xkO2ZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIE9wZW4gU2Fucywgc2Fucy1zZXJpZiwgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxMHB0IH0gXV0+PC9zdHlsZT48L2RlZnM+PGcgaWQ9ImhvbGRlcl8xNWE0NGU5NGEwMiI+PHJlY3Qgd2lkdGg9IjE3MSIgaGVpZ2h0PSIxODAiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSI1OSIgeT0iOTQuOCI+MTcxeDE4MDwvdGV4dD48L2c+PC9nPjwvc3ZnPg==" data-holder-rendered="true">
      </a>
    </div>
    <div class="col-xs-6 col-md-3">
      <a href="#" class="thumbnail">
        <img data-src="holder.js/100%x180" alt="100%x180" style="height: 180px; width: 100%; display: block;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTcxIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDE3MSAxODAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzEwMCV4MTgwCkNyZWF0ZWQgd2l0aCBIb2xkZXIuanMgMi42LjAuCkxlYXJuIG1vcmUgYXQgaHR0cDovL2hvbGRlcmpzLmNvbQooYykgMjAxMi0yMDE1IEl2YW4gTWFsb3BpbnNreSAtIGh0dHA6Ly9pbXNreS5jbwotLT48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWyNob2xkZXJfMTVhNDRlOTU3NDQgdGV4dCB7IGZpbGw6I0FBQUFBQTtmb250LXdlaWdodDpib2xkO2ZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIE9wZW4gU2Fucywgc2Fucy1zZXJpZiwgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxMHB0IH0gXV0+PC9zdHlsZT48L2RlZnM+PGcgaWQ9ImhvbGRlcl8xNWE0NGU5NTc0NCI+PHJlY3Qgd2lkdGg9IjE3MSIgaGVpZ2h0PSIxODAiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSI1OSIgeT0iOTQuOCI+MTcxeDE4MDwvdGV4dD48L2c+PC9nPjwvc3ZnPg==" data-holder-rendered="true">
      </a>
    </div>
    <div class="col-xs-6 col-md-3">
      <a href="#" class="thumbnail">
        <img data-src="holder.js/100%x180" alt="100%x180" style="height: 180px; width: 100%; display: block;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTcxIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDE3MSAxODAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzEwMCV4MTgwCkNyZWF0ZWQgd2l0aCBIb2xkZXIuanMgMi42LjAuCkxlYXJuIG1vcmUgYXQgaHR0cDovL2hvbGRlcmpzLmNvbQooYykgMjAxMi0yMDE1IEl2YW4gTWFsb3BpbnNreSAtIGh0dHA6Ly9pbXNreS5jbwotLT48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWyNob2xkZXJfMTVhNDRlOTc1MGYgdGV4dCB7IGZpbGw6I0FBQUFBQTtmb250LXdlaWdodDpib2xkO2ZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIE9wZW4gU2Fucywgc2Fucy1zZXJpZiwgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxMHB0IH0gXV0+PC9zdHlsZT48L2RlZnM+PGcgaWQ9ImhvbGRlcl8xNWE0NGU5NzUwZiI+PHJlY3Qgd2lkdGg9IjE3MSIgaGVpZ2h0PSIxODAiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSI1OSIgeT0iOTQuOCI+MTcxeDE4MDwvdGV4dD48L2c+PC9nPjwvc3ZnPg==" data-holder-rendered="true">
      </a>
    </div>
    <div class="col-xs-6 col-md-3">
      <a href="#" class="thumbnail">
        <img data-src="holder.js/100%x180" alt="100%x180" style="height: 180px; width: 100%; display: block;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTcxIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDE3MSAxODAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzEwMCV4MTgwCkNyZWF0ZWQgd2l0aCBIb2xkZXIuanMgMi42LjAuCkxlYXJuIG1vcmUgYXQgaHR0cDovL2hvbGRlcmpzLmNvbQooYykgMjAxMi0yMDE1IEl2YW4gTWFsb3BpbnNreSAtIGh0dHA6Ly9pbXNreS5jbwotLT48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWyNob2xkZXJfMTVhNDRlOTlmOTkgdGV4dCB7IGZpbGw6I0FBQUFBQTtmb250LXdlaWdodDpib2xkO2ZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIE9wZW4gU2Fucywgc2Fucy1zZXJpZiwgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxMHB0IH0gXV0+PC9zdHlsZT48L2RlZnM+PGcgaWQ9ImhvbGRlcl8xNWE0NGU5OWY5OSI+PHJlY3Qgd2lkdGg9IjE3MSIgaGVpZ2h0PSIxODAiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSI1OSIgeT0iOTQuOCI+MTcxeDE4MDwvdGV4dD48L2c+PC9nPjwvc3ZnPg==" data-holder-rendered="true">
      </a>
    </div>
  </div>
</div>

```html
<div class="row">
  <div class="col-xs-6 col-md-3">
    <a href="#" class="thumbnail">
      <img src="..." alt="...">
    </a>
  </div>
  ...
</div>
```

### 自定义内容

添加一点点额外的标签，就可以把任何类型的 HTML 内容，例如标题、段落或按钮，加入缩略图组件内。

<div class="example-box">
  <div class="row">
    <div class="col-sm-6 col-md-4">
      <div class="thumbnail">
        <img data-src="holder.js/100%x200" alt="100%x200" style="height: 200px; width: 100%; display: block;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjQyIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDI0MiAyMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzEwMCV4MjAwCkNyZWF0ZWQgd2l0aCBIb2xkZXIuanMgMi42LjAuCkxlYXJuIG1vcmUgYXQgaHR0cDovL2hvbGRlcmpzLmNvbQooYykgMjAxMi0yMDE1IEl2YW4gTWFsb3BpbnNreSAtIGh0dHA6Ly9pbXNreS5jbwotLT48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWyNob2xkZXJfMTVhNDRlOTUyNzAgdGV4dCB7IGZpbGw6I0FBQUFBQTtmb250LXdlaWdodDpib2xkO2ZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIE9wZW4gU2Fucywgc2Fucy1zZXJpZiwgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxMnB0IH0gXV0+PC9zdHlsZT48L2RlZnM+PGcgaWQ9ImhvbGRlcl8xNWE0NGU5NTI3MCI+PHJlY3Qgd2lkdGg9IjI0MiIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSI4OS44NTAwMDAzODE0Njk3MyIgeT0iMTA1LjciPjI0MngyMDA8L3RleHQ+PC9nPjwvZz48L3N2Zz4=" data-holder-rendered="true">
        <div class="caption">
          <h3>Thumbnail label</h3>
          <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
          <p><a href="#" class="btn btn-primary" role="button">Button</a> <a href="#" class="btn btn-default" role="button">Button</a></p>
        </div>
      </div>
    </div>
    <div class="col-sm-6 col-md-4">
      <div class="thumbnail">
        <img data-src="holder.js/100%x200" alt="100%x200" style="height: 200px; width: 100%; display: block;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjQyIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDI0MiAyMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzEwMCV4MjAwCkNyZWF0ZWQgd2l0aCBIb2xkZXIuanMgMi42LjAuCkxlYXJuIG1vcmUgYXQgaHR0cDovL2hvbGRlcmpzLmNvbQooYykgMjAxMi0yMDE1IEl2YW4gTWFsb3BpbnNreSAtIGh0dHA6Ly9pbXNreS5jbwotLT48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWyNob2xkZXJfMTVhNDRlOWFlZGQgdGV4dCB7IGZpbGw6I0FBQUFBQTtmb250LXdlaWdodDpib2xkO2ZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIE9wZW4gU2Fucywgc2Fucy1zZXJpZiwgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxMnB0IH0gXV0+PC9zdHlsZT48L2RlZnM+PGcgaWQ9ImhvbGRlcl8xNWE0NGU5YWVkZCI+PHJlY3Qgd2lkdGg9IjI0MiIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSI4OS44NTAwMDAzODE0Njk3MyIgeT0iMTA1LjciPjI0MngyMDA8L3RleHQ+PC9nPjwvZz48L3N2Zz4=" data-holder-rendered="true">
        <div class="caption">
          <h3>Thumbnail label</h3>
          <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
          <p><a href="#" class="btn btn-primary" role="button">Button</a> <a href="#" class="btn btn-default" role="button">Button</a></p>
        </div>
      </div>
    </div>
    <div class="col-sm-6 col-md-4">
      <div class="thumbnail">
        <img data-src="holder.js/100%x200" alt="100%x200" style="height: 200px; width: 100%; display: block;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjQyIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDI0MiAyMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzEwMCV4MjAwCkNyZWF0ZWQgd2l0aCBIb2xkZXIuanMgMi42LjAuCkxlYXJuIG1vcmUgYXQgaHR0cDovL2hvbGRlcmpzLmNvbQooYykgMjAxMi0yMDE1IEl2YW4gTWFsb3BpbnNreSAtIGh0dHA6Ly9pbXNreS5jbwotLT48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWyNob2xkZXJfMTVhNDRlOTQzM2IgdGV4dCB7IGZpbGw6I0FBQUFBQTtmb250LXdlaWdodDpib2xkO2ZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIE9wZW4gU2Fucywgc2Fucy1zZXJpZiwgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxMnB0IH0gXV0+PC9zdHlsZT48L2RlZnM+PGcgaWQ9ImhvbGRlcl8xNWE0NGU5NDMzYiI+PHJlY3Qgd2lkdGg9IjI0MiIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSI4OS44NTAwMDAzODE0Njk3MyIgeT0iMTA1LjciPjI0MngyMDA8L3RleHQ+PC9nPjwvZz48L3N2Zz4=" data-holder-rendered="true">
        <div class="caption">
          <h3>Thumbnail label</h3>
          <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
          <p><a href="#" class="btn btn-primary" role="button">Button</a> <a href="#" class="btn btn-default" role="button">Button</a></p>
        </div>
      </div>
    </div>
  </div>
</div>

```html
<div class="row">
  <div class="col-sm-6 col-md-4">
    <div class="thumbnail">
      <img src="..." alt="...">
      <div class="caption">
        <h3>Thumbnail label</h3>
        <p>...</p>
        <p><a href="#" class="btn btn-primary" role="button">Button</a> <a href="#" class="btn btn-default" role="button">Button</a></p>
      </div>
    </div>
  </div>
</div>
```

## 警告框

<p class="lead">
  警告框组件通过提供一些灵活的预定义消息，为常见的用户动作提供反馈消息。
</p>

### 实例

将任意文本和一个可选的关闭按钮组合在一起就能组成一个警告框，`.alert` 类是必须要设置的，另外我们还提供了有特殊意义的4个类（例如，`.alert-success`），代表不同的警告信息。

<div class="callout callout-info">
  <h4>没有默认类</h4>
  <p>警告框没有默认类，只有基类和修饰类。默认的灰色警告框并没有多少意义。所以您要使用一种有意义的警告类。目前提供了成功、消息、警告或危险。</p>
</div>

<div class="example-box">
  <div class="alert alert-success" role="alert">
    **Well done!** You successfully read this important alert message.
  </div>
  <div class="alert alert-info" role="alert">
    **Heads up!** This alert needs your attention, but it's not super important.
  </div>
  <div class="alert alert-warning" role="alert">
    **Warning!** Better check yourself, you're not looking too good.
  </div>
  <div class="alert alert-danger" role="alert">
    **Oh snap!** Change a few things up and try submitting again.
  </div>
</div>

```html
<div class="alert alert-success" role="alert">...</div>
<div class="alert alert-info" role="alert">...</div>
<div class="alert alert-warning" role="alert">...</div>
<div class="alert alert-danger" role="alert">...</div>
```

### 可关闭的警告框

为警告框添加一个可选的 `.alert-dismissible` 类和一个关闭按钮。

<div class="callout callout-info">
  <h4>依赖警告框 JavaScript 插件</h4>
  <p>如果需要为警告框组件提供关闭功能，请使用 [jQuery 警告框插件](组件模块.html#t1-4_警告框)。</p>
</div>

<div class="example-box">
  <div class="alert alert-warning alert-dismissible" role="alert">
    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
    **Warning!** Better check yourself, you're not looking too good.
  </div>
</div>

```html
<div class="alert alert-warning alert-dismissible" role="alert">
  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
  <strong>Warning!</strong> Better check yourself, you're not looking too good.
</div>
```

<div class="callout callout-warning">
  <h4>确保在所有设备上的正确行为</h4>
  <p>务必给 `<button>` 元素添加 `data-dismiss="alert"` 属性。</p>
</div>

### 警告框中的链接

用 `.alert-link` 工具类，可以为链接设置与当前警告框相符的颜色。

<div class="example-box">
  <div class="alert alert-success" role="alert">
    **Well done!** You successfully read <a href="#" class="alert-link">this important alert message</a>.
  </div>
  <div class="alert alert-info" role="alert">
    **Heads up!** This <a href="#" class="alert-link">alert needs your attention</a>, but it's not super important.
  </div>
  <div class="alert alert-warning" role="alert">
    **Warning!** Better check yourself, you're <a href="#" class="alert-link">not looking too good</a>.
  </div>
  <div class="alert alert-danger" role="alert">
    **Oh snap!** <a href="#" class="alert-link">Change a few things up</a> and try submitting again.
  </div>
</div>

```html
<div class="alert alert-success" role="alert">
  <a href="#" class="alert-link">...</a>
</div>
<div class="alert alert-info" role="alert">
  <a href="#" class="alert-link">...</a>
</div>
<div class="alert alert-warning" role="alert">
  <a href="#" class="alert-link">...</a>
</div>
<div class="alert alert-danger" role="alert">
  <a href="#" class="alert-link">...</a>
</div>
```

## 进度条

<p class="lead">
  通过这些简单、灵活的进度条，为当前工作流程或动作提供实时反馈。
</p>

<div class="callout callout-danger">
  <h4>跨浏览器兼容性</h4>
  <p>进度条组件使用了 CSS3 的 transition 和 animation 属性来完成一些特效。这些特性在 Internet Explorer 9 或以下版本中、Firefox 的老版本中没有被支持。Opera 12 不支持 animation 属性。</p>
</div>

<div class="callout callout-info">
  <h4 id="callout-progress-csp">Content Security Policy (CSP) compatibility</h4>
  <p>If your website has a [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/Security/CSP) which doesn't allow `style-src 'unsafe-inline'`, then you won't be able to use inline `style` attributes to set progress bar widths as shown in our examples below. Alternative methods for setting the widths that are compatible with strict CSPs include using a little custom JavaScript (that sets `element.style.width`) or using custom CSS classes.</p>
</div>

### 基本实例

默认样式的进度条

<div class="example-box">
  <div class="progress">
    <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;">
      <span class="sr-only">60% Complete</span>
    </div>
  </div>
</div>

```html
<div class="progress">
  <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;">
    <span class="sr-only">60% Complete</span>
  </div>
</div>
```

### 带有提示标签的进度条

将设置了 `.sr-only` 类的 `<span>` 标签从进度条组件中移除 类，从而让当前进度显示出来。

<div class="example-box">
  <div class="progress">
    <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;">
      60%
    </div>
  </div>
</div>

```html
<div class="progress">
  <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;">
    60%
  </div>
</div>
```

在展示很低的百分比时，如果需要让文本提示能够清晰可见，可以为进度条设置 `min-width` 属性。

<div class="example-box">
  <div class="progress">
    <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em;">
      0%
    </div>
  </div>
  <div class="progress">
    <div class="progress-bar" role="progressbar" aria-valuenow="2" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em; width: 2%;">
      2%
    </div>
  </div>
</div>

```html
<div class="progress">
  <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em;">
    0%
  </div>
</div>
<div class="progress">
  <div class="progress-bar" role="progressbar" aria-valuenow="2" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em; width: 2%;">
    2%
  </div>
</div>
```

### 根据情境变化效果

进度条组件使用与按钮和警告框相同的类，根据不同情境展现相应的效果。

<div class="example-box">
  <div class="progress">
    <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 40%">
      <span class="sr-only">40% Complete (success)</span>
    </div>
  </div>
  <div class="progress">
    <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: 20%">
      <span class="sr-only">20% Complete</span>
    </div>
  </div>
  <div class="progress">
    <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%">
      <span class="sr-only">60% Complete (warning)</span>
    </div>
  </div>
  <div class="progress">
    <div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style="width: 80%">
      <span class="sr-only">80% Complete (danger)</span>
    </div>
  </div>
</div>

```html
<div class="progress">
  <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 40%">
    <span class="sr-only">40% Complete (success)</span>
  </div>
</div>
<div class="progress">
  <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: 20%">
    <span class="sr-only">20% Complete</span>
  </div>
</div>
<div class="progress">
  <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%">
    <span class="sr-only">60% Complete (warning)</span>
  </div>
</div>
<div class="progress">
  <div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style="width: 80%">
    <span class="sr-only">80% Complete (danger)</span>
  </div>
</div>
```

### 条纹效果

通过渐变可以为进度条创建条纹效果，IE9 及更低版本不支持。

<div class="example-box">
  <div class="progress">
    <div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 40%">
      <span class="sr-only">40% Complete (success)</span>
    </div>
  </div>
  <div class="progress">
    <div class="progress-bar progress-bar-info progress-bar-striped" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: 20%">
      <span class="sr-only">20% Complete</span>
    </div>
  </div>
  <div class="progress">
    <div class="progress-bar progress-bar-warning progress-bar-striped" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%">
      <span class="sr-only">60% Complete (warning)</span>
    </div>
  </div>
  <div class="progress">
    <div class="progress-bar progress-bar-danger progress-bar-striped" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style="width: 80%">
      <span class="sr-only">80% Complete (danger)</span>
    </div>
  </div>
</div>

```html
<div class="progress">
  <div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 40%">
    <span class="sr-only">40% Complete (success)</span>
  </div>
</div>
<div class="progress">
  <div class="progress-bar progress-bar-info progress-bar-striped" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: 20%">
    <span class="sr-only">20% Complete</span>
  </div>
</div>
<div class="progress">
  <div class="progress-bar progress-bar-warning progress-bar-striped" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%">
    <span class="sr-only">60% Complete (warning)</span>
  </div>
</div>
<div class="progress">
  <div class="progress-bar progress-bar-danger progress-bar-striped" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style="width: 80%">
    <span class="sr-only">80% Complete (danger)</span>
  </div>
</div>
```

### 动画效果

为 `.progress-bar-striped` 添加 `.active` 类，使其呈现出由右向左运动的动画效果。IE9 及更低版本的浏览器不支持。

<div class="example-box">
  <div class="progress">
    <div class="progress-bar progress-bar-striped" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 45%"><span class="sr-only">45% Complete</span></div>
  </div>
  <button type="button" class="btn btn-default bs-docs-activate-animated-progressbar" data-toggle="button" aria-pressed="false" autocomplete="off">Toggle animation</button>
</div>

```html
<div class="progress">
  <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 45%">
    <span class="sr-only">45% Complete</span>
  </div>
</div>
```

### 堆叠效果

把多个进度条放入同一个 `.progress` 中，使它们呈现堆叠的效果。

<div class="example-box">
  <div class="progress">
    <div class="progress-bar progress-bar-success" style="width: 35%">
      <span class="sr-only">35% Complete (success)</span>
    </div>
    <div class="progress-bar progress-bar-warning progress-bar-striped" style="width: 20%">
      <span class="sr-only">20% Complete (warning)</span>
    </div>
    <div class="progress-bar progress-bar-danger" style="width: 10%">
      <span class="sr-only">10% Complete (danger)</span>
    </div>
  </div>
</div>

```html
<div class="progress">
  <div class="progress-bar progress-bar-success" style="width: 35%">
    <span class="sr-only">35% Complete (success)</span>
  </div>
  <div class="progress-bar progress-bar-warning progress-bar-striped" style="width: 20%">
    <span class="sr-only">20% Complete (warning)</span>
  </div>
  <div class="progress-bar progress-bar-danger" style="width: 10%">
    <span class="sr-only">10% Complete (danger)</span>
  </div>
</div>
```

## 媒体对象

<p class="lead">
  这是一个抽象的样式，用以构建不同类型的组件，这些组件都具有在文本内容的左或右侧对齐的图片（就像博客评论或 Twitter 消息等）。
</p>

### 默认样式

默认样式的媒体对象组件允许在一个内容块的左边或右边展示一个多媒体内容（图像、视频、音频）。

<div class="example-box">
  <div class="media">
    <div class="media-left">
      <a href="#">
        <img class="media-object" data-src="holder.js/64x64" alt="64x64" style="width: 64px; height: 64px;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PCEtLQpTb3VyY2UgVVJMOiBob2xkZXIuanMvNjR4NjQKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNWE0NWZhMGM1MCB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1YTQ1ZmEwYzUwIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSIxMi41IiB5PSIzNi44Ij42NHg2NDwvdGV4dD48L2c+PC9nPjwvc3ZnPg==" data-holder-rendered="true">
      </a>
    </div>
    <div class="media-body">
      <h4 class="media-heading">Media heading</h4>
      Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
    </div>
  </div>
  <div class="media">
    <div class="media-left">
      <a href="#">
        <img class="media-object" data-src="holder.js/64x64" alt="64x64" style="width: 64px; height: 64px;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PCEtLQpTb3VyY2UgVVJMOiBob2xkZXIuanMvNjR4NjQKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNWE0NWZhNzY2NyB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1YTQ1ZmE3NjY3Ij48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSIxMi41IiB5PSIzNi44Ij42NHg2NDwvdGV4dD48L2c+PC9nPjwvc3ZnPg==" data-holder-rendered="true">
      </a>
    </div>
    <div class="media-body">
      <h4 class="media-heading">Media heading</h4>
      Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
      <div class="media">
        <div class="media-left">
          <a href="#">
            <img class="media-object" data-src="holder.js/64x64" alt="64x64" style="width: 64px; height: 64px;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PCEtLQpTb3VyY2UgVVJMOiBob2xkZXIuanMvNjR4NjQKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNWE0NWZhNTAwMiB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1YTQ1ZmE1MDAyIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSIxMi41IiB5PSIzNi44Ij42NHg2NDwvdGV4dD48L2c+PC9nPjwvc3ZnPg==" data-holder-rendered="true">
          </a>
        </div>
        <div class="media-body">
          <h4 class="media-heading">Nested media heading</h4>
          Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
        </div>
      </div>
    </div>
  </div>
  <div class="media">
    <div class="media-body">
      <h4 class="media-heading">Media heading</h4>
      Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
    </div>
    <div class="media-right">
      <a href="#">
        <img class="media-object" data-src="holder.js/64x64" alt="64x64" style="width: 64px; height: 64px;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PCEtLQpTb3VyY2UgVVJMOiBob2xkZXIuanMvNjR4NjQKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNWE0NWZhODU3YSB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1YTQ1ZmE4NTdhIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSIxMi41IiB5PSIzNi44Ij42NHg2NDwvdGV4dD48L2c+PC9nPjwvc3ZnPg==" data-holder-rendered="true">
      </a>
    </div>
  </div>
  <div class="media">
    <div class="media-left">
      <a href="#">
        <img class="media-object" data-src="holder.js/64x64" alt="64x64" style="width: 64px; height: 64px;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PCEtLQpTb3VyY2UgVVJMOiBob2xkZXIuanMvNjR4NjQKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNWE0NWZhMmFhOCB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1YTQ1ZmEyYWE4Ij48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSIxMi41IiB5PSIzNi44Ij42NHg2NDwvdGV4dD48L2c+PC9nPjwvc3ZnPg==" data-holder-rendered="true">
      </a>
    </div>
    <div class="media-body">
      <h4 class="media-heading">Media heading</h4>
      Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
    </div>
    <div class="media-right">
      <a href="#">
        <img class="media-object" data-src="holder.js/64x64" alt="64x64" style="width: 64px; height: 64px;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PCEtLQpTb3VyY2UgVVJMOiBob2xkZXIuanMvNjR4NjQKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNWE0NWZhMzE0OCB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1YTQ1ZmEzMTQ4Ij48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSIxMi41IiB5PSIzNi44Ij42NHg2NDwvdGV4dD48L2c+PC9nPjwvc3ZnPg==" data-holder-rendered="true">
      </a>
    </div>
  </div>
</div>

```html
<div class="media">
  <div class="media-left">
    <a href="#">
      <img class="media-object" src="..." alt="...">
    </a>
  </div>
  <div class="media-body">
    <h4 class="media-heading">Media heading</h4>
    ...
  </div>
</div>
```

`.pull-left` 和 `.pull-right` 这两个类以前也曾经被用在了媒体组件上，但是，从 v3.3.0 版本开始，他们就不再被建议使用了。`.media-left` 和 `.media-right` 替代了他们，不同之处是，在 html 结构中， `.media-right` 应当放在 `.media-body` 的后面。

#### 对齐

图片或其他媒体类型可以顶部、中部或底部对齐。默认是顶部对齐。

<div class="example-box">
  <div class="media">
    <div class="media-left">
      <a href="#">
        <img class="media-object" data-src="holder.js/64x64" alt="64x64" style="width: 64px; height: 64px;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PCEtLQpTb3VyY2UgVVJMOiBob2xkZXIuanMvNjR4NjQKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNWE0NWZhNTliOSB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1YTQ1ZmE1OWI5Ij48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSIxMi41IiB5PSIzNi44Ij42NHg2NDwvdGV4dD48L2c+PC9nPjwvc3ZnPg==" data-holder-rendered="true">
      </a>
    </div>
    <div class="media-body">
      <h4 class="media-heading">Top aligned media</h4>
      <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
      <p>Donec sed odio dui. Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
    </div>
  </div>
  <div class="media">
    <div class="media-left media-middle">
      <a href="#">
        <img class="media-object" data-src="holder.js/64x64" alt="64x64" style="width: 64px; height: 64px;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PCEtLQpTb3VyY2UgVVJMOiBob2xkZXIuanMvNjR4NjQKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNWE0NWZhMzA3MCB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1YTQ1ZmEzMDcwIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSIxMi41IiB5PSIzNi44Ij42NHg2NDwvdGV4dD48L2c+PC9nPjwvc3ZnPg==" data-holder-rendered="true">
      </a>
    </div>
    <div class="media-body">
      <h4 class="media-heading">Middle aligned media</h4>
      <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
      <p>Donec sed odio dui. Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
    </div>
  </div>
  <div class="media">
    <div class="media-left media-bottom">
      <a href="#">
        <img class="media-object" data-src="holder.js/64x64" alt="64x64" style="width: 64px; height: 64px;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PCEtLQpTb3VyY2UgVVJMOiBob2xkZXIuanMvNjR4NjQKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNWE0NWZhM2E0OCB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1YTQ1ZmEzYTQ4Ij48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSIxMi41IiB5PSIzNi44Ij42NHg2NDwvdGV4dD48L2c+PC9nPjwvc3ZnPg==" data-holder-rendered="true">
      </a>
    </div>
    <div class="media-body">
      <h4 class="media-heading">Bottom aligned media</h4>
      <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
      <p>Donec sed odio dui. Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
    </div>
  </div>
</div>

```html
<div class="media">
  <div class="media-left media-middle">
    <a href="#">
      <img class="media-object" src="..." alt="...">
    </a>
  </div>
  <div class="media-body">
    <h4 class="media-heading">Middle aligned media</h4>
    ...
  </div>
</div>
```

### 媒体对象列表

用一点点额外的标记，就能在列表内使用媒体对象组件（对评论或文章列表很有用）。

<div class="example-box">
  <ul class="media-list">
    <li class="media">
      <div class="media-left">
        <a href="#">
          <img class="media-object" data-src="holder.js/64x64" alt="64x64" style="width: 64px; height: 64px;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PCEtLQpTb3VyY2UgVVJMOiBob2xkZXIuanMvNjR4NjQKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNWE0NWZhMzkzMiB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1YTQ1ZmEzOTMyIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSIxMi41IiB5PSIzNi44Ij42NHg2NDwvdGV4dD48L2c+PC9nPjwvc3ZnPg==" data-holder-rendered="true">
        </a>
      </div>
      <div class="media-body">
        <h4 class="media-heading">Media heading</h4>
        <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.</p>
        <!-- Nested media object -->
        <div class="media">
          <div class="media-left">
            <a href="#">
              <img class="media-object" data-src="holder.js/64x64" alt="64x64" style="width: 64px; height: 64px;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PCEtLQpTb3VyY2UgVVJMOiBob2xkZXIuanMvNjR4NjQKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNWE0NWZhMjdjZSB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1YTQ1ZmEyN2NlIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSIxMi41IiB5PSIzNi44Ij42NHg2NDwvdGV4dD48L2c+PC9nPjwvc3ZnPg==" data-holder-rendered="true">
            </a>
          </div>
          <div class="media-body">
            <h4 class="media-heading">Nested media heading</h4>
            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
            <!-- Nested media object -->
            <div class="media">
              <div class="media-left">
                <a href="#">
                  <img class="media-object" data-src="holder.js/64x64" alt="64x64" style="width: 64px; height: 64px;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PCEtLQpTb3VyY2UgVVJMOiBob2xkZXIuanMvNjR4NjQKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNWE0NWZhMjEzMCB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1YTQ1ZmEyMTMwIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSIxMi41IiB5PSIzNi44Ij42NHg2NDwvdGV4dD48L2c+PC9nPjwvc3ZnPg==" data-holder-rendered="true">
                </a>
              </div>
              <div class="media-body">
                <h4 class="media-heading">Nested media heading</h4>
                Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
              </div>
            </div>
          </div>
        </div>
        <!-- Nested media object -->
        <div class="media">
          <div class="media-left">
            <a href="#">
              <img class="media-object" data-src="holder.js/64x64" alt="64x64" style="width: 64px; height: 64px;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PCEtLQpTb3VyY2UgVVJMOiBob2xkZXIuanMvNjR4NjQKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNWE0NWZhNDVmYSB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1YTQ1ZmE0NWZhIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSIxMi41IiB5PSIzNi44Ij42NHg2NDwvdGV4dD48L2c+PC9nPjwvc3ZnPg==" data-holder-rendered="true">
            </a>
          </div>
          <div class="media-body">
            <h4 class="media-heading">Nested media heading</h4>
            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.
          </div>
        </div>
      </div>
    </li>
  </ul>
</div>

```html
<ul class="media-list">
  <li class="media">
    <div class="media-left">
      <a href="#">
        <img class="media-object" src="..." alt="...">
      </a>
    </div>
    <div class="media-body">
      <h4 class="media-heading">Media heading</h4>
      ...
    </div>
  </li>
</ul>
```

## 列表组

<p class="lead">
  列表组是灵活又强大的组件，不仅能用于显示一组简单的元素，还能用于复杂的定制的内容。
</p>

### 基本实例

最简单的列表组仅仅是一个带有多个列表条目的无序列表，另外还需要设置适当的类。我们提供了一些预定义的样式，你可以根据自身的需求通过 CSS 自己定制。

<div class="example-box">
  <ul class="list-group">
    <li class="list-group-item">Cras justo odio</li>
    <li class="list-group-item">Dapibus ac facilisis in</li>
    <li class="list-group-item">Morbi leo risus</li>
    <li class="list-group-item">Porta ac consectetur ac</li>
    <li class="list-group-item">Vestibulum at eros</li>
  </ul>
</div>

```html
<ul class="list-group">
  <li class="list-group-item">Cras justo odio</li>
  <li class="list-group-item">Dapibus ac facilisis in</li>
  <li class="list-group-item">Morbi leo risus</li>
  <li class="list-group-item">Porta ac consectetur ac</li>
  <li class="list-group-item">Vestibulum at eros</li>
</ul>
```

### 徽章

给列表组加入徽章组件，它会自动被放在右边。

<div class="example-box">
  <ul class="list-group">
    <li class="list-group-item">
      <span class="badge">14</span>
      Cras justo odio
    </li>
    <li class="list-group-item">
      <span class="badge">2</span>
      Dapibus ac facilisis in
    </li>
    <li class="list-group-item">
      <span class="badge">1</span>
      Morbi leo risus
    </li>
  </ul>
</div>

```html
<ul class="list-group">
  <li class="list-group-item">
    <span class="badge">14</span>
    Cras justo odio
  </li>
</ul>
```

### 链接

用 `<a>` 标签代替 `<li>` 标签可以组成一个全部是链接的列表组（还要注意的是，我们需要将 `<ul>` 标签替换为 `<div>` 标签）。没必要给列表组中的每个元素都加一个父元素。

<div class="example-box">
  <div class="list-group">
    <a href="#" class="list-group-item active">
      Cras justo odio
    </a>
    <a href="#" class="list-group-item">Dapibus ac facilisis in</a>
    <a href="#" class="list-group-item">Morbi leo risus</a>
    <a href="#" class="list-group-item">Porta ac consectetur ac</a>
    <a href="#" class="list-group-item">Vestibulum at eros</a>
  </div>
</div>

```html
<div class="list-group">
  <a href="#" class="list-group-item active">
    Cras justo odio
  </a>
  <a href="#" class="list-group-item">Dapibus ac facilisis in</a>
  <a href="#" class="list-group-item">Morbi leo risus</a>
  <a href="#" class="list-group-item">Porta ac consectetur ac</a>
  <a href="#" class="list-group-item">Vestibulum at eros</a>
</div>
```

### 按钮

列表组中的元素也可以直接就是按钮（也同时意味着父元素必须是 `<div>` 而不能用 `<ul>` 了），并且无需为每个按钮单独包裹一个父元素。<strong class="text-danger">注意不要使用标准的 `.btn` 类！**

<div class="example-box">
  <div class="list-group">
    <button type="button" class="list-group-item">Cras justo odio</button>
    <button type="button" class="list-group-item">Dapibus ac facilisis in</button>
    <button type="button" class="list-group-item">Morbi leo risus</button>
    <button type="button" class="list-group-item">Porta ac consectetur ac</button>
    <button type="button" class="list-group-item">Vestibulum at eros</button>
  </div>
</div>

```html
<div class="list-group">
  <button type="button" class="list-group-item">Cras justo odio</button>
  <button type="button" class="list-group-item">Dapibus ac facilisis in</button>
  <button type="button" class="list-group-item">Morbi leo risus</button>
  <button type="button" class="list-group-item">Porta ac consectetur ac</button>
  <button type="button" class="list-group-item">Vestibulum at eros</button>
</div>
```

### 被禁用的条目

为 `.list-group-item` 添加 `.disabled` 类可以让单个条目显示为灰色，表现出被禁用的效果。

<div class="example-box">
  <div class="list-group">
    <a href="#" class="list-group-item disabled">
      Cras justo odio
    </a>
    <a href="#" class="list-group-item">Dapibus ac facilisis in</a>
    <a href="#" class="list-group-item">Morbi leo risus</a>
    <a href="#" class="list-group-item">Porta ac consectetur ac</a>
    <a href="#" class="list-group-item">Vestibulum at eros</a>
  </div>
</div>

```html
<div class="list-group">
  <a href="#" class="list-group-item disabled">
    Cras justo odio
  </a>
  <a href="#" class="list-group-item">Dapibus ac facilisis in</a>
  <a href="#" class="list-group-item">Morbi leo risus</a>
  <a href="#" class="list-group-item">Porta ac consectetur ac</a>
  <a href="#" class="list-group-item">Vestibulum at eros</a>
</div>
```

### 情境类

为列表中的条目添加情境类，默认样式或链接列表都可以。还可以为列表中的条目设置 `.active` 状态。

<div class="example-box">
  <div class="row">
    <div class="col-sm-6">
      <ul class="list-group">
        <li class="list-group-item list-group-item-success">Dapibus ac facilisis in</li>
        <li class="list-group-item list-group-item-info">Cras sit amet nibh libero</li>
        <li class="list-group-item list-group-item-warning">Porta ac consectetur ac</li>
        <li class="list-group-item list-group-item-danger">Vestibulum at eros</li>
      </ul>
    </div>
    <div class="col-sm-6">
      <div class="list-group">
        <a href="#" class="list-group-item list-group-item-success">Dapibus ac facilisis in</a>
        <a href="#" class="list-group-item list-group-item-info">Cras sit amet nibh libero</a>
        <a href="#" class="list-group-item list-group-item-warning">Porta ac consectetur ac</a>
        <a href="#" class="list-group-item list-group-item-danger">Vestibulum at eros</a>
      </div>
    </div>
  </div>
</div>

```html
<ul class="list-group">
  <li class="list-group-item list-group-item-success">Dapibus ac facilisis in</li>
  <li class="list-group-item list-group-item-info">Cras sit amet nibh libero</li>
  <li class="list-group-item list-group-item-warning">Porta ac consectetur ac</li>
  <li class="list-group-item list-group-item-danger">Vestibulum at eros</li>
</ul>
<div class="list-group">
  <a href="#" class="list-group-item list-group-item-success">Dapibus ac facilisis in</a>
  <a href="#" class="list-group-item list-group-item-info">Cras sit amet nibh libero</a>
  <a href="#" class="list-group-item list-group-item-warning">Porta ac consectetur ac</a>
  <a href="#" class="list-group-item list-group-item-danger">Vestibulum at eros</a>
</div>
```

### 定制内容

列表组中的每个元素都可以是任何 HTML 内容，甚至是像下面的带链接的列表组。

<div class="example-box">
  <div class="list-group">
    <a href="#" class="list-group-item active">
      <h4 class="list-group-item-heading">List group item heading</h4>
      <p class="list-group-item-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
    </a>
    <a href="#" class="list-group-item">
      <h4 class="list-group-item-heading">List group item heading</h4>
      <p class="list-group-item-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
    </a>
    <a href="#" class="list-group-item">
      <h4 class="list-group-item-heading">List group item heading</h4>
      <p class="list-group-item-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
    </a>
  </div>
</div>

```html
<div class="list-group">
  <a href="#" class="list-group-item active">
    <h4 class="list-group-item-heading">List group item heading</h4>
    <p class="list-group-item-text">...</p>
  </a>
</div>
```

## 面板

<p class="lead">
  虽然不总是必须，但是某些时候你可能需要将某些 DOM 内容放到一个盒子里。对于这种情况，可以试试面板组件。
</p>

### 基本实例

默认的 `.panel` 组件所做的只是设置基本的边框（border）和内补（padding）来包含内容。

<div class="example-box">
  <div class="panel panel-default">
    <div class="panel-body">
      Basic panel example
    </div>
  </div>
</div>

```html
<div class="panel panel-default">
  <div class="panel-body">
    Basic panel example
  </div>
</div>
```

### 带标题的面版

通过 `.panel-heading` 可以很简单地为面板加入一个标题容器。你也可以通过添加设置了 `.panel-title` 类的 `<h1>`-`<h6>` 标签，添加一个预定义样式的标题。不过，`<h1>`-`<h6>` 标签的字体大小将被 `.panel-heading` 的样式所覆盖。

为了给链接设置合适的颜色，务必将链接放到带有 `.panel-title` 类的标题标签内。

<div class="example-box">
  <div class="panel panel-default">
    <div class="panel-heading">Panel heading without title</div>
    <div class="panel-body">
      Panel content
    </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading">
      <h3 class="panel-title">Panel title</h3>
    </div>
    <div class="panel-body">
      Panel content
    </div>
  </div>
</div>

```html
<div class="panel panel-default">
  <div class="panel-heading">Panel heading without title</div>
  <div class="panel-body">
    Panel content
  </div>
</div>

<div class="panel panel-default">
  <div class="panel-heading">
    <h3 class="panel-title">Panel title</h3>
  </div>
  <div class="panel-body">
    Panel content
  </div>
</div>
```

### 带注脚的面板

把按钮或次要的文本放入 `.panel-footer` 容器内。注意面版的脚注**不会**从情境效果中继承颜色，因为他们并不是主要内容。

<div class="example-box">
  <div class="panel panel-default">
    <div class="panel-body">
      Panel content
    </div>
    <div class="panel-footer">Panel footer</div>
  </div>
</div>

```html
<div class="panel panel-default">
  <div class="panel-body">
    Panel content
  </div>
  <div class="panel-footer">Panel footer</div>
</div>
```

### 情境效果

像其他组件一样，可以简单地通过加入有情境效果的状态类，给特定的内容使用更针对特定情境的面版。

<div class="example-box">
  <div class="panel panel-primary">
    <div class="panel-heading">
      <h3 class="panel-title">Panel title</h3>
    </div>
    <div class="panel-body">
      Panel content
    </div>
  </div>
  <div class="panel panel-success">
    <div class="panel-heading">
      <h3 class="panel-title">Panel title</h3>
    </div>
    <div class="panel-body">
      Panel content
    </div>
  </div>
  <div class="panel panel-info">
    <div class="panel-heading">
      <h3 class="panel-title">Panel title</h3>
    </div>
    <div class="panel-body">
      Panel content
    </div>
  </div>
  <div class="panel panel-warning">
    <div class="panel-heading">
      <h3 class="panel-title">Panel title</h3>
    </div>
    <div class="panel-body">
      Panel content
    </div>
  </div>
  <div class="panel panel-danger">
    <div class="panel-heading">
      <h3 class="panel-title">Panel title</h3>
    </div>
    <div class="panel-body">
      Panel content
    </div>
  </div>
</div>

```html
<div class="panel panel-primary">...</div>
<div class="panel panel-success">...</div>
<div class="panel panel-info">...</div>
<div class="panel panel-warning">...</div>
<div class="panel panel-danger">...</div>
```

### 带表格的面版

为面板中不需要边框的表格添加 `.table` 类，是整个面板看上去更像是一个整体设计。如果是带有 `.panel-body` 的面板，我们为表格的上方添加一个边框，看上去有分隔效果。

<div class="example-box">
  <div class="panel panel-default">
    <!-- Default panel contents -->
    <div class="panel-heading">Panel heading</div>
    <div class="panel-body">
      <p>Some default panel content here. Nulla vitae elit libero, a pharetra augue. Aenean lacinia bibendum nulla sed consectetur. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
    </div>
    <!-- Table -->
    <table class="table">
      <thead>
      <tr>
        <th>#</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Username</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <th scope="row">1</th>
        <td>Mark</td>
        <td>Otto</td>
        <td>@mdo</td>
      </tr>
      <tr>
        <th scope="row">2</th>
        <td>Jacob</td>
        <td>Thornton</td>
        <td>@fat</td>
      </tr>
      <tr>
        <th scope="row">3</th>
        <td>Larry</td>
        <td>the Bird</td>
        <td>@twitter</td>
      </tr>
      </tbody>
    </table>
  </div>
</div>

```html
<div class="panel panel-default">
  <!-- Default panel contents -->
  <div class="panel-heading">Panel heading</div>
  <div class="panel-body">
    <p>...</p>
  </div>

  <!-- Table -->
  <table class="table">
    ...
  </table>
</div>
```

如果没有 `.panel-body` ，面版标题会和表格连接起来，没有空隙。

<div class="example-box">
  <div class="panel panel-default">
    <!-- Default panel contents -->
    <div class="panel-heading">Panel heading</div>
    <!-- Table -->
    <table class="table">
      <thead>
      <tr>
        <th>#</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Username</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <th scope="row">1</th>
        <td>Mark</td>
        <td>Otto</td>
        <td>@mdo</td>
      </tr>
      <tr>
        <th scope="row">2</th>
        <td>Jacob</td>
        <td>Thornton</td>
        <td>@fat</td>
      </tr>
      <tr>
        <th scope="row">3</th>
        <td>Larry</td>
        <td>the Bird</td>
        <td>@twitter</td>
      </tr>
      </tbody>
    </table>
  </div>
</div>

```html
<div class="panel panel-default">
  <!-- Default panel contents -->
  <div class="panel-heading">Panel heading</div>

          <!-- Table -->
  <table class="table">
    ...
  </table>
</div>
```

### 带列表组的面版

可以简单地在任何面版中加入具有最大宽度的 [列表组](#t1-17_列表组)。

<div class="example-box">
  <div class="panel panel-default">
    <!-- Default panel contents -->
    <div class="panel-heading">Panel heading</div>
    <div class="panel-body">
      <p>Some default panel content here. Nulla vitae elit libero, a pharetra augue. Aenean lacinia bibendum nulla sed consectetur. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
    </div>
    <!-- List group -->
    <ul class="list-group">
      <li class="list-group-item">Cras justo odio</li>
      <li class="list-group-item">Dapibus ac facilisis in</li>
      <li class="list-group-item">Morbi leo risus</li>
      <li class="list-group-item">Porta ac consectetur ac</li>
      <li class="list-group-item">Vestibulum at eros</li>
    </ul>
  </div>
</div>

```html
<div class="panel panel-default">
  <!-- Default panel contents -->
  <div class="panel-heading">Panel heading</div>
  <div class="panel-body">
    <p>...</p>
  </div>

  <!-- List group -->
  <ul class="list-group">
    <li class="list-group-item">Cras justo odio</li>
    <li class="list-group-item">Dapibus ac facilisis in</li>
    <li class="list-group-item">Morbi leo risus</li>
    <li class="list-group-item">Porta ac consectetur ac</li>
    <li class="list-group-item">Vestibulum at eros</li>
  </ul>
</div>
```

## 具有响应式特性的嵌入内容

根据被嵌入内容的外部容器的宽度，自动创建一个固定的比例，从而让浏览器自动确定视频或 slideshow 的尺寸，能够在各种设备上缩放。

这些规则被直接应用在 `<iframe>`、`<embed>`、`<video>` 和 `<object>` 元素上。如果你希望让最终样式与其他属性相匹配，还可以明确地使用一个派生出来的 `.embed-responsive-item` 类。

**超级提示：** 不需要为 `<iframe>` 元素设置 `frameborder="0"` 属性，因为我们已经替你这样做了！

<div class="example-box">
  <div class="embed-responsive embed-responsive-16by9">
    <iframe class="embed-responsive-item" src="http://v3.bootcss.com/" allowfullscreen=""></iframe>
  </div>
</div>

```html
<!-- 16:9 aspect ratio -->
<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="..."></iframe>
</div>

<!-- 4:3 aspect ratio -->
<div class="embed-responsive embed-responsive-4by3">
  <iframe class="embed-responsive-item" src="..."></iframe>
</div>
```

## Well

### 默认效果

把 Well 用在元素上，就能有嵌入（inset）的简单效果。

<div class="example-box">
  <div class="well">
    Look, I'm in a well!
  </div>
</div>

```html
<div class="well">...</div>
```

### 可选类/样式

通过这两种可选修饰类，可以控制此组件的内补（padding）和圆角的设置。

<div class="example-box">
  <div class="well well-lg">
    Look, I'm in a large well!
  </div>
</div>

```html
<div class="well well-lg">...</div>
```

<div class="example-box">
  <div class="well well-sm">
    Look, I'm in a small well!
  </div>
</div>

```html
<div class="well well-sm">...</div>
```

# 扩展增强样式

YFjs 组件库在 Bootstrap 3 基础上扩展了日常网页开发中常用到的一些样式。

## 文本

### 换行文本

相对于让文本不换行的类 `.text-nowrap` 来说，如果想让文本正确换行，可以使用 `.text-break` 类。

<div class="example-box">
  <p class="text-break">
    当显示一长串的英文文本段落时，我们经常会遇到内容无法正常换行的情况。( When the display English paragraphs of text a long string, we often encounter the content can not be normal line. )
  </p>
</div>

```html
<p class="text-break">
  ...
</p>
```

### 省略文本

对于较长的文本内容，如果希望只展示一行的内容并在末尾显示省略号（**溢出文本的省略**），可以使用 `.text-ellipsis` 类。

<div class="example-box">
  <p class="text-ellipsis">
    Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam id dolor id nibh ultricies vehicula.
  </p>
</div>

```html
<p class="text-ellipsis">
  ...
</p>
```

## 字体图标

### FontAwesome

组件库默认加入了 [FontAwesome](http://fontawesome.io/icons/) 的整套字体图标库（更新至 4.7.0 版本），其下的所有字体图标均可直接使用。

可以前往 <a href="../static/demo/fontawesome.html" target="_blank">FontAwesome 图标示例</a> 页面查看所有可用的 FontAwesome 图标。