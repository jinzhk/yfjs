describe("Test Module echarts2", function() {

	var mod = "echarts2";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var Echarts2, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdEcharts2) {
				error = err;
				Echarts2 = mdEcharts2;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Echarts2);
		});

	});

	describe("from minified", function() {

		var Echarts2, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdEcharts2) {
				error = err;
				Echarts2 = mdEcharts2;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Echarts2);
		});

	});

});