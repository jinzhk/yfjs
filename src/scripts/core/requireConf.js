!function(root, $, undefined) {
    "use strict";

    if(typeof require === "undefined" || typeof require.config !== "function" || typeof define !== "function" || !define.amd) { throw new Error("Requires AMD Require Plugin."); }
    if(root.YFjs == null) { throw new Error("YFjs must be declared before requireConf."); }

    var document = document || root.document;

    var YFjs = root.YFjs;

    var _docReadyStateIndex = YFjs.checkDocReadyState();

    var BaseMd = YFjs.baseMd + "/modules";

    var reg_start_at = /^@+/,
        reg_slash_start = /^\/+/,
        reg_slash_end = /\/+$/,
        reg_slash_back = /\\+/g,
        reg_rq_plugin = /^rq\/[^\!]+\!/,
        reg_rq_plugin_css = /^rq\/css!/,
        reg_protocol_start = /^https?:\/\/(?!\/)/;

    var requireConf = {
        paths: {"cookie":"cookie/cookie","crypto":"crypto/crypto-js","d3":"d3/d3","d3-v3":"d3-v3/d3","echarts/mapData/world":"echarts/mapData/world","echarts/mapData/china":"echarts/mapData/china","echarts/mapData/china-cities":"echarts/mapData/china-cities","echarts/mapData/china-contour":"echarts/mapData/china-contour","echarts/mapData/province/anhui":"echarts/mapData/province/anhui","echarts/mapData/province/aomen":"echarts/mapData/province/aomen","echarts/mapData/province/beijing":"echarts/mapData/province/beijing","echarts/mapData/province/chongqing":"echarts/mapData/province/chongqing","echarts/mapData/province/fujian":"echarts/mapData/province/fujian","echarts/mapData/province/gansu":"echarts/mapData/province/gansu","echarts/mapData/province/guangdong":"echarts/mapData/province/guangdong","echarts/mapData/province/guangxi":"echarts/mapData/province/guangxi","echarts/mapData/province/guizhou":"echarts/mapData/province/guizhou","echarts/mapData/province/hainan":"echarts/mapData/province/hainan","echarts/mapData/province/hebei":"echarts/mapData/province/hebei","echarts/mapData/province/heilongjiang":"echarts/mapData/province/heilongjiang","echarts/mapData/province/henan":"echarts/mapData/province/henan","echarts/mapData/province/hubei":"echarts/mapData/province/hubei","echarts/mapData/province/hunan":"echarts/mapData/province/hunan","echarts/mapData/province/jiangsu":"echarts/mapData/province/jiangsu","echarts/mapData/province/jiangxi":"echarts/mapData/province/jiangxi","echarts/mapData/province/jilin":"echarts/mapData/province/jilin","echarts/mapData/province/liaoning":"echarts/mapData/province/liaoning","echarts/mapData/province/neimenggu":"echarts/mapData/province/neimenggu","echarts/mapData/province/ningxia":"echarts/mapData/province/ningxia","echarts/mapData/province/qinghai":"echarts/mapData/province/qinghai","echarts/mapData/province/shandong":"echarts/mapData/province/shandong","echarts/mapData/province/shanghai":"echarts/mapData/province/shanghai","echarts/mapData/province/shanxi":"echarts/mapData/province/shanxi","echarts/mapData/province/shanxi1":"echarts/mapData/province/shanxi1","echarts/mapData/province/sichuan":"echarts/mapData/province/sichuan","echarts/mapData/province/taiwan":"echarts/mapData/province/taiwan","echarts/mapData/province/tianjin":"echarts/mapData/province/tianjin","echarts/mapData/province/xianggang":"echarts/mapData/province/xianggang","echarts/mapData/province/xinjiang":"echarts/mapData/province/xinjiang","echarts/mapData/province/xizang":"echarts/mapData/province/xizang","echarts/mapData/province/yunnan":"echarts/mapData/province/yunnan","echarts/mapData/province/zhejiang":"echarts/mapData/province/zhejiang","echarts/mapData/province":"echarts/mapData/province/province","echarts/mapData":"echarts/mapData/mapData","echarts":"echarts/echarts","echarts2/echarts":"echarts2/echarts","echarts2/chart/bar":"echarts2/chart/bar","echarts2/chart/chord":"echarts2/chart/chord","echarts2/chart/eventRiver":"echarts2/chart/eventRiver","echarts2/chart/force":"echarts2/chart/force","echarts2/chart/funnel":"echarts2/chart/funnel","echarts2/chart/gauge":"echarts2/chart/gauge","echarts2/chart/heatmap":"echarts2/chart/heatmap","echarts2/chart/k":"echarts2/chart/k","echarts2/chart/line":"echarts2/chart/line","echarts2/chart/map":"echarts2/chart/map","echarts2/chart/pie":"echarts2/chart/pie","echarts2/chart/radar":"echarts2/chart/radar","echarts2/chart/scatter":"echarts2/chart/scatter","echarts2/chart/tree":"echarts2/chart/tree","echarts2/chart/treemap":"echarts2/chart/treemap","echarts2/chart/venn":"echarts2/chart/venn","echarts2/chart/wordCloud":"echarts2/chart/wordCloud","echarts2/chart/base":"echarts2/echarts","echarts2/chart/island":"echarts2/echarts","echarts2/chart":"echarts2/echarts","echarts2/component/axis":"echarts2/echarts","echarts2/component/base":"echarts2/echarts","echarts2/component/categoryAxis":"echarts2/echarts","echarts2/component/dataRange":"echarts2/component/dataRange","echarts2/component/dataView":"echarts2/echarts","echarts2/component/dataZoom":"echarts2/echarts","echarts2/component/grid":"echarts2/echarts","echarts2/component/legend":"echarts2/echarts","echarts2/component/polar":"echarts2/chart/radar","echarts2/component/roamController":"echarts2/chart/map","echarts2/component/timeline":"echarts2/echarts","echarts2/component/title":"echarts2/echarts","echarts2/component/toolbox":"echarts2/echarts","echarts2/component/tooltip":"echarts2/echarts","echarts2/component/valueAxis":"echarts2/echarts","echarts2/component":"echarts2/echarts","echarts2/data/Graph":"echarts2/data/Graph","echarts2/data/KDTree":"echarts2/echarts","echarts2/data/quickSelect":"echarts2/echarts","echarts2/data/Tree":"echarts2/data/Tree","echarts2/layer/heatmap":"echarts2/chart/heatmap","echarts2/layout/Chord":"echarts2/chart/chord","echarts2/layout/EdgeBundling":"echarts2/echarts","echarts2/layout/eventRiver":"echarts2/chart/eventRiver","echarts2/layout/Force":"echarts2/chart/force","echarts2/layout/forceLayoutWorker":"echarts2/chart/force","echarts2/layout/Tree":"echarts2/chart/tree","echarts2/layout/TreeMap":"echarts2/chart/treemap","echarts2/layout/WordCloud":"echarts2/chart/wordCloud","echarts2/layout/WordCloudRectZero":"echarts2/chart/wordCloud","echarts2/theme/default":"echarts2/echarts","echarts2/theme/infographic":"echarts2/echarts","echarts2/theme/macarons":"echarts2/echarts","echarts2/util/mapData/geoJson/an_hui_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/ao_men_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/bei_jing_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/china_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/chong_qing_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/fu_jian_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/gan_su_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/guang_dong_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/guang_xi_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/gui_zhou_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/hai_nan_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/he_bei_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/he_nan_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/hei_long_jiang_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/hu_bei_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/hu_nan_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/ji_lin_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/jiang_su_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/jiang_xi_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/liao_ning_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/nei_meng_gu_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/ning_xia_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/qing_hai_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/shan_dong_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/shan_xi_1_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/shan_xi_2_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/shang_hai_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/si_chuan_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/tai_wan_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/tian_jin_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/world_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/xi_zang_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/xiang_gang_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/xin_jiang_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/yun_nan_geo":"echarts2/chart/map","echarts2/util/mapData/geoJson/zhe_jiang_geo":"echarts2/chart/map","echarts2/util/mapData/geoCoord":"echarts2/chart/map","echarts2/util/mapData/params":"echarts2/chart/map","echarts2/util/mapData/textFixed":"echarts2/chart/map","echarts2/util/projection/albers":"echarts2/chart/map","echarts2/util/projection/mercator":"echarts2/chart/map","echarts2/util/projection/normal":"echarts2/chart/map","echarts2/util/projection/svg":"echarts2/chart/map","echarts2/util/shape/Candle":"echarts2/echarts","echarts2/util/shape/Chain":"echarts2/echarts","echarts2/util/shape/Cross":"echarts2/echarts","echarts2/util/shape/GaugePointer":"echarts2/chart/gauge","echarts2/util/shape/HalfSmoothPolygon":"echarts2/chart/line","echarts2/util/shape/HandlePolygon":"echarts2/util/shape/HandlePolygon","echarts2/util/shape/Icon":"echarts2/echarts","echarts2/util/shape/MarkLine":"echarts2/echarts","echarts2/util/shape/normalIsCover":"echarts2/echarts","echarts2/util/shape/Ribbon":"echarts2/chart/chord","echarts2/util/shape/Symbol":"echarts2/echarts","echarts2/util/accMath":"echarts2/echarts","echarts2/util/coordinates":"echarts2/chart/radar","echarts2/util/date":"echarts2/echarts","echarts2/util/ecAnimation":"echarts2/echarts","echarts2/util/ecData":"echarts2/echarts","echarts2/util/ecEffect":"echarts2/echarts","echarts2/util/ecQuery":"echarts2/echarts","echarts2/util/kwargs":"echarts2/echarts","echarts2/util/ndarray":"echarts2/echarts","echarts2/util/number":"echarts2/echarts","echarts2/util/smartLogSteps":"echarts2/echarts","echarts2/util/smartSteps":"echarts2/echarts","echarts2/config":"echarts2/echarts","echarts2":"echarts2/echarts2","zrender2/animation/Animation":"echarts2/echarts","zrender2/animation/Clip":"echarts2/echarts","zrender2/animation/easing":"echarts2/echarts","zrender2/dep/excanvas":"echarts2/echarts","zrender2/dep/excanvas2":"echarts2/echarts","zrender2/dep/excanvas3":"echarts2/echarts","zrender2/loadingEffect/Bar":"echarts2/echarts","zrender2/loadingEffect/Base":"echarts2/echarts","zrender2/loadingEffect/Bubble":"echarts2/echarts","zrender2/loadingEffect/DynamicLine":"echarts2/echarts","zrender2/loadingEffect/Ring":"echarts2/echarts","zrender2/loadingEffect/Spin":"echarts2/echarts","zrender2/loadingEffect/Whirling":"echarts2/echarts","zrender2/mixin/Eventful":"echarts2/echarts","zrender2/mixin/Transformable":"echarts2/echarts","zrender2/shape/Base":"echarts2/echarts","zrender2/shape/BezierCurve":"echarts2/echarts","zrender2/shape/Circle":"echarts2/echarts","zrender2/shape/Droplet":"echarts2/echarts","zrender2/shape/Ellipse":"echarts2/chart/map","zrender2/shape/Heart":"echarts2/echarts","zrender2/shape/Image":"echarts2/echarts","zrender2/shape/Isogon":"echarts2/echarts","zrender2/shape/Line":"echarts2/echarts","zrender2/shape/Path":"echarts2/zrender/shape/Path","zrender2/shape/Polygon":"echarts2/echarts","zrender2/shape/Polyline":"echarts2/echarts","zrender2/shape/Rectangle":"echarts2/echarts","zrender2/shape/Ring":"echarts2/echarts","zrender2/shape/Rose":"echarts2/echarts","zrender2/shape/Sector":"echarts2/echarts","zrender2/shape/ShapeBundle":"echarts2/echarts","zrender2/shape/Star":"echarts2/echarts","zrender2/shape/Text":"echarts2/echarts","zrender2/shape/Trochoid":"echarts2/echarts","zrender2/shape/util/PathProxy":"echarts2/echarts","zrender2/shape/util/dashedLineTo":"echarts2/echarts","zrender2/shape/util/smoothBezier":"echarts2/echarts","zrender2/shape/util/smoothSpline":"echarts2/echarts","zrender2/tool/area":"echarts2/echarts","zrender2/tool/color":"echarts2/echarts","zrender2/tool/computeBoundingBox":"echarts2/echarts","zrender2/tool/curve":"echarts2/echarts","zrender2/tool/env":"echarts2/echarts","zrender2/tool/event":"echarts2/echarts","zrender2/tool/guid":"echarts2/echarts","zrender2/tool/http":"echarts2/echarts","zrender2/tool/log":"echarts2/echarts","zrender2/tool/math":"echarts2/echarts","zrender2/tool/matrix":"echarts2/echarts","zrender2/tool/util":"echarts2/echarts","zrender2/tool/vector":"echarts2/echarts","zrender2/Group":"echarts2/echarts","zrender2/Handler":"echarts2/echarts","zrender2/Layer":"echarts2/echarts","zrender2/Painter":"echarts2/echarts","zrender2/Storage":"echarts2/echarts","zrender2/config":"echarts2/echarts","zrender2/zrender":"echarts2/echarts","zrender2":"echarts2/echarts","es5-shim":"es5-shim/es5-shim","es6-shim":"es6-shim/es6-shim","highlight":"highlight/highlight.pack","html5shiv":"html5shiv/html5shiv","jq/chosen":"jq-plugins/chosen/chosen.jquery","jq/dataTables-bs3":"jq-plugins/dataTables-bs3/dataTables.bs3","jq/dragsort":"jq-plugins/dragsort/dragsort","jq/form/validator-bs3":"jq-plugins/form/validator-bs3/jquery.validate.bs3","jq/form":"jq-plugins/form/jquery.form","jq/mCustomScrollbar":"jq-plugins/mCustomScrollbar/jquery.mCustomScrollbar","jq/migrate":"jq-plugins/migrate/jquery-migrate","jq/multipicker":"jq-plugins/multipicker/multipicker","jq/nicescroll":"jq-plugins/nicescroll/jquery.nicescroll","jq/qrcode":"jq-plugins/qrcode/jquery.qrcode","jq/urlp":"jq-plugins/urlp/urlp","jq/webuploader":"jq-plugins/webuploader/webuploader","jq/zeroclipboard":"jq-plugins/zeroclipboard/jquery.zeroclipboard","jq/ztree":"jq-plugins/ztree/jquery.ztree","bs/alert":"jq-plugins/bootstrap/alert/alert","bs/button":"jq-plugins/bootstrap/button/button","bs/carousel":"jq-plugins/bootstrap/carousel/carousel","bs/clockpicker":"jq-plugins/bootstrap/clockpicker/clockpicker","bs/collapse":"jq-plugins/bootstrap/collapse/collapse","bs/daterangepicker":"jq-plugins/bootstrap/daterangepicker/daterangepicker","bs/datetimepicker":"jq-plugins/bootstrap/datetimepicker/datetimepicker","bs/modal":"jq-plugins/bootstrap/modal/modal","bs/paging":"jq-plugins/bootstrap/paging/paging","bs/popover":"jq-plugins/bootstrap/popover/popover","bs/slider":"jq-plugins/bootstrap/slider/slider","bs/spinbox":"jq-plugins/bootstrap/spinbox/spinbox","bs/switcher":"jq-plugins/bootstrap/switcher/switcher","bs/tab":"jq-plugins/bootstrap/tab/tab","bs/tooltip":"jq-plugins/bootstrap/tooltip/tooltip","bs/wizard":"jq-plugins/bootstrap/wizard/wizard","json":"json/json3","modernizr":"modernizr/modernizr-custom","moment/locale":"moment/locale","moment":"moment/moment","plupload/i18n":"plupload/i18n","plupload":"plupload/plupload","plupload-bs3":"plupload-bs3/jquery.plupload.bs3","remarkable":"remarkable/remarkable","respond":"respond/respond","zeroclipboard":"zeroclipboard/ZeroClipboard","yfjs/spa/app":"spa/spa","yfjs/spa/version":"spa/spa","yfjs/spa/util/ajax":"spa/spa","yfjs/spa/util/console":"spa/spa","yfjs/spa/util/cookie":"spa/spa","yfjs/spa/util/error":"spa/spa","yfjs/spa/util/event":"spa/spa","yfjs/spa/util/filter":"spa/spa","yfjs/spa/util/helpers":"spa/spa","yfjs/spa/util/history":"spa/spa","yfjs/spa/util/layout":"spa/spa","yfjs/spa/util/path-wildcard-compiler":"spa/spa","yfjs/spa/util/remote":"spa/spa","yfjs/spa/util/route":"spa/spa","yfjs/spa/util/style-loader":"spa/spa","yfjs/spa/util/template":"spa/spa","yfjs/spa/util/template-helpers":"spa/spa","yfjs/spa/util/view":"spa/spa","yfjs/spa/util/websocket":"spa/spa","yfjs/spa/util/widget":"spa/spa","yfjs/spa/ui/loading":"spa/spa","yfjs/spa":"spa/spa"},
        packages: [{"name":"codemirror","location":"codemirror","main":"lib/codemirror"},{"name":"jq/dataTables","location":"jq-plugins/dataTables","main":"jquery.dataTables"},{"name":"jq/form/validator","location":"jq-plugins/form/validator","main":"jquery.validate"},{"name":"ueditor","location":"ueditor","main":"ueditor.all"}],
        map: {"*":{"rq/cs":"rq-plugins/cs/cs.js","rq/css":"rq-plugins/css/css.js","rq/i18n":"rq-plugins/i18n/i18n.js","rq/text":"rq-plugins/text/text.js"}},
        shim: {"codemirror/lib/codemirror":["rq/css!codemirror/lib/codemirror"],"es5-shim":{"deps":[],"exports":"globals"},"es6-shim":{"deps":[],"exports":"globals"},"highlight":["rq/css!highlight/highlight.pack"],"html5shiv":{"deps":[],"exports":"html5"},"jq/chosen":["rq/css!jq-plugins/chosen/chosen-bs"],"jq/dataTables/jquery.dataTables":["rq/css!jq-plugins/dataTables/css/jquery.dataTables"],"jq/dataTables-bs3":["@jq/dataTables","rq/css!jq-plugins/dataTables-bs3/css/dataTables.bootstrap3"],"jq/form/validator-bs3":["@jq/form/validator","@bs/popover"],"jq/mCustomScrollbar":["rq/css!jq-plugins/mCustomScrollbar/jquery.mCustomScrollbar"],"jq/multipicker":["rq/css!jq-plugins/multipicker/multipicker"],"jq/webuploader":["rq/css!jq-plugins/webuploader/webuploader"],"jq/ztree":["rq/css!jq-plugins/ztree/jquery.ztree"],"bs/clockpicker":["rq/css!jq-plugins/bootstrap/clockpicker/clockpicker"],"bs/daterangepicker":["rq/css!jq-plugins/bootstrap/daterangepicker/daterangepicker"],"bs/datetimepicker":["rq/css!jq-plugins/bootstrap/datetimepicker/datetimepicker"],"bs/popover":["@bs/tooltip"],"bs/slider":["rq/css!jq-plugins/bootstrap/slider/slider"],"bs/switcher":["rq/css!jq-plugins/bootstrap/switcher/switcher-bs2"],"bs/wizard":["rq/css!jq-plugins/bootstrap/wizard/wizard"],"json":{"deps":[],"exports":"JSON3"},"modernizr":{"deps":[],"exports":"Modernizr"},"plupload-bs3":["rq/css!plupload-bs3/css/jquery.plupload.bs3","@bs/button","@jq/dragsort"],"respond":{"deps":[],"exports":"respond"}}
    };

    requireConf.paths = parsePathsUrl(requireConf.paths);

    requireConf.packages = parsePackagesUrl(requireConf.packages);

    requireConf.map = parseMapUrl(requireConf.map);

    requireConf.shim = parseShimUrl(requireConf.shim);
    requireConf.shim = parseShimCss(requireConf.shim);

    var Versions = {"codemirror":"5.9.0","cookie":"0.8.2","crypto":"3.1.6","d3":"4.6.0","d3-v3":"3.5.16","echarts/mapData/world":"3.5.4","echarts/mapData/china":"3.5.4","echarts/mapData/china-cities":"3.5.4","echarts/mapData/china-contour":"3.5.4","echarts/mapData/province/anhui":"3.5.4","echarts/mapData/province/aomen":"3.5.4","echarts/mapData/province/beijing":"3.5.4","echarts/mapData/province/chongqing":"3.5.4","echarts/mapData/province/fujian":"3.5.4","echarts/mapData/province/gansu":"3.5.4","echarts/mapData/province/guangdong":"3.5.4","echarts/mapData/province/guangxi":"3.5.4","echarts/mapData/province/guizhou":"3.5.4","echarts/mapData/province/hainan":"3.5.4","echarts/mapData/province/hebei":"3.5.4","echarts/mapData/province/heilongjiang":"3.5.4","echarts/mapData/province/henan":"3.5.4","echarts/mapData/province/hubei":"3.5.4","echarts/mapData/province/hunan":"3.5.4","echarts/mapData/province/jiangsu":"3.5.4","echarts/mapData/province/jiangxi":"3.5.4","echarts/mapData/province/jilin":"3.5.4","echarts/mapData/province/liaoning":"3.5.4","echarts/mapData/province/neimenggu":"3.5.4","echarts/mapData/province/ningxia":"3.5.4","echarts/mapData/province/qinghai":"3.5.4","echarts/mapData/province/shandong":"3.5.4","echarts/mapData/province/shanghai":"3.5.4","echarts/mapData/province/shanxi":"3.5.4","echarts/mapData/province/shanxi1":"3.5.4","echarts/mapData/province/sichuan":"3.5.4","echarts/mapData/province/taiwan":"3.5.4","echarts/mapData/province/tianjin":"3.5.4","echarts/mapData/province/xianggang":"3.5.4","echarts/mapData/province/xinjiang":"3.5.4","echarts/mapData/province/xizang":"3.5.4","echarts/mapData/province/yunnan":"3.5.4","echarts/mapData/province/zhejiang":"3.5.4","echarts/mapData/province":"3.5.4","echarts/mapData":"3.5.4","echarts":"3.5.4","echarts2/echarts":"2.2.7","echarts2/chart/bar":"2.2.7","echarts2/chart/chord":"2.2.7","echarts2/chart/eventRiver":"2.2.7","echarts2/chart/force":"2.2.7","echarts2/chart/funnel":"2.2.7","echarts2/chart/gauge":"2.2.7","echarts2/chart/heatmap":"2.2.7","echarts2/chart/k":"2.2.7","echarts2/chart/line":"2.2.7","echarts2/chart/map":"2.2.7","echarts2/chart/pie":"2.2.7","echarts2/chart/radar":"2.2.7","echarts2/chart/scatter":"2.2.7","echarts2/chart/tree":"2.2.7","echarts2/chart/treemap":"2.2.7","echarts2/chart/venn":"2.2.7","echarts2/chart/wordCloud":"2.2.7","echarts2/chart/base":"2.2.7","echarts2/chart/island":"2.2.7","echarts2/chart":"2.2.7","echarts2/component/axis":"2.2.7","echarts2/component/base":"2.2.7","echarts2/component/categoryAxis":"2.2.7","echarts2/component/dataRange":"2.2.7","echarts2/component/dataView":"2.2.7","echarts2/component/dataZoom":"2.2.7","echarts2/component/grid":"2.2.7","echarts2/component/legend":"2.2.7","echarts2/component/polar":"2.2.7","echarts2/component/roamController":"2.2.7","echarts2/component/timeline":"2.2.7","echarts2/component/title":"2.2.7","echarts2/component/toolbox":"2.2.7","echarts2/component/tooltip":"2.2.7","echarts2/component/valueAxis":"2.2.7","echarts2/component":"2.2.7","echarts2/data/Graph":"2.2.7","echarts2/data/KDTree":"2.2.7","echarts2/data/quickSelect":"2.2.7","echarts2/data/Tree":"2.2.7","echarts2/layer/heatmap":"2.2.7","echarts2/layout/Chord":"2.2.7","echarts2/layout/EdgeBundling":"2.2.7","echarts2/layout/eventRiver":"2.2.7","echarts2/layout/Force":"2.2.7","echarts2/layout/forceLayoutWorker":"2.2.7","echarts2/layout/Tree":"2.2.7","echarts2/layout/TreeMap":"2.2.7","echarts2/layout/WordCloud":"2.2.7","echarts2/layout/WordCloudRectZero":"2.2.7","echarts2/theme/default":"2.2.7","echarts2/theme/infographic":"2.2.7","echarts2/theme/macarons":"2.2.7","echarts2/util/mapData/geoJson/an_hui_geo":"2.2.7","echarts2/util/mapData/geoJson/ao_men_geo":"2.2.7","echarts2/util/mapData/geoJson/bei_jing_geo":"2.2.7","echarts2/util/mapData/geoJson/china_geo":"2.2.7","echarts2/util/mapData/geoJson/chong_qing_geo":"2.2.7","echarts2/util/mapData/geoJson/fu_jian_geo":"2.2.7","echarts2/util/mapData/geoJson/gan_su_geo":"2.2.7","echarts2/util/mapData/geoJson/guang_dong_geo":"2.2.7","echarts2/util/mapData/geoJson/guang_xi_geo":"2.2.7","echarts2/util/mapData/geoJson/gui_zhou_geo":"2.2.7","echarts2/util/mapData/geoJson/hai_nan_geo":"2.2.7","echarts2/util/mapData/geoJson/he_bei_geo":"2.2.7","echarts2/util/mapData/geoJson/he_nan_geo":"2.2.7","echarts2/util/mapData/geoJson/hei_long_jiang_geo":"2.2.7","echarts2/util/mapData/geoJson/hu_bei_geo":"2.2.7","echarts2/util/mapData/geoJson/hu_nan_geo":"2.2.7","echarts2/util/mapData/geoJson/ji_lin_geo":"2.2.7","echarts2/util/mapData/geoJson/jiang_su_geo":"2.2.7","echarts2/util/mapData/geoJson/jiang_xi_geo":"2.2.7","echarts2/util/mapData/geoJson/liao_ning_geo":"2.2.7","echarts2/util/mapData/geoJson/nei_meng_gu_geo":"2.2.7","echarts2/util/mapData/geoJson/ning_xia_geo":"2.2.7","echarts2/util/mapData/geoJson/qing_hai_geo":"2.2.7","echarts2/util/mapData/geoJson/shan_dong_geo":"2.2.7","echarts2/util/mapData/geoJson/shan_xi_1_geo":"2.2.7","echarts2/util/mapData/geoJson/shan_xi_2_geo":"2.2.7","echarts2/util/mapData/geoJson/shang_hai_geo":"2.2.7","echarts2/util/mapData/geoJson/si_chuan_geo":"2.2.7","echarts2/util/mapData/geoJson/tai_wan_geo":"2.2.7","echarts2/util/mapData/geoJson/tian_jin_geo":"2.2.7","echarts2/util/mapData/geoJson/world_geo":"2.2.7","echarts2/util/mapData/geoJson/xi_zang_geo":"2.2.7","echarts2/util/mapData/geoJson/xiang_gang_geo":"2.2.7","echarts2/util/mapData/geoJson/xin_jiang_geo":"2.2.7","echarts2/util/mapData/geoJson/yun_nan_geo":"2.2.7","echarts2/util/mapData/geoJson/zhe_jiang_geo":"2.2.7","echarts2/util/mapData/geoCoord":"2.2.7","echarts2/util/mapData/params":"2.2.7","echarts2/util/mapData/textFixed":"2.2.7","echarts2/util/projection/albers":"2.2.7","echarts2/util/projection/mercator":"2.2.7","echarts2/util/projection/normal":"2.2.7","echarts2/util/projection/svg":"2.2.7","echarts2/util/shape/Candle":"2.2.7","echarts2/util/shape/Chain":"2.2.7","echarts2/util/shape/Cross":"2.2.7","echarts2/util/shape/GaugePointer":"2.2.7","echarts2/util/shape/HalfSmoothPolygon":"2.2.7","echarts2/util/shape/HandlePolygon":"2.2.7","echarts2/util/shape/Icon":"2.2.7","echarts2/util/shape/MarkLine":"2.2.7","echarts2/util/shape/normalIsCover":"2.2.7","echarts2/util/shape/Ribbon":"2.2.7","echarts2/util/shape/Symbol":"2.2.7","echarts2/util/accMath":"2.2.7","echarts2/util/coordinates":"2.2.7","echarts2/util/date":"2.2.7","echarts2/util/ecAnimation":"2.2.7","echarts2/util/ecData":"2.2.7","echarts2/util/ecEffect":"2.2.7","echarts2/util/ecQuery":"2.2.7","echarts2/util/kwargs":"2.2.7","echarts2/util/ndarray":"2.2.7","echarts2/util/number":"2.2.7","echarts2/util/smartLogSteps":"2.2.7","echarts2/util/smartSteps":"2.2.7","echarts2/config":"2.2.7","echarts2":"2.2.7","zrender2/animation/Animation":"2.2.7","zrender2/animation/Clip":"2.2.7","zrender2/animation/easing":"2.2.7","zrender2/dep/excanvas":"2.2.7","zrender2/dep/excanvas2":"2.2.7","zrender2/dep/excanvas3":"2.2.7","zrender2/loadingEffect/Bar":"2.2.7","zrender2/loadingEffect/Base":"2.2.7","zrender2/loadingEffect/Bubble":"2.2.7","zrender2/loadingEffect/DynamicLine":"2.2.7","zrender2/loadingEffect/Ring":"2.2.7","zrender2/loadingEffect/Spin":"2.2.7","zrender2/loadingEffect/Whirling":"2.2.7","zrender2/mixin/Eventful":"2.2.7","zrender2/mixin/Transformable":"2.2.7","zrender2/shape/Base":"2.2.7","zrender2/shape/BezierCurve":"2.2.7","zrender2/shape/Circle":"2.2.7","zrender2/shape/Droplet":"2.2.7","zrender2/shape/Ellipse":"2.2.7","zrender2/shape/Heart":"2.2.7","zrender2/shape/Image":"2.2.7","zrender2/shape/Isogon":"2.2.7","zrender2/shape/Line":"2.2.7","zrender2/shape/Path":"2.2.7","zrender2/shape/Polygon":"2.2.7","zrender2/shape/Polyline":"2.2.7","zrender2/shape/Rectangle":"2.2.7","zrender2/shape/Ring":"2.2.7","zrender2/shape/Rose":"2.2.7","zrender2/shape/Sector":"2.2.7","zrender2/shape/ShapeBundle":"2.2.7","zrender2/shape/Star":"2.2.7","zrender2/shape/Text":"2.2.7","zrender2/shape/Trochoid":"2.2.7","zrender2/shape/util/PathProxy":"2.2.7","zrender2/shape/util/dashedLineTo":"2.2.7","zrender2/shape/util/smoothBezier":"2.2.7","zrender2/shape/util/smoothSpline":"2.2.7","zrender2/tool/area":"2.2.7","zrender2/tool/color":"2.2.7","zrender2/tool/computeBoundingBox":"2.2.7","zrender2/tool/curve":"2.2.7","zrender2/tool/env":"2.2.7","zrender2/tool/event":"2.2.7","zrender2/tool/guid":"2.2.7","zrender2/tool/http":"2.2.7","zrender2/tool/log":"2.2.7","zrender2/tool/math":"2.2.7","zrender2/tool/matrix":"2.2.7","zrender2/tool/util":"2.2.7","zrender2/tool/vector":"2.2.7","zrender2/Group":"2.2.7","zrender2/Handler":"2.2.7","zrender2/Layer":"2.2.7","zrender2/Painter":"2.2.7","zrender2/Storage":"2.2.7","zrender2/config":"2.2.7","zrender2/zrender":"2.2.7","zrender2":"2.2.7","es5-shim":"4.5.9","es6-shim":"0.35.3","highlight":"9.9.0+20170224","html5shiv":"3.7.3","jq/chosen":"1.4.2+20170512","jq/dataTables":"1.10.7+20170606","jq/dataTables-bs3":"1.10.7+20170606","jq/dragsort":"0.5.2","jq/form/validator":"1.13.1","jq/form/validator-bs3":"1.13.1","jq/form":"4.2.1","jq/mCustomScrollbar":"3.1.5","jq/migrate":"1.2.1","jq/multipicker":"0.8.2","jq/nicescroll":"3.6.0","jq/qrcode":"1.0","jq/urlp":"1.0.4","jq/webuploader":"0.1.5","jq/zeroclipboard":"0.2.2","jq/ztree":"3.5.18","bs/alert":"3.3.4","bs/button":"3.3.4+20150713","bs/carousel":"3.3.4","bs/clockpicker":"0.0.7","bs/collapse":"3.3.4","bs/daterangepicker":"2.1.15","bs/datetimepicker":"2.4.4","bs/modal":"3.3.4+20170424","bs/paging":"1.0.2+20170508","bs/popover":"3.3.4+20150609","bs/slider":"9.8.0","bs/spinbox":"3.6.3+20150518","bs/switcher":"3.3.4+20170504","bs/tab":"3.3.4","bs/tooltip":"3.3.4+20150609","bs/wizard":"3.6.3+20151109","json":"3.3.2","modernizr":"3.4.0","moment":"2.10.3","plupload":"2.1.4","plupload-bs3":"2.1.4","remarkable":"1.6.0","respond":"1.4.2","rq/cs":"0.5.0","rq/css":"0.1.8","rq/i18n":"2.0.4","rq/text":"2.0.12","ueditor":"1.4.3.3+20170526","zeroclipboard":"2.2.0","yfjs/spa/app":"1.0.0-rc.4","yfjs/spa/version":"1.0.0-rc.4","yfjs/spa/util/ajax":"1.0.0-rc.4","yfjs/spa/util/console":"1.0.0-rc.4","yfjs/spa/util/cookie":"1.0.0-rc.4","yfjs/spa/util/error":"1.0.0-rc.4","yfjs/spa/util/event":"1.0.0-rc.4","yfjs/spa/util/filter":"1.0.0-rc.4","yfjs/spa/util/helpers":"1.0.0-rc.4","yfjs/spa/util/history":"1.0.0-rc.4","yfjs/spa/util/layout":"1.0.0-rc.4","yfjs/spa/util/path-wildcard-compiler":"1.0.0-rc.4","yfjs/spa/util/remote":"1.0.0-rc.4","yfjs/spa/util/route":"1.0.0-rc.4","yfjs/spa/util/style-loader":"1.0.0-rc.4","yfjs/spa/util/template":"1.0.0-rc.4","yfjs/spa/util/template-helpers":"1.0.0-rc.4","yfjs/spa/util/view":"1.0.0-rc.4","yfjs/spa/util/websocket":"1.0.0-rc.4","yfjs/spa/util/widget":"1.0.0-rc.4","yfjs/spa/ui/loading":"1.0.0-rc.4","yfjs/spa":"1.0.0-rc.4"};
    
    require.config({
        waitSeconds: 0, // 关闭超时时间设置
        baseUrl: YFjs.baseRq,
        urlArgs: function(moduleName, url) {
            var v = getModuleVersion(moduleName);
            if (v == null) {
                if (false === YFjs.bCache) {
                    v = YFjs.VERSION + '+' + YFjs.timestamp;
                } else {
                    v = YFjs.VERSION
                }
            }
            return 'v=' + v;
        },
        paths: requireConf.paths,
        map: requireConf.map,
        packages: requireConf.packages,
        shim: requireConf.shim
    });

    function parsePathsUrl(paths) {
        paths = paths || {};
        for (var id in paths) {
            paths[id] = joinPath(BaseMd, paths[id]);
        }
        return paths;
    }

    function parsePackagesUrl(packages) {
        packages = packages || [];
        var _package;
        for (var i in packages) {
            _package = packages[i];
            if (_package && _package.location) {
                _package.location = joinPath(BaseMd, _package.location);
                packages[i] = _package;
            }
        }
        return packages;
    }

    function parseMapUrl(map, level) {
        map = map || {};
        level = level || 0;
        var _map;
        for (var key in map) {
            _map = map[key];
            if (_map && typeof _map === "object" && level < 1000) {
                _map = parseMapUrl(_map, level + 1);
            } else if (_map) {
                _map = joinPath(BaseMd, _map);
            }
            map[key] = _map;
        }
        return map;
    }

    function parseShimUrl(shim, level) {
        shim = shim || {};
        level = level || 0;
        var _shim;
        for (var name in shim) {
            _shim = shim[name];
            if (_shim) {
                if (isArray(_shim)) {
                    for (var i in _shim) {
                        if (reg_rq_plugin.test(_shim[i])) {
                            _shim[i] = (_shim[i]+'').replace(reg_rq_plugin, function(m) {return joinPath(m + BaseMd) + '/';})
                        } else if (reg_start_at.test(_shim[i])) {
                            _shim[i] = _shim[i].replace(reg_start_at, "");
                        } else {
                            _shim[i] = joinPath(BaseMd, _shim[i]);
                        }
                    }
                } else if (isArray(_shim.deps) && level < 1000) {
                    _shim.deps = parseShimUrl(_shim.deps, level + 1);
                }
            }
            shim[name] = _shim;
        }
        return shim;
    }

    function parseShimCss(shim, level) {
        shim = shim || {};
        level = level || 0;
        var _shim;
        for (var name in shim) {
            _shim = shim[name];
            if (_shim) {
                if (isArray(_shim)) {
                    for (var i = 0; i<_shim.length; i++) {
                        if (!reg_rq_plugin.test(_shim[i]) && _shim[i].indexOf(BaseMd)!=0) {
                            var _shimCss = getShimCss(shim, _shim[i]);
                            if (_shimCss.length) {
                                _shimCss.unshift(_shim[i]);
                                _shim.splice.apply(_shim, [i, 1].concat(_shimCss));
                                i += _shimCss.length;
                            }
                        } 
                    }
                } else if (isArray(_shim.deps) && level < 1000) {
                    _shim.deps = parseShimUrl(_shim.deps, level + 1);
                }
            }
            shim[name] = _shim;
        }
        return shim;
    }

    function getShimCss(shim, mdName) {
        mdName = getShimMdName(mdName);
        var deps = shim[mdName];
        if (deps && !isArray(deps)) {
            if (isArray(deps.deps)) {
                deps = deps.deps;
            } else {
                deps = [];
            }
        }
        if (isArray(deps)) {
            var _deps = [];
            for (var i = 0; i < deps.length; i++) {
                if (reg_rq_plugin_css.test(deps[i])) {
                    _deps.push(deps[i]);
                }
            }
            deps = _deps;
        } else {
            deps = [];
        }
        return deps;
    }

    function getShimMdName(mdName) {
        if (isArray(requireConf.packages)) {
            for (var i = 0; i < requireConf.packages.length; i++) {
                var pkg = requireConf.packages[i];
                if (pkg && pkg.name == mdName) {
                    mdName = joinPath(mdName, pkg.main);
                    break;
                }
            }
        }
        return mdName;
    }

    function joinPath() {
        var paths = Array.prototype.slice.call(arguments);
        var path, _paths = [];
        for (var i=0; i<paths.length; i++) {
            path = paths[i];
            if (path != null) {
                path += '';
                if (reg_slash_start.test(path)) {
                    path = path.replace(reg_slash_start, "");
                }
                if (reg_slash_end.test(path)) {
                    path = path.replace(reg_slash_end, "");
                }
                path = path.replace(reg_slash_back, "");
                _paths.push(path);
            }
        }
        return _paths.join("/");
    }

    function getModuleVersion(moduleName) {
        if (moduleName == null) return null;

        moduleName += '';

        var mdNames = moduleName.split('/'), mdName, v;

        do {
            mdName = getModuleNameByUrl(mdNames.join('/'));
            mdNames = mdNames.slice(0, -1);
            v = Versions[mdName];
        } while (
            mdNames.length && v == null
        )

        return v;
    }

    function getModuleNameByUrl(moduleUrl) {
        if (moduleUrl == null) return '';

        moduleUrl += '';

        var moduleName;

        if (reg_protocol_start.test(moduleUrl)) {
            // find from map
            for (var mapKey in requireConf.map) {
                if (requireConf.map[mapKey]) {
                    for (var key in requireConf.map[mapKey]) {
                        if (requireConf.map[mapKey][key] == moduleUrl) {
                            moduleName = key;
                            break;
                        }
                    }
                }
                if (moduleName != null) break;
            }
            if (moduleName != null) return moduleName;
            // find from shim
            var deps, shim, dep;
            for (var key in requireConf.shim) {
                shim = requireConf.shim[key];
                deps = isArray(shim) ? shim : (isArray(shim.deps) ? shim.deps : []);
                for (var i in deps) {
                    dep = deps[i] + '';
                    if (reg_rq_plugin.test(dep)) {
                        dep = dep.replace(reg_rq_plugin, "");
                    }
                    if (dep == moduleUrl) {
                        moduleName = key;
                        break;
                    }
                }
                if (moduleName != null) break;
            }
        } else {
            moduleName = moduleUrl;
        }

        return moduleName;
    }

    function isArray(o) {
        if (o == null) return false;
        if (typeof o !== "object") return false;
        return Object.prototype.toString.call(o).slice(8, -1) === "Array";
    }

    define('echarts2', ['echarts2/echarts'], function (main) {return main;});
    define('jquery', [], function() {return ($ && typeof $.noConflict === "function" ? ($ = $.noConflict()) : null)});
    define('yfjs', [], function() {return YFjs});

    // define ueditor home url
    if (requireConf.paths && requireConf.paths['ueditor'] != null) {
        root.UEDITOR_HOME_URL = requireConf.paths['ueditor'];
    } else if (isArray(requireConf.packages)) {
        for (var i=0; i<requireConf.packages.length; i++) {
            var pkg = requireConf.packages[i];
            if (pkg && pkg.name == "ueditor") {
                root.UEDITOR_HOME_URL = pkg.location;
                break;
            }
        }
    }
    if (root.UEDITOR_HOME_URL != null && !reg_slash_end.test(root.UEDITOR_HOME_URL)) {
        root.UEDITOR_HOME_URL += '/';
    }
    
    // write compatible scripts
    var docWrites = '';
    if (YFjs.bCompatibleModernizr) {
        var scriptModernizrSrc = requireConf.paths['modernizr'] + '.js?v=' + Versions['modernizr'];
        if (_docReadyStateIndex < 2) {
            docWrites += YFjs.createScriptTag(scriptModernizrSrc);
        } else {
            var scriptModernizr = YFjs.createScriptElement(scriptModernizrSrc);
            if (scriptModernizr) {
                YFjs.appendChild(scriptModernizr);
            }
        }
    }
    if (YFjs.bCompatibleRespond && !YFjs.testMediaQuery('all')) {
        var scriptRespondSrc = requireConf.paths['respond'] + '.js?v=' + Versions['respond'];
        if (_docReadyStateIndex < 2) {
            docWrites += YFjs.createScriptTag(scriptRespondSrc);
        } else {
            var scriptRespond = YFjs.createScriptElement(scriptRespondSrc);
            if (scriptRespond) {
                YFjs.appendChild(scriptRespond);
            }
        }
    }
    if (YFjs.bCompatibleHtml5 && !YFjs.testHtml5Elements()) {
        var scriptHtml5shivSrc = requireConf.paths['html5shiv'] + '.js?v=' + Versions['html5shiv'];
        if (_docReadyStateIndex < 2) {
            docWrites += YFjs.createScriptTag(scriptHtml5shivSrc);
        } else {
            var scriptHtml5shiv = YFjs.createScriptElement(scriptHtml5shivSrc);
            if (scriptHtml5shiv) {
                YFjs.appendChild(scriptHtml5shiv);
            }
        }
    }
    if (YFjs.bCompatibleES5 && !YFjs.testSupportsES5()) {
        var scriptES5Src = requireConf.paths['es5-shim'] + '.js?v=' + Versions['es5-shim'];
        if (_docReadyStateIndex < 2) {
            docWrites += YFjs.createScriptTag(scriptES5Src);
        } else {
            var scriptES5 = YFjs.createScriptElement(scriptES5Src);
            if (scriptES5) {
                YFjs.appendChild(scriptES5);
            }
        }
    }
    if (YFjs.bCompatibleES6 && !YFjs.testSupportsES6()) {
        var scriptES6Src = requireConf.paths['es6-shim'] + '.js?v=' + Versions['es6-shim'];
        if (_docReadyStateIndex < 2) {
            docWrites += YFjs.createScriptTag(scriptES6Src);
        } else {
            var scriptES6 = YFjs.createScriptElement(scriptES6Src);
            if (scriptES6) {
                YFjs.appendChild(scriptES6);
            }
        }
    }
    var supportsJSON = YFjs.testJSON();
    if (YFjs.bCompatibleJSON && !supportsJSON) {
        var scriptJSONSrc = requireConf.paths['json'] + '.js?v=' + Versions['json'];
        if (_docReadyStateIndex < 2) {
            docWrites += YFjs.createScriptTag(scriptJSONSrc);
        } else {
            var scriptJSON = YFjs.createScriptElement(scriptJSONSrc);
            if (scriptJSON) {
                YFjs.appendChild(scriptJSON);
            }
        }
    } else if (supportsJSON) {
        define('json', function() {return root.JSON});
    }
}(this, jQuery);