(function(window, undefined) {

    var document = document || window.document || {};
    
    // init YFjs browser content
    var $exampleBrowser = $('#example-box-yfjs-browser');
    if ($exampleBrowser.length && YFjs && YFjs.browser) {
        var exampleBrowser = [];
        for (var key in YFjs.browser) {
            exampleBrowser.push('    ' + key + ': ' + YFjs.browser[key]);
        }
        exampleBrowser = '{\n' + exampleBrowser.join(',\n') + '\n}';
        $('pre code', $exampleBrowser).html('YFjs.browser = ' + exampleBrowser);
    }

    var $win = $(window),
        $doc = $(document),
        $docEl = $('body, html'),
        $body = $('body'),
        $header = $('body > .navbar:first'),
        $headerNext = $header.next(),
        $sideNav = $('.page-toc:first'),
        $content = $('.content:first'),
        $container = $content.parents('.container:first');

    var anchorSelector = 'a[href^="#t"]',
        anchorLastSelector = 'a[href^="#t"]:last';

    if ($sideNav.length) {
        $sideNav.css('overflow', "auto");
        // set aside offsetTop
        var offsetHead = $headerNext.offset(),
            topHead = offsetHead ? offsetHead.top : 0;
        var offsetSide = $sideNav.offset(), topSide;
        topSide = offsetSide ? offsetSide.top : 0;
        topSide -= topHead;
        topSide -= 20;
        $sideNav.data('offsetTop', topSide);
        // set anchor link offsetTop
        $(anchorSelector, $content).each(function () {
            var href = $(this).attr('href');
            if (/^#t/.test(href)) {
                var offsetTop = calculateOffsetTop.call(this, $content);
                $('a[href="' + href + '"]', $sideNav).data('offsetTop', offsetTop);
            }
        });
        // affix side nav
        affixSideNav();
        // collapse side nav
        collapseSideNav();
        // listen scroll
        var collapseSideTimeout, collapseSideTime = 30;
        $win.scroll(function () {
            affixSideNav();
            // debounce 防抖处理
            if (collapseSideTimeout) {
                clearTimeout(collapseSideTimeout);
            }
            collapseSideTimeout = setTimeout(collapseSideNav, collapseSideTime);
        });
        $win.off('resize.sideNav').on('resize.sideNav', function() {
            checkSideNavScrollBar();
        });
    }

    $(document).on('click', anchorSelector, function (e) {
        e.preventDefault();
        var offsetTop = calculateOffsetTop.call(this, $content);
        if (offsetTop != null) {
            $(this).blur();
            $docEl.animate({scrollTop: offsetTop}, 200);
        }
        return false;
    });

    $(document).on('click', '.link-back-top', function() {
        $docEl.animate({scrollTop: 0}, 200);
        $(this).blur();
    });

    // scroll content by hash
    setTimeout(function() {
        try {
            var anchorEl = document.createElement("a");
            anchorEl.setAttribute('href', window.location.href);
            var anchorOffsetTop = calculateOffsetTop.call(anchorEl, $content);
            if (anchorOffsetTop != null) {
                if (window.location.hash != "") {
                    window.location.hash = "";
                }
                $doc.scrollTop(anchorOffsetTop);
            }
        } catch (e) {}
    }, 1000/60)

    function calculateOffsetTop($wrapper) {
        if (this != null) {
            var $this = $(this),
                anchor = $this.attr('href');
            anchor = anchor == null ? '' : anchor;
            var posHash = anchor.lastIndexOf('#');
            if (posHash > -1) {
                anchor = anchor.substring(posHash + 1);
            }
            if (anchor.length) {
                var $anchor;
                try {
                    $anchor = $("#" + anchor, $wrapper);
                } catch (e) {
                    $anchor = null;
                }
                if (!$anchor || !$anchor.length) {
                    try {
                        $anchor = document.getElementById(anchor);
                        if ($anchor != null) {
                            $anchor = $($anchor);
                        }
                    } catch (e) {
                        $anchor = null;
                    }
                }
                if ($anchor && $anchor.length) {
                    var top;
                    if ((top = $anchor.data('offsetTop')) == null) {
                        var offsetHead = $headerNext.offset(),
                            topHead = offsetHead ? offsetHead.top : 0;
                        var offset = $anchor.offset();
                        top = offset ? offset.top : 0;
                        top -= topHead;
                        top -= 5;
                        top = parseInt(top);
                        $anchor.data('offsetTop', top);
                    }
                    return top;
                }
            }
        }
    }

    function affixSideNav() {
        var offsetHead = $headerNext.offset(),
            topHead = offsetHead ? offsetHead.top : 0,
            topSide = $sideNav.data('offsetTop') || topHead;
        var scrollTop = $doc.scrollTop();
        if (scrollTop > topSide) {
            if ($sideNav.data('offsetTop') == null) {
                $sideNav.data('offsetTop', topSide);
            }
            var bodyW = $body.innerWidth(),
                contentW = $container.innerWidth(),
                offsetRight = (bodyW - contentW) / 2;
            $sideNav.addClass('affix').css('right', offsetRight);
        } else {
            $sideNav.removeClass('affix').css('right', 0);
        }
        checkSideNavScrollBar();
    }

    function collapseSideNav() {
        var $lastAnchor,
            scrollTopMax = $header.outerHeight() + $container.outerHeight() - $win.height();
        var scrollTop = $doc.scrollTop();
        if (scrollTop >= scrollTopMax) {
            $lastAnchor = $(anchorLastSelector, $sideNav);
        } else {
            $(anchorSelector, $sideNav).each(function () {
                var $this = $(this),
                    offsetTop = $this.data('offsetTop');
                if (offsetTop > scrollTop) {
                    return false;
                }
                $lastAnchor = $this;
            });
        }
        if ($lastAnchor != null && $lastAnchor.length) {
            $('li', $sideNav).removeClass('active');
            $lastAnchor.parents('li:first').addClass('active');
            var $nav = $lastAnchor.parents('ul:first');
            while ($nav.length && $nav.parent().get(0) !== $sideNav.get(0)) {
                $nav = $nav.parents('li:first').addClass('active').parents('ul:first');
            }
            // 自动移动滚动条位置
            var sideNavH = $sideNav.innerHeight(),
                sideNavContentH = 0;
            $sideNav.children().each(function() {
                sideNavContentH += $(this).outerHeight();
            });
            var hasScrollbar = sideNavContentH > sideNavH;
            if (hasScrollbar) {
                try {
                    var $sideNavFirst = $sideNav.children('ul:first'),
                        sideNavH = $sideNav.height(),
                        lastAnchorPos = $lastAnchor.offset().top - $sideNavFirst.offset().top,
                        lastAnchorH = $lastAnchor.outerHeight();
                    var sideNavScrollTop = $sideNav.scrollTop();
                    if (lastAnchorPos < sideNavScrollTop || (lastAnchorPos + lastAnchorH) > (sideNavScrollTop + sideNavH)) {
                        var scrollPos = lastAnchorPos - sideNavH;
                        if (scrollPos < 0) {
                            $sideNav.scrollTop(0);
                        } else {
                            $sideNav.scrollTop(scrollPos + lastAnchorH);
                        }
                    }
                } catch(e) {}
            }
        } else {
            $('li', $sideNav).removeClass('active');
        }
        $(anchorSelector, $sideNav).blur();
    }

    function checkSideNavScrollBar() {
        var winH = $win.height(),
            scrollTop = $doc.scrollTop();
        var offsetSide = $sideNav.offset(),
            topSide = offsetSide ? offsetSide.top : 0;
        topSide -= scrollTop;
        var asideH = winH - topSide;
        if (asideH < 0) asideH = 1;
        var asideInnerH = $sideNav.innerHeight();
        if (asideInnerH > asideH) {
            $sideNav.css({
                height: asideH + "px",
                paddingRight: "0px"
            });
        } else {
            $sideNav.css({
                height: asideH + "px",
                paddingRight: calculateScrollBarWidth() + "px"
            });
        }
    }

    var scrollbarWidth;
    function calculateScrollBarWidth() {
        var width;
        if (typeof scrollbarWidth === "undefined") {
            var sizer = $('<p/>').css({
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: 150,
                padding: 0,
                overflow: 'scroll',
                visibility: 'hidden'
            }).appendTo('body');

            width = sizer[0].offsetWidth - sizer[0].clientWidth;
            scrollbarWidth = width;

            sizer.remove();
        } else {
            width = scrollbarWidth;
        }
        return width;
    }

    require(['zeroclipboard', 'bs/tooltip'], function(ZeroClipboard) {

        // add copy btn
        $('pre code[class^="lang-"]', $content).each(function() {
            var $code = $(this);
            $('<button class="btn btn-clipboard" type="button">复制</button>').insertAfter($code);
            var $btnClipboard = $code.next();
            initClipboard($btnClipboard.get(0));
        });
    
        ZeroClipboard.config({
            zIndex: 1020
        });

        function initClipboard(el) {
            var $this = $(el), clipboard = new ZeroClipboard(el);
            clipboard.on("ready", function(readyEvent) {
                $this.addClass('actived');
                clipboard.on("copy", function (event) {
                    var $tar = $(event.target),
                        $code = $tar.siblings("code:first");
                    var code = $code.text();
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
        }
    });

})(this);