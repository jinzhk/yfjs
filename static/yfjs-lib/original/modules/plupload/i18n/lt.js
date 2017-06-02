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

// Lithuanian (lt)
    plupload.addI18n({
        "Stop Upload": "Stabdyti įkėlimą",
        "Upload URL might be wrong or doesn't exist.": "Klaidinga arba neegzistuojanti įkėlimo nuoroda.",
        "tb": "tb",
        "Size": "Dydis",
        "Close": "Uždaryti",
        "Init error.": "Įkrovimo klaida.",
        "Add files to the upload queue and click the start button.": "Pridėkite bylas į įkėlimo eilę ir paspauskite starto mygtuką.",
        "Filename": "Bylos pavadinimas",
        "Image format either wrong or not supported.": "Paveiksliuko formatas klaidingas arba nebepalaikomas.",
        "Status": "Statusas",
        "HTTP Error.": "HTTP klaida.",
        "Start Upload": "Pradėti įkėlimą",
        "mb": "mb",
        "kb": "kb",
        "Duplicate file error.": "Pasikartojanti byla.",
        "File size error.": "Netinkamas bylos dydis.",
        "N/A": "N/A",
        "gb": "gb",
        "Error: Invalid file extension:": "Klaida: Netinkamas bylos plėtinys:",
        "Select files": "Žymėti bylas",
        "%s already present in the queue.": "%s jau yra eilėje.",
        "File: %s": "Byla: %s",
        "b": "b",
        "Uploaded %d/%d files": "Įkelta bylų: %d/%d",
        "Upload element accepts only %d file(s) at a time. Extra files were stripped.": "Vienu metu galima įkelti tik %d bylas(ų). Papildomos bylos buvo pašalintos.",
        "%d files queued": "%d bylų eilėje",
        "File: %s, size: %d, max file size: %d": "Byla: %s, dydis: %d, galimas dydis: %d",
        "Drag files here.": "Padėti bylas čia.",
        "Runtime ran out of available memory.": "Išeikvota darbinė atmintis.",
        "File count error.": "Netinkamas bylų kiekis.",
        "File extension error.": "Netinkamas pletinys.",
        "Error: File too large:": "Klaida: Byla per didelė:",
        "Add Files": "Pridėti bylas"
    });

}));