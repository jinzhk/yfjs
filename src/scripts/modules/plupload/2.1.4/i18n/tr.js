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

// Turkish (tr)
    plupload.addI18n({
        "Stop Upload": "Yüklemeyi durdur",
        "Upload URL might be wrong or doesn't exist.": "URL yok ya da hatalı olabilir.",
        "tb": "tb",
        "Size": "Boyut",
        "Close": "Kapat",
        "Init error.": "Başlangıç hatası.",
        "Add files to the upload queue and click the start button.": "Dosyaları kuyruğa ekleyin ve başlatma butonuna tıklayın.",
        "Filename": "Dosya adı",
        "Image format either wrong or not supported.": "Resim formatı yanlış ya da desteklenmiyor.",
        "Status": "Durum",
        "HTTP Error.": "HTTP hatası.",
        "Start Upload": "Yüklemeyi başlat",
        "mb": "mb",
        "kb": "kb",
        "Duplicate file error.": "Yinelenen dosya hatası.",
        "File size error.": "Dosya boyutu hatası.",
        "N/A": "-",
        "gb": "gb",
        "Error: Invalid file extension:": "Hata: Geçersiz dosya uzantısı:",
        "Select files": "Dosyaları seç",
        "%s already present in the queue.": "%s kuyrukta zaten mevcut.",
        "File: %s": "Dosya: %s",
        "b": "bayt",
        "Uploaded %d/%d files": "%d/%d dosya yüklendi",
        "Upload element accepts only %d file(s) at a time. Extra files were stripped.": "Yükleme elemanı aynı anda %d dosya kabul eder. Ekstra dosyalar işleme konulmaz.",
        "%d files queued": "Kuyrukta %d dosya var.",
        "File: %s, size: %d, max file size: %d": "Dosya: %s, boyut: %d, maksimum dosya boyutu: %d",
        "Drag files here.": "Dosyaları buraya bırakın.",
        "Runtime ran out of available memory.": "İşlem için yeterli bellek yok.",
        "File count error.": "Dosya sayım hatası.",
        "File extension error.": "Dosya uzantısı hatası.",
        "Error: File too large:": "Hata: Dosya çok büyük:",
        "Add Files": "Dosya ekle"
    });

}));