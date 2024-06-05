// to get chrome.storage.session, use the following command
// chrome.storage.session.get(null, function(data) { console.log(data); })

// we want to remove entries that are no longer relevant (the user closed the page, or moved to the next chapter/episode for example)
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    chrome.storage.session.remove(tabId.toString(), function(){
        var error = chrome.runtime.lasterror;
        if (error) {
            console.error(error);
        }
    });

});

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.type === "saveToSessionStorage") {
        const tabId = sender.tab.id;
        chrome.storage.session.set({ [tabId.toString()]: message.message }).then(() => {
            console.log("Value was set");
          });
        
        chrome.storage.session.get(console.log)
    }

});