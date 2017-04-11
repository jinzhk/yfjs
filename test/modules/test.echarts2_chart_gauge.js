describe("Test Module echarts2/chart/gauge", function() {

	var mod = "echarts2/chart/gauge";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var Gauge, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdGauge) {
				error = err;
				Gauge = mdGauge;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Gauge);
		});

	});

	describe("from minified", function() {

		var Gauge, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdGauge) {
				error = err;
				Gauge = mdGauge;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Gauge);
		});

	});

});