chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.current) {
        var current = message.current;
        console.log('Current value:', current);
        // do something with the current value

        chrome.history.search(
            {
                maxResults: 3,
                text: current
            },
            (results)=>{
                if (results.length > 0) {
                    // get the first result
                    var result = results[0];
                    console.log('Most recent visit:', result.url);
                    // do something with the result
                    sendResponse({ result: result });
                } else {
                    console.log('No results found');
                }
            }
        );
    }

    // Return true to indicate that the response will be sent asynchronously
    return true;
});
