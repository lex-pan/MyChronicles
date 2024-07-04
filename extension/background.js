// to get chrome.storage.session, use the following command
// chrome.storage.session.get(null, function(data) { console.log(data); })
const apiLink = 'http://localhost:5172';

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
        chrome.storage.session.set({ [tabId.toString()]: {message: message.message, userChronicleId: message.userChronicleId} }).then(() => {
            console.log("Value was set");
          });
        
        chrome.storage.session.get(console.log)
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "decipherUrlMethod") {
        const urlOrigin = getOrigin(message.message);
        
        chrome.storage.session.get(urlOrigin, function(data) {
            console.log(data);
            if (chrome.runtime.lastError) {
                console.error("Error retrieving data from storage:", chrome.runtime.lastError);
            } else {
                // Check if the key exists in the retrieved data
                if (data[urlOrigin] === undefined) {
                    const raw_response = fetch(`${apiLink}/urls/${urlOrigin}`)
                    .then(response => response.json())
                    .then(website_parse_info => 
                        {
                            console.log(website_parse_info);
                            chrome.storage.session.set({[urlOrigin]: website_parse_info})
                            sendResponse(website_parse_info);
                        })
                    .catch(error => sendResponse({error: error.toString()}))
                } else {
                    sendResponse(data[urlOrigin]);
                }
            }
          })
        
        // return true is required to send a message back because it tells chrome that the message will be sent later 
        return true;
    }
}); 

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "sendToDb") {
        const raw_response = fetch(`${apiLink}/user/automatic-update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/text' // Example: Accept JSON responses
            },
            credentials: 'include',
            body: JSON.stringify({
                "title": message.title,
                "chapter": message.chapter,
                "url": message.tabURL,
                "entertainment_category": message.entertainment_category
            })
        })
        .then(response => response.json())
        .then(userChronicleId => {
            console.log(userChronicleId);
            sendResponse(userChronicleId);
        })
        .catch(error => sendResponse({error: error.toString()}))
    }

    return true;
});

function getOrigin(tabURL) {
    const start = tabURL.indexOf("//")+2;
    const end = tabURL.indexOf("/", start);
    const origin = tabURL.substring(start, end);
    return origin
}