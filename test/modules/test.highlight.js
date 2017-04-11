describe("Test Module highlight", function() {

	var mod = "highlight";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var Hljs, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdHljs) {
				error = err;
				Hljs = mdHljs;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Hljs);
		});

	});

	describe("from minified", function() {

		var Hljs, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdHljs) {
				error = err;
				Hljs = mdHljs;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Hljs);
		});

	});

});