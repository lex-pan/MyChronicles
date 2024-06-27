export async function loginStatus() {
    const request = await fetch('http://localhost:5172/user/login-status', {
        method: 'GET',
        credentials: 'include', // Include cookies with the request
    });
    
    let loginResult = await request.text();
    console.log(loginResult);
}