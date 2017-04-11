describe("Test Module jq/webuploader", function() {

	var mod = "jq/webuploader";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	var _require = __YFjs.requirejs;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var WebUploader, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdWebUploader) {
				error = err;
				WebUploader = mdWebUploader;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(WebUploader);
		});

	});

	describe("from minified", function() {

		var WebUploader, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdWebUploader) {
				error = err;
				WebUploader = mdWebUploader;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(WebUploader);
		});

	});

});