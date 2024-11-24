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

// DO NOT ADD ASYNC TO THIS LISTENER 
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case "saveDecipheredTabInfo":
            saveDecipheredTabInfo(message, sender, sendResponse);
            break;  
        case "sendToDb":
            sendToDb(message, sender);
            break;
        case "retrieveDecipherMethod":
            console.log("we in background retrieving decipher method");
            retrieveDecipherMethod(message, sender, sendResponse);
            break;
        case "validateUrl":
            validateTabUrl(message, sender, sendResponse);
            break
        default:
            sendResponse("invalid message");
            break;
    }

    return true; // Ensures async sendResponse works properly, to keep message channel open
});

// retrieve the tabId and set it to the tab deciphered info we retrieved
// if user chronicle id does not exist, we request for info
function saveDecipheredTabInfo(message, sender, sendResponse) {
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
}

// send to db what the user has read, if UC has not been retrieved, retrieve it
function sendToDb(message, sender) {
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

// if it's a valid site
// retrieve the decipher method when called from session storage
// if not in session storage, retrieve from db
function retrieveDecipherMethod(message, sender, sendResponse) {
    chrome.storage.session.get([message.domain], (decipherMethod) => {
        console.log(decipherMethod[message.domain]);
        if (decipherMethod[message.domain] == undefined) {
            fetch(`${apiLink}/urls/decipher/${message.domain}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json' // Example: Accept JSON responses
                }
            })
            .then(response => response.json())
            .then(decipherMethodResult => {
                console.log(decipherMethodResult);
                chrome.storage.session.set({[message.domain]: decipherMethodResult})
                sendResponse(decipherMethodResult);
            })
        } else {
            sendResponse(decipherMethod[message.domain]);
        }
    })
}

// retrieve valid urls from session storage
// if not there, call db to retrieve, store result and validate
function validateTabUrl(message, sender, sendResponse) {
    let tabURL = message.tabURL;
    chrome.storage.session.get("validUrls", async (listOfValidURLS) => {
        console.log(listOfValidURLS["validUrls"]);
        if (listOfValidURLS["validUrls"] == undefined) {
            let response = await fetch(`${apiLink}/urls/valid`, {
                method: 'GET'
            });
            
            let urls = await response.json();
            console.log(urls);
            chrome.storage.session.set({"validUrls": urls})
            validURL = matchesUrlRegex(tabURL, urls)
            sendResponse(validURL);
        } else {
            validURL = matchesUrlRegex(tabURL, listOfValidURLS["validUrls"])
            sendResponse(validURL);
        }
    })
}

// Function to check if the URL matches any pattern
function matchesUrlRegex(tabURL, listOfValidURLS) {
    return listOfValidURLS.some(pattern => {
        // Replace wildcard '*' with regex equivalents
        const regexPattern = new RegExp(pattern.replace(/\*/g, '.*'));
        return regexPattern.test(tabURL);
    });
}

// Define the list of URL patterns
const urlPatterns = [
    "https://mangadex.org/chapter*"
];

let matchStatus = {};

// Since websites use SPA, content script won't load even when link changes
// this code is used to detect url changes that match the deciphering we want
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // checks if the page is valid 
    if (changeInfo.url && matchesUrlRegex(changeInfo.url, urlPatterns)) {
        matchStatus[tabId] = true;  // Store match for this specific tabId
    } 
    
    // content script is generally not loaded before changeInfo.status is complete
    // so we wait for that and if it's complete and valid, we send it to the valid one
    // this is only sent to a page with a valid tab ID preventing race conditions
    if (changeInfo.status === 'complete' && matchStatus[tabId]) {
        console.log("sending message to content script for tab", tabId);
        chrome.tabs.sendMessage( tabId, {
            action: "decipherTab"
        })

        delete matchStatus[tabId];
    }
});

/*
A flaw in the code is that it's currently unable to detect changes in title
when there is no changes to url, there is currently a band-aid solution using 
setinterval in content script but when you have the time, here's how to 
implement it:
    - use changeinfo.status to check for pages in title
    - if previous title is invalid such as "Loading - Mangadex" we know that it'll change to a valid one soon so save it as a boolean
        - remember to ignore useless changeinfo.status such as undefined
    - to fix error where url doesn't change but title changes
        - keep track of previous title
        - check if decipherTab action has been sent, if not then set to true
        - if previous title and a valid current title don't match and our 
          decipherTab action hasn't been set, then we send a decipherTab
          action, effectively solving the problem

Ex of flaw: mangadex.org selecting different chapter from menu will not result in url change
but will result in a chapter change with same name, but my script can't identify it
*/