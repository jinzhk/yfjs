describe("Test Module plupload", function() {

	var mod = "plupload";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var Plupload, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdPlupload) {
				error = err;
				Plupload = mdPlupload;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Plupload);
		});

	});

	describe("from minified", function() {

		var Plupload, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdPlupload) {
				error = err;
				Plupload = mdPlupload;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Plupload);
		});

	});

});