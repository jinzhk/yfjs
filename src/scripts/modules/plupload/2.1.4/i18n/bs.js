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

// Bosnian (bs)
    plupload.addI18n({
        "Stop Upload": "Prekini dodavanje",
        "Upload URL might be wrong or doesn't exist.": "URL za dodavanje je neispravan ili ne postoji.",
        "tb": "tb",
        "Size": "Veličina",
        "Close": "Zatvori",
        "Init error.": "Inicijalizacijska greška.",
        "Add files to the upload queue and click the start button.": "Dodajte datoteke u red i kliknite na dugme za pokretanje.",
        "Filename": "Naziv datoteke",
        "Image format either wrong or not supported.": "Format slike je neispravan ili nije podržan.",
        "Status": "Status",
        "HTTP Error.": "HTTP greška.",
        "Start Upload": "Započni dodavanje",
        "mb": "mb",
        "kb": "kb",
        "Duplicate file error.": "Dupla datoteka.",
        "File size error.": "Greška u veličini datoteke.",
        "N/A": "N/A",
        "gb": "gb",
        "Error: Invalid file extension:": "Greška! Neispravan ekstenzija datoteke:",
        "Select files": "Odaberite datoteke",
        "%s already present in the queue.": "%s se već nalazi u redu.",
        "File: %s": "Datoteka: %s",
        "b": "b",
        "Uploaded %d/%d files": "Dodano %d/%d datoteka",
        "Upload element accepts only %d file(s) at a time. Extra files were stripped.": "Dodavanje trenutno dozvoljava samo %d datoteka istovremeno. Dodatne datoteke su uklonjene.",
        "%d files queued": "%d datoteka čeka",
        "File: %s, size: %d, max file size: %d": "Datoteka: %s, veličina: %d, maksimalna veličina: %d",
        "Drag files here.": "Dovucite datoteke ovdje.",
        "Runtime ran out of available memory.": "Nema više dostupne memorije.",
        "File count error.": "Greška u brojanju datoeka.",
        "File extension error.": "Greška u ekstenziji datoteke.",
        "Error: File too large:": "Greška! Datoteka je prevelika:",
        "Add Files": "Dodaj datoteke"
    });

}));