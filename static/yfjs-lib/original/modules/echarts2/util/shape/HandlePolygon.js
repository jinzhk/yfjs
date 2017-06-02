define('echarts2/util/shape/HandlePolygon', [
    'require',
    'zrender2/shape/Base',
    'zrender2/shape/Polygon',
    'zrender2/tool/util'
], function (require) {
    var Base = require('zrender2/shape/Base');
    var PolygonShape = require('zrender2/shape/Polygon');
    var zrUtil = require('zrender2/tool/util');
    function HandlePolygon(options) {
        Base.call(this, options);
    }
    HandlePolygon.prototype = {
        type: 'handle-polygon',
        buildPath: function (ctx, style) {
            PolygonShape.prototype.buildPath(ctx, style);
        },
        isCover: function (x, y) {
            var originPos = this.transformCoordToLocal(x, y);
            x = originPos[0];
            y = originPos[1];
            var rect = this.style.rect;
            if (x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height) {
                return true;
            } else {
                return false;
            }
        }
    };
    zrUtil.inherits(HandlePolygon, Base);
    return HandlePolygon;
});