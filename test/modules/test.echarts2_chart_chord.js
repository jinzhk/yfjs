describe("Test Module echarts2/chart/chord", function() {

	var mod = "echarts2/chart/chord";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var Chord, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdChord) {
				error = err;
				Chord = mdChord;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Chord);
		});

	});

	describe("from minified", function() {

		var Chord, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdChord) {
				error = err;
				Chord = mdChord;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Chord);
		});

	});

});