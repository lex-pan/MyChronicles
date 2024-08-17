'use client';
import { redirect, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch, useAppStore } from '../../globalRedux/hooks';
import { login } from '@/globalRedux/features/User/UserChroniclesSlice';
import Link from 'next/link';
import apiLink from '@/app/utils/apiLink';
import { useSearchParams } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  // in this function when you send a fetch request, if login is successful
  // the response will contain a set-cookie header that the browser will automatically set for you
  // you won't be able to access the set cookie header
  // you still need credentials include so that the browser can store the cookie
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const usernameOrEmail = formData.get('usernameOrEmail');
    const password = formData.get('password');

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
            "speed": "slow"
        })
    });
    
    const userInfo = await loginUserResult.json();
    console.log(userInfo);


    if (loginUserResult.status == 200) {
      dispatch(login({username: userInfo.username, userChronicles: userInfo.userChronicles}));
      const postLogin = searchParams.get('post');
      console.log(postLogin);
      if (postLogin == 'profile') {
        router.push(`/user-profile/${userInfo.username}`);
      } else {
        router.back();
      }
    }  else {
      // display error message
    }
  }

  return ( 
    <form className="login-page" onSubmit={handleLogin}>
      <h1>Welcome</h1>
      <textarea placeholder="Username or Email" name="usernameOrEmail"></textarea>
      <input placeholder="Password" type="password" name="password"></input>
      <button>Login</button> 
      <Link href={"/register"} className="loginRegisterSwitch">Don&apos;t have an account? Register here.</Link>
    </form>
  );
}
  