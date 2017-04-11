describe("Test Module echarts2/chart/force", function() {

	var mod = "echarts2/chart/force";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var Force, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdForce) {
				error = err;
				Force = mdForce;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Force);
		});

	});

	describe("from minified", function() {

		var Force, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdForce) {
				error = err;
				Force = mdForce;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Force);
		});

	});

});