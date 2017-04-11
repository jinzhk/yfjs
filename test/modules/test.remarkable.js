describe("Test Module remarkable", function() {

	var mod = "remarkable";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var Remarkable, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdRemarkable) {
				error = err;
				Remarkable = mdRemarkable;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Remarkable);
		});

	});

	describe("from minified", function() {

		var Remarkable, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdRemarkable) {
				error = err;
				Remarkable = mdRemarkable;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Remarkable);
		});

	});

});