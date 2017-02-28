/**
 * jquery.plupload.bs3.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 *
 * Depends:
 *	bootstrap button
 *
 * Optionally:
 *	jquery dragsort
 */

/* global jQuery:true */

/**
 Bootstrap UI based implementation of the Plupload API - multi-runtime file uploading API.

 @example
 <!-- Instantiating: -->
 <div id="uploader">
    <p>Your browser doesn't have Flash, Silverlight or HTML5 support.</p>
 </div>

 <script>
 $('#uploader').plupload({
        url : '../upload.jsp',
        filters : [
            {title : "Image files", extensions : "jpg,gif,png"}
        ],
        rename: true,
        sortable: true
    });
 </script>

 @example
 // Invoking methods:
 $('#uploader').plupload(options);

 // Display welcome message in the notification area
 $('#uploader').plupload('notify', 'info', "This might be obvious, but you need to click 'Add Files' to add some files.");

 @example
 // Subscribing to the events...
 // ... on initialization:
 $('#uploader').plupload({
		...
		viewchanged: function(event, args) {
			// stuff ...
		}
	});
 // ... or after initialization
 $('#uploader').on("viewchanged", function(event, args) {
		// stuff ...
	});

 @class UI.Plupload
 @constructor
 @param {Object} settings For detailed information about each option check documentation.
 @param {String} settings.url URL of the server-side upload handler.
 @param {Number|String} [settings.chunk_size=0] Chunk size in bytes to slice the file into. Shorcuts with b, kb, mb, gb, tb suffixes also supported. `e.g. 204800 or "204800b" or "200kb"`. By default - disabled.
 @param {String} [settings.file_data_name="file"] Name for the file field in Multipart formated message.
 @param {Object} [settings.filters={}] Set of file type filters.
 @param {Array} [settings.filters.mime_types=[]] List of file types to accept, each one defined by title and list of extensions. `e.g. {title : "Image files", extensions : "jpg,jpeg,gif,png"}`. Dispatches `plupload.FILE_EXTENSION_ERROR`
 @param {String|Number} [settings.filters.max_file_size=0] Maximum file size that the user can pick, in bytes. Optionally supports b, kb, mb, gb, tb suffixes. `e.g. "10mb" or "1gb"`. By default - not set. Dispatches `plupload.FILE_SIZE_ERROR`.
 @param {Boolean} [settings.filters.prevent_duplicates=false] Do not let duplicates into the queue. Dispatches `plupload.FILE_DUPLICATE_ERROR`.
 @param {Number} [settings.filters.max_file_count=0] Limit the number of files that can reside in the queue at the same time (default is 0 - no limit).
 @param {String} [settings.flash_swf_url] URL of the Flash swf.
 @param {Object} [settings.headers] Custom headers to send with the upload. Hash of name/value pairs.
 @param {Number|String} [settings.max_file_size] Maximum file size that the user can pick, in bytes. Optionally supports b, kb, mb, gb, tb suffixes. `e.g. "10mb" or "1gb"`. By default - not set. Dispatches `plupload.FILE_SIZE_ERROR`.
 @param {Number} [settings.max_retries=0] How many times to retry the chunk or file, before triggering Error event.
 @param {Boolean} [settings.multipart=true] Whether to send file and additional parameters as Multipart formated message.
 @param {Object} [settings.multipart_params] Hash of key/value pairs to send with every file upload.
 @param {Boolean} [settings.multi_selection=true] Enable ability to select multiple files at once in file dialog.
 @param {Boolean} [settings.prevent_duplicates=false] Do not let duplicates into the queue. Dispatches `plupload.FILE_DUPLICATE_ERROR`.
 @param {String|Object} [settings.required_features] Either comma-separated list or hash of required features that chosen runtime should absolutely possess.
 @param {Object} [settings.resize] Enable resizng of images on client-side. Applies to `image/jpeg` and `image/png` only. `e.g. {width : 200, height : 200, quality : 90, crop: true}`
 @param {Number} [settings.resize.width] If image is bigger, it will be resized.
 @param {Number} [settings.resize.height] If image is bigger, it will be resized.
 @param {Number} [settings.resize.quality=90] Compression quality for jpegs (1-100).
 @param {Boolean} [settings.resize.crop=false] Whether to crop images to exact dimensions. By default they will be resized proportionally.
 @param {String} [settings.runtimes="html5,flash,silverlight,html4"] Comma separated list of runtimes, that Plupload will try in turn, moving to the next if previous fails.
 @param {String} [settings.silverlight_xap_url] URL of the Silverlight xap.
 @param {Boolean} [settings.unique_names=false] If true will generate unique filenames for uploaded files.

 @param {Boolean} [settings.autostart=false] Whether to auto start uploading right after file selection.
 @param {Boolean} [settings.dragdrop=true] Enable ability to add file to the queue by drag'n'dropping them from the desktop.
 @param {Boolean} [settings.rename=false] Enable ability to rename files in the queue.
 @param {Boolean} [settings.sortable=false] Enable ability to sort files in the queue, changing their uploading priority.
 @param {Object} [settings.buttons] Control the visibility of functional buttons.
 @param {Boolean} [settings.buttons.browse=true] Display browse button.
 @param {Boolean} [settings.buttons.start=true] Display start button.
 @param {Boolean} [settings.buttons.stop=true] Display stop button.
 @param {Object} [settings.views] Control various views of the file queue.
 @param {Boolean} [settings.views.list=true] Enable list view.
 @param {Boolean} [settings.views.thumbs=false] Enable thumbs view.
 @param {String} [settings.views.default='list'] Default view.
 @param {Boolean} [settings.views.remember=true] Whether to remember the current view (requires jQuery Cookie plugin).
 @param {Boolean} [settings.multiple_queues=true] Re-activate the widget after each upload procedure.
 */

/* ========================================================
 * Updated by 靳志凯(jinzhk) @ 2015-07-13
 * 1、改为了模块兼容式写法
 * 2、去除了jquery ui的button和progressbar依赖，改为了bootstrap依赖
 * ========================================================
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('window', function() {return root;});
        define(['window', 'jquery', 'plupload'], factory);
    } else if(typeof exports === 'object' && typeof module !== 'undefined') {
        var jQuery;
        try {
            jQuery = require('jquery');
        } catch (err) {
            jQuery = root.jQuery;
            if (!jQuery) throw new Error('jQuery dependency not found');
        }
        var plupload;
        try {
            plupload = require('plupload');
        } catch (err) {
            plupload = root.plupload;
            if (!plupload) throw new Error('plupload dependency not found');
        }
        module.exports = factory(root, jQuery, plupload);
    } else {
        if (!root.jQuery) throw new Error('jQuery dependency not found');
        if (!root.plupload) throw new Error('plupload dependency not found');
        root.pluploadUI = factory(root, root.jQuery, root.plupload);
    }
}(this, function(window, $, plupload) {

    /**
     Dispatched when the widget is initialized and ready.

     @event ready
     @param {plupload.Uploader} uploader Uploader instance sending the event.
     */

    /**
     Dispatched when file dialog is closed.

     @event selected
     @param {plupload.Uploader} uploader Uploader instance sending the event.
     @param {Array} files Array of selected files represented by plupload.File objects
     */

    /**
     Dispatched when file dialog is closed.

     @event removed
     @param {plupload.Uploader} uploader Uploader instance sending the event.
     @param {Array} files Array of removed files represented by plupload.File objects
     */

    /**
     Dispatched when upload is started.

     @event start
     @param {plupload.Uploader} uploader Uploader instance sending the event.
     */

    /**
     Dispatched when upload is stopped.

     @event stop
     @param {plupload.Uploader} uploader Uploader instance sending the event.
     */

    /**
     Dispatched during the upload process.

     @event progress
     @param {plupload.Uploader} uploader Uploader instance sending the event.
     @param {plupload.File} file File that is being uploaded (includes loaded and percent properties among others).
     @param {Number} size Total file size in bytes.
     @param {Number} loaded Number of bytes uploaded of the files total size.
     @param {Number} percent Number of percentage uploaded of the file.
     */

    /**
     Dispatched when file is uploaded.

     @event uploaded
     @param {plupload.Uploader} uploader Uploader instance sending the event.
     @param {plupload.File} file File that was uploaded.
     @param {Enum} status Status constant matching the plupload states QUEUED, UPLOADING, FAILED, DONE.
     */

    /**
     Dispatched when upload of the whole queue is complete.

     @event complete
     @param {plupload.Uploader} uploader Uploader instance sending the event.
     @param {Array} files Array of uploaded files represented by plupload.File objects
     */

    /**
     Dispatched when the view is changed, e.g. from `list` to `thumbs` or vice versa.

     @event viewchanged
     @param {plupload.Uploader} uploader Uploader instance sending the event.
     @param {String} type Current view type.
     */

    /**
     Dispatched when error of some kind is detected.

     @event error
     @param {plupload.Uploader} uploader Uploader instance sending the event.
     @param {String} error Error message.
     @param {plupload.File} file File that was uploaded.
     @param {Enum} status Status constant matching the plupload states QUEUED, UPLOADING, FAILED, DONE.
     */

    var uploaders = {};

    plupload.addI18n({
        "Select files": "点击选择文件",
        "Drag files here.": "或者把文件拖到这里。",
        "Remove file": "移除文件"
    });

    function _(str) {
        return plupload.translate(str) || str;
    }

    function renderUI(obj) {
        obj.id = obj.attr('id');

        obj.html(
            '<div class="plupload_wrapper">' +
                '<div class="plupload_container">' +
                    '<div class="plupload_choose">' +
                        '<div class="plupload_choice">' +
                            '<i class="fa fa-upload plupload_icon_choice"></i>' +
                            '<button class="btn btn-info plupload_button_choice">' + _("Select files") + '</button>' +
                        '</div>' +
                        '<div class="plupload_dnd">' +
                            '<div class="plupload_dnd_area">' +
                                '<span>' + _("Drag files here.") + '</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="plupload_buttons">' +
                        '<div class="pull-left">' +
                            '<a class="btn btn-success plupload_button_start"><i class="glyphicon glyphicon-circle-arrow-right"></i>&ensp;' + _("Start Upload") + '</a>' +
                            '<a class="btn btn-default plupload_button_stop hidden"><i class="glyphicon glyphicon-minus-sign"></i>&ensp;' + _("Stop Upload") + '</a>' +
                            /*'<a class="btn btn-info plupload_button_add"><i class="glyphicon glyphicon-plus-sign"></i>&ensp;' + _("Add Files") + '</a>' +*/
                        '</div>' +
                        '<div class="btn-group plupload_view_switch pull-right" data-toggle="buttons">' +
                            '<label class="btn btn-default"  for="'+obj.id+'_view_thumbs" data-view="thumbs">' +
                                '<input type="radio" id="'+obj.id+'_view_thumbs" name="view_mode_'+obj.id+'" autocomplete="off" />' +
                                '<i class="fa fa-picture-o"></i>' +
                                '<span class="sr-only">' + _('Thumbnails') + '</span>' +
                            '</label>' +
                            '<label class="btn btn-default" for="'+obj.id+'_view_list" data-view="list">' +
                                '<input type="radio" id="'+obj.id+'_view_list" name="view_mode_'+obj.id+'" autocomplete="off" />' +
                                '<i class="fa fa-list"></i>' +
                                '<span class="sr-only">' + _('List') + '</span>' +
                            '</label>' +
                        '</div>' +
                    '</div>' +
                    '<div class="plupload_preview">' +
                        '<ul class="plupload_preview_thumbs plupload_scroll"></ul>' +
                        '<div class="plupload_preview_list">' +
                            '<div class="plupload_preview_list_header clearfix">' +
                                '<div class="pull-right">' +
                                    '<b class="plupload_file_size">' + _('Size') + '</b>' +
                                    '<b class="plupload_file_status">' + _('Status') + '</b>' +
                                    '<b class="plupload_file_action">&emsp;</b>' +
                                '</div>' +
                                '<b class="plupload_file_name">' + _('Filename') + '</b>' +
                            '</div>' +
                            '<ul class="plupload_preview_list_body plupload_scroll clearfix"></ul>' +
                        '</div>' +
                    '</div>' +
                    '<div class="plupload_status">' +
                        '<p class="plupload_status_text pull-left"><span class="plupload_upload_status">已上传 0/0 个文件</span>，共 <span class="plupload_total_size">0 B</span></p>' +
                        '<div class="progress plupload_total_progress pull-right">' +
                            '<div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0">' +
                                '<span class="plupload_total_percent">0%</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<input class="plupload_count" value="0" type="hidden">' +
            '</div>'
        );
    }

    var defaults = {
        browse_button_hover: 'hover',
        browse_button_active: 'active',

        filters: {},

        // widget specific
        buttons: {
            browse: true,
            start: true,
            stop: true
        },

        views: {
            list: true,
            thumbs: false,
            active: 'list',
            remember: true // requires: https://github.com/carhartl/jquery-cookie, otherwise disabled even if set to true
        },

        thumb_width: 120,
        thumb_height: 120,

        multiple_queues: true, // re-use widget by default
        dragdrop : true,
        autostart: false,
        sortable: false,
        rename: false
    };

    var pluploadUI = function(element, options) {
        var self = this, id;

        this.FILE_COUNT_ERROR = -9001;

        this.$element = $(element);

        id = this.$element.attr('id');
        if (!id) {
            id = plupload.guid();
            this.$element.attr('id', id);
        }
        this.id = id;

        // backup the elements initial state
        this.contents_bak = this.$element.html();
        renderUI(this.$element);

        // container, just in case
        this.container = $('.plupload_container', this.$element).attr('id', id + '_container');

        this.drop_area = $('.plupload_dnd_area', this.container);

        // list of files, may become sortable
        this.preview = $('.plupload_preview', this.container).attr('id', id + '_preview');
        this.preview_thumbs = $('.plupload_preview_thumbs', this.container).attr('id', id + '_preview_thumbs');
        this.preview_list_wrapper = $('.plupload_preview_list', this.container).attr('id', id + '_preview_list');
        this.preview_list = $('.plupload_preview_list_body', this.preview_list_wrapper).attr('id', id + '_preview_list');

        this.content = this.preview_thumbs;

        // buttons
        this.browse_button = $('.plupload_button_choice', this.container).attr('id', id + '_browse');
        this.browse_button.add($('.plupload_button_add', this.container).attr('id', id + '_add'));
        this.start_button = $('.plupload_button_start', this.container).attr('id', id + '_start');
        this.stop_button = $('.plupload_button_stop', this.container).attr('id', id + '_stop');
        this.thumbs_switcher = $('#' + id + '_view_thumbs');
        this.list_switcher = $('#' + id + '_view_list');

        if ($.fn.button) {
            this.browse_button.button('disable');
            this.start_button.button('disable');
        }

        // status bar
        this.status_bar = $('.plupload_status', this.container);

        // progressbar
        this.progressbar = $('.plupload_total_progress', this.container);

        // counter
        this.counter = $('.plupload_count', this.$element)
            .attr({
                id: id + '_count',
                name: id + '_count'
            });

        // initialize this options
        this.options = $.extend(true, {}, defaults, typeof options === "object" ? options : null);

        // initialize uploader instance
        this._initUploader();
    };

    pluploadUI.prototype = {
        _initUploader: function() {
            var self = this
                , id = this.id
                , uploader
                , options = {
                    container: id + '_buttons',
                    browse_button: id + '_browse'
                }
                ;

            $('.plupload_buttons', this.$element).attr('id', id + '_buttons');

            if (self.options.dragdrop) {
                self.drop_area.attr('id', this.id + '_dropbox');
                options.drop_element = this.id + '_dropbox';
            }

            uploader = this.uploader = uploaders[id] = new plupload.Uploader($.extend(this.options, options));

            // initialize uploader settings
            $.each(uploader.settings, function(key, value) {
                self._setOption(key, value);
            });

            if (self.options.views.thumbs) {
                uploader.settings.required_features.display_media = true;
            }

            // for backward compatibility
            if (self.options.max_file_count) {
                plupload.extend(uploader.getOption('filters'), {
                    max_file_count: self.options.max_file_count
                });
            }

            plupload.addFileFilter('max_file_count', function(maxCount, file, cb) {
                if (maxCount <= this.files.length - (this.total.uploaded + this.total.failed)) {
                    self.browse_button.button('disable');
                    this.disableBrowse();

                    this.trigger('Error', {
                        code : self.FILE_COUNT_ERROR,
                        message : _("File count error."),
                        file : file
                    });
                    cb(false);
                } else {
                    cb(true);
                }
            });


            uploader.bind('Error', function(up, err) {
                var message, details = "";

                message = '<strong>' + err.message + '</strong>';

                switch (err.code) {
                    case plupload.FILE_EXTENSION_ERROR:
                        details = o.sprintf(_("File: %s"), err.file.name);
                        break;

                    case plupload.FILE_SIZE_ERROR:
                        details = o.sprintf(_("File: %s, size: %d, max file size: %d"), err.file.name,  plupload.formatSize(err.file.size), plupload.formatSize(plupload.parseSize(up.getOption('filters').max_file_size)));
                        break;

                    case plupload.FILE_DUPLICATE_ERROR:
                        details = o.sprintf(_("%s already present in the queue."), err.file.name);
                        break;

                    case self.FILE_COUNT_ERROR:
                        details = o.sprintf(_("Upload element accepts only %d file(s) at a time. Extra files were stripped."), up.getOption('filters').max_file_count || 0);
                        break;

                    case plupload.IMAGE_FORMAT_ERROR :
                        details = _("Image format either wrong or not supported.");
                        break;

                    case plupload.IMAGE_MEMORY_ERROR :
                        details = _("Runtime ran out of available memory.");
                        break;

                    /* // This needs a review
                     case plupload.IMAGE_DIMENSIONS_ERROR :
                     details = o.sprintf(_('Resoultion out of boundaries! <b>%s</b> runtime supports images only up to %wx%hpx.'), up.runtime, up.features.maxWidth, up.features.maxHeight);
                     break;	*/

                    case plupload.HTTP_ERROR:
                        details = _("Upload URL might be wrong or doesn't exist.");
                        break;
                }

                message += " <br /><i>" + details + "</i>";

                self._trigger('error', null, { up: up, error: err } );

                // do not show UI if no runtime can be initialized
                if (err.code === plupload.INIT_ERROR) {
                    setTimeout(function() {
                        self.destroy();
                    }, 1);
                } else {
                    self.notify('error', message);
                }
            });


            uploader.bind('PostInit', function(up) {
                // all buttons are optional, so they can be disabled and hidden
                if (!self.options.buttons.browse) {
                    self.browse_button.button('disable').hide();
                    up.disableBrowse(true);
                } else {
                    self.browse_button.button('enable');
                }

                if (!self.options.buttons.start) {
                    self.start_button.button('disable').hide();
                }

                if (!self.options.buttons.stop) {
                    self.stop_button.button('disable').hide();
                }

                if (!self.options.unique_names && self.options.rename) {
                    self._enableRenaming();
                }

                if (self.options.dragdrop && up.features.dragdrop) {
                    self.drop_area.addClass('plupload_dropbox');
                }

                self._enableViewSwitcher();

                self.start_button.click(function(e) {
                    if (!$(this).is('.disabled') && !$(this).is(':disabled')) {
                        self.start();
                    }
                    e.preventDefault();
                });

                self.stop_button.click(function(e) {
                    self.stop();
                    e.preventDefault();
                });

                self._trigger('ready', null, { up: up });
            });

            // uploader internal events must run first
            uploader.init();

            uploader.bind('FileFiltered', function(up, file) {
                self._addFiles(file);
            });

            uploader.bind('FilesAdded', function(up, files) {
                self._trigger('selected', null, { up: up, files: files } );

                // re-enable sortable
                if (self.options.sortable && $.fn.sortable) {
                    self._enableSortingList();
                }

                self._trigger('updatelist', null, { filelist: self.content });

                if (self.options.autostart) {
                    // set a little delay to make sure that QueueChanged triggered by the core has time to complete
                    setTimeout(function() {
                        self.start();
                    }, 10);
                }
            });

            uploader.bind('FilesRemoved', function(up, files) {
                // destroy sortable if enabled
                if ($.fn.sortable && self.options.sortable) {
                    self.preview_list.dragsort('destroy');
                    self.preview_thumbs.dragsort('destroy');
                }

                $.each(files, function(i, file) {
                    $('.plupload_file[data-id="' + file.id + '"]').toggle("highlight", function() {
                        $(this).remove();
                    });
                });

                if (up.files.length) {
                    // re-initialize sortable
                    if (self.options.sortable && $.fn.sortable) {
                        self._enableSortingList();
                    }
                } else {
                    setTimeout(function() {
                        self.preview.hide();
                    }, 500);
                }

                self._trigger('updatelist', null, { filelist: self.content });
                self._trigger('removed', null, { up: up, files: files } );
            });

            uploader.bind('QueueChanged StateChanged', function() {
                self._handleState();
            });

            uploader.bind('UploadFile', function(up, file) {
                self._handleFileStatus(file);
            });

            uploader.bind('FileUploaded', function(up, file) {
                self._handleFileStatus(file);
                self._trigger('uploaded', null, { up: up, file: file } );
            });

            uploader.bind('UploadProgress', function(up, file) {
                self._handleFileStatus(file);
                self._updateTotalProgress();
                self._trigger('progress', null, { up: up, file: file } );
            });

            uploader.bind('UploadComplete', function(up, files) {
                self._addFormFields();
                self._trigger('complete', null, { up: up, files: files } );
            });

        },


        _setOption: function(key, value) {
            var self = this;

            if (key == 'buttons' && typeof(value) == 'object') {
                value = $.extend(self.options.buttons, value);

                if (!value.browse) {
                    self.browse_button.button('disable').hide();
                    self.uploader.disableBrowse(true);
                } else {
                    self.browse_button.button('enable').show();
                    self.uploader.disableBrowse(false);
                }

                if (!value.start) {
                    self.start_button.button('disable').hide();
                } else {
                    self.start_button.show();
                    if (self.uploader && self.uploader.files.length) {
                        self.start_button.button('enable');
                    } else {
                        self.start_button.button('disable');
                    }
                }

                if (!value.stop) {
                    self.stop_button.button('disable').hide();
                } else {
                    self.stop_button.button('enable').show();
                }
            }

            self.uploader.settings[key] = value;
        },

        _trigger: function( type, event, data ) {
            type = typeof type == 'string' ? type.toLowerCase() : '';

            var prop, orig,
                callback = this.options[ 'on' + type ];

            data = data || {};
            event = $.Event( event );
            event.type = type;
            // the original event may come from any element
            // so we need to reset the target on the new event
            event.target = this.$element[ 0 ];

            // copy original event properties over to the new event
            orig = event.originalEvent;
            if ( orig ) {
                for ( prop in orig ) {
                    if ( !( prop in event ) ) {
                        event[ prop ] = orig[ prop ];
                    }
                }
            }

            this.$element.trigger( event, data );
            return !( $.isFunction( callback ) &&
            callback.apply( this.$element[0], [ event ].concat( data ) ) === false ||
            event.isDefaultPrevented() );
        },

        /**
         Start upload. Triggers `start` event.

         @method start
         */
        start: function() {
            this.uploader.start();
            this._trigger('start', null, { up: this.uploader });
        },


        /**
         Stop upload. Triggers `stop` event.

         @method stop
         */
        stop: function() {
            this.uploader.stop();
            this._trigger('stop', null, { up: this.uploader });
        },


        /**
         Enable browse button.

         @method enable
         */
        enable: function() {
            this.browse_button.button('enable');
            this.uploader.disableBrowse(false);
        },


        /**
         Disable browse button.

         @method disable
         */
        disable: function() {
            this.browse_button.button('disable');
            this.uploader.disableBrowse(true);
        },


        /**
         Retrieve file by it's unique id.

         @method getFile
         @param {String} id Unique id of the file
         @return {plupload.File}
         */
        getFile: function(id) {
            var file;

            if (typeof id === 'number') {
                file = this.uploader.files[id];
            } else {
                file = this.uploader.getFile(id);
            }
            return file;
        },

        /**
         Return array of files currently in the queue.

         @method getFiles
         @return {Array} Array of files in the queue represented by plupload.File objects
         */
        getFiles: function() {
            return this.uploader.files;
        },


        /**
         Remove the file from the queue.

         @method removeFile
         @param {plupload.File|String} file File to remove, might be specified directly or by it's unique id
         */
        removeFile: function(file) {
            if (plupload.typeOf(file) === 'string') {
                file = this.getFile(file);
            }
            this.uploader.removeFile(file);
        },


        /**
         Clear the file queue.

         @method clearQueue
         */
        clearQueue: function() {
            this.uploader.splice();
        },


        /**
         Retrieve internal plupload.Uploader object (usually not required).

         @method getUploader
         @return {plupload.Uploader}
         */
        getUploader: function() {
            return this.uploader;
        },


        /**
         Trigger refresh procedure, specifically browse_button re-measure and re-position operations.
         Might get handy, when UI Widget is placed within the popup, that is constantly hidden and shown
         again - without calling this method after each show operation, dialog trigger might get displaced
         and disfunctional.

         @method refresh
         */
        refresh: function() {
            this.uploader.refresh();
        },


        /**
         Display a message in notification area.

         @method notify
         @param {Enum} type Type of the message, either `error` or `info`
         @param {String} message The text message to display.
         */
        notify: function(type, message) {
            var popup = $(
                '<div class="plupload_message_layer fade">' +
                    '<div class="alert alert-danger plupload_message">' +
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                        '<i class="fa fa-bug plupload_message_icon"></i>' +
                        '<p class="plupload_message_content">' + message + '</p>' +
                    '</div>' +
                '</div>'
            );

            this.container.append(popup);

            var doRemoveMessage = function() {
                popup.removeClass("in");
                setTimeout(function() {
                    popup.remove();
                }, 200);
            };

            popup
                .find('.close')
                .click(function() {
                    doRemoveMessage();
                })
                .end()
                .click(function(e) {
                    if(!$.contains($(".plupload_message", popup)[0], e.target) && e.target !== $(".plupload_message", popup)[0]) {
                        doRemoveMessage();
                    }
                });

            setTimeout(function() {
                popup.addClass("in");
            }, 200);
        },


        /**
         Destroy the widget, the uploader, free associated resources and bring back original html.

         @method destroy
         */
        destroy: function() {
            // destroy uploader instance
            this.uploader.destroy();

            // unbind all button events
            $('.btn', this.$element).unbind();

            // restore the elements initial state
            this.$element
                .empty()
                .html(this.contents_bak);
            this.contents_bak = '';
        },


        _handleState: function() {
            var up = this.uploader
                , filesPending = up.files.length - (up.total.uploaded + up.total.failed)
                , maxCount = up.getOption('filters').max_file_count || 0
                ;

            if (plupload.STARTED === up.state) {
                $([])
                    .add(this.stop_button)
                    .add('.plupload_started')
                    .removeClass('hidden');

                this.start_button.button('disable');

                if (!this.options.multiple_queues) {
                    this.browse_button.button('disable');
                    up.disableBrowse();
                }
            }
            else if (plupload.STOPPED === up.state) {
                $([])
                    .add(this.stop_button)
                    .add('.plupload_started')
                    .addClass('hidden');

                if (filesPending) {
                    this.start_button.button('enable');
                } else {
                    this.start_button.button('disable');
                }

                // if max_file_count defined, only that many files can be queued at once
                if (this.options.multiple_queues && maxCount && maxCount > filesPending) {
                    this.browse_button.button('enable');
                    up.disableBrowse(false);
                }

                this._updateTotalProgress();
            }

            this.status_bar
                .find('.plupload_total_num')
                .html(up.files.length)
                .end()
                .find('.plupload_total_size')
                .html(plupload.formatSize(up.total.size).toUpperCase())
                .end()
                .find('.plupload_upload_status')
                .html(o.sprintf(_('Uploaded %d/%d files'), up.total.uploaded, up.files.length));

            up.refresh();
        },


        _handleFileStatus: function(file) {
            var $file = $('.plupload_file[data-id="' + file.id + '"]', this.content), actionClass;

            // since this method might be called asynchronously, file row might not yet be rendered
            if (!$file.length) {
                return;
            }

            var $statusText = this.view_mode === 'list' ? $file.find('.plupload_file_status') : $file.find('.plupload_file_status_text');

            $file.find('.close').removeClass('disabled');

            switch (file.status) {
                case plupload.DONE:
                    actionClass = 'plupload_done';
                    if($file.hasClass(actionClass)) break;
                    $statusText.html("已成功上传");
                    break;

                case plupload.FAILED:
                    actionClass = 'plupload_failed';
                    if($file.hasClass(actionClass)) break;
                    $statusText.html("上传失败");
                    break;

                case plupload.QUEUED:
                    actionClass = 'plupload_delete';
                    if($file.hasClass(actionClass)) break;
                    $statusText.html("准备上传");
                    break;

                case plupload.UPLOADING:
                    actionClass = 'plupload_uploading';
                    $file.find('.close').addClass('disabled');
                    if($file.hasClass(actionClass)) break;
                    $statusText.html(file.percent + '%');

                    // scroll uploading file into the view if its bottom boundary is out of it
                    var scroller = this.content
                        , scrollTop = scroller.scrollTop()
                        , scrollerHeight = scroller.height()
                        , rowOffset = $file.position().top + $file.height()
                        ;

                    if (scrollerHeight < rowOffset) {
                        scroller.scrollTop(scrollTop + rowOffset - scrollerHeight);
                    }
                    break;
            }

            // Set file specific progress
            if (file.status == plupload.FAILED) {
                $file
                    .find('.plupload_file_percent')
                    .html('100%')
                    .end()
                    .find('.plupload_file_progress > .progress-bar')
                    .attr('aria-valuenow', 100)
                    .css('width', '100%')
                    .end()
                    .find('.plupload_file_size')
                    .html(plupload.formatSize(file.size));
            } else if(file.status != plupload.QUEUED) {
                $file
                    .find('.plupload_file_percent')
                    .html(file.percent + '%')
                    .end()
                    .find('.plupload_file_progress > .progress-bar')
                    .attr('aria-valuenow', file.percent)
                    .css('width', file.percent + '%')
                    .end()
                    .find('.plupload_file_size')
                    .html(plupload.formatSize(file.size));
            }

            if(actionClass && !$file.hasClass(actionClass)) {
                $file
                    .removeClass(['plupload_done', 'plupload_failed', 'plupload_delete', 'plupload_uploading'].join(' '))
                    .addClass(actionClass);
            }
        },


        _updateTotalProgress: function() {
            var up = this.uploader, totalPercent = 0;

            // Scroll to end of file list
            this.preview[0].scrollTop = this.preview[0].scrollHeight;

            // calculate total progress
            if (up.total.failed || up.total.uploaded) {
                var totalSize = 0, uploadedSize = 0;
                $.each(up.files, function(i, file) {
                    if (file.status != plupload.FAILED) {
                        totalSize += file.origSize;
                        uploadedSize += (file.origSize * file.percent / 100);
                    }
                });
                totalPercent = totalSize > 0 ? (uploadedSize / totalSize * 100) : 0;
            } else {
                totalPercent = up.total.percent;
            }

            this.progressbar
                .find('.progress-bar')
                .attr('aria-valuenow', totalPercent)
                .css('width', totalPercent + '%')
                .removeClass('progress-bar-info progress-bar-success')
                .addClass(totalPercent >= 100 ? 'progress-bar-success' : 'progress-bar-info')
                .end()
                .find('.plupload_total_percent')
                .html(Math.round(totalPercent) + '%');
        },


        _displayThumbs: function() {
            var self = this
                , tw, th // thumb width/height
                , cols
                , num = 0 // number of simultaneously visible thumbs
                , thumbs = [] // array of thumbs to preload at any given moment
                , loading = false
                ;

            if (!this.options.views.thumbs) {
                return;
            }

            function onLast(el, eventName, cb) {
                var timer;

                el && el.on(eventName, function() {
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        clearTimeout(timer);
                        cb();
                    }, 300);
                });
            }


            // calculate number of simultaneously visible thumbs
            function measure() {
                if (!tw || !th) {
                    var wrapper = $('.plupload_file:eq(0)', self.preview_thumbs);
                    tw = wrapper.outerWidth(true);
                    th = wrapper.outerHeight(true);
                }

                var aw = self.content.width(), ah = self.content.height();
                cols = Math.floor(aw / tw);
                num =  cols * (Math.ceil(ah / th) + 1);
            }


            function pickThumbsToLoad() {
                // calculate index of virst visible thumb
                var startIdx = Math.floor(self.content.scrollTop() / th) * cols;
                // get potentially visible thumbs that are not yet visible
                thumbs = $('.plupload_file', self.preview_thumbs)
                    .slice(startIdx, startIdx + num)
                    .filter('.plupload_thumb_toload')
                    .get();
            }


            function init() {
                function mpl() { // measure, pick, load
                    if (self.view_mode !== 'thumbs') {
                        return;
                    }
                    measure();
                    pickThumbsToLoad();
                    lazyLoad();
                }

                if ($.fn.resizable) {
                    onLast(self.container, 'resize', mpl);
                }

                onLast(self.window, 'resize', mpl);
                onLast(self.content, 'scroll',  mpl);

                self.$element.on('viewchanged selected', mpl);

                mpl();
            }


            function preloadThumb(file, cb) {
                var img = new o.Image();

                var $file = $('.plupload_file[data-id="' + file.id + '"]', self.preview_thumbs);

                img.onload = function() {
                    var thumb = $('.plupload_file_thumb', $file);

                    this.embed(thumb[0], {
                        width: self.options.thumb_width,
                        height: self.options.thumb_height,
                        //crop: true,
                        resample: 'bicubic',
                        swf_url: o.resolveUrl(self.options.flash_swf_url || self.uploader.settings.flash_swf_url),
                        xap_url: o.resolveUrl(self.options.silverlight_xap_url || self.uploader.settings.silverlight_xap_url)
                    });
                };

                img.bind("embedded error", function(e) {
                    $file
                        .removeClass('plupload_thumb_loading')
                        .addClass('plupload_thumb_' + e.type)
                    ;
                    this.destroy();
                    setTimeout(cb, 1); // detach, otherwise ui might hang (in SilverLight for example)
                });

                $file
                    .removeClass('plupload_thumb_toload')
                    .addClass('plupload_thumb_loading')
                ;
                img.load(file.getSource());
            }


            function lazyLoad() {
                if (self.view_mode !== 'thumbs' || loading) {
                    return;
                }

                pickThumbsToLoad();
                if (!thumbs.length) {
                    return;
                }

                loading = true;

                preloadThumb(self.getFile($(thumbs.shift()).data('id')), function() {
                    loading = false;
                    lazyLoad();
                });
            }

            // this has to run only once to measure structures and bind listeners
            this.$element.on('selected', function onselected() {
                self.$element.off('selected', onselected);
                init();
            });
        },


        _addFiles: function(files) {
            var self = this, file_html, html = '';

            if (plupload.typeOf(files) !== 'array') {
                files = [files];
            }

            var parseHtml = function(html) {
                var result = '', ext;
                if (!html) return result;
                $.each(files, function(i, file) {
                    ext = o.Mime.getFileExtension(file.name) || 'none';

                    result += html.replace(/\{(\w+)\}/g, function($0, $1) {
                        switch ($1) {
                            case 'thumb_width':
                            case 'thumb_height':
                                return self.options[$1];

                            case 'size':
                                return plupload.formatSize(file.size);

                            case 'ext':
                                return ext;

                            default:
                                return file[$1] || '';
                        }
                    });
                });
                return result;
            };

            var getThumbsFileHtml = function() {
                return (
                    '<li class="plupload_file plupload_delete plupload_thumb_toload" data-id="{id}" style="width:{thumb_width}px;">' +
                        '<div class="plupload_file_thumb" data-file-ext="{ext}" style="width: {thumb_width}px; height: {thumb_height}px; line-height: {thumb_height}px;"></div>' +
                        '<div class="progress plupload_file_progress">' +
                            '<div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0;">' +
                                '<span class="plupload_file_percent sr-only">{percent}</span>' +
                            '</div>' +
                        '</div>' +
                        '<div class="plupload_file_layer">' +
                            '<div class="plupload_file_status">' +
                                '<button type="button" class="close" title="' + _("Remove file") + '"><i class="glyphicon glyphicon-remove-circle"></i></button>' +
                                '<i class="fa fa-spinner fa-spin plupload_file_icon_spin hidden"></i>' +
                                '<span class="plupload_file_status_text">准备上传</span>' +
                            '</div>' +
                            '<div class="plupload_file_info">' +
                                '<h5 class="plupload_file_name" title="{name}">{name}</h5>' +
                                '<em class="plupload_file_size">{size}</em>' +
                            '</div>' +
                        '</div>' +
                        '<div class="plupload_file_fields hidden"></div>' +
                    '</li>'
                );
            };

            var getListFileHtml = function() {
                return (
                    '<li class="plupload_file plupload_delete" data-id="{id}">' +
                        '<div class="pull-right">' +
                            '<span class="plupload_file_size">{size}</span>' +
                            '<span class="plupload_file_status">准备上传</span>' +
                            '<span class="plupload_file_action">' +
                                '<button type="button" class="close" title="' + _("Remove file") + '"><i class="glyphicon glyphicon-remove-circle"></i></button>' +
                                '<i class="fa fa-spinner fa-spin plupload_file_icon_spin hidden"></i>' +
                            '</span>' +
                        '</div>' +
                        '<span class="plupload_file_name">{name}</span>' +
                        '<div class="plupload_file_fields hidden"></div>' +
                    '</li>'
                );
            };

            var files_html = '';

            if (self.options.views.thumbs) {
                files_html = parseHtml(getThumbsFileHtml());
                self.preview_thumbs.append(files_html);

                $(".plupload_file", self.preview_thumbs)
                    .off("mouseover mouseleave")
                    .on("mouseover", function() {
                        $(this).find(".plupload_file_layer").addClass("in");
                    })
                    .on("mouseleave", function() {
                        $(this).find(".plupload_file_layer").removeClass("in");
                    });

            }

            if(self.options.views.list) {
                files_html = parseHtml(getListFileHtml());
                self.preview_list.append(files_html);
            }

            self.preview.is(':hidden') && self.preview.show();

            self.browse_button.removeClass(self.uploader.settings.browse_button_active);

            $(".plupload_file .close", self.preview)
                .off("click.remove")
                .on("click.remove", function(e) {
                    e.preventDefault();
                    self.removeFile($(e.target).closest('.plupload_file').data('id'));
                });
        },


        _addFormFields: function() {
            var self = this;

            // re-add from fresh
            $('.plupload_file_fields', this.preview).html('');

            plupload.each(this.uploader.files, function(file, count) {
                var fields = ''
                    , id = self.id + '_' + count
                    ;

                if (file.target_name) {
                    fields += '<input type="hidden" name="' + id + '_tmpname" value="'+plupload.xmlEncode(file.target_name)+'" />';
                }
                fields += '<input type="hidden" name="' + id + '_name" value="'+plupload.xmlEncode(file.name)+'" />';
                fields += '<input type="hidden" name="' + id + '_status" value="' + (file.status === plupload.DONE ? 'done' : 'failed') + '" />';

                $('.plupload_file[data-id="' + file.id + '"]', this.content).find('.plupload_file_fields').html(fields);
            });

            this.counter.val(this.uploader.files.length);
        },


        _viewChanged: function(view) {
            var self = this;

            this.view_mode = view;

            // update or write a new cookie
            if (this.options.views.remember && $.cookie) {
                $.cookie('plupload_ui_view', view, { expires: 7, path: '/' });
            }

            this.content = this['preview_' + view] || this.preview_thumbs;

            // ugly fix for IE6 - make content area stretchable
            if (o.Env.browser === 'IE' && o.Env.version < 7) {
                this.content.attr('style', 'height:expression(document.getElementById("' + this.id + '_container' + '").clientHeight - ' + (view === 'list' ? 132 : 102) + ')');
            }

            this.container.removeClass('plupload_view_list plupload_view_thumbs').addClass('plupload_view_' + view);
            this._trigger('viewchanged', null, { view: view });

            // update current view file status
            $.each(this.uploader.files, function(i, file) {
                self._handleFileStatus(file)
            });
        },


        _enableViewSwitcher: function() {
            var self = this
                , view
                , switcher = $('.plupload_view_switch', this.container)
                , buttons
                , button
                ;

            plupload.each(['list', 'thumbs'], function(view) {
                if (!self.options.views[view]) {
                    switcher.find('[for="' + self.id + '_view_' + view + '"]').remove();
                }
            });

            // check if any visible left
            buttons = switcher.find('.btn');

            if (buttons.length === 1) {
                switcher.hide();
                view = buttons.eq(0).data('view');
                this._viewChanged(view);
            } else if ($.fn.button && buttons.length > 1) {
                if (this.options.views.remember && $.cookie) {
                    view = $.cookie('plupload_ui_view');
                }

                // if wierd case, bail out to default
                if (!~plupload.inArray(view, ['list', 'thumbs'])) {
                    view = this.options.views.active;
                }


                // active current view
                button = switcher.find('[for="' + self.id + '_view_' + view + '"]');
                button.addClass('active').find('input').prop('checked', true);

                switcher
                    .show()
                    .button()
                    .find('input')
                    .on('change', function(e) {
                        e.preventDefault(); // avoid auto scrolling to widget in IE and FF (see #850)
                        view = $(this).closest('label').data('view');
                        self._viewChanged(view);
                    });

                this._viewChanged(view);
            } else {
                buttons.length > 1 && switcher.show();
                this._viewChanged(this.options.views.active);
            }

            // initialize thumb viewer if requested
            if (this.options.views.thumbs) {
                this._displayThumbs();
            }

            var measureScrollbar = function () {
                var scrollDiv = document.createElement('div');
                scrollDiv.className = 'modal-scrollbar-measure';
                self.container.append(scrollDiv);
                var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
                self.container[0].removeChild(scrollDiv);
                return scrollbarWidth;
            };

            // initialize view list header padding-right
            if (this.options.views.list) {
                $('.plupload_preview_list_header', self.preview_list_wrapper).css('padding-right', measureScrollbar() + 'px');
            }

        },


        _enableRenaming: function() {
            var self = this;

            this.preview.dblclick(function(e) {
                var nameSpan = $(e.target), nameInput, file, parts, name, ext = "";

                if (!nameSpan.hasClass('plupload_file_name_wrapper')) {
                    return;
                }

                // Get file name and split out name and extension
                file = self.uploader.getFile(nameSpan.closest('.plupload_file')[0].id);
                name = file.name;
                parts = /^(.+)(\.[^.]+)$/.exec(name);
                if (parts) {
                    name = parts[1];
                    ext = parts[2];
                }

                // Display input element
                nameInput = $('<input class="plupload_file_rename" type="text" />').width(nameSpan.width()).insertAfter(nameSpan.hide());
                nameInput.val(name).blur(function() {
                    nameSpan.show().parent().scrollLeft(0).end().next().remove();
                }).keydown(function(e) {
                    var nameInput = $(this);

                    if ($.inArray(e.keyCode, [13, 27]) !== -1) {
                        e.preventDefault();

                        // Rename file and glue extension back on
                        if (e.keyCode === 13) {
                            file.name = nameInput.val() + ext;
                            nameSpan.html(file.name);
                        }
                        nameInput.blur();
                    }
                })[0].focus();
            });
        },


        _enableSortingList: function() {
            var self = this;

            if ($('.plupload_file', this.content).length < 2) {
                return;
            }

            // destroy sortable if enabled
            this._disableSortingList();

            // enable
            this.content.dragsort({
                dragSelector: 'li',
                dragBetween: false,
                placeHolderTemplate: '<li class="plupload_file_placeholder"></li>',
                dragEnd: function() {
                    var files = [];

                    $('.plupload_file', self.content).each(function(i) {
                        files[files.length] = self.uploader.getFile($(this).attr('id'));
                    });

                    files.unshift(files.length);
                    files.unshift(0);

                    // re-populate files array
                    Array.prototype.splice.apply(self.uploader.files, files);
                }
            });
        },

        _disableSortingList: function(view) {
            var self = this;

            if(view) {
                self['preview_' + view] && self['preview_' + view].dragsort('destroy');
            } else {
                plupload.each(['list', 'thumbs'], function(view) {
                    self['preview_' + view] && self['preview_' + view].dragsort('destroy');
                });
            }
        }


    };


// jQuery PLUGIN DEFINITION
// ========================

    function Plugin(option) {
        var results = [];
        this.each(function () {
            var $this   = $(this);
            var data    = $this.data('bs.plupload.ui');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('bs.plupload.ui', (data = new pluploadUI(this, options)))

            if (typeof option === 'string') {
                typeof data[option] === "function" && results.push(data[option].call(data));
            } else {
                results.push(data);
            }
        });
        if (results <= 1) {
            return results[0];
        } else {
            return results;
        }
    }

    var old = $.fn.plupload;

    $.fn.plupload             = Plugin;
    $.fn.plupload.Constructor = pluploadUI;


// PLUGIN NO CONFLICT
// ==================

    $.fn.plupload.noConflict = function () {
        $.fn.plupload = old;
        return this;
    }


}));
