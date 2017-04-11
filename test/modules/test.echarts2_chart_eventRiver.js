describe("Test Module echarts2/chart/eventRiver", function() {

	var mod = "echarts2/chart/eventRiver";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var EventRiver, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdEventRiver) {
				error = err;
				EventRiver = mdEventRiver;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(EventRiver);
		});

	});

	describe("from minified", function() {

		var EventRiver, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdEventRiver) {
				error = err;
				EventRiver = mdEventRiver;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(EventRiver);
		});

	});

});