describe("Test Module echarts2/chart/venn", function() {

	var mod = "echarts2/chart/venn";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var Venn, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdVenn) {
				error = err;
				Venn = mdVenn;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Venn);
		});

	});

	describe("from minified", function() {

		var Venn, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdVenn) {
				error = err;
				Venn = mdVenn;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Venn);
		});

	});

});