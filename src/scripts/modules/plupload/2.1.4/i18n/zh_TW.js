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

// Chinese (Taiwan) (zh_TW)
    plupload.addI18n({
        "Stop Upload": "停止上傳",
        "Upload URL might be wrong or doesn't exist.": "檔案URL可能有誤或者不存在。",
        "tb": "tb",
        "Size": "大小",
        "Close": "關閉",
        "Init error.": "初始化錯誤。",
        "Add files to the upload queue and click the start button.": "將檔案加入上傳序列，然後點選”開始上傳“按鈕。",
        "Filename": "檔案名稱",
        "Image format either wrong or not supported.": "圖片格式錯誤或者不支援。",
        "Status": "狀態",
        "HTTP Error.": "HTTP 錯誤。",
        "Start Upload": "開始上傳",
        "mb": "mb",
        "kb": "kb",
        "Duplicate file error.": "錯誤：檔案重複。",
        "File size error.": "錯誤：檔案大小超過限制。",
        "N/A": "N/A",
        "gb": "gb",
        "Error: Invalid file extension:": "錯誤：不接受的檔案格式:",
        "Select files": "選擇檔案",
        "%s already present in the queue.": "%s 已經存在目前的檔案序列。",
        "File: %s": "檔案: %s",
        "b": "b",
        "Uploaded %d/%d files": "已上傳 %d/%d 個文件",
        "Upload element accepts only %d file(s) at a time. Extra files were stripped.": "每次只能上傳 %d 個檔案，超過限制數量的檔案將被忽略。",
        "%d files queued": "%d 個檔案加入到序列",
        "File: %s, size: %d, max file size: %d": "檔案: %s, 大小: %d, 檔案大小上限: %d",
        "Drag files here.": "把檔案拖曳到這裡。",
        "Runtime ran out of available memory.": "執行時耗盡了所有可用的記憶體。",
        "File count error.": "檔案數量錯誤。",
        "File extension error.": "檔案副檔名錯誤。",
        "Error: File too large:": "錯誤: 檔案大小太大:",
        "Add Files": "增加檔案"
    });

}));