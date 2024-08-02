// when setting innherHTML use document.addeventlistener if you want to add functions to elements
const apiLink = 'http://localhost:5172';

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
          "password": password
      })
  });

  const result = await loginUserResult.text();
  // instead of redirecting to user-profile we want to redirect to user-profile/[username] if they came after clicking login
  // otherwise we want to send them to about page for now change to homepage in future

  if (result == "false") {
    let extensionHtml = document.getElementById("extension-popup");
    extensionHtml.innerHTML += `
      <p class="login-result">Username or password invalid</p>
    `;
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
      <button class="extension-button">To Site</button>
      <button class="extension-button">Update</button>
    </div>
    <a class="extension-attribution" href="https://www.freepik.com/icon/book_13960454#fromView=search&page=1&position=0&uuid=e497bb06-528d-4a63-9e3d-9a09fdb42d7d">Image Attribution: Icon by HideMaru</a>
    `;

    if (userChronicleInfo.rating != null) {
      fillStars(userChronicleInfo.rating/5 * 100);
    }

    document.getElementsByClassName("extension-button")[0].addEventListener('click', logout);
    document.getElementsByClassName("extension-button")[2].addEventListener('click', () => {update(tabData)});
    document.getElementsByClassName("rating-div-input")[0].addEventListener('blur', valueCheck);
    document.getElementsByClassName("rating-div-input")[0].addEventListener('input', typeStars);
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
      <textarea placeholder="Username" name="username"></textarea>
      <textarea placeholder="Email" name="email"></textarea>
      <input placeholder="Password" type="password" name="password"></input>
      <button class="register-page-submit">Register</button> 
      <p class="register">Have an account? Sign in here.</p>
    </form>
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
          let extensionHtml = document.getElementById("extension-popup");
          extensionHtml.innerHTML = `
            <h3 class="grid-website">MyChronicles</h3>
            <div class="grid-info">
                <p class="invalid-message">Not a valid page or wait a second because the data might not have loaded</p>
            </div>
            <div class="invalid-options">
              <button class="extension-button">Log Out</button>
              <button class="extension-button">To Site</button>
            </div>
          `;
          document.getElementsByClassName("extension-button")[0].addEventListener('click', logout);
        } else {
          setUpExtension(data[activeTabId]);
        }
    }
  });
}

// this basically loads the popup.html when the user clicks on the extension icon
// it checks if user is logged in, if not the application will present login page
// otherwise, it queries for a valid tabId (check if it's a valid page), if it's present, then the data will load
document.addEventListener("DOMContentLoaded", async () => {
  let loginStatus = await isLoggedIn();

  if (loginStatus == "false") {
    setupLoginPage();
  } else {
    retrieveDataSetUpExtension();
  }
});