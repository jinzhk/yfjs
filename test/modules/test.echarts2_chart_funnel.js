describe("Test Module echarts2/chart/funnel", function() {

	var mod = "echarts2/chart/funnel";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var Funnel, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdFunnel) {
				error = err;
				Funnel = mdFunnel;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Funnel);
		});

	});

	describe("from minified", function() {

		var Funnel, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdFunnel) {
				error = err;
				Funnel = mdFunnel;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Funnel);
		});

	});

});