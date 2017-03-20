(function(window, $) {
    "use strict";

    if(typeof require === "undefined" || typeof require.config !== "function" || typeof define !== "function" || !define.amd) { throw new Error("Requires AMD Require Plugin."); }
    if(window.YFjs == null) { throw new Error("YFjs must be declared before requireConf."); }

    var YFjs = window.YFjs;

    var Versions = {
        codemirror: '5.9.0',
        cryptoJS: '3.1.6',
        d3: '4.6.0',
        'd3-v3': '3.5.16',
        bs: {
            alert: '3.3.4',
            button: '3.3.4+20150713',
            carousel: '3.3.4',
            collapse: '3.3.4',
            datetimepicker: '3.0.0',
            daterangepicker: '2.0.8',
            clockpicker: '0.0.7',
            modal: '3.3.4+20170125',
            paging: '1.0.2+20161114',
            popover: '3.3.4+20150609',
            slider: '4.5.6',
            spinbox: '3.6.3+20150518',
            switcher: '3.3.2+20150513',
            tab: '3.3.4',
            tooltip: '3.3.4+20150609',
            wizard: '3.6.3+20151109'
        },
        jq: {
            migrate: '1.2.1',
            dataTables: '1.10.7+20170306',
            form: '3.51.0_x1',
            form_validator: '1.13.1',
            form_wizard: 'bs3',
            wizard: '3.6.3',
            chosen: '1.4.2+20160423',
            cookie: '1.4.1',
            dragsort: '0.5.2',
            multipicker: '0.8.0',
            multiselect: '0.8.0',
            nicescroll: '3.6.0',
            mCustomScrollbar: '3.1.5',
            qrcode: '1.0',
            urlp: '1.0.4',
            ztree: '3.5.18',
            webuploader: '0.1.5',
            zeroclipboard: '0.2.2'
        },
        rq: {
            cs: '0.5.0',
            css: '0.1.8',
            domReady: '2.0.1',
            i18n: '2.0.4',
            text: '2.0.12'
        },
        json: '3.3.2',
        respond: '1.4.2',
        echarts: '3.1.10',
        echarts2: '2.2.7',
        moment: '2.10.3',
        plupload: '2.1.4',
        remarkable: '1.6.0',
        'es5-shim': '4.5.9',
        'es6-shim': '0.35.3',
        highlight: '9.9.0+20170224',
        yfjs: {
            spa: '1.0.0-rc+20170303'
        },
        zeroclipboard: '2.2.0'
    };

    var BaseUrls = {
        codemirror: YFjs.baseMd+'/codemirror/'+Versions.codemirror,
        cryptoJS: YFjs.baseMd+'/crypto/'+Versions.cryptoJS,
        d3: YFjs.baseMd+'/d3/'+Versions.d3,
        'd3-v3': YFjs.baseMd+'/d3/'+Versions['d3-v3'],
        json: YFjs.baseMd+'/json/'+Versions.json,
        respond: YFjs.baseMd+'/respond/'+Versions.respond,
        echarts: YFjs.baseMd+'/echarts/'+Versions.echarts,
        echarts2: YFjs.baseMd+'/echarts/'+Versions.echarts2,
        moment: YFjs.baseMd+'/moment/'+Versions.moment,
        plupload: YFjs.baseMd+'/plupload/'+Versions.plupload,
        remarkable: YFjs.baseMd+'/remarkable/'+Versions.remarkable,
        'es5-shim': YFjs.baseMd+'/es5-shim/'+Versions['es5-shim'],
        'es6-shim': YFjs.baseMd+'/es6-shim/'+Versions['es6-shim'],
        highlight: YFjs.baseMd+'/highlight/'+Versions['highlight'],
        zeroclipboard: YFjs.baseMd+'/zeroclipboard/'+Versions['zeroclipboard'],
        spa: YFjs.baseMd+'/spa'
    };
    var getModuleUrl = function(baseUrl, name, version) {
        return (baseUrl ? baseUrl : '') + (name ? ('/' + name.replace(/_/g, '/')) :'') + (version ? ('/' + version) : '');
    };

    var mdName;

    // init jq modules baseUrl
    for(mdName in Versions.jq) {
        !BaseUrls.jq && (BaseUrls.jq = {});
        BaseUrls.jq[mdName] = getModuleUrl(YFjs.baseMd+'/jq-plugins', mdName, Versions.jq[mdName]);
    }
    // init bs modules baseUrl
    for(mdName in Versions.bs) {
        !BaseUrls.bs && (BaseUrls.bs = {});
        BaseUrls.bs[mdName] = getModuleUrl(YFjs.baseMd+'/jq-plugins/bootstrap', mdName, Versions.bs[mdName]);
    }
    // init rq modules baseUrl
    for(mdName in Versions.rq) {
        !BaseUrls.rq && (BaseUrls.rq = {});
        BaseUrls.rq[mdName] = getModuleUrl(YFjs.baseMd+'/rq-plugins', mdName, Versions.rq[mdName]);
    }

    mdName = null;

    var MdUrl = {},
        parseMdUrl = function(mdUrls, pMdName) {
            if (typeof mdUrls !== "object") return;

            var mdUrl, mdName;

            for (mdName in mdUrls) {
                mdUrl = mdUrls[mdName];
                mdName = pMdName != null ? pMdName + '/' + mdName : mdName;
                if (typeof mdUrl === "object") {
                    parseMdUrl(mdUrl, mdName);
                } else if (mdUrl != null) {
                    MdUrl[mdUrl] = mdName;
                }
            }
        };

    parseMdUrl(BaseUrls);

    require.config({
        waitSeconds: 0, // 关闭超时时间设置
        baseUrl: YFjs.baseRq,
        urlArgs: function(moduleName, url) {
            var v = getModuleVersion(moduleName);
            if (v == null) {
                var mdName = getModuleByUrl(url);
                v = getModuleVersion(mdName);
            }
            if (v == null) {
                if (false === YFjs.mdCache) {
                    v = YFjs.VERSION + '+' + YFjs.timestamp;
                } else {
                    v = YFjs.VERSION
                }
            }
            return 'v=' + v;
        },
        paths: {
            'yfjs/spa': BaseUrls.spa+'/spa',
            'yfjs/spa/app': BaseUrls.spa+'/spa',
            'yfjs/spa/version': BaseUrls.spa+'/spa',
            'yfjs/spa/util/ajax': BaseUrls.spa+'/spa',
            'yfjs/spa/util/console': BaseUrls.spa+'/spa',
            'yfjs/spa/util/cookie': BaseUrls.spa+'/spa',
            'yfjs/spa/util/error': BaseUrls.spa+'/spa',
            'yfjs/spa/util/event': BaseUrls.spa+'/spa',
            'yfjs/spa/util/filter': BaseUrls.spa+'/spa',
            'yfjs/spa/util/helpers': BaseUrls.spa+'/spa',
            'yfjs/spa/util/history': BaseUrls.spa+'/spa',
            'yfjs/spa/util/layout': BaseUrls.spa+'/spa',
            'yfjs/spa/util/path-wildcard-compiler': BaseUrls.spa+'/spa',
            'yfjs/spa/util/remote': BaseUrls.spa+'/spa',
            'yfjs/spa/util/route': BaseUrls.spa+'/spa',
            'yfjs/spa/util/style-loader': BaseUrls.spa+'/spa',
            'yfjs/spa/util/template': BaseUrls.spa+'/spa',
            'yfjs/spa/util/template-helpers': BaseUrls.spa+'/spa',
            'yfjs/spa/util/view': BaseUrls.spa+'/spa',
            'yfjs/spa/util/websocket': BaseUrls.spa+'/spa',
            'yfjs/spa/util/widget': BaseUrls.spa+'/spa',
            'yfjs/spa/ui/loading': BaseUrls.spa+'/spa',
            'es5-shim': BaseUrls['es5-shim']+'/es5-shim',
            'es6-shim': BaseUrls['es6-shim']+'/es6-shim',
            'crypto-js': BaseUrls.cryptoJS+'/crypto-js',
            'd3': BaseUrls.d3+'/d3',
            'd3-v3': BaseUrls['d3-v3']+'/d3',
            'highlight': BaseUrls.highlight+'/highlight.pack',
            'bs/alert': BaseUrls.bs.alert+'/alert',
            'bs/button': BaseUrls.bs.button+'/button',
            'bs/carousel': BaseUrls.bs.carousel+'/carousel',
            'bs/collapse': BaseUrls.bs.collapse+'/collapse',
            'bs/datetimepicker': BaseUrls.bs.datetimepicker+'/datetimepicker',
            'bs/daterangepicker': BaseUrls.bs.daterangepicker+'/daterangepicker',
            'bs/clockpicker': BaseUrls.bs.clockpicker+'/clockpicker',
            'bs/modal': BaseUrls.bs.modal+'/modal',
            'bs/paging': BaseUrls.bs.paging+'/paging',
            'bs/popover': BaseUrls.bs.popover+'/popover',
            'bs/slider': BaseUrls.bs.slider+'/slider',
            'bs/spinbox': BaseUrls.bs.spinbox+'/spinbox',
            'bs/switcher': BaseUrls.bs.switcher+'/switcher',
            'bs/tab': BaseUrls.bs.tab+'/tab',
            'bs/tooltip': BaseUrls.bs.tooltip+'/tooltip',
            'bs/wizard': BaseUrls.bs.wizard+'/wizard',
            'jq/migrate': BaseUrls.jq.migrate+'/jquery-migrate',
            'jq/dataTables-bs3': BaseUrls.jq.dataTables+'/dataTables.bs3',
            'jq/dataTables-jui': BaseUrls.jq.dataTables+'/dataTables.jui',
            'jq/dataTables-foundation': BaseUrls.jq.dataTables+'/dataTables.foundation',
            'jq/form': BaseUrls.jq.form+'/jquery.form',
            'jq/form/wizard': BaseUrls.jq.form_wizard+'/wizard',
            'jq/form/validator-bs3': BaseUrls.jq.form_validator+'/jquery.validate.bs3',
            'jq/chosen':BaseUrls.jq.chosen+'/chosen.jquery',
            'jq/cookie':BaseUrls.jq.cookie+'/jquery.cookie',
            'jq/dragsort':BaseUrls.jq.dragsort+'/dragsort',
            'jq/multipicker':BaseUrls.jq.multipicker+'/multipicker',
            'jq/multiselect':BaseUrls.jq.multiselect+'/multiselect',
            'jq/history':BaseUrls.jq.history+'/jquery.history',
            'jq/nicescroll':BaseUrls.jq.nicescroll+'/jquery.nicescroll',
            'jq/mCustomScrollbar':BaseUrls.jq.mCustomScrollbar+'/jquery.mCustomScrollbar',
            'jq/qrcode':BaseUrls.jq.qrcode+'/jquery.qrcode',
            'jq/urlp':BaseUrls.jq.urlp+'/urlp',
            'jq/ztree':BaseUrls.jq.ztree+'/jquery.ztree',
            'jq/webuploader':BaseUrls.jq.webuploader+'/webuploader',
            'jq/zeroclipboard':BaseUrls.jq.zeroclipboard+'/jquery.zeroclipboard',
            json: BaseUrls.json+'/json3',
            moment: BaseUrls.moment+'/moment',
            plupload: BaseUrls.plupload+'/plupload',
            'plupload/i18n': BaseUrls.plupload+'/i18n',
            'plupload-bs3': BaseUrls.plupload+'/jquery.plupload.bs3',
            remarkable: BaseUrls.remarkable+'/remarkable',
            respond: BaseUrls.respond+'/respond',
            zeroclipboard: BaseUrls.zeroclipboard+'/ZeroClipboard',
            echarts: BaseUrls.echarts+'/echarts',
            'echarts2': BaseUrls.echarts2,
            'echarts2/chart/bar': BaseUrls.echarts2+'/chart/bar',
            'echarts2/chart/chord': BaseUrls.echarts2+'/chart/chord',
            'echarts2/chart/eventRiver': BaseUrls.echarts2+'/chart/eventRiver',
            'echarts2/chart/force': BaseUrls.echarts2+'/chart/force',
            'echarts2/chart/funnel': BaseUrls.echarts2+'/chart/funnel',
            'echarts2/chart/gauge': BaseUrls.echarts2+'/chart/gauge',
            'echarts2/chart/heatmap': BaseUrls.echarts2+'/chart/heatmap',
            'echarts2/chart/k': BaseUrls.echarts2+'/chart/k',
            'echarts2/chart/line': BaseUrls.echarts2+'/chart/line',
            'echarts2/chart/map': BaseUrls.echarts2+'/chart/map',
            'echarts2/chart/pie': BaseUrls.echarts2+'/chart/pie',
            'echarts2/chart/radar': BaseUrls.echarts2+'/chart/radar',
            'echarts2/chart/scatter': BaseUrls.echarts2+'/chart/scatter',
            'echarts2/chart/tree': BaseUrls.echarts2+'/chart/tree',
            'echarts2/chart/treemap': BaseUrls.echarts2+'/chart/treemap',
            'echarts2/chart/venn': BaseUrls.echarts2+'/chart/venn',
            'echarts2/chart/wordCloud': BaseUrls.echarts2+'/chart/wordCloud',
            'echarts2/chart/base': BaseUrls.echarts2+'/echarts',
            'echarts2/chart/island': BaseUrls.echarts2+'/echarts',
            'echarts2/component/axis': BaseUrls.echarts2+'/echarts',
            'echarts2/component/base': BaseUrls.echarts2+'/echarts',
            'echarts2/component/categoryAxis': BaseUrls.echarts2+'/echarts',
            'echarts2/component/dataRange': BaseUrls.echarts2+'/component/dataRange',
            'echarts2/component/dataView': BaseUrls.echarts2+'/echarts',
            'echarts2/component/dataZoom': BaseUrls.echarts2+'/echarts',
            'echarts2/component/grid': BaseUrls.echarts2+'/echarts',
            'echarts2/component/legend': BaseUrls.echarts2+'/echarts',
            'echarts2/component/polar': BaseUrls.echarts2+'/chart/radar',
            'echarts2/component/roamController': BaseUrls.echarts2+'/chart/map',
            'echarts2/component/timeline': BaseUrls.echarts2+'/echarts',
            'echarts2/component/title': BaseUrls.echarts2+'/echarts',
            'echarts2/component/toolbox': BaseUrls.echarts2+'/echarts',
            'echarts2/component/tooltip': BaseUrls.echarts2+'/echarts',
            'echarts2/component/valueAxis': BaseUrls.echarts2+'/echarts',
            'echarts2/data/Graph': BaseUrls.echarts2+'/echarts/force',
            'echarts2/data/KDTree': BaseUrls.echarts2+'/echarts',
            'echarts2/data/quickSelect': BaseUrls.echarts2+'/echarts',
            'echarts2/data/Tree': BaseUrls.echarts2+'/data/Tree',
            'echarts2/layer/heatmap': BaseUrls.echarts2+'/chart/heatmap',
            'echarts2/layout/Chord': BaseUrls.echarts2+'/chart/chord',
            'echarts2/layout/EdgeBundling': BaseUrls.echarts2+'/echarts',
            'echarts2/layout/eventRiver': BaseUrls.echarts2+'/chart/eventRiver',
            'echarts2/layout/Force': BaseUrls.echarts2+'/chart/force',
            'echarts2/layout/forceLayoutWorker': BaseUrls.echarts2+'/chart/force',
            'echarts2/layout/Tree': BaseUrls.echarts2+'/chart/tree',
            'echarts2/layout/TreeMap': BaseUrls.echarts2+'/chart/treemap',
            'echarts2/layout/WordCloud': BaseUrls.echarts2+'/chart/WordCloud',
            'echarts2/layout/WordCloudRectZero': BaseUrls.echarts2+'/chart/WordCloud',
            'echarts2/theme/default': BaseUrls.echarts2+'/echarts',
            'echarts2/theme/infographic': BaseUrls.echarts2+'/echarts',
            'echarts2/theme/macarons': BaseUrls.echarts2+'/echarts',
            'echarts2/util/mapData/geoJson/an_hui_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/ao_men_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/bei_jing_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/china_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/chong_qing_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/fu_jian_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/gan_su_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/guang_dong_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/guang_xi_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/gui_zhou_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/hai_nan_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/he_bei_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/he_nan_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/hei_long_jiang_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/hu_bei_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/hu_nan_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/ji_lin_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/jiang_su_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/jiang_xi_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/liao_ning_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/nei_meng_gu_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/ning_xia_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/qing_hai_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/shan_dong_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/shan_xi_1_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/shan_xi_2_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/shang_hai_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/si_chuan_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/tai_wan_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/tian_jin_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/world_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/xi_zang_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/xiang_gang_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/xin_jiang_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/yun_nan_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoJson/zhe_jiang_geo': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/geoCoord': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/params': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/mapData/textFixed': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/projection/albers': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/projection/mercator': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/projection/normal': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/projection/svg': BaseUrls.echarts2+'/chart/map',
            'echarts2/util/shape/Candle': BaseUrls.echarts2+'/echarts',
            'echarts2/util/shape/Chain': BaseUrls.echarts2+'/echarts',
            'echarts2/util/shape/Cross': BaseUrls.echarts2+'/echarts',
            'echarts2/util/shape/GaugePointer': BaseUrls.echarts2+'/chart/gauge',
            'echarts2/util/shape/HalfSmoothPolygon': BaseUrls.echarts2+'/chart/line',
            'echarts2/util/shape/HandlePolygon': BaseUrls.echarts2+'/util/shape/HandlePolygon',
            'echarts2/util/shape/Icon': BaseUrls.echarts2+'/echarts',
            'echarts2/util/shape/MarkLine': BaseUrls.echarts2+'/echarts',
            'echarts2/util/shape/normalIsCover': BaseUrls.echarts2+'/echarts',
            'echarts2/util/shape/Ribbon': BaseUrls.echarts2+'/chart/chord',
            'echarts2/util/shape/Symbol': BaseUrls.echarts2+'/echarts',
            'echarts2/util/accMath': BaseUrls.echarts2+'/echarts',
            'echarts2/util/coordinates': BaseUrls.echarts2+'/chart/radar',
            'echarts2/util/date': BaseUrls.echarts2+'/echarts',
            'echarts2/util/ecAnimation': BaseUrls.echarts2+'/echarts',
            'echarts2/util/ecData': BaseUrls.echarts2+'/echarts',
            'echarts2/util/ecEffect': BaseUrls.echarts2+'/echarts',
            'echarts2/util/ecQuery': BaseUrls.echarts2+'/echarts',
            'echarts2/util/kwargs': BaseUrls.echarts2+'/echarts',
            'echarts2/util/ndarray': BaseUrls.echarts2+'/echarts',
            'echarts2/util/number': BaseUrls.echarts2+'/echarts',
            'echarts2/util/smartLogSteps': BaseUrls.echarts2+'/echarts',
            'echarts2/util/smartSteps': BaseUrls.echarts2+'/echarts',
            'echarts2/chart': BaseUrls.echarts2+'/echarts',
            'echarts2/component': BaseUrls.echarts2+'/echarts',
            'echarts2/config': BaseUrls.echarts2+'/echarts',
            zrender2: BaseUrls.echarts2+'/echarts',
            'zrender2/zrender': BaseUrls.echarts2+'/echarts',
            'zrender2/animation/Animation': BaseUrls.echarts2+'/echarts',
            'zrender2/animation/Clip': BaseUrls.echarts2+'/echarts',
            'zrender2/animation/easing': BaseUrls.echarts2+'/echarts',
            'zrender2/dep/excanvas': BaseUrls.echarts2+'/echarts',
            'zrender2/dep/excanvas2': BaseUrls.echarts2+'/echarts',
            'zrender2/dep/excanvas3': BaseUrls.echarts2+'/echarts',
            'zrender2/loadingEffect/Bar': BaseUrls.echarts2+'/echarts',
            'zrender2/loadingEffect/Base': BaseUrls.echarts2+'/echarts',
            'zrender2/loadingEffect/Bubble': BaseUrls.echarts2+'/echarts',
            'zrender2/loadingEffect/DynamicLine': BaseUrls.echarts2+'/echarts',
            'zrender2/loadingEffect/Ring': BaseUrls.echarts2+'/echarts',
            'zrender2/loadingEffect/Spin': BaseUrls.echarts2+'/echarts',
            'zrender2/loadingEffect/Whirling': BaseUrls.echarts2+'/echarts',
            'zrender2/mixin/Eventful': BaseUrls.echarts2+'/echarts',
            'zrender2/mixin/Transformable': BaseUrls.echarts2+'/echarts',
            'zrender2/shape/Base': BaseUrls.echarts2+'/echarts',
            'zrender2/shape/BezierCurve': BaseUrls.echarts2+'/echarts',
            'zrender2/shape/Circle': BaseUrls.echarts2+'/echarts',
            'zrender2/shape/Droplet': BaseUrls.echarts2+'/echarts',
            'zrender2/shape/Ellipse': BaseUrls.echarts2+'/chart/map',
            'zrender2/shape/Heart': BaseUrls.echarts2+'/echarts',
            'zrender2/shape/Image': BaseUrls.echarts2+'/echarts',
            'zrender2/shape/Isogon': BaseUrls.echarts2+'/echarts',
            'zrender2/shape/Line': BaseUrls.echarts2+'/echarts',
            'zrender2/shape/Path': BaseUrls.echarts2+'/zrender/shape/Path',
            'zrender2/shape/Polygon': BaseUrls.echarts2+'/echarts',
            'zrender2/shape/Polyline': BaseUrls.echarts2+'/echarts',
            'zrender2/shape/Rectangle': BaseUrls.echarts2+'/echarts',
            'zrender2/shape/Ring': BaseUrls.echarts2+'/echarts',
            'zrender2/shape/Rose': BaseUrls.echarts2+'/echarts',
            'zrender2/shape/Sector': BaseUrls.echarts2+'/echarts',
            'zrender2/shape/ShapeBundle': BaseUrls.echarts2+'/echarts',
            'zrender2/shape/Star': BaseUrls.echarts2+'/echarts',
            'zrender2/shape/Text': BaseUrls.echarts2+'/echarts',
            'zrender2/shape/Trochoid': BaseUrls.echarts2+'/echarts',
            'zrender2/shape/util/PathProxy': BaseUrls.echarts2+'/echarts',
            'zrender2/shape/util/dashedLineTo': BaseUrls.echarts2+'/echarts',
            'zrender2/shape/util/smoothBezier': BaseUrls.echarts2+'/echarts',
            'zrender2/shape/util/smoothSpline': BaseUrls.echarts2+'/echarts',
            'zrender2/tool/area': BaseUrls.echarts2+'/echarts',
            'zrender2/tool/color': BaseUrls.echarts2+'/echarts',
            'zrender2/tool/computeBoundingBox': BaseUrls.echarts2+'/echarts',
            'zrender2/tool/curve': BaseUrls.echarts2+'/echarts',
            'zrender2/tool/env': BaseUrls.echarts2+'/echarts',
            'zrender2/tool/event': BaseUrls.echarts2+'/echarts',
            'zrender2/tool/guid': BaseUrls.echarts2+'/echarts',
            'zrender2/tool/http': BaseUrls.echarts2+'/echarts',
            'zrender2/tool/log': BaseUrls.echarts2+'/echarts',
            'zrender2/tool/math': BaseUrls.echarts2+'/echarts',
            'zrender2/tool/matrix': BaseUrls.echarts2+'/echarts',
            'zrender2/tool/util': BaseUrls.echarts2+'/echarts',
            'zrender2/tool/vector': BaseUrls.echarts2+'/echarts',
            'zrender2/Group': BaseUrls.echarts2+'/echarts',
            'zrender2/Handler': BaseUrls.echarts2+'/echarts',
            'zrender2/Layer': BaseUrls.echarts2+'/echarts',
            'zrender2/Painter': BaseUrls.echarts2+'/echarts',
            'zrender2/Storage': BaseUrls.echarts2+'/echarts',
            'zrender2/config': BaseUrls.echarts2+'/echarts'
        },
        map: {
            '*': {
                'rq/cs': BaseUrls.rq.cs+'/cs.js',
                'rq/css': BaseUrls.rq.css+'/css.js',
                'rq/domReady': BaseUrls.rq.domReady+'/domReady.js',
                'rq/i18n': BaseUrls.rq.i18n+'/i18n.js',
                'rq/text': BaseUrls.rq.text+'/text.js'
            }
        },
        packages: [
            {
                name: 'codemirror',
                location: BaseUrls.codemirror,
                main: 'lib/codemirror'
            },
            {
                name: 'jq/form/validator',
                location: BaseUrls.jq.form_validator,
                main: 'jquery.validate'
            },
            {
                name: 'jq/dataTables',
                location: BaseUrls.jq.dataTables,
                main: 'jquery.dataTables'
            }
        ],
        shim: {
            'codemirror/lib/codemirror': ['rq/css!'+BaseUrls.codemirror+'/lib/codemirror'],
            'bs/datetimepicker': ['rq/css!'+BaseUrls.bs.datetimepicker+'/datetimepicker'],
            'bs/daterangepicker': ['rq/css!'+BaseUrls.bs.daterangepicker+'/daterangepicker-bs3'],
            'bs/clockpicker': ['rq/css!'+BaseUrls.bs.clockpicker+'/clockpicker'],
            'bs/slider': ['rq/css!'+BaseUrls.bs.slider+'/slider'],
            'bs/switcher': ['rq/css!'+BaseUrls.bs.switcher+'/switcher-bs2'],
            'bs/popover': ['bs/tooltip'],
            'bs/wizard': ['rq/css!'+BaseUrls.bs.wizard+'/wizard'],
            'jq/chosen': ['rq/css!'+BaseUrls.jq.chosen+'/chosen-bs'],
            'jq/form/wizard': ['bs/modal', 'bs/popover'],
            'jq/form/validator-bs3': ['jq/form/validator', 'bs/popover'],
            'jq/dataTables/jquery.dataTables': ['rq/css!'+BaseUrls.jq.dataTables+'/css/jquery.dataTables'],
            'jq/dataTables-bs3': [
                'rq/css!'+BaseUrls.jq.dataTables+'/css/jquery.dataTables',
                'rq/css!'+BaseUrls.jq.dataTables+'/css/dataTables.bootstrap3'
            ],
            'jq/dataTables-jui': [
                'rq/css!'+BaseUrls.jq.dataTables+'/css/jquery.dataTables',
                'rq/css!'+BaseUrls.jq.dataTables+'/css/dataTables.jqueryui'
            ],
            'jq/dataTables-foundation': [
                'rq/css!'+BaseUrls.jq.dataTables+'/css/jquery.dataTables',
                'rq/css!'+BaseUrls.jq.dataTables+'/css/dataTables.foundation'
            ],
            'jq/mCustomScrollbar': ['rq/css!'+BaseUrls.jq.mCustomScrollbar+'/jquery.mCustomScrollbar'],
            'jq/multipicker': ['rq/css!'+BaseUrls.jq.multipicker+'/multipicker'],
            'jq/multiselect': ['rq/css!'+BaseUrls.jq.multiselect+'/multiselect'],
            'jq/ztree': ['rq/css!'+BaseUrls.jq.ztree+'/jquery.ztree'],
            'jq/webuploader': ['rq/css!'+BaseUrls.jq.webuploader+'/webuploader'],
            'plupload-bs3': ['rq/css!'+BaseUrls.plupload+'/css/jquery.plupload.bs3', 'bs/button', 'jq/dragsort'],
            'highlight': ['rq/css!'+BaseUrls.highlight+'/highlight.pack']
        }
    });

    BaseUrls = null;

    function getModuleVersion(moduleName) {
        if (typeof moduleName !== "string") return null;

        var mdNames = moduleName.split('\/'),i = 0,
            vObj = Versions, v = vObj[mdNames[i]];

        while (v != null && typeof v === "object") {
            vObj = v;
            i ++;
            if (mdNames[i] == null) {
                v = null;
            } else {
                v = vObj[mdNames[i]];
            }
        }

        return v;
    }

    function getModuleByUrl(url) {
        if (typeof url !== "string") return null;

        url = $.trim(url);

        var mdName = null;

        if (url.indexOf(YFjs.baseMd) != 0) return mdName;

        if ((mdName = MdUrl[url]) != null) return mdName;

        var posSuffix = url.lastIndexOf(".");
        if (posSuffix > -1) {
            var posLastSlash = url.lastIndexOf("/");
            if (posLastSlash < posSuffix) {
                url = url.substring(0, posSuffix);
            }
        }

        if ((mdName = MdUrl[url]) != null) return mdName;

        do {
            url = url.split('\/');
            url.pop();
            url = $.trim(url.join("/"));
            mdName = MdUrl[url];
        } while (
            mdName == null && url.length > 0
        );

        return mdName;
    }

    define('echarts2', ['echarts2/echarts'], function(main) {return main;});

    define('jquery', [], function() {return ($ && typeof $.noConflict === "function" ? ($ = $.noConflict()) : null)});
    define('yfjs', [], function() {return YFjs});

})(this, jQuery);