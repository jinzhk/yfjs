describe("Test Module ueditor", function() {

	var mod = "ueditor";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var UEditor, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdUEditor) {
				error = err;
				UEditor = mdUEditor;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(UEditor);
		});

	});

	describe("from minified", function() {

		var UEditor, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdUEditor) {
				error = err;
				UEditor = mdUEditor;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(UEditor);
		});

	});

});