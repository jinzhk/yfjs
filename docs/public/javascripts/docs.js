YFjs.ready(function() {
    require(['highlight', 'zeroclipboard', 'bs/tooltip'], function(hljs, ZeroClipboard) {
        hljs.configure({theme: "github"});
        $('pre > code').each(function() {
            var $this = $(this);
            $this.data('original-code', $this.html());
            hljs.highlightBlock(this);
        });
        initSideNav();
        ZeroClipboard.config({
            zIndex: 1020
        });
        $('.btn-clipboard').each(function() {
            var $this = $(this), clipboard = new ZeroClipboard(this);
            clipboard.on("ready", function(readyEvent) {
                clipboard.on("copy", function (event) {
                    var $tar = $(event.target),
                        $code = $tar.siblings("pre").children("code");
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
    function initSideNav() {
        var $win = $(window),
            $doc = $(document),
            $docEl = $('body, html'),
            $body = $('body'),
            $header = $('header'),
            $headerNext = $header.next(),
            $aside = $('aside'),
            $content = $('.content:first');
        if ($aside.length) {
            // set aside offsetTop
            var offsetHead = $headerNext.offset(),
                topHead = offsetHead ? offsetHead.top : 0;
            var offsetSide = $aside.offset(), topSide;
            topSide = offsetSide ? offsetSide.top : 0;
            topSide -= topHead;
            topSide -= 20;
            $aside.data('offsetTop', topSide);
            // set anchor link offsetTop
            $('.link-anchor', $content).each(function () {
                var offsetTop = calculateOffsetTop.call(this, $content);
                var href = $(this).attr('href');
                $('.link-anchor[href="' + href + '"]', $aside).data('offsetTop', offsetTop);
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
        $(document).on('click', ".link-anchor", function (e) {
            e.preventDefault();
            var offsetTop = calculateOffsetTop.call(this, $content);
            if (offsetTop != null) {
                $docEl.animate({scrollTop: offsetTop}, 200);
            }
            return false;
        });
        $(document).on('click', '.link-back-top', function() {
            $docEl.animate({scrollTop: 0}, 200);
            $(this).blur();
        });
        // scroll content by hash
        try {
            var anchorEl = document.createElement("a");
            anchorEl.setAttribute('href', window.location.href);
            var anchorOffsetTop = calculateOffsetTop.call(anchorEl, $content);
            if (anchorOffsetTop != null) {
                $doc.scrollTop(anchorOffsetTop);
            }
        } catch (e) {}
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
                topSide = $aside.data('offsetTop') || topHead;
            var scrollTop = $win.scrollTop();
            if (scrollTop > topSide) {
                if ($aside.data('offsetTop') == null) {
                    $aside.data('offsetTop', topSide);
                }
                $aside.addClass('affix');
            } else {
                $aside.removeClass('affix');
            }
            checkSideNavScrollBar();
        }
        function collapseSideNav() {
            var $lastAnchor,
                scrollTopMax = $body.innerHeight() - $win.height();
            var scrollTop = $win.scrollTop();
            if (scrollTop >= scrollTopMax) {
                $lastAnchor = $('.link-anchor:last', $aside);
            } else {
                $('.link-anchor', $aside).each(function () {
                    var $this = $(this),
                        offsetTop = $this.data('offsetTop');
                    if (offsetTop > scrollTop) {
                        return false;
                    }
                    $lastAnchor = $this;
                });
            }
            if ($lastAnchor != null && $lastAnchor.length) {
                $('li', $aside).removeClass('active');
                $lastAnchor.parents('li:first').addClass('active');
                var $nav = $lastAnchor.parents('ul:first');
                while ($nav.length && !$nav.is('.sidenav')) {
                    $nav = $nav.parents('li:first').addClass('active').parents('ul:first');
                }
            } else {
                $('li', $aside).removeClass('active');
            }
            $('.link-anchor', $aside).blur();
        }
        function checkSideNavScrollBar() {
            var winH = $win.height(),
                scrollTop = $win.scrollTop();
            var offsetSide = $aside.offset(),
                topSide = offsetSide ? offsetSide.top : 0;
            topSide -= scrollTop;
            var asideH = winH - topSide;
            if (asideH < 0) asideH = 1;
            var asideInnerH = $aside.innerHeight();
            if (asideInnerH > asideH) {
                $aside.css({
                    height: asideH + "px",
                    paddingRight: "0px"
                });
            } else {
                $aside.css({
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
    }
});