'use client';
export default function Register() {
    
    async function handleRegistration(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');

        const registerUserResult = await fetch('http://localhost:5172/user/register', {
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

        // const payload = await registerUserResult.text();

        console.log(registerUserResult);
    }

    return ( 
      <form className="login-page" onSubmit={handleRegistration}>
        <h1>Welcome</h1>
        <textarea placeholder="Username" name="username"></textarea>
        <textarea placeholder="Email" name="email"></textarea>
        <input placeholder="Password" type="password" name="password"></input>
        <button>Register</button> 
      </form>
    );
}
  