/**
 * 分页插件，改写自 bootstrap-paginator.js v1.0.2
 *
 * Updated by jinzhk on 2016/11/14
 * Fixed: 分页按钮禁用后不再触发 pageClicked 事件
 * 
 * Updated by jinzhk on 2017/05/08
 * Fixed: 改变每页显示条目数后没有自动更新页码显示内容
 * Fixed: 计算显示总数目时会超出设置的总数目
 * Add: getPages() 方法返回内容添加了总条目数 totalCount
 */
define(['jquery'], function($) {

    "use strict";


    /* Paging PUBLIC CLASS DEFINITION
     * ================================= */

    /**
     * Paging Constructor
     *
     * @param element element of the paging
     * @param options the options to config the Paging
     *
     * */
    var Paging = function (element, options) {
        this.init(element, options);
    };

    Paging.VERSION = "1.0.2";

    Paging.DEFAULTS = {
        dom: 'p',
        size: "normal",
        sizeMap: {
            'large': "pagination-lg",
            'small': "pagination-sm",
            'mini': ""
        },
        alignment: "left",
        containerClass: "",
        itemContainerClass: function (type, page, current) {
            return (page === current) ? "active" : "";
        },
        itemContentClass: function (type, page, current) {
            return "";
        },
        currentPage: 1,
        numberOfPages: 5,
        totalCount: 0,
        pageUrl: function (type, page, current) {
            return null;
        },
        onPageClicked: null,
        onPageChanged: null,
        onPageNumberChanged: null,
        shouldShowPage: function (type, page, current) {
            var result = true;
            switch (type) {
                case "first":
                    result = (current !== 1);
                    break;
                case "prev":
                    result = (current !== 1);
                    break;
                case "next":
                    result = (current !== this.totalPages);
                    break;
                case "last":
                    result = (current !== this.totalPages);
                    break;
                case "page":
                    result = true;
                    break;
            }
            return result;
        },
        tooltip: false,
        tooltipOptions: {
            animation: true,
            html: true,
            placement: 'top',
            selector: false,
            title: "",
            container: false
        },
        info: false,
        currentPageInfo: false,
        numbers: false,
        numbersList: [10, 25, 50, 100],
        language: {
            page: function (type, page, current) {
                switch (type) {
                    case "first":
                        return "&lt;&lt;";
                    case "prev":
                        return "&lt;";
                    case "next":
                        return "&gt;";
                    case "last":
                        return "&gt;&gt;";
                    case "page":
                        return page;
                }
            },
            tooltip: function (type, page, current) {
                switch (type) {
                    case "first":
                        return "Go to first page";
                    case "prev":
                        return "Go to previous page";
                    case "next":
                        return "Go to next page";
                    case "last":
                        return "Go to last page";
                    case "page":
                        return (page === current) ? "Current page is " + page : "Go to page " + page;
                }
            },
            info: function(numberOfPages, totalPages, totalCount) {
                numberOfPages = parseInt(numberOfPages, 10) || 0;
                totalPages = parseInt(totalPages, 10) || 0;
                var totalEntries = numberOfPages * totalPages;
                if (totalEntries > totalCount) {
                    totalEntries = totalCount;
                }
                return 'Total <em>' + totalEntries + '</em> entries';
            },
            currentPageInfo: function(current, totalPages) {
                current = parseInt(current, 10) || 0;
                totalPages = parseInt(totalPages, 10) || 0;
                return "Pages: " + current + "/" + totalPages;
            },
            numbers: function(selectHtml, numberOfPages) {
                return "Show " + selectHtml + " entries";
            }
        }
    };

    Paging.prototype = {

        options: function() {
            return $.extend({}, Paging.DEFAULTS);
        }(),

        /**
         * Initialization function of the paging, accepting an element and the options as parameters
         *
         * @param element element of the paging
         * @param options the options to config the paging
         *
         * */
        init: function (element, options) {

            this.$element = $(element);

            this.currentPage = 1;

            this.lastPage = 1;

            this.setOptions(options);

            this.initialized = true;
        },

        /**
         * Update the properties of the paging element
         *
         * @param options options to config the paging
         * */
        setOptions: function (options) {

            this.options = $.extend(true, {}, this.options, options);
            if (options && $.isArray(options.numbersList)) {
                this.options.numbersList = [].concat(options.numbersList);
            }
            if (!$.isArray(this.options.numbersList)) {
                this.options.numbersList = [].concat(Paging.DEFAULTS.numbersList);
            }

            this.numberOfPages = parseInt(this.options.numberOfPages, 10); //setup the numberOfPages to be shown
            this.totalCount = parseInt(this.options.totalCount, 10); //setup the totalCount to be shown
            this.totalPages = Math.ceil(this.options.totalCount / this.numberOfPages);  //setup the total pages property.

            if (!~$.inArray(this.numberOfPages, this.options.numbersList)) {
                this.options.numbersList.unshift(this.numberOfPages);
            }

            //move the set current page after the setting of total pages. otherwise it will cause out of page exception.
            if (options && typeof (options.currentPage)  !== 'undefined') {

                this.setCurrentPage(options.currentPage);
            }

            this.listen();

            //render the paging
            this.render();

            if (!this.initialized && this.lastPage !== this.currentPage) {
                this.$element.trigger("pageChanged.paging", [this.lastPage, this.currentPage]);
            }

        },

        /**
         * Sets up the events listeners. Currently the pageclicked and pagechanged events are linked if available.
         *
         * */
        listen: function () {

            this.$element.off("pageClicked.paging");

            this.$element.off("pageChanged.paging");

            this.$element.off("pageNumberChanged.paging");// unload the events for the element

            if (typeof (this.options.onPageClicked) === "function") {
                this.$element.on("pageClicked.paging", this.options.onPageClicked);
            }

            if (typeof (this.options.onPageChanged) === "function") {
                this.$element.on("pageChanged.paging", this.options.onPageChanged);
            }

            if (typeof (this.options.onPageNumberChanged) === "function") {
                this.$element.on("pageNumberChanged.paging", this.options.onPageNumberChanged);
            }

            this.$element.on("pageClicked.paging", this.onPageClicked);
        },

        /**
         * Renders the paging according to the internal properties and the settings.
         *
         *
         * */
        render: function () {

            //empty the outter most container then add the listContainer inside.
            this.$element.empty();

            this.$element.addClass("nav-pagination");

            var alignment = this.options.alignment || "left";
            this.$element.addClass("nav-pagination-" + alignment.toLowerCase());

            if (this.totalPages <= 0) {
                return;
            }

            var domStr = this.getValueFromOption(this.options.dom) || '';

            var $wrapper = this.$element,
                $pagination, $info, $currentPageInfo, $numbers,
                ch, newNode, cNext, sAttr, i, j;
            for (i=0; i<domStr.length; i++) {
                ch = domStr.charAt(i);
                switch (ch) {
                    case '<':
                        // create new node
                        newNode = $("<div/>")[0];
                        cNext = domStr.charAt(i+1);
                        if (cNext == '"' || cNext == "'") {
                            sAttr = "";
                            j = 2;
                            while (domStr.charAt(i+j) != cNext) {
                                sAttr += domStr.charAt(i+j);
                                j ++;
                            }
                            // add class or id attr.
                            if (sAttr.indexOf('.') != -1) {
                                var aSplit = sAttr.split('.');
                                newNode.id = aSplit[0].substr(1, aSplit[0].length-1);
                                newNode.className = aSplit[1];
                            } else if (sAttr.charAt(0) == "#") {
                                newNode.id = sAttr.substr(1, sAttr.length-1);
                            } else {
                                newNode.className = sAttr;
                            }
                            i += j;
                        }
                        $wrapper.append(newNode);
                        $wrapper = $(newNode);
                        break;
                    case '>':
                        // end new node
                        $wrapper = $wrapper.parent();
                        break;
                    case 'p':
                        // pagination of paging
                        $pagination = $('<ul></ul>');
                        $wrapper.append($pagination);
                        break;
                    case 'i':
                        // info of paging
                        if (this.getValueFromOption(this.options.info)) {
                            $info = $('<label></label>');
                            $info.addClass("pagination-info");
                            $info.html(this.getValueFromOption(this.options.language.info, this.numberOfPages, this.totalPages, this.totalCount));
                            $wrapper.append($info);
                        }
                        break;
                    case 'c':
                        // current page info of paging
                        if (this.getValueFromOption(this.options.currentPageInfo)) {
                            $currentPageInfo = $('<label></label>');
                            $currentPageInfo.addClass("pagination-info-page");
                            $currentPageInfo.html(this.getValueFromOption(this.options.language.currentPageInfo, this.currentPage, this.totalPages));
                            $wrapper.append($currentPageInfo);
                        }
                        break;
                    case 'n':
                        // select number of pages
                        if (this.getValueFromOption(this.options.numbers)) {
                            $numbers = $('<label></label>');
                            $numbers.addClass("pagination-numbers");
                            var numbersSelect = '<select>';
                            $.each(this.getValueFromOption(this.options.numbersList), $.proxy(function(i, item) {
                                numbersSelect += '<option value="' + item + '"' + (item == this.numberOfPages ? ' selected="selected"' : '') +'>' + item + '</option>';
                            }, this));
                            numbersSelect += '</select>';
                            $numbers.html(this.getValueFromOption(this.options.language.numbers, numbersSelect, this.numberOfPages));
                            $wrapper.append($numbers);
                            $wrapper.on("change", '.pagination-numbers select', {oldNumber: this.numberOfPages} , $.proxy(this.onPageNumberChanged, this));
                        }
                        break;
                    default:
                        break;
                }
            }

            i = 0;

            var size = this.options.size || "normal",
                pages = this.getPages(),
                containerClass = this.getValueFromOption(this.options.containerClass, this.$element),
                first = null, prev = null, next = null, last = null, p = null;

            $pagination.prop("class", "").addClass("pagination");

            switch (size.toLowerCase()) {
                case "large":
                case "small":
                case "mini":
                    $pagination.addClass(this.options.sizeMap[size.toLowerCase()]);
                    break;
                default:
                    break;
            }

            $pagination.addClass(containerClass);

            //update the page element reference
            this.pageRef = [];

            if (pages.first) {//if the there is first page element
                first = this.buildPageItem("first", pages.first);

                if (first) {
                    $pagination.append(first);
                }

            }

            if (pages.prev) {//if the there is previous page element

                prev = this.buildPageItem("prev", pages.prev);

                if (prev) {
                    $pagination.append(prev);
                }

            }


            for (i = 0; i < pages.length; i = i + 1) {//fill the numeric pages.

                p = this.buildPageItem("page", pages[i]);

                if (p) {
                    $pagination.append(p);
                }
            }

            if (pages.next) {//if there is next page

                next = this.buildPageItem("next", pages.next);

                if (next) {
                    $pagination.append(next);
                }
            }

            if (pages.last) {//if there is last page

                last = this.buildPageItem("last", pages.last);

                if (last) {
                    $pagination.append(last);
                }
            }

        },

        /**
         *
         * Creates a page item base on the type and page number given.
         *
         * @param page page number
         * @param type type of the page, whether it is the first, prev, page, next, last
         *
         * @return Object the constructed page element
         * */
        buildPageItem: function (type, page) {

            var itemContainer = $("<li></li>"),//creates the item container
                itemContent = $("<a></a>"),//creates the item content
                text = "",
                title = "",
                itemContainerClass = this.options.itemContainerClass(type, page, this.currentPage),
                itemContentClass = this.getValueFromOption(this.options.itemContentClass, type, page, this.currentPage),
                tooltipOpts = null;


            switch (type) {

                case "first":
                    if (!this.getValueFromOption(this.options.shouldShowPage, type, page, this.currentPage)) { return; }
                    if (this.currentPage <= 1) {
                        itemContent.prop('disabled', true);
                    }
                    text = this.getValueFromOption(this.options.language.page, type, page, this.currentPage);
                    title = this.getValueFromOption(this.options.language.tooltip, type, page, this.currentPage);
                    break;
                case "last":
                    if (!this.getValueFromOption(this.options.shouldShowPage, type, page, this.currentPage)) { return; }
                    if (this.currentPage >= this.totalPages) {
                        itemContent.prop('disabled', true);
                    }
                    text = this.getValueFromOption(this.options.language.page, type, page, this.currentPage);
                    title = this.getValueFromOption(this.options.language.tooltip, type, page, this.currentPage);
                    break;
                case "prev":
                    if (!this.getValueFromOption(this.options.shouldShowPage, type, page, this.currentPage)) { return; }
                    if (this.currentPage <= 1) {
                        itemContent.prop('disabled', true);
                    }
                    text = this.getValueFromOption(this.options.language.page, type, page, this.currentPage);
                    title = this.getValueFromOption(this.options.language.tooltip, type, page, this.currentPage);
                    break;
                case "next":
                    if (!this.getValueFromOption(this.options.shouldShowPage, type, page, this.currentPage)) { return; }
                    if (this.currentPage >= this.totalPages) {
                        itemContent.prop('disabled', true);
                    }
                    text = this.getValueFromOption(this.options.language.page, type, page, this.currentPage);
                    title = this.getValueFromOption(this.options.language.tooltip, type, page, this.currentPage);
                    break;
                case "page":
                    if (!this.getValueFromOption(this.options.shouldShowPage, type, page, this.currentPage)) { return; }
                    text = this.getValueFromOption(this.options.language.page, type, page, this.currentPage);
                    title = this.getValueFromOption(this.options.language.tooltip, type, page, this.currentPage);
                    break;
            }

            itemContainer.addClass(itemContainerClass).append(itemContent);

            itemContent.addClass(itemContentClass).html(text).on("click", null, {type: type, page: page}, $.proxy(this.onPageItemClicked, this));

            if (this.options.pageUrl) {
                itemContent.attr("href", this.getValueFromOption(this.options.pageUrl, type, page, this.currentPage));
            }

            if (!itemContent.attr('href')) {
                itemContent.attr('href', "javascript:;");
            }

            if (this.options.tooltip) {
                tooltipOpts = $.extend({}, this.options.tooltipOptions, {title: title});

                itemContent.tooltip(tooltipOpts);
            } else {
                itemContent.attr("title", title);
            }

            return itemContainer;

        },

        /**
         *
         *  Destroys the paging element, it unload the event first, then empty the content inside.
         *
         * */
        destroy: function () {

            this.$element.off("pageClicked.paging");

            this.$element.off("pageChanged.paging");

            this.$element.removeData('paging.bs');

            this.$element.empty();

        },

        /**
         * Shows the page
         *
         * */
        show: function (page) {

            this.setCurrentPage(page);

            this.render();

            if (this.lastPage !== this.currentPage) {
                this.$element.trigger("pageChanged.paging", [this.lastPage, this.currentPage]);
            }
        },

        /**
         * Shows the next page
         *
         * */
        showNext: function () {
            var pages = this.getPages();

            if (pages.next) {
                this.show(pages.next);
            }

        },

        /**
         * Shows the previous page
         *
         * */
        showPrevious: function () {
            var pages = this.getPages();

            if (pages.prev) {
                this.show(pages.prev);
            }

        },

        /**
         * Shows the first page
         *
         * */
        showFirst: function () {
            var pages = this.getPages();

            if (pages.first) {
                this.show(pages.first);
            }

        },

        /**
         * Shows the last page
         *
         * */
        showLast: function () {
            var pages = this.getPages();

            if (pages.last) {
                this.show(pages.last);
            }

        },

        /**
         * Internal on page item click handler, when the page item is clicked, change the current page to the corresponding page and
         * trigger the pageclick event for the listeners.
         *
         *
         * */
        onPageItemClicked: function (event) {

            if ($(event.currentTarget).is(':disabled')) return this;

            var type = event.data.type,
                page = event.data.page;

            this.$element.trigger("pageClicked.paging", [event, type, page]);

        },

        onPageNumberChanged: function (event) {

            // update paging
            this.currentPage = 1;
            this.lastPage = 1;
            this.setOptions({
                currentPage: 1,
                numberOfPages: $(event.target).val()
            });

            var oldNumber = event.data.oldNumber;

            this.$element.trigger("pageNumberChanged.paging", [event, oldNumber]);

        },

        onPageClicked: function (event, originalEvent, type, page) {

            if ($(originalEvent.currentTarget).is(':disabled')) return this;

            //show the corresponding page and retrieve the newly built item related to the page clicked before for the event return

            var currentTarget = $(event.currentTarget);

            switch (type) {
                case "first":
                    currentTarget.paging("showFirst");
                    break;
                case "prev":
                    currentTarget.paging("showPrevious");
                    break;
                case "next":
                    currentTarget.paging("showNext");
                    break;
                case "last":
                    currentTarget.paging("showLast");
                    break;
                case "page":
                    currentTarget.paging("show", page);
                    break;
            }

        },

        setCurrentPage: function (page) {
            if (page > this.totalPages || page < 1) {// if the current page is out of range, return.

                //throw "Page out of range";
                return;

            }

            this.lastPage = this.currentPage;

            this.currentPage = parseInt(page, 10);

        },

        /**
         * Gets an array that represents the current status of the page object. Numeric pages can be access via array mode. length attributes describes how many numeric pages are there. First, previous, next and last page can be accessed via attributes first, prev, next and last. Current attribute marks the current page within the pages.
         *
         * @return object output objects that has first, prev, next, last and also the number of pages in between.
         * */
        getPages: function () {

            var totalPages = this.totalPages,// get or calculate the total pages via the total records
                pageStart = (this.currentPage % this.numberOfPages === 0) ? (parseInt(this.currentPage / this.numberOfPages, 10) - 1) * this.numberOfPages + 1 : parseInt(this.currentPage / this.numberOfPages, 10) * this.numberOfPages + 1,//calculates the start page.
                output = [],
                i = 0,
                counter = 0;

            pageStart = pageStart < 1 ? 1 : pageStart;//check the range of the page start to see if its less than 1.

            for (i = pageStart, counter = 0; counter < this.numberOfPages && i <= totalPages; i = i + 1, counter = counter + 1) {//fill the pages
                output.push(i);
            }

            output.first = 1;//add the first when the current page leaves the 1st page.

            if (this.currentPage > 1) {// add the previous when the current page leaves the 1st page
                output.prev = this.currentPage - 1;
            } else {
                output.prev = 1;
            }

            if (this.currentPage < totalPages) {// add the next page when the current page doesn't reach the last page
                output.next = this.currentPage + 1;
            } else {
                output.next = totalPages;
            }

            output.last = totalPages;// add the last page when the current page doesn't reach the last page

            output.current = this.currentPage;//mark the current page.

            output.total = totalPages;

            output.totalCount = this.totalCount;

            output.numberOfPages = this.options.numberOfPages;

            return output;

        },

        /**
         * Gets the value from the options, this is made to handle the situation where value is the return value of a function.
         *
         * @return mixed value that depends on the type of parameters, if the given parameter is a function, then the evaluated result is returned. Otherwise the parameter itself will get returned.
         * */
        getValueFromOption: function (value) {

            var output = null,
                args = Array.prototype.slice.call(arguments, 1);

            if (typeof value === 'function') {
                output = value.apply(this, args);
            } else {
                output = value;
            }

            return output;

        }

    };


    /* TYPEAHEAD PLUGIN DEFINITION
     * =========================== */

    var old = $.fn.paging;

    $.fn.paging = function (option) {

        var args = arguments,
            result = null;

        $(this).each(function (index, item) {
            var $this = $(item),
                data = $this.data('paging.bs'),
                options = (typeof option !== 'object') ? null : option;

            if (!data) {
                data = new Paging(this, options);

                $this = $(data.$element);

                $this.data('paging.bs', data);

                return;
            }

            if (typeof option === 'string') {

                if (data[option]) {
                    result = data[option].apply(data, Array.prototype.slice.call(args, 1));
                } else {
                    throw "Paging Error: Method " + option + " does not exist";
                }

            } else {
                result = data.setOptions(option);
            }
        });

        return result;

    };

    $.fn.paging.setDefaults = function(options) {
        if (options && typeof options === "object") {
            Paging.prototype.options = $.extend(true, {}, Paging.DEFAULTS, options);
        }
    };

    $.fn.paging.noConflict = function() {
        $.fn.paging = old;
        return this;
    };

    $.fn.paging.Constructor = Paging;

    return Paging;

});
