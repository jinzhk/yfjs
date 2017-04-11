describe("Test Module echarts2/chart/radar", function() {

	var mod = "echarts2/chart/radar";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var Radar, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdRadar) {
				error = err;
				Radar = mdRadar;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Radar);
		});

	});

	describe("from minified", function() {

		var Radar, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdRadar) {
				error = err;
				Radar = mdRadar;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Radar);
		});

	});

});