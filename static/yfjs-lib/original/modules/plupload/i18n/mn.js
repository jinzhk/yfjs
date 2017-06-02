(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['plupload'], factory);
    } else if(typeof exports === 'object' && typeof module !== 'undefined') {
        var plupload;
        try {
            plupload = require('plupload');
        } catch (err) {
            plupload = root.plupload;
        }
        if (!plupload) throw new Error('plupload dependency not found');
        module.exports = factory(plupload);
    } else {
        if (!root.plupload) throw new Error('plupload dependency not found');
        factory(root.plupload);
    }
}(this, function(plupload) {

// Mongolian (mn)
    plupload.addI18n({
        "Stop Upload": "",
        "Upload URL might be wrong or doesn't exist.": "",
        "tb": "",
        "Size": "",
        "Close": "",
        "Init error.": "",
        "Add files to the upload queue and click the start button.": "",
        "Filename": "",
        "Image format either wrong or not supported.": "",
        "Status": "",
        "HTTP Error.": "",
        "Start Upload": "",
        "mb": "",
        "kb": "",
        "Duplicate file error.": "",
        "File size error.": "",
        "N/A": "",
        "gb": "",
        "Error: Invalid file extension:": "",
        "Select files": "",
        "%s already present in the queue.": "",
        "File: %s": "",
        "b": "",
        "Uploaded %d/%d files": "",
        "Upload element accepts only %d file(s) at a time. Extra files were stripped.": "",
        "%d files queued": "",
        "File: %s, size: %d, max file size: %d": "",
        "Drag files here.": "",
        "Runtime ran out of available memory.": "",
        "File count error.": "",
        "File extension error.": "",
        "Error: File too large:": "",
        "Add Files": ""
    });

}));