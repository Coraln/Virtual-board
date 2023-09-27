const express = require('express')
const cors = require('cors')
const app = express()
const authorizeToken = require('./middleware/auth')
const PORT = process.env.PORT || 3030

app.use(cors())

// behövs för att kunna ta emot JSON i request-bodyn
app.use(express.json())

app.get('/', (req, res) => {
    console.log(`GET request to / from ${req.ip}`)
    res.send('Mainpage!')
})

// statiska sidor i public-katalogen
app.use('/public', express.static(__dirname + '/public'))

// middleware-funktion, validerar jwt
//  app.use(authorizeToken)
// Middlewaren kan också vara i själva route-funktionen:
const notesRouter = require('./routes/notes.js')
app.use('/notes', authorizeToken, notesRouter)

const usersRouter = require('./routes/users.js')
app.use('/users', usersRouter)


console.log("Morjens Node!") 

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
})