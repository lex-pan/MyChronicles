async function handleLogOut() {
    const logoutResult = await fetch('http://localhost:5172/user/logout', {
        method: 'GET',
        credentials: 'include', // Include cookies with the request
    });
    
    console.log(logoutResult);
}

// in this function when you send a fetch request, you need to send the user cookie
// this way the api can identify which user you are using the credentials: include
async function handleProfileClick() {
    console.log("hello");
  const request = await fetch('http://localhost:5172/user/login-status', {
    method: 'GET',
    credentials: 'include', // Include cookies with the request
  });
  
  const isLoggedIn = await request.text();
  console.log(isLoggedIn);
  if (isLoggedIn == "true") {
    console.log("going to profile");
    // redirect to user-profile
    window.location.href = "/user-profile";
  } else {
    console.log("going to login");
    window.location.href = "/login?toProfile=true";
  }
}