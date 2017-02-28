define('echarts2/chart/venn', [
    'require',
    './base',
    'zrender2/shape/Text',
    'zrender2/shape/Circle',
    'zrender2/shape/Path',
    '../config',
    '../util/ecData',
    'zrender2/tool/util',
    '../chart'
], function (require) {
    var ChartBase = require('./base');
    var TextShape = require('zrender2/shape/Text');
    var CircleShape = require('zrender2/shape/Circle');
    var PathShape = require('zrender2/shape/Path');
    var ecConfig = require('../config');
    ecConfig.venn = {
        zlevel: 0,
        z: 1,
        calculable: false
    };
    var ecData = require('../util/ecData');
    var zrUtil = require('zrender2/tool/util');
    function Venn(ecTheme, messageCenter, zr, option, myChart) {
        ChartBase.call(this, ecTheme, messageCenter, zr, option, myChart);
        this.refresh(option);
    }
    Venn.prototype = {
        type: ecConfig.CHART_TYPE_VENN,
        _buildShape: function () {
            this.selectedMap = {};
            this._symbol = this.option.symbolList;
            this._queryTarget;
            this._dropBoxList = [];
            this._vennDataCounter = 0;
            var series = this.series;
            var legend = this.component.legend;
            for (var i = 0; i < series.length; i++) {
                if (series[i].type === ecConfig.CHART_TYPE_VENN) {
                    series[i] = this.reformOption(series[i]);
                    var serieName = series[i].name || '';
                    this.selectedMap[serieName] = legend ? legend.isSelected(serieName) : true;
                    if (!this.selectedMap[serieName]) {
                        continue;
                    }
                    this._buildVenn(i);
                }
            }
            this.addShapeList();
        },
        _buildVenn: function (seriesIndex) {
            var r0;
            var r1;
            var serie = this.series[seriesIndex];
            var data = serie.data;
            if (data[0].value > data[1].value) {
                r0 = this.zr.getHeight() / 3;
                r1 = r0 * Math.sqrt(data[1].value) / Math.sqrt(data[0].value);
            } else {
                r1 = this.zr.getHeight() / 3;
                r0 = r1 * Math.sqrt(data[0].value) / Math.sqrt(data[1].value);
            }
            var x0 = this.zr.getWidth() / 2 - r0;
            var coincideLengthAnchor = (r0 + r1) / 2 * Math.sqrt(data[2].value) / Math.sqrt((data[0].value + data[1].value) / 2);
            var coincideLength = r0 + r1;
            if (data[2].value !== 0) {
                coincideLength = this._getCoincideLength(data[0].value, data[1].value, data[2].value, r0, r1, coincideLengthAnchor, Math.abs(r0 - r1), r0 + r1);
            }
            var x1 = x0 + coincideLength;
            var y = this.zr.getHeight() / 2;
            this._buildItem(seriesIndex, 0, data[0], x0, y, r0);
            this._buildItem(seriesIndex, 1, data[1], x1, y, r1);
            if (data[2].value !== 0 && data[2].value !== data[0].value && data[2].value !== data[1].value) {
                var xLeft = (r0 * r0 - r1 * r1) / (2 * coincideLength) + coincideLength / 2;
                var xRight = coincideLength / 2 - (r0 * r0 - r1 * r1) / (2 * coincideLength);
                var h = Math.sqrt(r0 * r0 - xLeft * xLeft);
                var rightLargeArcFlag = 0;
                var leftLargeArcFlag = 0;
                if (data[0].value > data[1].value && x1 < x0 + xLeft) {
                    leftLargeArcFlag = 1;
                }
                if (data[0].value < data[1].value && x1 < x0 + xRight) {
                    rightLargeArcFlag = 1;
                }
                this._buildCoincideItem(seriesIndex, 2, data[2], x0 + xLeft, y - h, y + h, r0, r1, rightLargeArcFlag, leftLargeArcFlag);
            }
        },
        _getCoincideLength: function (value0, value1, value2, r0, r1, coincideLengthAnchor, coincideLengthAnchorMin, coincideLengthAnchorMax) {
            var x = (r0 * r0 - r1 * r1) / (2 * coincideLengthAnchor) + coincideLengthAnchor / 2;
            var y = coincideLengthAnchor / 2 - (r0 * r0 - r1 * r1) / (2 * coincideLengthAnchor);
            var alfa = Math.acos(x / r0);
            var beta = Math.acos(y / r1);
            var area0 = r0 * r0 * Math.PI;
            var area2 = alfa * r0 * r0 - x * r0 * Math.sin(alfa) + beta * r1 * r1 - y * r1 * Math.sin(beta);
            var scaleAnchor = area2 / area0;
            var scale = value2 / value0;
            var approximateValue = Math.abs(scaleAnchor / scale);
            if (approximateValue > 0.999 && approximateValue < 1.001) {
                return coincideLengthAnchor;
            } else if (approximateValue <= 0.999) {
                coincideLengthAnchorMax = coincideLengthAnchor;
                coincideLengthAnchor = (coincideLengthAnchor + coincideLengthAnchorMin) / 2;
                return this._getCoincideLength(value0, value1, value2, r0, r1, coincideLengthAnchor, coincideLengthAnchorMin, coincideLengthAnchorMax);
            } else {
                coincideLengthAnchorMin = coincideLengthAnchor;
                coincideLengthAnchor = (coincideLengthAnchor + coincideLengthAnchorMax) / 2;
                return this._getCoincideLength(value0, value1, value2, r0, r1, coincideLengthAnchor, coincideLengthAnchorMin, coincideLengthAnchorMax);
            }
        },
        _buildItem: function (seriesIndex, dataIndex, dataItem, x, y, r) {
            var series = this.series;
            var serie = series[seriesIndex];
            var circle = this.getCircle(seriesIndex, dataIndex, dataItem, x, y, r);
            ecData.pack(circle, serie, seriesIndex, dataItem, dataIndex, dataItem.name);
            this.shapeList.push(circle);
            if (serie.itemStyle.normal.label.show) {
                var label = this.getLabel(seriesIndex, dataIndex, dataItem, x, y, r);
                ecData.pack(label, serie, seriesIndex, serie.data[dataIndex], dataIndex, serie.data[dataIndex].name);
                this.shapeList.push(label);
            }
        },
        _buildCoincideItem: function (seriesIndex, dataIndex, dataItem, x, y0, y1, r0, r1, rightLargeArcFlag, leftLargeArcFlag) {
            var series = this.series;
            var serie = series[seriesIndex];
            var queryTarget = [
                dataItem,
                serie
            ];
            var normal = this.deepMerge(queryTarget, 'itemStyle.normal') || {};
            var emphasis = this.deepMerge(queryTarget, 'itemStyle.emphasis') || {};
            var normalColor = normal.color || this.zr.getColor(dataIndex);
            var emphasisColor = emphasis.color || this.zr.getColor(dataIndex);
            var path = 'M' + x + ',' + y0 + 'A' + r0 + ',' + r0 + ',0,' + rightLargeArcFlag + ',1,' + x + ',' + y1 + 'A' + r1 + ',' + r1 + ',0,' + leftLargeArcFlag + ',1,' + x + ',' + y0;
            var style = {
                color: normalColor,
                path: path
            };
            var shape = {
                zlevel: serie.zlevel,
                z: serie.z,
                style: style,
                highlightStyle: {
                    color: emphasisColor,
                    lineWidth: emphasis.borderWidth,
                    strokeColor: emphasis.borderColor
                }
            };
            shape = new PathShape(shape);
            if (shape.buildPathArray) {
                shape.style.pathArray = shape.buildPathArray(style.path);
            }
            ecData.pack(shape, series[seriesIndex], 0, dataItem, dataIndex, dataItem.name);
            this.shapeList.push(shape);
        },
        getCircle: function (seriesIndex, dataIndex, dataItem, x, y, r) {
            var serie = this.series[seriesIndex];
            var queryTarget = [
                dataItem,
                serie
            ];
            var normal = this.deepMerge(queryTarget, 'itemStyle.normal') || {};
            var emphasis = this.deepMerge(queryTarget, 'itemStyle.emphasis') || {};
            var normalColor = normal.color || this.zr.getColor(dataIndex);
            var emphasisColor = emphasis.color || this.zr.getColor(dataIndex);
            var circle = {
                zlevel: serie.zlevel,
                z: serie.z,
                clickable: true,
                style: {
                    x: x,
                    y: y,
                    r: r,
                    brushType: 'fill',
                    opacity: 1,
                    color: normalColor
                },
                highlightStyle: {
                    color: emphasisColor,
                    lineWidth: emphasis.borderWidth,
                    strokeColor: emphasis.borderColor
                }
            };
            if (this.deepQuery([
                    dataItem,
                    serie,
                    this.option
                ], 'calculable')) {
                this.setCalculable(circle);
                circle.draggable = true;
            }
            return new CircleShape(circle);
        },
        getLabel: function (seriesIndex, dataIndex, dataItem, x, y, r) {
            var serie = this.series[seriesIndex];
            var itemStyle = serie.itemStyle;
            var queryTarget = [
                dataItem,
                serie
            ];
            var normal = this.deepMerge(queryTarget, 'itemStyle.normal') || {};
            var status = 'normal';
            var labelControl = itemStyle[status].label;
            var textStyle = labelControl.textStyle || {};
            var text = this.getLabelText(dataIndex, dataItem, status);
            var textFont = this.getFont(textStyle);
            var textColor = normal.color || this.zr.getColor(dataIndex);
            var textSize = textStyle.fontSize || 12;
            var textShape = {
                zlevel: serie.zlevel,
                z: serie.z,
                style: {
                    x: x,
                    y: y - r - textSize,
                    color: textStyle.color || textColor,
                    text: text,
                    textFont: textFont,
                    textAlign: 'center'
                }
            };
            return new TextShape(textShape);
        },
        getLabelText: function (dataIndex, dataItem, status) {
            var series = this.series;
            var serie = series[0];
            var formatter = this.deepQuery([
                dataItem,
                serie
            ], 'itemStyle.' + status + '.label.formatter');
            if (formatter) {
                if (typeof formatter == 'function') {
                    return formatter(serie.name, dataItem.name, dataItem.value);
                } else if (typeof formatter == 'string') {
                    formatter = formatter.replace('{a}', '{a0}').replace('{b}', '{b0}').replace('{c}', '{c0}');
                    formatter = formatter.replace('{a0}', serie.name).replace('{b0}', dataItem.name).replace('{c0}', dataItem.value);
                    return formatter;
                }
            } else {
                return dataItem.name;
            }
        },
        refresh: function (newOption) {
            if (newOption) {
                this.option = newOption;
                this.series = newOption.series;
            }
            this._buildShape();
        }
    };
    zrUtil.inherits(Venn, ChartBase);
    require('../chart').define('venn', Venn);
    return Venn;
});