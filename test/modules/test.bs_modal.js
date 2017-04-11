describe("Test Module bs/modal", function() {

	var mod = "bs/modal";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	var _require = __YFjs.requirejs;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var jq, Modal, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdModal) {
				error = err;
				jq = _require('jquery');
				Modal = mdModal;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(jq);
			should.exist(jq.fn.modal);
			should.exist(Modal);
		});

	});

	describe("from minified", function() {

		var jq, Modal, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdModal) {
				error = err;
				jq = _require('jquery');
				Modal = mdModal;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(jq);
			should.exist(jq.fn.modal);
			should.exist(Modal);
		});

	});

});