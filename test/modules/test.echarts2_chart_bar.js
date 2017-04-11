describe("Test Module echarts2/chart/bar", function() {

	var mod = "echarts2/chart/bar";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var Bar, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdBar) {
				error = err;
				Bar = mdBar;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Bar);
		});

	});

	describe("from minified", function() {

		var Bar, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdBar) {
				error = err;
				Bar = mdBar;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Bar);
		});

	});

});