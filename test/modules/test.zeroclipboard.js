describe("Test Module zeroclipboard", function() {

	var mod = "zeroclipboard";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var ZeroClipboard, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdZeroClipboard) {
				error = err;
				ZeroClipboard = mdZeroClipboard;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(ZeroClipboard);
		});

	});

	describe("from minified", function() {

		var ZeroClipboard, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdZeroClipboard) {
				error = err;
				ZeroClipboard = mdZeroClipboard;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(ZeroClipboard);
		});

	});

});