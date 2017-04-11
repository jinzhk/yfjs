describe("Test Module yfjs/spa", function() {

	var mod = "yfjs/spa";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var SPA, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdSPA) {
				error = err;
				SPA = mdSPA;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(SPA);
		});

	});

	describe("from minified", function() {

		var SPA, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdSPA) {
				error = err;
				SPA = mdSPA;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(SPA);
		});

	});

});