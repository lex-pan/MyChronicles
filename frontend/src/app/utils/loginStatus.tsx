export async function loginStatus() {
    const request = await fetch('http://localhost:5172/user/login-status', {
        method: 'GET'
    });
    
    let loginResult = await request.text();
    console.log(loginResult);
}