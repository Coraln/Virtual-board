

//CLIENT-SIDE SCRIPT, THAT SENDS MESSAGES TO AND RECIEVES FROM SERVER
console.log("Start of app.js");


async function logIn() {
  console.log("logIn function called");
  try {
    const res = await fetch('http://localhost:3030/users/login', {
    //const res = await fetch('https://w-o-m-23.azurewebsites.net/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // Hämtar data i json format & konverterar till string
      body: JSON.stringify({
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value
      })
    });
    
    const resJson = await res.json();

    console.log('Server Response:', resJson);

    /*if (resJson.ok) {
      // Redirect to Azure-hosted WebSocket server after successful login
      //window.location.href = 'https://w-o-m-2023.azurewebsites.net/public/index.html'; // Replace with your actual URL
      window.location.href = 'http://localhost:3000/public/index.html';
  } else {
      // Handle login failure
      document.querySelector('#status').innerHTML = 'Login failed';
  } */

        if (resJson.msg === 'Login successful') {
            // Save the token to local storage
            localStorage.setItem('token', resJson.token);
            console.log("Token saved to localStorage");

            // Fetch private data from the note-taking server
            const token = localStorage.getItem('token');
            //const privateData = await fetch('https://w-o-m-2023.azurewebsites.net/private', {
              const privateData = await fetch('http://localhost:3000/private', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => response.json());

            console.log('Private Data:', privateData);

            

            // Redirect to the desired location with token in url
            //window.location.href = `https://w-o-m-2023.azurewebsites.net/public/index.html?token=${resJson.token}`;
            window.location.href = `http://localhost:3000/public/index.html?token=${resJson.token}`;

        } else {
            // Handle login failure
            document.querySelector('#status').innerHTML = 'Error logging in';
        }

    } catch (error) {
        console.error('Error logging in:', error);
        document.querySelector('#status').innerHTML = 'Error logging in';
    }

  console.log("End of login function in app.js");
}

document.querySelector('#send').addEventListener('click', logIn);

console.log("End of app.js");