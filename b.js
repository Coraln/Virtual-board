const express = require('express')
const cors = require('cors')
const app = express()
const authorizeToken = require('./middleware/auth')
const PORT = process.env.PORT || 3030

app.use(cors());

const corsOptions = {
    //origin: ['http://localhost:3000'],
    origin: ['https://w-o-m-2023.azurewebsites.net'],
};

app.use(cors(corsOptions));

// behövs för att kunna ta emot JSON i request-bodyn
app.use(express.json());

app.get('/', (req, res) => {
    console.log(`GET request to / from ${req.ip}`)
    res.send('Mainpage!')
})

// statiska sidor i public-katalogen
app.use('/public', express.static(__dirname + '/public'))

app.get('/private', authorizeToken, (req, res) => {
    // Forward the request to the note-taking server
    const token = req.headers.authorization;
    fetch('https://w-o-m-2023.azurewebsites.net/private', {
    //fetch('http://localhost:3000/private', {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    })
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(error => res.status(500).json({ error: 'Internal Server Error' }));
  });
  

// middleware-funktion, validerar jwt
//app.use(authorizeToken);
// Middlewaren kan också vara i själva route-funktionen:
const notesRouter = require('./routes/notes.js')
app.use('/notes', authorizeToken, notesRouter)

const usersRouter = require('./routes/users.js')
app.use('/users', usersRouter)

const registerRouter = require('./routes/register.js');
app.use('/register', registerRouter);


const boardsRouter = require('./routes/boards');
app.use('/boards', boardsRouter);

console.log("Morjens Node!") 

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
}).on('error', (err) => {
    console.error('Error starting server:', err);
});