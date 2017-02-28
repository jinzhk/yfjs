define('yfjs/spa/util/view', [
    '../version', './helpers', './event', './error', './widget'
], function(
    Version, _, Event, Error, Widget
) {

    var NAMESPACE = "View";

    var View = Widget({
        NAMESPACE : NAMESPACE,
        VERSION : Version(NAMESPACE),

        DEFAULTS : {
            /**
             * 当前 view 使用的布局 {String|Function}
             * - 相对于 layouts 目录
             * - 只有最上层的 view 的 layout 配置项起作用
             * - 为 Function 类型时获取返回结果。this 指针指向当前 view 的接口实例
             */
            layout: _.__undef__
        },

        CONTAINER_ID : "app-view",
        BIND_KEY     : "data-view",

        Event : Event(NAMESPACE),
        Error : Error(NAMESPACE),

        defaultState: function(state) {
            return state || {};
        }
    });

    View.Error.translate({
        'script_unfound': "加载 {0} 视图失败。找不到依赖文件或模块 {1}",
        'script_timeout': "加载 {0} 视图失败。依赖文件或模块 {1} 加载超时",
        'script_error': "加载 {0} 视图失败。文件 {1} 存在错误：{2}",
        'script_invalid_return': "加载 {0} 视图失败。视图文件 {1} 必须明确返回视图实例",
        'callback': "执行 {0} 视图的 {1} 时发生了错误: {2}",
        'style_unfound': "视图 {0} 错误。{1}",
        'load_fail': "加载 {0} 视图失败。{1}"
    });

    View.Error.translate(
        'setter',
        "视图 {0} 设置错误。无法设置实例属性 {1}，因为它是视图实例的固有属性"
    );

    View.Error.translate(
        'include_limit',
        "视图 {0} 模板引入错误。引入 {1} 时超过最大引入层数（" + Widget.INCLUDE_LEVEL_LIMIT +"）限制"
    );

    return View;
});