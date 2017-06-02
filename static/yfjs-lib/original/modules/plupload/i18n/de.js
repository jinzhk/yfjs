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

// German (de)
    plupload.addI18n({
        "Stop Upload": "Hochladen stoppen",
        "Upload URL might be wrong or doesn't exist.": "Upload-URL ist falsch oder existiert nicht.",
        "tb": "TB",
        "Size": "Größe",
        "Close": "Schließen",
        "Init error.": "Initialisierungsfehler",
        "Add files to the upload queue and click the start button.": "Dateien hinzufügen und auf 'Hochladen' klicken.",
        "Filename": "Dateiname",
        "Image format either wrong or not supported.": "Bildformat falsch oder nicht unterstützt.",
        "Status": "Status",
        "HTTP Error.": "HTTP-Fehler",
        "Start Upload": "Hochladen beginnen",
        "mb": "MB",
        "kb": "KB",
        "Duplicate file error.": "Datei bereits hochgeladen",
        "File size error.": "Fehler bei Dateigröße",
        "N/A": "Nicht verfügbar",
        "gb": "GB",
        "Error: Invalid file extension:": "Fehler: Ungültige Dateiendung:",
        "Select files": "Dateien auswählen",
        "%s already present in the queue.": "%s ist bereits in der Warteschlange",
        "File: %s": "Datei: %s",
        "b": "B",
        "Uploaded %d/%d files": "%d/%d Dateien wurden hochgeladen",
        "Upload element accepts only %d file(s) at a time. Extra files were stripped.": "Pro Durchgang können nur %d Datei(en) akzeptiert werden. Überzählige Dateien wurden ignoriert.",
        "%d files queued": "%d Dateien in der Warteschlange",
        "File: %s, size: %d, max file size: %d": "Datei: %s, Größe: %d, maximale Dateigröße: %d",
        "Drag files here.": "Dateien hier hin ziehen.",
        "Runtime ran out of available memory.": "Nicht genügend Speicher verfügbar.",
        "File count error.": "Fehlerhafte Dateianzahl.",
        "File extension error.": "Fehler bei Dateiendung",
        "Error: File too large:": "Fehler: Datei zu groß:",
        "Add Files": "Dateien hinzufügen"
    });

}));