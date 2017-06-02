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

// Georgian (ka)
    plupload.addI18n({
        "Stop Upload": "ატვირთვის შეჩერება",
        "Upload URL might be wrong or doesn't exist.": "ატვირთვის მისამართი არასწორია ან არ არსებობს.",
        "tb": "ტბ",
        "Size": "ზომა",
        "Close": "დავხუროთ",
        "Init error.": "ინიციალიზაციის შეცდომა.",
        "Add files to the upload queue and click the start button.": "დაამატეთ ფაილები და დააჭირეთ ღილაკს - ატვირთვა.",
        "Filename": "ფაილის სახელი",
        "Image format either wrong or not supported.": "ფაილის ფორმატი არ არის მხარდაჭერილი ან არასწორია.",
        "Status": "სტატუსი",
        "HTTP Error.": "HTTP შეცდომა.",
        "Start Upload": "ატვირთვა",
        "mb": "მბ",
        "kb": "კბ",
        "Duplicate file error.": "ესეთი ფაილი უკვე დამატებულია.",
        "File size error.": "ფაილის ზომა დაშვებულზე დიდია.",
        "N/A": "N/A",
        "gb": "გბ",
        "Error: Invalid file extension:": "შეცდომა: ფაილს აქვს არასწორი გაფართოება.",
        "Select files": "ფაილების მონიშვნა",
        "%s already present in the queue.": "%s უკვე დამატებულია.",
        "File: %s": "ფაილი: %s",
        "b": "ბ",
        "Uploaded %d/%d files": "ატვირთულია %d/%d ფაილი",
        "Upload element accepts only %d file(s) at a time. Extra files were stripped.": "ერთდროულად დაშვებულია მხოლოდ %d ფაილის დამატება.",
        "%d files queued": "რიგშია %d ფაილი",
        "File: %s, size: %d, max file size: %d": "ფაილი: %s, ზომა: %d, მაქსიმალური დაშვებული ზომა: %d",
        "Drag files here.": "ჩააგდეთ ფაილები აქ.",
        "Runtime ran out of available memory.": "ხელმისაწვდომი მეხსიერება გადაივსო.",
        "File count error.": "აღმოჩენილია ზედმეტი ფაილები.",
        "File extension error.": "ფაილის ფორმატი დაშვებული არ არის.",
        "Error: File too large:": "შეცდომა: ფაილი ზედმეტად დიდია.",
        "Add Files": "დაამატეთ ფაილები"
    });

}));