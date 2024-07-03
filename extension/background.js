// to get chrome.storage.session, use the following command
// chrome.storage.session.get(null, function(data) { console.log(data); })
const apiLink = 'http://localhost:5172/urls';

// we want to remove entries that are no longer relevant (the user closed the page for example)
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "decipherUrlMethod") {
        const urlOrigin = getOrigin(message.message);
        const raw_response = fetch(`${apiLink}/${urlOrigin}`)
            .then(response => response.json())
            .then(website_parse_info => sendResponse(website_parse_info))
            .catch(error => sendResponse({error: error.toString()}))
        
        console.log(raw_response);

        // return true is required to send a message back because it tells chrome that the message will be sent later 
        return true;
    }
}); 

function getOrigin(tabURL) {
    const start = tabURL.indexOf("//")+2;
    const end = tabURL.indexOf("/", start);
    const origin = tabURL.substring(start, end);
    return origin
}

chrome.runtime.onMessage.addListener((message, sender) => {
    
});