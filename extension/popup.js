async function getActiveTabURL() {
  const tabs = await chrome.tabs.query({
      currentWindow: true,
      active: true
  });

  return tabs[0].id;
}

function setUpExtension(tabData) {
    let extensionHtml = document.getElementById("extension-popup");
    console.log(tabData);
    // add stars to rating
    extensionHtml.innerHTML = 
    `
    <h3 class="grid-website">MyChronicles</h3>
    <div class="grid-info">
        <p class="grid-info-item">Title: ${tabData[1]}</p>
        <p class="grid-info-item">Chapter: ${tabData[2]}</p>
        <p class="grid-info-item">Rating:</p>
        <p class="grid-info-item">Review:</p> 
        <textarea class="grid-info-textarea" placeholder="Write your review here"></textarea>
        <p class="grid-info-item">Notes:</p>
        <textarea class="grid-info-textarea" placeholder="Write your notes here"></textarea>
    </div>
    <button class="extension-button">To Site</button>
    <button class="extension-button">Update</button>
    <a class="extension-attribution" href="https://www.freepik.com/icon/book_13960454#fromView=search&page=1&position=0&uuid=e497bb06-528d-4a63-9e3d-9a09fdb42d7d">Image Attribution: Icon by HideMaru</a>
    `;
}


// this basically loads the popup.html when the user clicks on the extension icon
// it queries for a valid tabId, if it's present, then the data will load
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
          setUpExtension(data[activeTabId]);
        } else {
            console.log("Not a valid chronicles page or key not found");
        }
    }
  });
});