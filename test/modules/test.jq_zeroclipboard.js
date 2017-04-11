describe("Test Module jq/zeroclipboard", function() {

	var mod = "jq/zeroclipboard";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	var _require = __YFjs.requirejs;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var jq, ZeroClipboard, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdZeroClipboard) {
				error = err;
				jq = _require('jquery');
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
			should.exist(jq.event.special.beforecopy);
			should.exist(jq.event.special.copy);
			should.exist(jq.event.special.aftercopy);
			should.exist(jq.event.special["copy-error"]);
		});

	});

	describe("from minified", function() {

		var jq, ZeroClipboard, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdZeroClipboard) {
				error = err;
				jq = _require('jquery');
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
			should.exist(jq.event.special.beforecopy);
			should.exist(jq.event.special.copy);
			should.exist(jq.event.special.aftercopy);
			should.exist(jq.event.special["copy-error"]);
		});

	});

});