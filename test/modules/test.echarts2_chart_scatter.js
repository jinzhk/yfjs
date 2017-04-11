describe("Test Module echarts2/chart/scatter", function() {

	var mod = "echarts2/chart/scatter";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var Scatter, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdScatter) {
				error = err;
				Scatter = mdScatter;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Scatter);
		});

	});

	describe("from minified", function() {

		var Scatter, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdScatter) {
				error = err;
				Scatter = mdScatter;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Scatter);
		});

	});

});