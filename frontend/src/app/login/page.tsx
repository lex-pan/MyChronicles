'use client';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch, useAppStore } from '../../globalRedux/hooks';
import { setLoginStatus } from '@/globalRedux/features/User/UserLoginSlice';

export default function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();

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
            'Content-Type': 'application/json',
            'Accept': 'application/text' // Example: Accept JSON responses
        },
        credentials: 'include',
        body: JSON.stringify({
            "emailOrUsername": usernameOrEmail,
            "password": password
        })
    });
    const username = await loginUserResult.text();

    if (loginUserResult.status == 200) {
      router.back();
    }     

    dispatch(setLoginStatus({username: username, loggedIn: true}));
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
  