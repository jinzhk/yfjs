describe("Test Module echarts2/chart/wordCloud", function() {

	var mod = "echarts2/chart/wordCloud";

	var injectModule = __YFjs.injectModule;
	var resetNodes = __YFjs.resetNodes;
	var resetModuleNode = __YFjs.resetModuleNode;

	after(function() {
		resetNodes();
	});

	describe("from original", function() {

		var WordCloud, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false, 'data-debug': true}, function(err, mdWordCloud) {
				error = err;
				WordCloud = mdWordCloud;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(WordCloud);
		});

	});

	describe("from minified", function() {

		var WordCloud, error;

		before(function(done) {
			injectModule(mod, {'data-basecss': false}, function(err, mdWordCloud) {
				error = err;
				WordCloud = mdWordCloud;
				done();
			});
		});
		
		after(function() {
			resetModuleNode(mod);
		});

		it("can be required", function() {
			should.not.exist(error);
			should.exist(WordCloud);
		});

	});

});