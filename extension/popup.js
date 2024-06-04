// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "FROM_BACKGROUND") {
      console.log("Message received in popup:", request.message);
      document.getElementById('response').innerText = request.message;
    }
  });