//runs when popup is loaded
document.addEventListener('DOMContentLoaded', function () {

    //initialize a bookmark if it already doesnt exist
    // chrome.storage.local.get('bookmarkExists', function (result) {
    //     if (!result.bookmarkExists) {
    //         chrome.bookmarks.create({
    //             parentId: '1', // bookmarks bar
    //             title: 'ReVisit',
    //             url: 'https://www.example.com/',
    //         }, (bookmark) => {
    //             console.log('Bookmark created with ID:', bookmark.id);
    //             chrome.storage.local.set({ 'bookmarkId': bookmark.id });
    //         });

    //     }
    // });

    chrome.bookmarks.search({ title: 'ReVisit' }, (results) => {
        let foundBookmark = false;
        for (let i = 0; i < results.length; i++) {
            if (results[i].title === "ReVisit") {
                foundBookmark = true;
                chrome.storage.local.set({ 'bookmarkId': results[i].id });
                break;
            }
        }
        if (!foundBookmark) {
            chrome.bookmarks.create({
                parentId: '1',
                title: 'ReVisit',
                url: 'https://www.example.com/',
            }, (bookmark) => {
                console.log('Bookmark created with ID:', bookmark.id);
                chrome.storage.local.set({ 'bookmarkId': bookmark.id });
            });
        }
    });



    var inputField = document.getElementById('input-field');
    var submitBtn = document.getElementById('submit-btn');
    var text = document.getElementById('text');
    var visitBtn = document.getElementById('visit');
    var clearBtn = document.getElementById('clear');

    const saveCurrentWebsite = () => {
        var inputText = inputField.value;
        console.log('Input text:', inputText);
        if (inputText !== "") {
            chrome.storage.local.set({ 'web': inputText }, function () {
                console.log('Saved in storage: ' + inputText);
            });
        }
    }

    const visitCurrentWebsite = () => {
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

    const clearLocal = () => {
        chrome.storage.local.clear(() => {
            console.log('Extension data cleared.');
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

    clearBtn.addEventListener('click', clearLocal);

    chrome.runtime.onSuspend.addListener(function () {
        // Remove event listeners
        submitBtn.removeEventListener('click', saveCurrentWebsite);
        visitBtn.removeEventListener('click', visitCurrentWebsite);
        clearBtn.removeEventListener('click', clearLocal);
    });





});  