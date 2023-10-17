
async function register() {
    // Get username and password from the form fields
    const email = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    console.log("Attempting to create user with email: ", email, " and password: ", password);
  
    try {
      const res = await fetch('https://w-o-m-2023.azurewebsites.net/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const resJson = await res.json();
      console.log('Server Response:', resJson);
  
      if (resJson.msg === 'User registered successfully') {
        console.log("User has been created with name: ", email);
        window.location.href = '/public/login/index.html'; 
      } else {
        console.error("Could not create user.");
      }
  
    } catch (error) {
      console.error('Error registering:', error);
    }
  }
  
  document.querySelector('#registrationForm').addEventListener('submit', (event) => {
    event.preventDefault();
    register();
  });