describe("Test Module echarts2/chart/heatmap", function() {

	var mod = "echarts2/chart/heatmap";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var Heatmap, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdHeatmap) {
				error = err;
				Heatmap = mdHeatmap;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Heatmap);
		});

	});

	describe("from minified", function() {

		var Heatmap, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdHeatmap) {
				error = err;
				Heatmap = mdHeatmap;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Heatmap);
		});

	});

});