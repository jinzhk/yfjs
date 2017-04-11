describe("Test Module crypto", function() {

	var mod = "crypto";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var CryptoJS, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdCryptoJS) {
				error = err;
				CryptoJS = mdCryptoJS;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(CryptoJS);
		});

	});

	describe("from minified", function() {

		var CryptoJS, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdCryptoJS) {
				error = err;
				CryptoJS = mdCryptoJS;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(CryptoJS);
		});

	});

});