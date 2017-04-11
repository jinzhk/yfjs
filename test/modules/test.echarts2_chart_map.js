describe("Test Module echarts2/chart/map", function() {

	var mod = "echarts2/chart/map";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var _Map, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, md_Map) {
				error = err;
				_Map = md_Map;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(_Map);
		});

	});

	describe("from minified", function() {

		var _Map, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, md_Map) {
				error = err;
				_Map = md_Map;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(_Map);
		});

	});

});