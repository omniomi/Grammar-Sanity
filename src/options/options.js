// Saves options to chrome.storage
function save_options() {
    var accident = document.getElementById('accident').checked;
    var sudden   = document.getElementById('sudden').checked;
    var lego     = document.getElementById('lego').checked;
    var mark     = document.getElementById('mark').checked;
    chrome.storage.sync.set({
        replaceAccident: accident,
        replaceSudden:   sudden,
        replaceLego:     lego,
        markChanged:     mark
    }, function () {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 1000);
    });
}

// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get({
        replaceAccident: true,
        replaceSudden:   true,
        replaceLego:     true,
        markChanged:     true
    }, function (items) {
        document.getElementById('accident').checked = items.replaceAccident;
        document.getElementById('sudden').checked   = items.replaceSudden;
        document.getElementById('lego').checked     = items.replaceLego;
        document.getElementById('mark').checked     = items.markChanged;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);