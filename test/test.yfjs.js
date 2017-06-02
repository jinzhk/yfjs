describe("Test YFjs", function() {
	
	var buildConf = __YFjs.buildConf;
	var requireConf = __YFjs.requireConf;

	var versions = requireConf.versions;

	var injectYFjs = __YFjs.injectYFjs;

	var relativePath = __YFjs.relativePath;

	var resetNodes = __YFjs.resetNodes;
	var getLinkCssByUrl = __YFjs.getLinkCssByUrl;
	var getScriptByUrl = __YFjs.getScriptByUrl;

	after(function() {
		resetNodes();
	})

	describe("By defaults", function() {
		var window, document, evt, YFjs;

		before(function(done) {
			injectYFjs(function(event) {
				window = this;
				document = this ? this.document : undefined;
				evt = event;
				YFjs = this ? this.YFjs : undefined;
				done();
			});
		});

		after(function() {
			resetNodes();
		});

		it("YFjs declared", function(done) {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(YFjs);
			should.equal(YFjs.VERSION, buildConf.version);
			should(YFjs).have.property('browser');
			should(YFjs).have.property('bCache');
			should(YFjs).have.property('bDebug');
			should(YFjs).have.property('bDebugCss');
			should(YFjs).have.property('bDebugModule');
			should(YFjs).have.property('bBaseCss');
			should(YFjs).have.property('bCompatible');
			should(YFjs).have.property('bCompatibleModernizr');
			should(YFjs).have.property('bCompatibleRespond');
			should(YFjs).have.property('bCompatibleHtml5');
			should(YFjs).have.property('bCompatibleES5');
			should(YFjs).have.property('bCompatibleES6');
			should(YFjs).have.property('bCompatibleJSON');
			should(YFjs).have.property('baseUrl');
			should(YFjs).have.property('baseCss');
			should(YFjs).have.property('baseMd');
			should(YFjs).have.property('baseRq');
			should(YFjs).have.property('timestamp');
			should.equal(typeof YFjs.testMediaQuery, "function");
			should.equal(typeof YFjs.testHtml5Elements, "function");
			should.equal(typeof YFjs.testJSON, "function");
			should.equal(typeof YFjs.testSupportsES5, "function");
			should.equal(typeof YFjs.testSupportsES6, "function");
			should.equal(typeof YFjs.createScriptElement, "function");
			should.equal(typeof YFjs.ready, "function");
			YFjs.ready(function () {
				done();
			});
		});

		it("YFjs load minified resources by default", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(YFjs);
			should.exist(YFjs.baseMd);
			should.exist(YFjs.baseCss);
			YFjs.baseMd.should.be.a.String;
			YFjs.baseMd.should.endWith("/" + buildConf.minified);
			YFjs.baseCss.should.be.a.String;
			YFjs.baseCss.should.endWith("/" + buildConf.minified);
		});

		it("YFjs load base.css by default", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.exist(YFjs.baseCss);
			var baseCssSrc = YFjs.baseCss + "/styles/base.css?v=" + buildConf.version;
			var baseCssLink = getLinkCssByUrl.call(document, baseCssSrc);
			should.exist(baseCssLink);
		});

		it("YFjs load yfjs-core.js by default", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.exist(YFjs.baseMd);
			var yfjsCoreSrc = YFjs.baseMd + "/yfjs-core.js?v=" + buildConf.version;
			var yfjsCoreScript = getScriptByUrl.call(document, yfjsCoreSrc);
			should.exist(yfjsCoreScript);
		});

		it("YFjs load RequireJS by default", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(window.requirejs);
		});

		it("YFjs load RequireJS Plugin - domReady by default", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(window.requirejs);
			should.exist(window.requirejs.s.contexts._.registry['rq/domReady']);
		});

		it("YFjs load jQuery by default", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(window.jQuery);
		});

		it("YFjs load jQuery Plugin - $.fn.serializeObject by default", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(window.jQuery);
			should.exist(window.jQuery.fn.serializeObject);
		});

		it("YFjs load jQuery Plugin - $.parseQuery by default", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(window.jQuery);
			should.exist(window.jQuery.parseQuery);
		});

		it("YFjs load jQuery Plugin - $.fn.mousewheel & $.fn.unmousewheel by default", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(window.jQuery);
			should.exist(window.jQuery.fn.mousewheel);
			should.exist(window.jQuery.fn.unmousewheel);
		});

		it("YFjs load jQuery Plugin - $.support.transition by default", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(window.jQuery);
			should.exist(window.jQuery.fn.emulateTransitionEnd);
		});

		it("YFjs load jQuery Plugin - $.fn.scrollspy by default", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(window.jQuery);
			should.exist(window.jQuery.fn.scrollspy);
		});

		it("YFjs load jQuery Plugin - $.fn.affix by default", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(window.jQuery);
			should.exist(window.jQuery.fn.affix);
		});

		it("YFjs load jQuery Plugin - $.fn.loader by default", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(window.jQuery);
			should.exist(window.jQuery.fn.loader);
		});

		it("YFjs load jQuery Plugin - $.fn.dropdown by default", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(window.jQuery);
			should.exist(window.jQuery.fn.dropdown);
		});

		it("YFjs load jQuery Plugin - $.fn.metisMenu by default", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(window.jQuery);
			should.exist(window.jQuery.fn.metisMenu);
		});

		it("YFjs load jQuery Plugin - $.fn.iCheck by default", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(window.jQuery);
			should.exist(window.jQuery.fn.iCheck);
		});

	});
	
	describe("Set 'data-cache'", function() {
		var window, document, evt, YFjs;

		before(function(done) {
			injectYFjs({'data-cache': false}, function(event) {
				window = this;
				document = this ? this.document : undefined;
				evt = event;
				YFjs = this ? this.YFjs : undefined;
				done();
			});
		});

		after(function() {
			resetNodes();
		});

		it("YFjs attr 'data-cache' can be setted to 'false'", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.equal(YFjs.bCache, false);
		});

	});

	describe("Set 'data-debug'", function() {
		var window, document, evt, YFjs;

		before(function(done) {
			injectYFjs({'data-debug': true}, function(event) {
				window = this;
				document = this ? this.document : undefined;
				evt = event;
				YFjs = this ? this.YFjs : undefined;
				done();
			});
		});

		after(function() {
			resetNodes();
		});

		it("YFjs attr 'data-debug' can be setted to 'true'", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.equal(YFjs.bDebug, true);
			should.equal(YFjs.bDebugCss, true);
			should.equal(YFjs.bDebugModule, true);
		});

		it("YFjs would load original resources when 'data-debug' setted to 'true'", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(YFjs);
			should.exist(YFjs.baseMd);
			YFjs.baseMd.should.be.a.String;
			YFjs.baseMd.should.endWith("/" + buildConf.original);
			YFjs.baseCss.should.be.a.String;
			YFjs.baseCss.should.endWith("/" + buildConf.original);
		});

	});

	describe("Set 'data-debug-css'", function() {
		var window, document, evt, YFjs;

		before(function(done) {
			injectYFjs({'data-debug-css': true}, function(event) {
				window = this;
				document = this ? this.document : undefined;
				evt = event;
				YFjs = this ? this.YFjs : undefined;
				done();
			});
		});

		after(function() {
			resetNodes();
		});

		it("YFjs attr 'data-debug-css' can be setted to 'true'", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.equal(YFjs.bDebugCss, true);
		});

		it("YFjs would load original base.css when 'data-debug-css' setted to 'true'", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(YFjs);
			should.exist(YFjs.baseMd);
			YFjs.baseMd.should.be.a.String;
			YFjs.baseMd.should.endWith("/" + buildConf.minified);
			YFjs.baseCss.should.be.a.String;
			YFjs.baseCss.should.endWith("/" + buildConf.original);
		});

	});

	describe("Set 'data-debug-module'", function() {
		var window, document, evt, YFjs;

		before(function(done) {
			injectYFjs({'data-debug-module': true}, function(event) {
				window = this;
				document = this ? this.document : undefined;
				evt = event;
				YFjs = this ? this.YFjs : undefined;
				done();
			});
		});

		after(function() {
			resetNodes();
		});

		it("YFjs attr 'data-debug-module' can be setted to 'true'", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.equal(YFjs.bDebugModule, true);
		});

		it("YFjs would load original modules scripts when 'data-debug-module' setted to 'true'", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(YFjs);
			should.exist(YFjs.baseMd);
			YFjs.baseMd.should.be.a.String;
			YFjs.baseMd.should.endWith("/" + buildConf.original);
			YFjs.baseCss.should.be.a.String;
			YFjs.baseCss.should.endWith("/" + buildConf.minified);
		});

	});

	describe("Set 'data-basecss'", function() {
		var window, document, evt, YFjs;

		before(function(done) {
			injectYFjs({'data-basecss': false}, function(event) {
				window = this;
				document = this ? this.document : undefined;
				evt = event;
				YFjs = this ? this.YFjs : undefined;
				done();
			});
		});

		after(function() {
			resetNodes();
		});

		it("YFjs attr 'data-basecss' can be setted to 'false'", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.equal(YFjs.bBaseCss, false);
		});

		it("YFjs would not load base.css when 'data-basecss' setted to 'false'", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.exist(YFjs.baseCss);
			var baseCssSrc = YFjs.baseCss + "/styles/base.css?v=" + buildConf.version;
			var baseCssLink = getLinkCssByUrl.call(document, baseCssSrc);
			should.not.exist(baseCssLink);
		});

	});

	describe("Set 'data-base'", function() {
		var window, document, evt, YFjs;

		// 应用访问基路径
		var context = "/context/";

		before(function(done) {
			injectYFjs({'data-base': context}, function(event) {
				window = this;
				document = this ? this.document : undefined;
				evt = event;
				YFjs = this ? this.YFjs : undefined;
				done();
			});
		});

		after(function() {
			resetNodes();
		});

		it("YFjs attr 'data-base' can be setted to '" + context + "'", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.exist(YFjs.baseUrl);
			YFjs.baseUrl.should.be.a.String;
			var baseContext = relativePath(YFjs.baseUrl);
			context = context.replace(/^\/+/, "").replace(/\/+$/, "");
			should.equal(baseContext, context);
		});

	});

	describe("Set 'data-base-require'", function() {
		var window, document, evt, YFjs;

		// 应用内自定义模块引入基路径
		var baseRq = "app";

		before(function(done) {
			injectYFjs({'data-base-require': baseRq}, function(event) {
				window = this;
				document = this ? this.document : undefined;
				evt = event;
				YFjs = this ? this.YFjs : undefined;
				done();
			});
		});

		after(function() {
			resetNodes();
		});

		it("YFjs attr 'data-base-require' can be setted to '" + baseRq + "'", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.exist(YFjs.baseRq);
			YFjs.baseRq.should.be.a.String;
			YFjs.baseRq.should.endWith("/" + baseRq);
		});

	});
	
	describe("Set 'data-compatible'", function() {
		var window, document, evt, YFjs;

		before(function(done) {
			injectYFjs({'data-compatible': true, 'data-debug': true}, function(event) {
				window = this;
				document = this ? this.document : undefined;
				evt = event;
				YFjs = this ? this.YFjs : undefined;
				if (YFjs && YFjs.ready) {
					YFjs.ready(function() {
						done();
					});
				} else {
					done();
				}
			});
		});

		after(function() {
			resetNodes();
		});

		it("YFjs attr 'data-compatible' can be setted to 'true'", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.equal(YFjs.bCompatible, true);
			should.equal(YFjs.bCompatibleModernizr, true);
			should.equal(YFjs.bCompatibleRespond, true);
			should.equal(YFjs.bCompatibleHtml5, true);
			should.equal(YFjs.bCompatibleES5, true);
			should.equal(YFjs.bCompatibleES6, true);
			should.equal(YFjs.bCompatibleJSON, true);
		});

		it("YFjs would load Modernizr script when 'data-compatible' setted to 'true'", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.exist(YFjs.baseMd);
			var scriptModernizrSrc = YFjs.baseMd + "/modules/" + requireConf.paths['modernizr'] + ".js?v=" + versions['modernizr'];
			var scriptModernizr = getScriptByUrl.call(document, scriptModernizrSrc);
			should.exist(scriptModernizr);
		});

		it("YFjs would test and load respond script when 'data-compatible' setted to 'true'", function () {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.exist(YFjs.baseMd);
			should.equal(typeof YFjs.testMediaQuery, "function");
			if (!YFjs.testMediaQuery('all')) {
				var scriptRespondSrc = YFjs.baseMd + "/modules/" + requireConf.paths['respond'] + ".js?v=" + versions['respond'];
				var scriptRespond = getScriptByUrl.call(document, scriptRespondSrc);
				should.exist(scriptRespond);
		    }
		});

		it("YFjs would test and load html5shiv script when 'data-compatible' setted to 'true'", function () {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.exist(YFjs.baseMd);
			should.equal(typeof YFjs.testHtml5Elements, "function");
			if (!YFjs.testHtml5Elements()) {
				var scriptHtml5ShivSrc = YFjs.baseMd + "/modules/" + requireConf.paths['html5shiv'] + ".js?v=" + versions['html5shiv'];
				var scriptHtml5Shiv = getScriptByUrl.call(document, scriptHtml5ShivSrc);
				should.exist(scriptHtml5Shiv);
			}
		});

		it("YFjs would test and load es5-shim script when 'data-compatible' setted to 'true'", function () {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.exist(YFjs.baseMd);
			should.equal(typeof YFjs.testSupportsES5, "function");
			if (!YFjs.testSupportsES5()) {
				var scriptES5ShimSrc = YFjs.baseMd + "/modules/" + requireConf.paths['es5-shim'] + ".js?v=" + versions['es5-shim'];
				var scriptES5Shim = getScriptByUrl.call(document, scriptES5ShimSrc);
				should.exist(scriptES5Shim);
			}
		});

		it("YFjs would test and load es6-shim script when 'data-compatible' setted to 'true'", function () {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.exist(YFjs.baseMd);
			should.equal(typeof YFjs.testSupportsES6, "function");
			if (!YFjs.testSupportsES6()) {
				var scriptES6ShimSrc = YFjs.baseMd + "/modules/" + requireConf.paths['es6-shim'] + ".js?v=" + versions['es6-shim'];
				var scriptES6Shim = getScriptByUrl.call(document, scriptES6ShimSrc);
				should.exist(scriptES6Shim);
			}
		});

		it("YFjs would test and load json script when 'data-compatible' setted to 'true'", function () {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.exist(YFjs.baseMd);
			should.equal(typeof YFjs.testJSON, "function");
			var supportsJSON = YFjs.testJSON();
			if (!supportsJSON) {
				var scriptJSONSrc = YFjs.baseMd + "/modules/" + requireConf.paths['json'] + ".js?v=" + versions['json'];
				var scriptJSON = getScriptByUrl.call(document, scriptJSONSrc);
				should.exist(scriptJSON);
			}
		});

	});
	
	describe("Set 'data-compatible-modernizr'", function() {
		var window, document, evt, YFjs;

		before(function(done) {
			injectYFjs({'data-compatible-modernizr': true, 'data-debug': true}, function(event) {
				window = this;
				document = this ? this.document : undefined;
				evt = event;
				YFjs = this ? this.YFjs : undefined;
				if (YFjs && YFjs.ready) {
					YFjs.ready(function() {
						done();
					});
				} else {
					done();
				}
			});
		});

		after(function() {
			resetNodes();
		});

		it("YFjs attr 'data-compatible-modernizr' can be setted to 'true'", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.equal(YFjs.bCompatible, undefined);
			should.equal(YFjs.bCompatibleModernizr, true);
			should.equal(YFjs.bCompatibleRespond, undefined);
			should.equal(YFjs.bCompatibleHtml5, undefined);
			should.equal(YFjs.bCompatibleES5, undefined);
			should.equal(YFjs.bCompatibleES6, undefined);
			should.equal(YFjs.bCompatibleJSON, undefined);
		});

		it("YFjs would load Modernizr script when 'data-compatible-modernizr' setted to 'true'", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.exist(YFjs.baseMd);
			var scriptModernizrSrc = YFjs.baseMd + "/modules/" + requireConf.paths['modernizr'] + ".js?v=" + versions['modernizr'];
			var scriptModernizr = getScriptByUrl.call(document, scriptModernizrSrc);
			should.exist(scriptModernizr);
		});

	});

	describe("Set 'data-compatible-respond'", function() {
		var window, document, evt, YFjs;

		before(function(done) {
			injectYFjs({'data-compatible-respond': true, 'data-debug': true}, function(event) {
				window = this;
				document = this ? this.document : undefined;
				evt = event;
				YFjs = this ? this.YFjs : undefined;
				if (YFjs && YFjs.ready) {
					YFjs.ready(function() {
						done();
					});
				} else {
					done();
				}
			});
		});

		after(function() {
			resetNodes();
		});

		it("YFjs attr 'data-compatible-respond' can be setted to 'true'", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.equal(YFjs.bCompatible, undefined);
			should.equal(YFjs.bCompatibleModernizr, undefined);
			should.equal(YFjs.bCompatibleRespond, true);
			should.equal(YFjs.bCompatibleHtml5, undefined);
			should.equal(YFjs.bCompatibleES5, undefined);
			should.equal(YFjs.bCompatibleES6, undefined);
			should.equal(YFjs.bCompatibleJSON, undefined);
		});

		it("YFjs would test and load respond script when 'data-compatible-respond' setted to 'true'", function () {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.exist(YFjs.baseMd);
			should.equal(typeof YFjs.testMediaQuery, "function");
			if (!YFjs.testMediaQuery('all')) {
				var scriptRespondSrc = YFjs.baseMd + "/modules/" + requireConf.paths['respond'] + ".js?v=" + versions['respond'];
				var scriptRespond = getScriptByUrl.call(document, scriptRespondSrc);
				should.exist(scriptRespond);
		    }
		});

	});

	describe("Set 'data-compatible-html5'", function() {
		var window, document, evt, YFjs;

		before(function(done) {
			injectYFjs({'data-compatible-html5': true, 'data-debug': true}, function(event) {
				window = this;
				document = this ? this.document : undefined;
				evt = event;
				YFjs = this ? this.YFjs : undefined;
				if (YFjs && YFjs.ready) {
					YFjs.ready(function() {
						done();
					});
				} else {
					done();
				}
			});
		});

		after(function() {
			resetNodes();
		});

		it("YFjs attr 'data-compatible-html5' can be setted to 'true'", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.equal(YFjs.bCompatible, undefined);
			should.equal(YFjs.bCompatibleModernizr, undefined);
			should.equal(YFjs.bCompatibleRespond, undefined);
			should.equal(YFjs.bCompatibleHtml5, true);
			should.equal(YFjs.bCompatibleES5, undefined);
			should.equal(YFjs.bCompatibleES6, undefined);
			should.equal(YFjs.bCompatibleJSON, undefined);
		});

		it("YFjs would test and load html5shiv script when 'data-compatible-html5' setted to 'true'", function () {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.exist(YFjs.baseMd);
			should.equal(typeof YFjs.testHtml5Elements, "function");
			if (!YFjs.testHtml5Elements()) {
				var scriptHtml5ShivSrc = YFjs.baseMd + "/modules/" + requireConf.paths['html5shiv'] + ".js?v=" + versions['html5shiv'];
				var scriptHtml5Shiv = getScriptByUrl.call(document, scriptHtml5ShivSrc);
				should.exist(scriptHtml5Shiv);
			}
		});

	});
	
	describe("Set 'data-compatible-es5'", function() {
		var window, document, evt, YFjs;

		before(function(done) {
			injectYFjs({'data-compatible-es5': true, 'data-debug': true}, function(event) {
				window = this;
				document = this ? this.document : undefined;
				evt = event;
				YFjs = this ? this.YFjs : undefined;
				if (YFjs && YFjs.ready) {
					YFjs.ready(function() {
						done();
					});
				} else {
					done();
				}
			});
		});

		after(function() {
			resetNodes();
		});

		it("YFjs attr 'data-compatible-es5' can be setted to 'true'", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.equal(YFjs.bCompatible, undefined);
			should.equal(YFjs.bCompatibleModernizr, undefined);
			should.equal(YFjs.bCompatibleRespond, undefined);
			should.equal(YFjs.bCompatibleHtml5, undefined);
			should.equal(YFjs.bCompatibleES5, true);
			should.equal(YFjs.bCompatibleES6, undefined);
			should.equal(YFjs.bCompatibleJSON, undefined);
		});

		it("YFjs would test and load es5-shim script when 'data-compatible-es5' setted to 'true'", function () {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.exist(YFjs.baseMd);
			should.equal(typeof YFjs.testSupportsES5, "function");
			if (!YFjs.testSupportsES5()) {
				var scriptES5ShimSrc = YFjs.baseMd + "/modules/" + requireConf.paths['es5-shim'] + ".js?v=" + versions['es5-shim'];
				var scriptES5Shim = getScriptByUrl.call(document, scriptES5ShimSrc);
				should.exist(scriptES5Shim);
			}
		});

	});

	describe("Set 'data-compatible-es6'", function() {
		var window, document, evt, YFjs;

		before(function(done) {
			injectYFjs({'data-compatible-es6': true, 'data-debug': true}, function(event) {
				window = this;
				document = this ? this.document : undefined;
				evt = event;
				YFjs = this ? this.YFjs : undefined;
				if (YFjs && YFjs.ready) {
					YFjs.ready(function() {
						done();
					});
				} else {
					done();
				}
			});
		});

		after(function() {
			resetNodes();
		});

		it("YFjs attr 'data-compatible-es6' can be setted to 'true'", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.equal(YFjs.bCompatible, undefined);
			should.equal(YFjs.bCompatibleModernizr, undefined);
			should.equal(YFjs.bCompatibleRespond, undefined);
			should.equal(YFjs.bCompatibleHtml5, undefined);
			should.equal(YFjs.bCompatibleES5, undefined);
			should.equal(YFjs.bCompatibleES6, true);
			should.equal(YFjs.bCompatibleJSON, undefined);
		});

		it("YFjs would test and load es6-shim script when 'data-compatible-es6' setted to 'true'", function () {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.exist(YFjs.baseMd);
			should.equal(typeof YFjs.testSupportsES6, "function");
			if (!YFjs.testSupportsES6()) {
				var scriptES6ShimSrc = YFjs.baseMd + "/modules/" + requireConf.paths['es6-shim'] + ".js?v=" + versions['es6-shim'];
				var scriptES6Shim = getScriptByUrl.call(document, scriptES6ShimSrc);
				should.exist(scriptES6Shim);
			}
		});

	});
	
	describe("Set 'data-compatible-json'", function() {
		var window, document, evt, YFjs;

		before(function(done) {
			injectYFjs({'data-compatible-json': true, 'data-debug': true}, function(event) {
				window = this;
				document = this ? this.document : undefined;
				evt = event;
				YFjs = this ? this.YFjs : undefined;
				if (YFjs && YFjs.ready) {
					YFjs.ready(function() {
						done();
					});
				} else {
					done();
				}
			});
		});

		after(function() {
			resetNodes();
		});

		it("YFjs attr 'data-compatible-json' can be setted to 'true'", function() {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.equal(YFjs.bCompatible, undefined);
			should.equal(YFjs.bCompatibleModernizr, undefined);
			should.equal(YFjs.bCompatibleRespond, undefined);
			should.equal(YFjs.bCompatibleHtml5, undefined);
			should.equal(YFjs.bCompatibleES5, undefined);
			should.equal(YFjs.bCompatibleES6, undefined);
			should.equal(YFjs.bCompatibleJSON, true);
		});

		it("YFjs would test and load json script when 'data-compatible-json' setted to 'true'", function () {
			should.exist(evt);
			should.not.exist(evt.error);
			should.exist(window);
			should.exist(document);
			should.exist(YFjs);
			should.exist(YFjs.baseMd);
			should.equal(typeof YFjs.testJSON, "function");
			var supportsJSON = YFjs.testJSON();
			if (!supportsJSON) {
				var scriptJSONSrc = YFjs.baseMd + "/modules/" + requireConf.paths['json'] + ".js?v=" + versions['json'];
				var scriptJSON = getScriptByUrl.call(document, scriptJSONSrc);
				should.exist(scriptJSON);
			}
		});

	});
	
});
