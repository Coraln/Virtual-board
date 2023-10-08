const jwt = require('jsonwebtoken')
require('dotenv').config() // läs in alla variabler i .env

module.exports = (req, res, next) => {
    console.log('LOG: middleware/auth.js - trying to verify JWT token')

    try {
        // plocka ut jwt från headern
        const token = req.headers['authorization'].split(' ')[1]
        
        // verifiera token och spara användarinfo
        const authUser = jwt.verify(token, process.env.JWT_SECRET)

        // spara användarinfo i req
        req.authUser = authUser

        console.log("User: " + authUser + " authenticated with JWT token (middleware/auth.js)")

        next()

    } catch (error) {
        console.log("JWT error: ", error.message)
        res.status(401).send({
            msg: "Authorization failed in middleware/auth.js",
            error: error.message
        })

    }

}

