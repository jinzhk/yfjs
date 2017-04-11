describe("Test Module echarts2/chart/pie", function() {

	var mod = "echarts2/chart/pie";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var Pie, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdPie) {
				error = err;
				Pie = mdPie;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Pie);
		});

	});

	describe("from minified", function() {

		var Pie, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdPie) {
				error = err;
				Pie = mdPie;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Pie);
		});

	});

});