// we want to remove entries that are no longer relevant (the user closed the page, or moved to the next chapter/episode for example)
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    // 
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.url) {
        // The URL of the tab has changed
        console.log('URL of tab ' + tabId + ' has changed to ' + changeInfo.url);
    }
});