(function(window, undefined) {

    var document = document || window.document || {};

	// init style
	try {
		var style = document.createElement("style");
		style.setAttribute('type', "text/css");
		var styleText = document.createTextNode(
			'pre {position: relative}' +
			'pre .btn-clipboard {' +
			    'position: absolute;' +
			    'top: 0;' +
			    'right: 0;' +
			    'z-index: 10;' +
			    'border-top: 0 none;' +
			    'border-right: 0 none;' +
			    'border-top-left-radius: 0;' +
			    'border-top-right-radius: 4px;' +
			    'border-bottom-right-radius: 0;' +
			'}'
		);
		style.appendChild(styleText);
		document.head.appendChild(style)
	} catch(e) {}
    
	require(['highlight', 'zeroclipboard', 'bs/tooltip'], function(hljs, ZeroClipboard) {
	    hljs.configure({theme: "github"});
	    $('pre > code').each(function() {
	        var $this = $(this);
			$('<button class="btn btn-clipboard" type="button">复制</button>').insertAfter($this);
	        $this.data('original-code', $this.html());
	        hljs.highlightBlock(this);
	    });
	    ZeroClipboard.config({
	        zIndex: 1020
	    });
	    $('.btn-clipboard').each(function() {
	        var $this = $(this), clipboard = new ZeroClipboard(this);
	        clipboard.on("ready", function(readyEvent) {
                $this.addClass('actived');
	            clipboard.on("copy", function (event) {
	                var $tar = $(event.target),
	                    $code = $tar.siblings("code:first");
	                var code = $code.data('original-code') + "";
	                code = code.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&#123;/g, "{").replace(/&#125;/g, "}");
	                clipboard.setText(code);
	            });
	            clipboard.on("aftercopy", function(event) {
	                var $tar = $(event.target);
	                $tar.one("hidden.bs.tooltip", function() {
	                    $tar
	                        .attr('title', "已复制!").tooltip("fixTitle")
	                        .tooltip("show")
	                        .attr('title', "点击复制").tooltip("fixTitle");
	                }).tooltip("hide");
	            });
	        });
            clipboard.on("error", function(error) {
                $this.remove();
                console.log(error);
            });
	        $this.on("mouseover", function(event) {
	            var $this = $(event.currentTarget);
	            $this.addClass("hover");
	            $this.data({
	                'container': "body",
	                'placement': "top"
	            }).attr('title', "点击复制").tooltip("show");
	        });
	        $this.on("mouseout", function(event) {
	            var $this = $(event.currentTarget);
	            $this.removeClass("hover").blur();
	            $this.tooltip("destroy");
	        });
	    });
	});

	var parent = window.parent;

	if (parent && parent !== window) {
		$(parent).on('resize', function() {
			resizeIframesH(this);
		});
		resizeIframesH(parent);
	}

	window.resizeIframesH = resizeIframesH;

	function resizeIframesH(win) {
		win = win || parent;
		if (win && win.document) {
			var iframes = win.document.getElementsByTagName("iframe") || [];
			$.each(iframes, function(i, iframe) {
				if (iframe.contentWindow === window) {
					var $iframe = $(iframe),
						innerH = $(document.body).innerHeight();
					$iframe.height(innerH);
					var $parent = $iframe.parent();
					if ($parent.hasClass("embed-responsive")) {
						$parent.css('padding-bottom', innerH + "px");
					}
					return false;
				}
			});
		}
	}

})(this);