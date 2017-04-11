describe("Test Module echarts2/chart/k", function() {

	var mod = "echarts2/chart/k";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var K, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdK) {
				error = err;
				K = mdK;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(K);
		});

	});

	describe("from minified", function() {

		var K, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdK) {
				error = err;
				K = mdK;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(K);
		});

	});

});