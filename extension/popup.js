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
        <p class="grid-info-item">Title: ${tabData?.[1] ?? "Not Found"}</p>
        <div class="status-div">
            <p class="grid-info-item">Status:</p>
            <select class="status-options">
              <option value="reading">Reading</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
              <option value="dropped">Dropped</option>
              <option value="plan to read">Plan to Read</option>
              <option value="rereading">Rereading</option>
            </select>
        </div>
        <p class="grid-info-item">Episode: ${tabData?.[2] ?? "Not Found"}</p>
        <div class="rating-div">
            <p class="grid-info-item">Rating:</p>
            <input class="rating-div-input" type="number" step="0.5" min="1.0" max="5.0">
            <div class="grid-info-stars-outer"><div class="grid-info-stars-inner"></div></div>
        </div>
        <p class="grid-info-item">Review:</p> 
        <textarea class="grid-info-textarea" placeholder="Write your review here"></textarea>
        <p class="grid-info-item">Notes:</p>
        <textarea class="grid-info-textarea" placeholder="Write your notes here"></textarea>
    </div>
    <button class="extension-button">To Site</button>
    <button class="extension-button">Update</button>
    <a class="extension-attribution" href="https://www.freepik.com/icon/book_13960454#fromView=search&page=1&position=0&uuid=e497bb06-528d-4a63-9e3d-9a09fdb42d7d">Image Attribution: Icon by HideMaru</a>
    `;

    document.getElementsByClassName("rating-div-input")[0].addEventListener('blur', valueCheck);
    document.getElementsByClassName("rating-div-input")[0].addEventListener('input', typeStars);
}

function valueCheck() {
  this.value = Math.round(this.value * 10)/10

  if (this.value < 1) {
    this.value = 1
  }

  if (this.value > 5) {
    this.value = 5
  }
  ratingValue = this.value;
  let starWidth = this.value/5 * 100;

  if (((starWidth - 10) % 20) == 0) {
    starWidth = starWidth - 0.3;
  }

  fillStars(starWidth);
}

function typeStars() {
    let starWidth = this.value/5 * 100;

    if (((starWidth - 10) % 20) == 0) {
      starWidth = starWidth - 0.3;
    }

    fillStars(starWidth);
}

function fillStars(starWidth) {
  let stars = document.getElementsByClassName("grid-info-stars-inner")[0];
  stars.style.width = starWidth + '%';
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