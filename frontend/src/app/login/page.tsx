'use client';

export default function Login() {

  // in this function when you send a fetch request, if login is successful
  // the response will contain a set-cookie header that the browser will automatically set for you
  // you won't be able to access the set cookie header
  // you still need credentials include so that the browser can store the cookie
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const usernameOrEmail = formData.get('usernameOrEmail');
    const password = formData.get('password');

    const loginUserResult = await fetch('http://localhost:5172/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            "emailOrUsername": usernameOrEmail,
            "password": password
        })
    });

    console.log(loginUserResult);
    if (loginUserResult.status == 200) {
      //const cookieHeader = loginUserResult.headers.get('Set-Cookie');
      // Parse the cookie header to get the cookie value
      //const cookieValue = cookieHeader.split(';')[0];
      //console.log(cookieValue);
      // Set the cookie in the client's browser
      // document.cookie = cookieValue;
    } else {
      console.log("sign in failed");
    }
    /*
    setTimeout(async () => {
      const request = await fetch('http://localhost:5172/user/login-status', {
          method: 'GET'
      });

      let loginResult = await request.text();
      console.log(loginResult);
  }, 1000); // Adjust the delay time as needed
    */
  }

  return ( 
    <form className="login-page" onSubmit={handleLogin}>
      <h1>Welcome</h1>
      <textarea placeholder="Username or Email" name="usernameOrEmail"></textarea>
      <input placeholder="Password" type="password" name="password"></input>
      <button>Login</button> 
    </form>
  );
}
  