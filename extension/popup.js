async function getActiveTabURL() {
  const tabs = await chrome.tabs.query({
      currentWindow: true,
      active: true
  });

  return tabs[0].id;
}

document.addEventListener("DOMContentLoaded", async () => {
  const activeTabId = await getActiveTabURL();
  console.log(activeTabId); 
  
  chrome.storage.session.get(activeTabId.toString(), function(data) {
    if (chrome.runtime.lastError) {
        console.error("Error retrieving data from storage:", chrome.runtime.lastError);
    } else {
        console.log(data[activeTabId]);
        // Check if the key exists in the retrieved data
        if (data != null) {
          const extensionBody = document.getElementById("extension-popup");
          extensionBody.innerHTML = `<div> ${data[activeTabId]} </div>`;
        } else {
            console.log("Not a valid chronicles page or key not found");
        }
    }
  });
});