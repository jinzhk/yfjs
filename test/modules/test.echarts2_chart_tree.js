describe("Test Module echarts2/chart/tree", function() {

	var mod = "echarts2/chart/tree";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var Tree, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdTree) {
				error = err;
				Tree = mdTree;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Tree);
		});

	});

	describe("from minified", function() {

		var Tree, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdTree) {
				error = err;
				Tree = mdTree;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Tree);
		});

	});

});