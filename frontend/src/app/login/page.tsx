'use client';

export default function Login() {

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
        body: JSON.stringify({
            "emailOrUsername": usernameOrEmail,
            "password": password
        })
    });

    console.log(loginUserResult);
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
  