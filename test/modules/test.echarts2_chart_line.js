describe("Test Module echarts2/chart/line", function() {

	var mod = "echarts2/chart/line";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var Line, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdLine) {
				error = err;
				Line = mdLine;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Line);
		});

	});

	describe("from minified", function() {

		var Line, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdLine) {
				error = err;
				Line = mdLine;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Line);
		});

	});

});