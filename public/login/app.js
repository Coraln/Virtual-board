//document.addEventListener('DOMContentLoaded', () => {

//CLIENT-SIDE SCRIPT, THAT SENDS MESSAGES TO AND RECIEVES FROM SERVER
console.log("Start of app.js");


















async function logIn() {
    console.log("logIn function called");
    try {
        const res = await fetch('http://localhost:3030/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: document.querySelector('#email').value,
                password: document.querySelector('#password').value
            })
        });

        const resJson = await res.json();

        console.log('Server Response:', resJson);

        if (resJson.ok) {
            // Login successful, do something with the data
            console.log('Login successful', data);
        } else {
            // Login failed, handle error
            console.error('Login failed', data);
        }

        // Save the token to local storage
        localStorage.setItem('token', resJson.token);
        console.log("Now it should have saved tokento localStorage");

        document.querySelector('#status').innerHTML = `
                Välkommen ${resJson.userEmail.split('@')[0]}!

                <p>Din JWT: <pre>${resJson.token}</pre></p>
            `;


        // Redirect to the desired location
        console.log('Redirecting to http://localhost:3000/public/');
        //window.location.href = 'http://localhost:3000/public/index.html';
    } catch (error) {
        console.error('Error logging in:', error);
        document.querySelector('#status').innerHTML = 'Error logging in';
    }
}
















document.querySelector('#send').addEventListener('click', logIn);
        
console.log("End of app.js");

//});