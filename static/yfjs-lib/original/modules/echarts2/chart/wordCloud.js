define('echarts2/chart/wordCloud', [
    'require',
    './base',
    'zrender2/shape/Text',
    '../layout/WordCloud',
    '../component/grid',
    '../component/dataRange',
    '../config',
    '../util/ecData',
    'zrender2/tool/util',
    'zrender2/tool/color',
    '../chart'
], function (require) {
    var ChartBase = require('./base');
    var TextShape = require('zrender2/shape/Text');
    var CloudLayout = require('../layout/WordCloud');
    require('../component/grid');
    require('../component/dataRange');
    var ecConfig = require('../config');
    var ecData = require('../util/ecData');
    var zrUtil = require('zrender2/tool/util');
    var zrColor = require('zrender2/tool/color');
    ecConfig.wordCloud = {
        zlevel: 0,
        z: 2,
        clickable: true,
        center: [
            '50%',
            '50%'
        ],
        size: [
            '40%',
            '40%'
        ],
        textRotation: [
            0,
            90
        ],
        textPadding: 0,
        autoSize: {
            enable: true,
            minSize: 12
        },
        itemStyle: {
            normal: {
                textStyle: {
                    fontSize: function (data) {
                        return data.value;
                    }
                }
            }
        }
    };
    function Cloud(ecTheme, messageCenter, zr, option, myChart) {
        ChartBase.call(this, ecTheme, messageCenter, zr, option, myChart);
        this.refresh(option);
    }
    Cloud.prototype = {
        type: ecConfig.CHART_TYPE_WORDCLOUD,
        refresh: function (newOption) {
            if (newOption) {
                this.option = newOption;
                this.series = newOption.series;
            }
            this._init();
        },
        _init: function () {
            var series = this.series;
            this.backupShapeList();
            var legend = this.component.legend;
            for (var i = 0; i < series.length; i++) {
                if (series[i].type === ecConfig.CHART_TYPE_WORDCLOUD) {
                    series[i] = this.reformOption(series[i]);
                    var serieName = series[i].name || '';
                    this.selectedMap[serieName] = legend ? legend.isSelected(serieName) : true;
                    if (!this.selectedMap[serieName]) {
                        continue;
                    }
                    this.buildMark(i);
                    this._initSerie(series[i]);
                }
            }
        },
        _initSerie: function (serie) {
            var textStyle = serie.itemStyle.normal.textStyle;
            var size = [
                this.parsePercent(serie.size[0], this.zr.getWidth()) || 200,
                this.parsePercent(serie.size[1], this.zr.getHeight()) || 200
            ];
            var center = this.parseCenter(this.zr, serie.center);
            var layoutConfig = {
                size: size,
                wordletype: { autoSizeCal: serie.autoSize },
                center: center,
                rotate: serie.textRotation,
                padding: serie.textPadding,
                font: textStyle.fontFamily,
                fontSize: textStyle.fontSize,
                fontWeight: textStyle.fontWeight,
                fontStyle: textStyle.fontStyle,
                text: function (d) {
                    return d.name;
                },
                data: serie.data
            };
            var clouds = new CloudLayout(layoutConfig);
            var self = this;
            clouds.end(function (d) {
                self._buildShapes(d);
            });
            clouds.start();
        },
        _buildShapes: function (data) {
            var len = data.length;
            for (var i = 0; i < len; i++) {
                this._buildTextShape(data[i], 0, i);
            }
            this.addShapeList();
        },
        _buildTextShape: function (oneText, seriesIndex, dataIndex) {
            var series = this.series;
            var serie = series[seriesIndex];
            var serieName = serie.name || '';
            var data = serie.data[dataIndex];
            var queryTarget = [
                data,
                serie
            ];
            var legend = this.component.legend;
            var defaultColor = legend ? legend.getColor(serieName) : this.zr.getColor(seriesIndex);
            var normal = this.deepMerge(queryTarget, 'itemStyle.normal') || {};
            var emphasis = this.deepMerge(queryTarget, 'itemStyle.emphasis') || {};
            var normalColor = this.getItemStyleColor(normal.color, seriesIndex, dataIndex, data) || defaultColor;
            var emphasisColor = this.getItemStyleColor(emphasis.color, seriesIndex, dataIndex, data) || (typeof normalColor === 'string' ? zrColor.lift(normalColor, -0.2) : normalColor);
            var textShape = new TextShape({
                zlevel: serie.zlevel,
                z: serie.z,
                hoverable: true,
                clickable: this.deepQuery(queryTarget, 'clickable'),
                style: {
                    x: 0,
                    y: 0,
                    text: oneText.text,
                    color: normalColor,
                    textFont: [
                        oneText.style,
                        oneText.weight,
                        oneText.size + 'px',
                        oneText.font
                    ].join(' '),
                    textBaseline: 'alphabetic',
                    textAlign: 'center'
                },
                highlightStyle: {
                    brushType: emphasis.borderWidth ? 'both' : 'fill',
                    color: emphasisColor,
                    lineWidth: emphasis.borderWidth || 0,
                    strokeColor: emphasis.borderColor
                },
                position: [
                    oneText.x,
                    oneText.y
                ],
                rotation: [
                    -oneText.rotate / 180 * Math.PI,
                    0,
                    0
                ]
            });
            ecData.pack(textShape, serie, seriesIndex, data, dataIndex, data.name);
            this.shapeList.push(textShape);
        }
    };
    zrUtil.inherits(Cloud, ChartBase);
    require('../chart').define('wordCloud', Cloud);
    return Cloud;
});define('echarts2/layout/WordCloud', [
    'require',
    '../layout/WordCloudRectZero',
    'zrender2/tool/util'
], function (require) {
    var ZeroArray = require('../layout/WordCloudRectZero');
    var zrUtil = require('zrender2/tool/util');
    function CloudLayout(option) {
        this._init(option);
    }
    CloudLayout.prototype = {
        start: function () {
            var board = null;
            var maxWit = 0;
            var maxHit = 0;
            var maxArea = 0;
            var i = -1;
            var tags = [];
            var maxBounds = null;
            var data = this.wordsdata;
            var dfop = this.defaultOption;
            var wordletype = dfop.wordletype;
            var size = dfop.size;
            var that = this;
            var zeroArrayObj = new ZeroArray({
                type: wordletype.type,
                width: size[0],
                height: size[1]
            });
            zeroArrayObj.calculate(function (options) {
                board = options.initarr;
                maxWit = options.maxWit;
                maxHit = options.maxHit;
                maxArea = options.area;
                maxBounds = options.imgboard;
                startStep();
            }, this);
            return this;
            function startStep() {
                that.totalArea = maxArea;
                if (wordletype.autoSizeCal.enable) {
                    that._autoCalTextSize(data, maxArea, maxWit, maxHit, wordletype.autoSizeCal.minSize);
                }
                if (dfop.timer) {
                    clearInterval(dfop.timer);
                }
                dfop.timer = setInterval(step, 0);
                step();
            }
            function step() {
                var start = +new Date();
                var n = data.length;
                var d;
                while (+new Date() - start < dfop.timeInterval && ++i < n && dfop.timer) {
                    d = data[i];
                    d.x = size[0] >> 1;
                    d.y = size[1] >> 1;
                    that._cloudSprite(d, data, i);
                    if (d.hasText && that._place(board, d, maxBounds)) {
                        tags.push(d);
                        d.x -= size[0] >> 1;
                        d.y -= size[1] >> 1;
                    }
                }
                if (i >= n) {
                    that.stop();
                    that._fixTagPosition(tags);
                    dfop.endcallback(tags);
                }
            }
        },
        _fixTagPosition: function (tags) {
            var center = this.defaultOption.center;
            for (var i = 0, len = tags.length; i < len; i++) {
                tags[i].x += center[0];
                tags[i].y += center[1];
            }
        },
        stop: function () {
            if (this.defaultOption.timer) {
                clearInterval(this.defaultOption.timer);
                this.defaultOption.timer = null;
            }
            return this;
        },
        end: function (v) {
            if (v) {
                this.defaultOption.endcallback = v;
            }
            return this;
        },
        _init: function (option) {
            this.defaultOption = {};
            this._initProperty(option);
            this._initMethod(option);
            this._initCanvas();
            this._initData(option.data);
        },
        _initData: function (datas) {
            var that = this;
            var thatop = that.defaultOption;
            this.wordsdata = datas.map(function (d, i) {
                d.text = thatop.text.call(that, d, i);
                d.font = thatop.font.call(that, d, i);
                d.style = thatop.fontStyle.call(that, d, i);
                d.weight = thatop.fontWeight.call(that, d, i);
                d.rotate = thatop.rotate.call(that, d, i);
                d.size = ~~thatop.fontSize.call(that, d, i);
                d.padding = thatop.padding.call(that, d, i);
                return d;
            }).sort(function (a, b) {
                return b.value - a.value;
            });
        },
        _initMethod: function (option) {
            var dfop = this.defaultOption;
            dfop.text = option.text ? functor(option.text) : cloudText;
            dfop.font = option.font ? functor(option.font) : cloudFont;
            dfop.fontSize = option.fontSize ? functor(option.fontSize) : cloudFontSize;
            dfop.fontStyle = option.fontStyle ? functor(option.fontStyle) : cloudFontNormal;
            dfop.fontWeight = option.fontWeight ? functor(option.fontWeight) : cloudFontNormal;
            dfop.rotate = option.rotate ? newCloudRotate(option.rotate) : cloudRotate;
            dfop.padding = option.padding ? functor(option.padding) : cloudPadding;
            dfop.center = option.center;
            dfop.spiral = archimedeanSpiral;
            dfop.endcallback = function () {
            };
            dfop.rectangularSpiral = rectangularSpiral;
            dfop.archimedeanSpiral = archimedeanSpiral;
            function cloudText(d) {
                return d.name;
            }
            function cloudFont() {
                return 'sans-serif';
            }
            function cloudFontNormal() {
                return 'normal';
            }
            function cloudFontSize(d) {
                return d.value;
            }
            function cloudRotate() {
                return 0;
            }
            function newCloudRotate(rotate) {
                return function () {
                    return rotate[Math.round(Math.random() * (rotate.length - 1))];
                };
            }
            function cloudPadding() {
                return 0;
            }
            function archimedeanSpiral(size) {
                var e = size[0] / size[1];
                return function (t) {
                    return [
                        e * (t *= 0.1) * Math.cos(t),
                        t * Math.sin(t)
                    ];
                };
            }
            function rectangularSpiral(size) {
                var dy = 4;
                var dx = dy * size[0] / size[1];
                var x = 0;
                var y = 0;
                return function (t) {
                    var sign = t < 0 ? -1 : 1;
                    switch (Math.sqrt(1 + 4 * sign * t) - sign & 3) {
                    case 0:
                        x += dx;
                        break;
                    case 1:
                        y += dy;
                        break;
                    case 2:
                        x -= dx;
                        break;
                    default:
                        y -= dy;
                        break;
                    }
                    return [
                        x,
                        y
                    ];
                };
            }
            function functor(v) {
                return typeof v === 'function' ? v : function () {
                    return v;
                };
            }
        },
        _initProperty: function (option) {
            var dfop = this.defaultOption;
            dfop.size = option.size || [
                256,
                256
            ];
            dfop.wordletype = option.wordletype;
            dfop.words = option.words || [];
            dfop.timeInterval = Infinity;
            dfop.timer = null;
            dfop.spirals = {
                archimedean: dfop.archimedeanSpiral,
                rectangular: dfop.rectangularSpiral
            };
            zrUtil.merge(dfop, {
                size: [
                    256,
                    256
                ],
                wordletype: {
                    type: 'RECT',
                    areaPresent: 0.058,
                    autoSizeCal: {
                        enable: true,
                        minSize: 12
                    }
                }
            });
        },
        _initCanvas: function () {
            var cloudRadians = Math.PI / 180;
            var cw = 1 << 11 >> 5;
            var ch = 1 << 11;
            var canvas;
            var ratio = 1;
            if (typeof document !== 'undefined') {
                canvas = document.createElement('canvas');
                canvas.width = 1;
                canvas.height = 1;
                ratio = Math.sqrt(canvas.getContext('2d').getImageData(0, 0, 1, 1).data.length >> 2);
                canvas.width = (cw << 5) / ratio;
                canvas.height = ch / ratio;
            } else {
                canvas = new Canvas(cw << 5, ch);
            }
            var c = canvas.getContext('2d');
            c.fillStyle = c.strokeStyle = 'red';
            c.textAlign = 'center';
            this.defaultOption.c = c;
            this.defaultOption.cw = cw;
            this.defaultOption.ch = ch;
            this.defaultOption.ratio = ratio;
            this.defaultOption.cloudRadians = cloudRadians;
        },
        _cloudSprite: function (d, data, di) {
            if (d.sprite) {
                return;
            }
            var cw = this.defaultOption.cw;
            var ch = this.defaultOption.ch;
            var c = this.defaultOption.c;
            var ratio = this.defaultOption.ratio;
            var cloudRadians = this.defaultOption.cloudRadians;
            c.clearRect(0, 0, (cw << 5) / ratio, ch / ratio);
            var x = 0;
            var y = 0;
            var maxh = 0;
            var n = data.length;
            --di;
            while (++di < n) {
                d = data[di];
                c.save();
                c.font = d.style + ' ' + d.weight + ' ' + ~~((d.size + 1) / ratio) + 'px ' + d.font;
                var w = c.measureText(d.text + 'm').width * ratio;
                var h = d.size << 1;
                if (d.rotate) {
                    var sr = Math.sin(d.rotate * cloudRadians);
                    var cr = Math.cos(d.rotate * cloudRadians);
                    var wcr = w * cr;
                    var wsr = w * sr;
                    var hcr = h * cr;
                    var hsr = h * sr;
                    w = Math.max(Math.abs(wcr + hsr), Math.abs(wcr - hsr)) + 31 >> 5 << 5;
                    h = ~~Math.max(Math.abs(wsr + hcr), Math.abs(wsr - hcr));
                } else {
                    w = w + 31 >> 5 << 5;
                }
                if (h > maxh) {
                    maxh = h;
                }
                if (x + w >= cw << 5) {
                    x = 0;
                    y += maxh;
                    maxh = 0;
                }
                if (y + h >= ch) {
                    break;
                }
                c.translate((x + (w >> 1)) / ratio, (y + (h >> 1)) / ratio);
                if (d.rotate) {
                    c.rotate(d.rotate * cloudRadians);
                }
                c.fillText(d.text, 0, 0);
                if (d.padding) {
                    c.lineWidth = 2 * d.padding;
                    c.strokeText(d.text, 0, 0);
                }
                c.restore();
                d.width = w;
                d.height = h;
                d.xoff = x;
                d.yoff = y;
                d.x1 = w >> 1;
                d.y1 = h >> 1;
                d.x0 = -d.x1;
                d.y0 = -d.y1;
                d.hasText = true;
                x += w;
            }
            var pixels = c.getImageData(0, 0, (cw << 5) / ratio, ch / ratio).data;
            var sprite = [];
            while (--di >= 0) {
                d = data[di];
                if (!d.hasText) {
                    continue;
                }
                var w = d.width;
                var w32 = w >> 5;
                var h = d.y1 - d.y0;
                for (var i = 0; i < h * w32; i++) {
                    sprite[i] = 0;
                }
                x = d.xoff;
                if (x == null) {
                    return;
                }
                y = d.yoff;
                var seen = 0;
                var seenRow = -1;
                for (var j = 0; j < h; j++) {
                    for (var i = 0; i < w; i++) {
                        var k = w32 * j + (i >> 5);
                        var m = pixels[(y + j) * (cw << 5) + (x + i) << 2] ? 1 << 31 - i % 32 : 0;
                        sprite[k] |= m;
                        seen |= m;
                    }
                    if (seen) {
                        seenRow = j;
                    } else {
                        d.y0++;
                        h--;
                        j--;
                        y++;
                    }
                }
                d.y1 = d.y0 + seenRow;
                d.sprite = sprite.slice(0, (d.y1 - d.y0) * w32);
            }
        },
        _place: function (board, tag, maxBounds) {
            var size = this.defaultOption.size;
            var perimeter = [
                {
                    x: 0,
                    y: 0
                },
                {
                    x: size[0],
                    y: size[1]
                }
            ];
            var startX = tag.x;
            var startY = tag.y;
            var maxDelta = Math.sqrt(size[0] * size[0] + size[1] * size[1]);
            var s = this.defaultOption.spiral(size);
            var dt = Math.random() < 0.5 ? 1 : -1;
            var t = -dt;
            var dxdy;
            var dx;
            var dy;
            while (dxdy = s(t += dt)) {
                dx = ~~dxdy[0];
                dy = ~~dxdy[1];
                if (Math.min(dx, dy) > maxDelta) {
                    break;
                }
                tag.x = startX + dx;
                tag.y = startY + dy;
                if (tag.x + tag.x0 < 0 || tag.y + tag.y0 < 0 || tag.x + tag.x1 > size[0] || tag.y + tag.y1 > size[1]) {
                    continue;
                }
                if (!cloudCollide(tag, board, size[0])) {
                    if (collideRects(tag, maxBounds)) {
                        var sprite = tag.sprite;
                        var w = tag.width >> 5;
                        var sw = size[0] >> 5;
                        var lx = tag.x - (w << 4);
                        var sx = lx & 127;
                        var msx = 32 - sx;
                        var h = tag.y1 - tag.y0;
                        var x = (tag.y + tag.y0) * sw + (lx >> 5);
                        var last;
                        for (var j = 0; j < h; j++) {
                            last = 0;
                            for (var i = 0; i <= w; i++) {
                                board[x + i] |= last << msx | (i < w ? (last = sprite[j * w + i]) >>> sx : 0);
                            }
                            x += sw;
                        }
                        delete tag.sprite;
                        return true;
                    }
                }
            }
            return false;
            function cloudCollide(tag, board, sw) {
                sw >>= 5;
                var sprite = tag.sprite;
                var w = tag.width >> 5;
                var lx = tag.x - (w << 4);
                var sx = lx & 127;
                var msx = 32 - sx;
                var h = tag.y1 - tag.y0;
                var x = (tag.y + tag.y0) * sw + (lx >> 5);
                var last;
                for (var j = 0; j < h; j++) {
                    last = 0;
                    for (var i = 0; i <= w; i++) {
                        if ((last << msx | (i < w ? (last = sprite[j * w + i]) >>> sx : 0)) & board[x + i]) {
                            return true;
                        }
                    }
                    x += sw;
                }
                return false;
            }
            function collideRects(a, maxBounds) {
                return maxBounds.row[a.y] && maxBounds.cloumn[a.x] && a.x >= maxBounds.row[a.y].start && a.x <= maxBounds.row[a.y].end && a.y >= maxBounds.cloumn[a.x].start && a.y <= maxBounds.cloumn[a.x].end;
            }
        },
        _autoCalTextSize: function (data, shapeArea, maxwidth, maxheight, minSize) {
            var sizesum = sum(data, function (k) {
                return k.size;
            });
            var i = data.length;
            var maxareapre = 0.25;
            var minTextSize = minSize;
            var cw = this.defaultOption.cw;
            var ch = this.defaultOption.ch;
            var c = this.defaultOption.c;
            var ratio = this.defaultOption.ratio;
            var cloudRadians = this.defaultOption.cloudRadians;
            var d;
            var dpre;
            while (i--) {
                d = data[i];
                dpre = d.size / sizesum;
                if (maxareapre) {
                    d.areapre = dpre < maxareapre ? dpre : maxareapre;
                } else {
                    d.areapre = dpre;
                }
                d.area = shapeArea * d.areapre;
                d.totalarea = shapeArea;
                measureTextWitHitByarea(d);
            }
            function measureTextWitHitByarea(d) {
                c.clearRect(0, 0, (cw << 5) / ratio, ch / ratio);
                c.save();
                c.font = d.style + ' ' + d.weight + ' ' + ~~((d.size + 1) / ratio) + 'px ' + d.font;
                var w = c.measureText(d.text + 'm').width * ratio, h = d.size << 1;
                w = w + 31 >> 5 << 5;
                c.restore();
                d.aw = w;
                d.ah = h;
                var k, rw, rh;
                if (d.rotate) {
                    var sr = Math.sin(d.rotate * cloudRadians);
                    var cr = Math.cos(d.rotate * cloudRadians);
                    var wcr = w * cr;
                    var wsr = w * sr;
                    var hcr = h * cr;
                    var hsr = h * sr;
                    rw = Math.max(Math.abs(wcr + hsr), Math.abs(wcr - hsr)) + 31 >> 5 << 5;
                    rh = ~~Math.max(Math.abs(wsr + hcr), Math.abs(wsr - hcr));
                }
                if (d.size <= minTextSize || d.rotate && w * h <= d.area && rw <= maxwidth && rh <= maxheight || w * h <= d.area && w <= maxwidth && h <= maxheight) {
                    d.area = w * h;
                    return;
                }
                if (d.rotate && rw > maxwidth && rh > maxheight) {
                    k = Math.min(maxwidth / rw, maxheight / rh);
                } else if (w > maxwidth || h > maxheight) {
                    k = Math.min(maxwidth / w, maxheight / h);
                } else {
                    k = Math.sqrt(d.area / (d.aw * d.ah));
                }
                d.size = ~~(k * d.size);
                if (d.size < minSize) {
                    d.size = minSize;
                    return;
                }
                return measureTextWitHitByarea(d);
            }
            function sum(dts, callback) {
                var j = dts.length;
                var ressum = 0;
                while (j--) {
                    ressum += callback(dts[j]);
                }
                return ressum;
            }
        }
    };
    return CloudLayout;
});define('echarts2/layout/WordCloudRectZero', ['require'], function (require) {
    function ZeroArray(option) {
        this.defaultOption = { type: 'RECT' };
        this._init(option);
    }
    ZeroArray.prototype = {
        RECT: '_calculateRect',
        _init: function (option) {
            this._initOption(option);
            this._initCanvas();
        },
        _initOption: function (option) {
            for (k in option) {
                this.defaultOption[k] = option[k];
            }
        },
        _initCanvas: function () {
            var canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            var ratio = Math.sqrt(canvas.getContext('2d').getImageData(0, 0, 1, 1).data.length >> 2);
            canvas.width = this.defaultOption.width;
            canvas.height = this.defaultOption.height;
            if (canvas.getContext) {
                var ctx = canvas.getContext('2d');
            }
            this.canvas = canvas;
            this.ctx = ctx;
            this.ratio = ratio;
        },
        calculate: function (callback, callbackObj) {
            var calType = this.defaultOption.type, calmethod = this[calType];
            this[calmethod].call(this, callback, callbackObj);
        },
        _calculateReturn: function (result, callback, callbackObj) {
            callback.call(callbackObj, result);
        },
        _calculateRect: function (callback, callbackObj) {
            var result = {}, width = this.defaultOption.width >> 5 << 5, height = this.defaultOption.height;
            result.initarr = this._rectZeroArray(width * height);
            result.area = width * height;
            result.maxHit = height;
            result.maxWit = width;
            result.imgboard = this._rectBoard(width, height);
            this._calculateReturn(result, callback, callbackObj);
        },
        _rectBoard: function (width, height) {
            var row = [];
            for (var i = 0; i < height; i++) {
                row.push({
                    y: i,
                    start: 0,
                    end: width
                });
            }
            var cloumn = [];
            for (var i = 0; i < width; i++) {
                cloumn.push({
                    x: i,
                    start: 0,
                    end: height
                });
            }
            return {
                row: row,
                cloumn: cloumn
            };
        },
        _rectZeroArray: function (num) {
            var a = [], n = num, i = -1;
            while (++i < n)
                a[i] = 0;
            return a;
        }
    };
    return ZeroArray;
});