describe("Test Module codemirror", function() {

	var mod = "codemirror";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var CodeMirror, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdCodeMirror) {
				error = err;
				CodeMirror = mdCodeMirror;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(CodeMirror);
		});

	});

	describe("from minified", function() {

		var CodeMirror, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdCodeMirror) {
				error = err;
				CodeMirror = mdCodeMirror;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(CodeMirror);
		});

	});

});