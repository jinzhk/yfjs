(function(window) {
	var document = document || window.document;

	var __YFjs = window.__YFjs;

	var testModules = [
		'bs/alert',
		'bs/button',
		'bs/carousel',
		'bs/clockpicker',
		'bs/collapse',
		'bs/daterangepicker',
		'bs/datetimepicker',
		'bs/modal',
		'bs/paging',
		'bs/popover',
		'bs/slider',
		'bs/spinbox',
		'bs/switcher',
		'bs/tab',
		'bs/tooltip',
		'bs/wizard',
		'codemirror',
		'crypto',
		'd3',
		'd3-v3',
		'echarts',
		'echarts2',
		'echarts2/chart/bar',
		'echarts2/chart/chord',
		'echarts2/chart/eventRiver',
		'echarts2/chart/force',
		'echarts2/chart/funnel',
		'echarts2/chart/gauge',
		'echarts2/chart/heatmap',
		'echarts2/chart/k',
		'echarts2/chart/line',
		'echarts2/chart/map',
		'echarts2/chart/pie',
		'echarts2/chart/radar',
		'echarts2/chart/scatter',
		'echarts2/chart/tree',
		'echarts2/chart/treemap',
		'echarts2/chart/venn',
		'echarts2/chart/wordCloud',
		'highlight',
		'jq/chosen',
		'jq/cookie',
		'jq/dataTables',
		'jq/dataTables-bs3',
		'jq/dragsort',
		'jq/form',
		'jq/form/validator',
		'jq/form/validator-bs3',
		'jq/form/wizard',
		'jq/mCustomScrollbar',
		'jq/migrate',
		'jq/nicescroll',
		'jq/qrcode',
		'jq/urlp',
		'jq/webuploader',
		'jq/zeroclipboard',
		'jq/ztree',
		'moment',
		'plupload',
		'plupload-bs3',
		'remarkable',
		'yfjs/spa',
		'zeroclipboard'
	];

	var testModulesHtml = '', testModule;
	for (var i=0; i<testModules.length; i++) {
		testModule = testModules[i];
		if (testModule != null) {
			testModule = __YFjs.normalizeModuleName(testModule);
			testModulesHtml += (
				'<script id="script-md-' + testModule + '-test" src="modules/test.' + testModule + '.js"></script>'
			);
		}
	}

	testModulesHtml && document.write(testModulesHtml);
})(this);
