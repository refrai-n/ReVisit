document.addEventListener('DOMContentLoaded', function () {
    var inputField = document.getElementById('input-field');
    var submitBtn = document.getElementById('submit-btn');
    var text = document.getElementById('text');
    var visitBtn = document.getElementById('visit');
    chrome.storage.local.get('web', function (result) {
        var current = result.web;
        text.innerHTML = `Currently Tracking: ${current}`;
    });

    submitBtn.addEventListener('click', function () {
        var inputText = inputField.value;
        console.log('Input text:', inputText);
        if (inputText !== "") {
            chrome.storage.local.set({ 'web': inputText }, function () {
                console.log('Saved in storage: ' + inputText);
            });
        }
    });

    visitBtn.addEventListener('click', function () {
        chrome.storage.local.get('web', function (result) {
            var current = result.web;
            if (current) {
                chrome.tabs.create({url: `http://${current}.com`, active: true });
            }
        });
    });
    

});