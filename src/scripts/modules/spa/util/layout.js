define('yfjs/spa/util/layout', [
    '../version', './helpers', './event', './error', './widget'
], function(
    Version, _, Event, Error, Widget
) {

    var NAMESPACE = "Layout";

    var Layout = Widget({
        NAMESPACE : NAMESPACE,
        VERSION   : Version(NAMESPACE),

        CONTAINER_ID : "app-layout",
        BIND_KEY     : "data-layout",

        Event : Event(NAMESPACE),
        Error : Error(NAMESPACE),

        PREFIX_PATH_SCRIPT   : "app/layouts",
        PREFIX_PATH_TEMPLATE : "app/templates/layouts",

        defaultTemplate: function(template) {
            if (!_.isUndef(template)) {
                template = template || "{{body}}";
            }
            return template;
        }
    });

    Layout.Error.translate({
        'script_unfound': "加载 {0} 布局失败。找不到依赖文件或模块 {1}",
        'script_timeout': "加载 {0} 布局失败。依赖文件或模块 {1} 加载超时",
        'script_error': "加载 {0} 布局失败。文件 {1} 存在错误：{2}",
        'script_invalid_return': "加载 {0} 布局失败。布局文件 {1} 必须明确返回布局实例",
        'callback': "执行 {0} 布局的 {1} 时发生了错误: {2}",
        'style_unfound': "布局 {0} - {1}",
        'load_fail': "加载 {0} 布局失败。{1}"
    });

    Layout.Error.translate(
        'setter',
        "布局 {0} 设置错误。无法设置实例属性 {1}，因为它是布局实例的固有属性"
    );

    Layout.Error.translate(
        'include_limit',
        "布局 {0} 模板引入错误。引入 {1} 时超过最大引入层数（" + Widget.INCLUDE_LEVEL_LIMIT +"）限制"
    );

    return Layout;
});