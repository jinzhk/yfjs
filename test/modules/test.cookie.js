describe("Test Module cookie", function() {

	var mod = "cookie";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	var _require = __YFjs.requirejs;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var Cookie, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdCookie) {
				error = err;
				Cookie = mdCookie;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Cookie);
		});

	});

	describe("from minified", function() {

		var Cookie, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdCookie) {
				error = err;
				Cookie = mdCookie;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Cookie);
		});

	});

});