describe("Test Module echarts2/chart/treemap", function() {

	var mod = "echarts2/chart/treemap";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var TreeMap, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdTreeMap) {
				error = err;
				TreeMap = mdTreeMap;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(TreeMap);
		});

	});

	describe("from minified", function() {

		var TreeMap, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdTreeMap) {
				error = err;
				TreeMap = mdTreeMap;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(TreeMap);
		});

	});

});