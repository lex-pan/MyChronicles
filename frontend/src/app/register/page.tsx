'use client';
import Link from "next/link";
import apiLink from "../utils/apiLink";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Register() {
    const router = useRouter();
    
    async function handleRegistration(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');

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
        
        notify(payload);
        console.log(payload);
        console.log(payload == 'User created');
        if (payload == 'User created') {
            router.back();
        }
    }

    function notify(result: string) {
        switch (result) {
            case 'Invalid email format.':
            case 'Username already in use':
            case 'Passwords must contain between 8-32 characters with at least one uppercase letter, one number, and one non special character':
                toast.error(result);
                break;
            case 'User created':
                toast.success("Account successfully created");
        }
    }

    return ( 
        <>
        <form className="login-page" onSubmit={handleRegistration}>
            <h1>Welcome</h1>
            <textarea placeholder="Username" name="username"></textarea>
            <textarea placeholder="Email" name="email"></textarea>
            <input placeholder="Password" type="password" name="password"></input>
            <button>Register</button> 
            <Link href={"/login?post=profile"} className="loginRegisterSwitch">Have an account? Sign in here.</Link>
        </form>
        <div className="register-requirements">
            <p>*Usernames should be between 3-30 characters</p>
            <p>*Passwords should contain:</p>
            <p className="indent-one">- a number,</p>
            <p className="indent-one">- a uppercase letter</p>
            <p className="indent-one">- a non-alphanumeric character</p>
            <p className="indent-one">- be between 8-32 characters</p>
        </div>
        </>
    );
}