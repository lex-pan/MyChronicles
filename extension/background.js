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

// retrieve the tabId and set it to the tab deciphered info we retrieved
// if user chronicle id does not exist, we request for info
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "saveDecipheredTabInfo") {
        const tabId = sender.tab.id;

        // if tab doesn't already exist we want to return a msg saying we require the user chronicle since this is first load so user chronicle has never been retrieved
        // if the title changes, we know that the user has moved on to a new chronicle in the same tab so we know that User Chronicle has also not been retrieved yet 
        // if tab exists we just return the fact we already have user chronicle
        // save deciphered tab data and keep user chronicle data 
        chrome.storage.session.get([tabId.toString()], (tabData) => {
            let currentData = tabData[tabId.toString()]; // Use an empty object if no data exists
            let UCretrieved = false;
            let updatedData = {};
            // we know there user chronicle data exists
            console.log(message.decipheredTabInfo);
            if (currentData != undefined && message.decipheredTabInfo[1] == currentData.message[1]) {
                console.log(currentData.message);
                UCretrieved = true;
                updatedData = {message: message.decipheredTabInfo, userChronicleData: currentData.userChronicleData}
            } else {
                updatedData = {message: message.decipheredTabInfo, userChronicleData: {retrieved: false}}
            }

            chrome.storage.session.set({ [tabId.toString()]: updatedData }).then(() => {
                console.log("Value was set");
            });

            sendResponse({UCretrieved: UCretrieved});
        });
        
        // indicates we are sending a message back, is required 
        return true;
    }
});

/*
    chrome.runtime.sendMessage(
        {
            type: "sendToDb", 
            tabURL: result[0], 
            title: result[1], 
            chapter: result[2], 
            entertainment_category: result[3], 
            UCretrieved: UCretrieved
        });
*/

// send to db what the user has read, if UC has not been retrieved, retrieve it
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
                "entertainment_category": message.entertainment_category,
                "UCretrieved": message.UCretrieved
            })
        })
        .then(response => response.json())
        .then(userChronicleData => {
            const tabId = sender.tab.id;

            console.log(userChronicleData);
            chrome.storage.session.get([tabId.toString()], (tabData) => {
                let currentData = tabData[tabId.toString()]; // Use an empty object if no data exists
                let updatedData;

                if (currentData == undefined) {
                    console.log("data wasn't saved to this tab ID")
                } else {
                    // updatedData = {message: message.decipheredTabInfo, userChronicleData: {retrieved: false}}
                    updatedData = {message: currentData.message, userChronicleData: userChronicleData}

                    chrome.storage.session.set({ [tabId.toString()]: updatedData }).then(() => {
                        console.log("UC data has been set");
                    });
                }
            });
        })
    }

    return true;
});