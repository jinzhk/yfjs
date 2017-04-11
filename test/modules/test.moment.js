describe("Test Module moment", function() {

	var mod = "moment";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var Moment, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdMoment) {
				error = err;
				Moment = mdMoment;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Moment);
		});

	});

	describe("from minified", function() {

		var Moment, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdMoment) {
				error = err;
				Moment = mdMoment;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(Moment);
		});

	});

});