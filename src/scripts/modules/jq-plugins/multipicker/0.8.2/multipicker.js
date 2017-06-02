/**
 * 多选组件（左右互选形式）
 *
 * Created by jinzk on 2015/10/28.
 *
 * options = {
 *      //高度，默认为"auto"
 *      height,
 *      //最小高度，默认为300(px)
 *      minHeight,
 *      //最大高度，默认为400(px)
 *      maxHeight,
 *      //已选栏配置
 *      toColumn: {
 *          // 自定义标题
 *          title: "已选栏",
 *          // 自定义样式class
 *          cssClass: "col-sm-6",
 *          // 已选列表，每项可为string或object，object必须含有name字段属性
 *          items: [],
 *          // "加载更多"功能默认显示文本
 *          loadText: "加载更多",
 *          // "加载更多"功能加载中显示文本
 *          loadingText: "正在加载...",
 *          // "加载更多"功能加载失败现实文本
 *          loadErrorText: "加载失败！点击重新加载",
 *          // "加载更多"功能全部加载完毕显示文本
 *          loadEmpty: "没有更多项了",
 *          // "加载更多"功能，function。若返回 Deferred 或 Promise 对象，将自动处理相关状态并添加数据
 *          loadMore: null
 *      },
 *      //未选栏配置
 *      fromColumn: {
 *          // 自定义标题
 *          title: "可选栏",
 *          // 自定义样式class
 *          cssClass: "col-sm-6",
 *          // 已选列表，每项可为string或object，object必须含有name字段属性
 *          items: [],
 *          // "加载更多"功能默认显示文本
 *          loadText: "加载更多",
 *          // "加载更多"功能加载中显示文本
 *          loadingText: "正在加载...",
 *          // "加载更多"功能加载失败现实文本
 *          loadErrorText: "加载失败！点击重新加载",
 *          // "加载更多"功能全部加载完毕显示文本
 *          loadEmpty: "没有更多项了",
 *          // "加载更多"功能，function。若返回 Deferred 或 Promise 对象，将自动处理相关状态并添加数据
 *          loadMore: null
 *      },
 *      // 使用 getSelectedData 和 getUnSelectedData 方法获取数据时指定数据源的键值，仅在数据项是对象类型时有效
 *      dataSrc: "",
 *      // 创建完成后的回调函数
 *      oncreated: null,
 *      // 选择改变后的回调函数
 *      onchanged: null,
 *      // 选择后的回调函数
 *      onselected: null,
 *      // 取消选择后的回调函数
 *      ondeselected: null
 * }
 *
 * Examples:
 * -- 初始构建
 * $(example).multiPicker({
 *      toColumn: {
 *          items: [
 *              "item1"
 *          ]
 *      },
 *      fromColumn: {
 *          items: [
 *              "item0",
 *              {
 *                  name: "item2",
 *                  // 不显示图标
 *                  icon: false
 *              }
 *          ]
 *      }
 * });
 *
 * -- 设置高度
 * $(example).multiPicker('setHeight', height);
 *
 * -- 设置最小高度
 * $(example).multiPicker('setMinHeight', minHeight);
 *
 * -- 设置最大高度
 * $(example).multiPicker('setMaxHeight', maxHeight);
 *
 * ---- loadMore 相关功能----
 *
 * -- 调用 fromColumn 配置项对应的loadMore方法（若存在）
 * $(example).multiPicker('loadMoreFrom');
 *
 * -- 改变 fromColumn 下 loadMore 功能的状态为"加载中"（配置loadMore时有效）
 * $(example).multiPicker('loadingMoreFrom');
 *
 * -- 改变 fromColumn 下 loadMore 功能的状态为"加载完毕"，需传入当次加载项数目参数（配置loadMore时有效）
 * $(example).multiPicker('loadedMoreFrom');
 *
 * -- 改变 fromColumn 下 loadMore 功能的状态为"加载错误"（配置loadMore时有效）
 * $(example).multiPicker('errorMoreFrom');
 *
 * -- 改变 fromColumn 下 loadMore 功能的状态为"加载全部完成"（配置loadMore时有效）
 * $(example).multiPicker('doneMoreFrom');
 *
 * ----以上 loadMore 相关功能 toColumn下用法和 fromColumn用法类似，只不过需要将 "From" 改为 "To"----
 *
 * -- 添加已选区域项
 * $(example).multiPicker('addSelectedItems', [items]);
 *
 * -- 添加未选区域项
 * $(example).multiPicker('addUnSelectedItems', [items]);
 *
 * -- 重设已选区域项
 * $(example).multiPicker('setSelectedItems', [items]);
 *
 * -- 重设未选区域项
 * $(example).multiPicker('setUnSelectedItems', [items]);
 *
 * -- 判断是否已改变选择
 * var isChanged = $(example).multiPicker('isChanged');
 *
 * -- 获取已选数据
 * var data = $(example).multiPicker('getSelectedData');
 *
 * -- 获取未选数据
 * var data = $(example).multiPicker('getUnSelectedData');
 *
 * Updated by jinzhk on 2017/04/24
 * 1. 组件会自动判断并添加上层容器了，修复了某些情况下容器内容溢出的问题
 * 2. 添加了实例方法 getSelectedElements 和 getUnSelectedElements，用以获取选择列和未选择列的行元素
 * 3. 版本号由 0.8.1 更新为 0.8.2
 */
define(['jquery'], function($) {

    var isNumeric = function(o) {
        return typeof(o) === "number" || /^\d+(\.\d+)?$/.test(o);
    };

    var MultiPicker = function(element, options) {
        this.$element = $(element);

        options = options && typeof options === "object" ? options : {};

        this.options = $.extend({}, MultiPicker.DEFAULTS, options);
        this.options.toColumn = $.extend({}, MultiPicker.DEFAULTS.toColumn, options.toColumn);
        this.options.fromColumn = $.extend({}, MultiPicker.DEFAULTS.fromColumn, options.fromColumn);

        this.create();

        this.bindEvents();
        this.handleEvents();

        this.$wrapper.trigger($.Event("created.multipicker"));
    };

    MultiPicker.VERSION = "0.8.2";

    MultiPicker.DATA_KEY = "item.multipicker";
    MultiPicker.INST_KEY = "ui.multipicker";

    MultiPicker.TYPE_SELECTED = "selected";
    MultiPicker.TYPE_UNSELECTED = "unselected";

    MultiPicker.DEFAULTS = {
        height: "auto",
        minHeight: 300,
        maxHeight: 400,
        toColumn: {
            title: "已选栏",
            cssClass: "col-sm-6",
            items: [],
            empty: "未添加选项",
            loadText: "加载更多",
            loadingText: "正在加载...",
            loadErrorText: "加载失败！点击重新加载",
            loadEmpty: "没有更多项了",
            loadMore: null
        },
        fromColumn: {
            title: "可选栏",
            cssClass: "col-sm-6",
            items: [],
            empty: "没有可选项",
            loadText: "加载更多",
            loadingText: "正在加载...",
            loadErrorText: "加载失败！点击重新加载",
            loadEmpty: "没有更多项了",
            loadMore: null
        },
        dataSrc: null,
        oncreated: null,
        onchanged: null,
        onselected: null,
        ondeselected: null
    };

    MultiPicker.DEFAULTS.ITEM = {
        name: "",
        icon: true
    };

    MultiPicker.ITEM = function(item) {
        var self = this;
        if (typeof item === "string") {
            this.originalData = item;
            $.each(MultiPicker.DEFAULTS.ITEM, function(key, value) {
                if (key == "name") {
                    self[key] = item;
                } else {
                    self[key] = value;
                }
            });
        } else {
            this.originalData = item ? $.extend({}, item) : item;
            item = $.extend({}, MultiPicker.DEFAULTS.ITEM, item);
            $.each(item, function(key, value) {
                self[key] = value;
            });
        }
    };

    MultiPicker.prototype.bindEvents = function() {
        this.$wrapper.off('created.multipicker').on('created.multipicker', $.proxy(function(e) {
            if (typeof this.options.oncreated === "function") {
                this.options.oncreated.apply(this, arguments);
            }
        }, this));
        this.$wrapper.off('changed.multipicker').on('changed.multipicker', $.proxy(function(e) {
            if (typeof this.options.onchanged === "function") {
                e.data = $(e.relatedTarget).data(MultiPicker.DATA_KEY).originalData;
                this.options.onchanged.apply(this, arguments);
            }
        }, this));
        this.$wrapper.off('selected.multipicker').on('selected.multipicker', $.proxy(function(e) {
            if (typeof this.options.onselected === "function") {
                e.data = $(e.relatedTarget).data(MultiPicker.DATA_KEY).originalData;
                this.options.onselected.apply(this, arguments);
            }
        }, this));
        this.$wrapper.off('deselected.multipicker').on('deselected.multipicker', $.proxy(function(e) {
            if (typeof this.options.ondeselected === "function") {
                e.data = $(e.relatedTarget).data(MultiPicker.DATA_KEY).originalData;
                this.options.ondeselected.apply(this, arguments);
            }
        }, this));

        return this;
    };

    MultiPicker.prototype.create = function() {
        var self = this, options = this.options;

        var $toColumn = $(
            '<div class="multipicker-column-to">' +
                '<fieldset>' +
                    '<legend class="multipicker-column-title">'+options.toColumn.title+'</legend>' +
                    '<div class="multipicker-column-filter">'+
                        '<i class="multipicker-icon-search"></i>' +
                        '<input class="form-control" type="search" />' +
                    '</div>' +
                    '<ul class="multipicker-column-list"></ul>' +
                '</fieldset>' +
            '</div>'
        ), $fromColumn = $(
            '<div class="multipicker-column-from">' +
                '<fieldset>' +
                    '<legend class="multipicker-column-title">'+options.fromColumn.title+'</legend>' +
                    '<div class="multipicker-column-filter">'+
                        '<i class="multipicker-icon-search"></i>' +
                        '<input class="form-control" type="search" />' +
                    '</div>' +
                    '<ul class="multipicker-column-list"></ul>' +
                '</fieldset>' +
            '</div>'
        );

        // init to list
        $toColumn.addClass(options.toColumn.cssClass);
        var $toList = $(".multipicker-column-list", $toColumn),
            $toItems = this.createItems(options.toColumn.items, MultiPicker.TYPE_SELECTED);
        $toList.append($toItems);

        // init from list
        $fromColumn.addClass(options.fromColumn.cssClass);
        var $fromList = $(".multipicker-column-list", $fromColumn),
            $fromItems = this.createItems(options.fromColumn.items, MultiPicker.TYPE_UNSELECTED);
        $fromList.append($fromItems);

        if (this.$element.hasClass('row') || this.$element.hasClass('multipicker-wrapper')) {
            this.$wrapper = this.$element;
            if (!this.$element.hasClass('multipicker-wrapper')) {
                this.$wrapper.addClass("multipicker-wrapper");
            }
        } else {
            this.$element.append(
                '<div class="multipicker-wrapper"></div>'
            );
            this.$wrapper = $('.multipicker-wrapper:last', this.$element);
        }

        this.$wrapper.empty().append($fromColumn).append($toColumn);
        
        this.$toColumn = $(".multipicker-column-to", this.$wrapper);
        this.$toList = $(".multipicker-column-list", this.$toColumn);

        if (!this.$wrapper.hasClass("row") && this.$toColumn[0] && this.$toColumn[0].className && this.$toColumn[0].className.indexOf("col-") > -1) {
            this.$wrapper.addClass("row");
        }

        this.createMoreItem(MultiPicker.TYPE_SELECTED);

        this.$fromColumn = $(".multipicker-column-from", this.$wrapper);
        this.$fromList = $(".multipicker-column-list", this.$fromColumn);

        if (!this.$wrapper.hasClass("row") && this.$fromColumn[0] && this.$fromColumn[0].className && this.$fromColumn[0].className.indexOf("col-") > -1) {
            this.$wrapper.addClass("row");
        }

        this.createMoreItem(MultiPicker.TYPE_UNSELECTED);

        this.orgSelectedItems = this.getSelectedItems();

        if (options.height && options.height !== "auto") {
            this.setHeight();
        } else {
            this.setMinHeight();
            this.setMaxHeight();
        }

        this.checkEmpty();

        return this;
    };

    MultiPicker.prototype.createItem = function(item, type) {
        if (item && item.name) {
            var itemTile, icon, iconTile;
            if (type === MultiPicker.TYPE_SELECTED) {
                icon = "delete";
                iconTile = "移除";
                itemTile = "双击移除";
            } else {
                icon = "add";
                iconTile = "选择";
                itemTile = "双击选择";
            }
            return $(
                '<li class="multipicker-column-item">' +
                    (item.icon ? '<i class="multipicker-icon-' + icon + '" title="' + iconTile + '"></i>' : '') +
                    '<a title="' + itemTile + '">' + item.name + '</a>' +
                '</li>'
            ).data(MultiPicker.DATA_KEY, item);
        }
        return $([]);
    };

    MultiPicker.prototype.createItems = function(items, type) {
        items = items || [];
        var self = this, $items = $([]);
        $.each(items, function(i, item) {
            $items = $items.add(self.createItem(new MultiPicker.ITEM(item), type));
        });
        return $items;
    };

    MultiPicker.prototype.createMoreItem = function(type) {
        if (type === MultiPicker.TYPE_SELECTED && this.options.toColumn.loadMore) {
            if (this.$toList.children(".multipicker-column-more").length <= 0) {
                this.$toList.append('<li class="multipicker-column-more"><a href="javascript:;">' + this.options.toColumn.loadText + '</a></li>');
            }
        } else if(type === MultiPicker.TYPE_UNSELECTED && this.options.fromColumn.loadMore) {
            if (this.$fromList.children(".multipicker-column-more").length <= 0) {
                this.$fromList.append('<li class="multipicker-column-more"><a href="javascript:;">' + this.options.fromColumn.loadText + '</a></li>');
            }
        }

        return this;
    };

    MultiPicker.prototype.checkEmpty = function() {
        // check to column
        var $toItems = this.$toList.children(".multipicker-column-item"),
            $toEmpty = this.$toList.children(".multipicker-column-empty");
        if (!$toItems.length) {
            if ($toEmpty.length) {
                $toEmpty.html(this.options.toColumn.empty);
            } else {
                this.$toList.prepend(
                    '<li class="multipicker-column-empty">' + this.options.toColumn.empty + '</li>'
                );
            }
            $('.multipicker-column-more', this.$toList).remove();
        } else if ($toEmpty.length) {
            $toEmpty.remove();
        }
        // check from column
        var $fromItems = this.$fromList.children(".multipicker-column-item"),
            $fromEmpty = this.$fromList.children(".multipicker-column-empty");
        if (!$fromItems.length) {
            if ($fromEmpty.length) {
                $fromEmpty.html(this.options.fromColumn.empty);
            } else {
                this.$fromList.prepend(
                    '<li class="multipicker-column-empty">' + this.options.fromColumn.empty + '</li>'
                );
            }
            $('.multipicker-column-more', this.$fromList).remove();
        } else if ($fromEmpty.length) {
            $fromEmpty.remove();
        }
    };

    MultiPicker.prototype.handleEvents = function() {
        var self = this;
        // search to
        this.$toColumn.find('input[type="search"]').on("keypress.multipicker", function(e) {
            if (e.keyCode == 13) {
                self.searchTo();
            }
        });
        this.$toColumn.find('.multipicker-icon-search').on("click.multipicker", function() {
            self.searchTo();
        });
        // search from
        this.$fromColumn.find('input[type="search"]').on("keypress.multipicker", function(e) {
            if (e.keyCode == 13) {
                self.searchFrom();
            }
        });
        this.$fromColumn.find('.multipicker-icon-search').on("click.multipicker", function() {
            self.searchFrom();
        });
        // move events
        var doAddItem = function($item) {
            var $newItem = self.createItem($item.data(MultiPicker.DATA_KEY), MultiPicker.TYPE_SELECTED);
            self.$toList.prepend($newItem);
            $item.remove();
            self.checkEmpty();
            self.$wrapper.trigger($.Event("selected.multipicker", {relatedTarget: $newItem[0]}));
            if (self.isChanged()) {
                self.$wrapper.trigger($.Event("changed.multipicker", {relatedTarget: $newItem[0]}));
            }
        };
        var doDeleteItem = function($item) {
            var $newItem = self.createItem($item.data(MultiPicker.DATA_KEY), MultiPicker.TYPE_UNSELECTED);
            self.$fromList.prepend($newItem);
            $item.remove();
            self.checkEmpty();
            self.$wrapper.trigger($.Event("deselected.multipicker", {relatedTarget: $newItem[0]}));
            if (self.isChanged()) {
                self.$wrapper.trigger($.Event("changed.multipicker", {relatedTarget: $newItem[0]}));
            }
        };
        // deselect
        this.$toList.on("dblclick.multipicker", ".multipicker-column-item>a", function() {
            doDeleteItem($(this).parents("li:first"));
        });
        this.$toList.on("click.multipicker", ".multipicker-icon-delete", function() {
            doDeleteItem($(this).parents("li:first"));
        });
        // select
        this.$fromList.on("dblclick.multipicker", ".multipicker-column-item>a", function() {
            doAddItem($(this).parents("li:first"));
        });
        this.$fromList.on("click.multipicker", ".multipicker-icon-add", function() {
            doAddItem($(this).parents("li:first"));
        });
        // load more
        this.$toList.on("click.multipicker", ".multipicker-column-more>a", this, function(e) {
            if ($(this).hasClass("done") || $(this).hasClass("loading")) return false;
            e.data.loadMoreTo();
        });
        this.$fromList.on("click.multipicker", ".multipicker-column-more>a", this, function(e) {
            if ($(this).hasClass("done") || $(this).hasClass("loading")) return false;
            e.data.loadMoreFrom();
        });

        return this;
    };

    MultiPicker.prototype.setHeight = function(height) {
        if (typeof height === "undefined") {
            height = this.options.height;
        }
        this.$toList.css('height', height + (isNumeric(height) ? "px" : ""));
        this.$fromList.css('height', height + (isNumeric(height) ? "px" : ""));

        return this;
    };

    MultiPicker.prototype.setMinHeight = function(minHeight) {
        if (typeof minHeight === "undefined") {
            minHeight = this.options.minHeight;
        }
        this.$toList.css('minHeight', minHeight + (isNumeric(minHeight) ? "px" : ""));
        this.$fromList.css('minHeight', minHeight + (isNumeric(minHeight) ? "px" : ""));

        return this;
    };

    MultiPicker.prototype.setMaxHeight = function(maxHeight) {
        if (typeof maxHeight === "undefined") {
            maxHeight = this.options.maxHeight;
        }
        this.$toList.css('maxHeight', maxHeight + (isNumeric(maxHeight) ? "px" : ""));
        this.$fromList.css('maxHeight', maxHeight + (isNumeric(maxHeight) ? "px" : ""));

        return this;
    };

    MultiPicker.prototype.isChanged = function() {
        if (this.orgSelectedItems) {
            var selectedItems = this.getSelectedItems();
            if (this.orgSelectedItems.length != selectedItems.length) {
                return true;
            }
            for (var i in selectedItems) {
                if (this.orgSelectedItems.indexOf(selectedItems[i]) < 0) {
                    return true;
                }
            }
        }
        return false;
    };

    MultiPicker.prototype.searchTo = function(keyword) {
        if (typeof keyword === "undefined") {
            keyword = this.$toColumn.find('input[type="search"]').val();
        }
        this.$toList.children(".multipicker-column-item").each(function() {
            var $this = $(this),
                itemData = $this.data(MultiPicker.DATA_KEY);
            if (keyword && itemData.name.indexOf(keyword) < 0) {
                $this.hide();
            } else {
                $this.show();
            }
            itemData = null;
            $this = null;
        });

        return this;
    };

    MultiPicker.prototype.searchFrom = function(keyword) {
        if (typeof keyword === "undefined") {
            keyword = this.$fromColumn.find('input[type="search"]').val();
        }
        this.$fromList.children(".multipicker-column-item").each(function() {
            var $this = $(this),
                itemData = $this.data(MultiPicker.DATA_KEY);
            if (keyword && itemData.name.indexOf(keyword) < 0) {
                $this.hide();
            } else {
                $this.show();
            }
            itemData = null;
            $this = null;
        });

        return this;
    };

    MultiPicker.prototype.loadMoreTo = function() {
        var self = this;
        if (typeof this.options.toColumn.loadMore === "function") {
            var num = this.loadedNumTo;
            var ret = this.options.toColumn.loadMore.call(this, num);
            if (ret && typeof ret.done === "function") {
                this.loadingMoreTo();
                ret.done(function(items) {
                    if ($.isArray(items) && items.length) {
                        self.loadedMoreTo(items.length);
                        self.addSelectedItems(items);
                    } else {
                        self.doneMoreTo();
                    }
                }).fail(function() {
                    self.errorMoreTo.apply(self, arguments);
                });
            } else {
                self.doneMoreTo();
            }
        }

        return this;
    };

    MultiPicker.prototype.loadMoreFrom = function() {
        var self = this;
        if (typeof this.options.fromColumn.loadMore === "function") {
            var num = this.loadedNumFrom;
            var ret = this.options.fromColumn.loadMore.call(this, num);
            if (ret && typeof ret.done === "function") {
                this.loadingMoreFrom();
                ret.done(function(items) {
                    if ($.isArray(items) && items.length) {
                        self.loadedMoreFrom(items);
                        self.addUnSelectedItems(items);
                    } else {
                        self.doneMoreFrom();
                    }
                }).fail(function() {
                    self.errorMoreFrom.apply(self, arguments);
                });
            } else {
                self.doneMoreFrom();
            }
        }

        return this;
    };

    MultiPicker.prototype.loadingMoreTo = function() {
        this.$toList.find(".multipicker-column-more")
            .removeClass("error")
            .addClass("loading")
            .children("a").text(this.options.toColumn.loadingText);

        return this;
    };

    MultiPicker.prototype.loadingMoreFrom = function() {
        this.$fromList.find(".multipicker-column-more")
            .removeClass("error")
            .addClass("loading")
            .children("a").text(this.options.fromColumn.loadingText);

        return this;
    };

    MultiPicker.prototype.loadedMoreTo = function(loadedNum) {
        this.loadedNumTo = this.loadedNumTo || 0;
        if (typeof loadedNum === "number" && loadedNum >= 0) {
            this.loadedNumTo += loadedNum;
        }
        this.$toList.find(".multipicker-column-more")
            .removeClass("loading")
            .children("a").text(this.options.toColumn.loadText);

        return this;
    };

    MultiPicker.prototype.loadedMoreFrom = function(loadedNum) {
        this.loadedNumFrom = this.loadedNumFrom || 0;
        if (typeof loadedNum === "number" && loadedNum >= 0) {
            this.loadedNumFrom += loadedNum;
        }
        this.$fromList.find(".multipicker-column-more")
            .removeClass("loading")
            .children("a").text(this.options.fromColumn.loadText);

        return this;
    };

    MultiPicker.prototype.errorMoreTo = function() {
        this.$toList.find(".multipicker-column-more")
            .removeClass("loading")
            .addClass("error")
            .children("a").text(this.options.toColumn.loadErrorText);

        return this;
    };

    MultiPicker.prototype.errorMoreFrom = function() {
        this.$fromList.find(".multipicker-column-more")
            .removeClass("loading")
            .addClass("error")
            .children("a").text(this.options.fromColumn.loadErrorText);

        return this;
    };

    MultiPicker.prototype.doneMoreTo = function() {
        this.$toList.find(".multipicker-column-more")
            .removeClass("loading loaded error")
            .addClass("done")
            .children("a").text(this.options.toColumn.loadEmpty);

        return this;
    };

    MultiPicker.prototype.doneMoreFrom = function() {
        this.$fromList.find(".multipicker-column-more")
            .removeClass("loading loaded error")
            .addClass("done")
            .children("a").text(this.options.fromColumn.loadEmpty);

        return this;
    };

    MultiPicker.prototype.addSelectedItems = function(items) {
        var $toItems = this.createItems(items, MultiPicker.TYPE_SELECTED);
        this.$toList.children(".multipicker-column-item:last").after($toItems);

        return this;
    };

    MultiPicker.prototype.addUnSelectedItems = function(items) {
        var $fromItems = this.createItems(items, MultiPicker.TYPE_UNSELECTED);
        this.$fromList.children(".multipicker-column-item:last").after($fromItems);

        return this;
    };

    MultiPicker.prototype.setSelectedItems = function(items) {
        var $toItems = this.createItems(items, MultiPicker.TYPE_SELECTED);
        this.$toList.empty().append($toItems);
        this.createMoreItem(MultiPicker.TYPE_SELECTED);

        return this;
    };

    MultiPicker.prototype.setUnSelectedItems = function(items) {
        var $fromItems = this.createItems(items, MultiPicker.TYPE_UNSELECTED);
        this.$fromList.empty().append($fromItems);
        this.createMoreItem(MultiPicker.TYPE_UNSELECTED);

        return this;
    };

    MultiPicker.prototype.getSelectedItems = function() {
        var data = [], itemData;
        this.$toList.children(".multipicker-column-item").each(function() {
            itemData = $(this).data(MultiPicker.DATA_KEY);
            itemData && data.push(itemData);
        });
        return data;
    };

    MultiPicker.prototype.getSelectedData = function() {
        var self = this, data = [],
            items = this.getSelectedItems();
        $.each(items, function(i, item) {
            data.push(self._getDataSource(item.originalData));
        });
        return data;
    };

    MultiPicker.prototype.getSelectedElements = function() {
        var elements = [];
        this.$toList.children(".multipicker-column-item").each(function() {
            elements.push(this);
        });
        return elements;
    };

    MultiPicker.prototype.getUnSelectedItems = function() {
        var data = [], itemData;
        this.$fromList.children(".multipicker-column-item").each(function() {
            itemData = $(this).data(MultiPicker.DATA_KEY);
            itemData && data.push(itemData);
        });
        return data;
    };

    MultiPicker.prototype.getUnSelectedData = function() {
        var self = this, data = [],
            items = this.getUnSelectedItems();
        $.each(items, function(i, item) {
            data.push(self._getDataSource(item.originalData));
        });
        return data;
    };

    MultiPicker.prototype.getUnSelectedElements = function() {
        var elements = [];
        this.$fromList.children(".multipicker-column-item").each(function() {
            elements.push(this);
        });
        return elements;
    };

    MultiPicker.prototype._getDataSource = function(data) {
        if (!data || !this.options.dataSrc || typeof data !== "object") return data;
        var result;
        if (typeof (this.options.dataSrc) === "object") {
            $.each(this.options.dataSrc, function(i, item) {
                !result && (result = {});
                result[item] = data[item];
            });
        } else {
            result = data[this.options.dataSrc];
        }
        return result;
    };

    var old = $.fn.multiPicker;

    $.fn.multiPicker = function(options) {
        var $this = $(this), inst;
        if (!(inst = $this.data(MultiPicker.INST_KEY))) {
            $this.data(MultiPicker.INST_KEY, (inst = new MultiPicker(this, options)));
        }
        if (typeof options === "string" && inst) {
            var called = inst[options];
            if (typeof called === "function") {
                var args = Array.prototype.slice.call(arguments, 1);
                return called.apply(inst, args);
            } else {
                throw "MultiPicker Error: Method " + called + " does not exist";
            }
        }
        return this;
    };

    $.fn.multiPicker.Constructor = MultiPicker;

    // noConflict
    $.fn.multiPicker.noConflict = function() {
        $.fn.multiPicker = old;
        return this;
    };

    return MultiPicker;
});