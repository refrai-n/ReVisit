
//Runs when a new message is received from index.j
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.current) {
        var current = message.current;
        console.log('Currently value :', current);
        // do something with the current value

        chrome.history.search(
            {
                maxResults: 3,
                text: current
            },
            (results) => {
                if (results.length > 0) {
                    // get the first result
                    var result = results[0];
                    console.log('Most recent visit:', result.url , typeof result.url);
                    // do something with the result
                    sendResponse({ result: result });
                } else {
                    console.log('No results found');
                }

                chrome.storage.local.get('bookmarkId', function (result) {
                    const bookmarkId = result.bookmarkId
                    chrome.bookmarks.update(bookmarkId,
                    { url: result.url},
                    ()=>{
                        console.log('Bookmark updated!');
                    }
                )

                });
                
            
            }
        );

        
    }
    // Return true to indicate that the response will be sent asynchronously
    return true;
});

