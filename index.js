//runs when popup is loaded
document.addEventListener('DOMContentLoaded', function () {

    //initialize a bookmark if it already doesnt exist
    if (chrome.storage.local.get('bookmarkExists', function (result) {
        if (result.bookmarkExists) {
            return false
        }
    })) {
        chrome.bookmarks.create({
            parentId: '1',
            title: "ReVisit",
            url: undefined
        },
            (bookmark) => {
                console.log('Bookmark created with ID:', bookmark.id);
                chrome.bookmarks.update(bookmark.id, { pinned: true }, function () {
                    console.log('Bookmark pinned!');
                    chrome.storage.local.set({ 'bookmarkExists': true, 'bookmarkId': bookmark.id });
                });
            });
    }


    var inputField = document.getElementById('input-field');
    var submitBtn = document.getElementById('submit-btn');
    var text = document.getElementById('text');
    var visitBtn = document.getElementById('visit');

    function saveCurrentWebsite() {
        var inputText = inputField.value;
        console.log('Input text:', inputText);
        if (inputText !== "") {
            chrome.storage.local.set({ 'web': inputText }, function () {
                console.log('Saved in storage: ' + inputText);
            });
        }
    }

    function visitCurrentWebsite() {
        chrome.storage.local.get('web', function (result) {
            var current = result.web;
            if (current) {
                chrome.runtime.sendMessage({ current: current }, function (response) {
                    var result = response.result;
                    if (result) {
                        chrome.tabs.create({ url: result.url, active: true });
                    } else {
                        console.log('No results found');
                    }
                });
            }
        });
    }


    chrome.storage.local.get('web', function (result) {
        var current = result.web;
        text.innerHTML = `Currently Tracking: ${current}`;

        // send message to background script with the current value
        chrome.runtime.sendMessage({ current: current });
    });

    submitBtn.addEventListener('click', saveCurrentWebsite);

    visitBtn.addEventListener('click', visitCurrentWebsite);

    chrome.runtime.onSuspend.addListener(function () {
        // Remove event listeners
        submitBtn.removeEventListener('click', saveCurrentWebsite);
        visitBtn.removeEventListener('click', visitCurrentWebsite);
    });





});  