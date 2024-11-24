// Note that the appropriate information will not be loaded when the user presses the back key, because the content script is not executed
// when setting innherHTML use document.addeventlistener if you want to add functions to elements
const apiLink = 'http://localhost:5172';

// Define the list of URL patterns
let urlPatterns = [];

async function getActiveTabURL() {
  const tabs = await chrome.tabs.query({
      currentWindow: true,
      active: true
  });

  return tabs[0].id;
}

async function isLoggedIn() {
  const request = await fetch(`${apiLink}/user/login-status`, {
    method: 'GET',
    credentials: 'include', // Include cookies with the request
  });

  let loginResult = await request.text();
  return loginResult;
}

async function logout() {
  const logoutResult = await fetch(`${apiLink}/user/logout`, {
      method: 'GET',
      credentials: 'include', // Include cookies with the request
  });
  
  setupLoginPage();
}

// create a notification div with styling and msg
// add it to the extension bottom and fade after 2 seconds 
function notification(message) {
  let extensionHtml = document.getElementById("extension-popup");
  let notification = document.createElement("div");
  let text = document.createTextNode(message);
  notification.appendChild(text);
  notification.classList.add("notification");
  extensionHtml.appendChild(notification);
  setTimeout(() => {
    extensionHtml.removeChild(notification);
  }, 4000);
}

async function login(event) {
  event.preventDefault();
  const loginForm = document.getElementsByClassName("login-page")[0];
  const usernameOrEmail =  loginForm.childNodes[3].value;
  const password = loginForm.childNodes[5].value;

  const loginUserResult = await fetch(`${apiLink}/user/login`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/text' // Example: Accept JSON responses
      },
      credentials: 'include',
      body: JSON.stringify({
          "emailOrUsername": usernameOrEmail,
          "password": password,
          "speed": "fast"
      })
  });

  const result = await loginUserResult.text();
  // instead of redirecting to user-profile we want to redirect to user-profile/[username] if they came after clicking login
  // otherwise we want to send them to about page for now change to homepage in future
  console.log(loginUserResult.status);
  if (loginUserResult.status != 200) {
    notification(result);
  } else {
    retrieveDataSetUpExtension();
  }
}

async function register(event) {
  event.preventDefault();
  const registerForm = document.getElementsByClassName("login-page")[0];
  const username = registerForm.childNodes[3].value;
  const email = registerForm.childNodes[5].value;
  const password = registerForm.childNodes[7].value;
  const registerUserResult = await fetch(`${apiLink}/user/register`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          "email" : email,
          "username": username,
          "password": password
      })
  });

  const payload = await registerUserResult.text();

  if (registerUserResult.status == 200) {
    setupLoginPage();
    notification("Successfully created account");
  } else {
    notification(payload);
  }
}

function patternMatchUrls() {
  let userInput = this.value;
  let matchingURLS = [];

  for (let i = 0; i < urlPatterns.length; i++) {
    if (urlPatterns[i].includes(userInput)) {
      matchingURLS.push(urlPatterns[i]);
    }
  }

  let displayUrls = document.getElementsByClassName("valid-urls")[0];
  displayUrls.innerHTML = matchingURLS.map((url) => {
    return `<li>${url}</li>`;
  }).join('');

}

function setUpExtension(tabData) {
    let extensionHtml = document.getElementById("extension-popup");
    let urlInfo = tabData.message;
    let userChronicleInfo = tabData.userChronicleData;
    console.log(userChronicleInfo);
    // add stars to rating
    extensionHtml.innerHTML = 
    `
    <h3 class="grid-website">MyChronicles</h3>
    <div class="grid-info">
        <p class="grid-info-item">Title: ${urlInfo?.[1] ?? "Not Found"}</p>
        <div class="status-div">
            <p class="grid-info-item">Status:</p>
            <select class="status-options" value=${userChronicleInfo.status ?? "Reading"}>
              <option value="Reading">Reading</option>
              <option value="Completed">Completed</option>
              <option value="Paused">Paused</option>
              <option value="Dropped">Dropped</option>
              <option value="Plan to Read">Plan to Read</option>
              <option value="Rereading">Rereading</option>
              <option value="">-</option>
            </select>
        </div>
        <p class="grid-info-item">Episode: ${urlInfo?.[2] ?? "Not Found"}</p>
        <div class="rating-div">
            <p class="grid-info-item">Rating:</p>
            <input class="rating-div-input" type="number" step="0.5" min="1.0" max="5.0" value=${userChronicleInfo.rating ?? ""}>
            <div class="grid-info-stars-outer"><div class="grid-info-stars-inner"></div></div>
        </div>
        <p class="grid-info-item">Review:</p> 
        <textarea class="grid-info-textarea" placeholder="Write your review here">${userChronicleInfo.review ?? ""}</textarea>
        <p class="grid-info-item">Notes:</p>
        <textarea class="grid-info-textarea" placeholder="Write your notes here">${userChronicleInfo.notes ?? ""}</textarea>
    </div>
    <div class="extension-options">
      <button class="extension-button">Log Out</button>
      <a href="https://my-chronicles.net/" target="_blank" class="extension-button button-link">To Site</a>
      <button class="extension-button">Update</button>
    </div>
    <a class="extension-attribution" href="https://www.freepik.com/icon/book_13960454#fromView=search&page=1&position=0&uuid=e497bb06-528d-4a63-9e3d-9a09fdb42d7d">Image Attribution: Icon by HideMaru</a>
    <div id="notification"></div>
    `;

    if (userChronicleInfo.rating != null) {
      fillStars(userChronicleInfo.rating/5 * 100);
    }

    document.getElementsByClassName("extension-button")[0].addEventListener('click', logout);  // logs user out
    document.getElementsByClassName("extension-button")[2].addEventListener('click', () => {update(tabData)});  // updates 
    document.getElementsByClassName("rating-div-input")[0].addEventListener('blur', valueCheck); // ensures that rating is valid and fills stars
    document.getElementsByClassName("rating-div-input")[0].addEventListener('input', typeStars); // also fills stars
}

async function update(tabData) {
  let userChronicleInfo = tabData.userChronicleData;
  const extensionInfo = document.getElementsByClassName("grid-info")[0];
  const status = extensionInfo.childNodes[3].childNodes[3].value;
  const rating = extensionInfo.childNodes[7].childNodes[3].value;
  const review = extensionInfo.childNodes[11].value;
  const notes = extensionInfo.childNodes[15].value;
  console.log(rating);
  const updateUserChronicle = await fetch(`${apiLink}/user/manual-extension-update`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
        "chronicle_id" : userChronicleInfo.book_id,
        "status": status,
        "rating": rating,
        "review": review,
        "notes": notes
    })
  });

  console.log(review);

  tabData.userChronicleData.status = status;
  tabData.userChronicleData.rating = rating;
  tabData.userChronicleData.review = review;
  tabData.userChronicleData.notes = notes;

  const activeTabId = await getActiveTabURL();
  chrome.storage.session.set({ [activeTabId.toString()]: {message: tabData.message, userChronicleData: tabData.userChronicleData} }).then(() => {
    console.log("Value was set");
  });

}

function valueCheck() {
  this.value = Math.round(this.value * 10)/10

  if (this.value < 1) {
    this.value = 1
  }

  if (this.value > 5) {
    this.value = 5
  }

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

function setupLoginPage() {
  let extensionHtml = document.getElementById("extension-popup");
  extensionHtml.innerHTML = `
    <h3 class="grid-website">MyChronicles</h3>
    <form class="login-page">
      <h1>Welcome</h1>
      <textarea placeholder="Username or Email" name="usernameOrEmail"></textarea>
      <input placeholder="Password" type="password" name="password"></input>
      <button type="submit" class="login-page-submit">Login</button> 
      <p class="register">Don't have an account? Sign up here.</p>
    </form>
    <div id="notification"></div>
  `;

  document.getElementsByClassName("login-page-submit")[0].addEventListener('click', login);
  document.getElementsByClassName("register")[0].addEventListener('click', setUpRegisterPage);
}

function setUpRegisterPage() {
  let extensionHtml = document.getElementById("extension-popup");
  extensionHtml.innerHTML = `
    <h3 class="grid-website">MyChronicles</h3>
    <form class="login-page">
      <h1>Welcome</h1>
      <textarea placeholder="Username (3-30 characters)" name="username"></textarea>
      <textarea placeholder="Email" name="email"></textarea>
      <input placeholder="Password" type="password" name="password"></input>
      <button class="register-page-submit">Register</button> 
      <p class="register">Have an account? Sign in here.</p>
    </form>
    <div id="notification"></div>
  `;

  document.getElementsByClassName("register-page-submit")[0].addEventListener('click', register);
  document.getElementsByClassName("register")[0].addEventListener('click', setupLoginPage);
}

async function retrieveDataSetUpExtension() {
  const activeTabId = await getActiveTabURL();

  chrome.storage.session.get(activeTabId.toString(), function(data) {
    if (chrome.runtime.lastError) {
        console.error("Error retrieving data from storage:", chrome.runtime.lastError);
    } else {
        // Check if the key exists in the retrieved data
        if (data[activeTabId] === undefined) {
          setupInvalidPage();
        } else {
          setUpExtension(data[activeTabId]);
        }
    }
  });
}

function setupInvalidPage() {
  let extensionHtml = document.getElementById("extension-popup");

  extensionHtml.innerHTML = `
    <h3 class="grid-website">MyChronicles</h3>
    <div class="grid-info">
      <div class="invalid-page-container">
        <h4 class="margin-bottom">Invalid page or refresh</h4>
        <p>Look for your domain here:</p>
        <p>(If it appears, the site is supported)</p>
        <input type="text" class="search-urls margin-bottom">
        <p>Your URL should match the following regex:</p>
        <ul class="valid-urls"></ul>
        <p>Valid URL's not checked since it'd</p>
        <p>be displayed instead of this page</p>
      </div>
    </div>
    <div class="invalid-options">
      <button class="extension-button">Log Out</button>
      <a href="https://my-chronicles.net/" target="_blank" class="extension-button button-link">To Site</a>
    </div>
    <div id="notification"></div>
  `;
  document.getElementsByClassName("extension-button")[0].addEventListener('click', logout);
  document.getElementsByClassName("search-urls")[0].addEventListener('input', patternMatchUrls);
  
  let displayUrls = document.getElementsByClassName("valid-urls")[0];
  displayUrls.innerHTML = urlPatterns.map((url) => {
    return `<li>${url}</li>`;
  }).join('');
}

function setupErrorPage() {
  let extensionHtml = document.getElementById("extension-popup");
  extensionHtml.innerHTML = `
    <h3 class="grid-website">MyChronicles</h3>
    <div class="grid-info">
      <div class="error-div"><p class="error-text">Seems like the API is down :(</p></div>
    </div>
  `;
}

// have to put this function here since chrome.runtime.sendMessage wouldn't fricking work
async function retrieveValidUrls() {
  return new Promise((resolve, reject) => {
      chrome.storage.session.get("validUrls", async (listOfValidURLS) => {
          console.log(listOfValidURLS["validUrls"]);
          if (listOfValidURLS["validUrls"] == undefined) {
              let response = await fetch(`${apiLink}/urls/valid`, {
                  method: 'GET'
              });
              
              let urls = await response.json();
              console.log(urls);
              chrome.storage.session.set({"validUrls": urls})
              resolve(urls);
          } else {
              resolve(listOfValidURLS["validUrls"]);
          }
      })
  })
}

// for handling race conditions, where user presses popup before data loads 
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type == "saveDecipheredTabInfo") {
    let senderID = sender.tab.id;
    let currentTabID = await getActiveTabURL();
    console.log("try to update");
    console.log(senderID);
    console.log(currentTabID);
    if (senderID == currentTabID) {
      retrieveDataSetUpExtension();
    }
  }
});

// this basically loads the popup.html when the user clicks on the extension icon
// it checks if user is logged in, if not the application will present login page
// otherwise, it queries for a valid tabId (check if it's a valid page), if it's present, then the data will load
document.addEventListener("DOMContentLoaded", async () => {
  let loginStatus = "false";
  try {
    loginStatus = await isLoggedIn();
  } catch {
    setupErrorPage();
    return 
  }

  urlPatterns = await retrieveValidUrls();
  console.log(urlPatterns);

  if (loginStatus == "false") {
    setupLoginPage();
  } else {
    retrieveDataSetUpExtension();
  }
});