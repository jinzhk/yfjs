describe("Test Module echarts", function() {

	var mod = "echarts";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var Echarts, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdEcharts) {
				error = err;
				Echarts = mdEcharts;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Echarts);
		});

	});

	describe("from minified", function() {

		var Echarts, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdEcharts) {
				error = err;
				Echarts = mdEcharts;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Echarts);
		});

	});

});