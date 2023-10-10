const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
require('dotenv').config()


// disable for production?
router.get('/', async (req, res) => {
    try {
        const users = await prisma.users.findMany();
        console.log("users GET");
        res.send({
            msg: 'users',
            users: users
        });
    } catch (error) {
        console.error('Error in GET /users:', error);
        res.status(500).send({ msg: 'ERROR', error: 'Internal Server Error' });
    }
});

// restrict for production
router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        console.log(userId);

        const user = await prisma.users.findUnique({
            where: { id: userId }
        });

        console.log("users GET ONE");
        res.send({ msg: 'users', user: user });
    } catch (error) {
        console.error('Error in GET /users/:id:', error);
        res.status(500).send({ msg: 'ERROR', error: 'Internal Server Error' });
    }
});



router.post('/login', async (req, res) => {
    try {

        const user = await prisma.users.findUnique({
            where: { email: req.body.email }
        })

        if (user == null) {
            return res.status(404).send({ msg: 'ERROR', error: 'User not found' })
        }

        const match = await bcrypt.compare(req.body.password, user.password)

        if (!match) {
            return res.status(401).send({ msg: 'ERROR', error: 'Wrong password' })
        }

        const token = await jwt.sign({
            sub: user.id,
            email: user.email,
            name: user.name,
            expiresIn: '1d'
        }, process.env.JWT_SECRET)

        // Send the token to the note taking project
        const axios = require('axios');


        console.log('Sending token:', token);
        console.log("Secret key to encode: " + process.env.JWT_SECRET);

        try {
            const response = await axios.post('http://localhost:3000/receiveToken', { token });
            console.log('Token sent successfully');
            //window.location.href = 'http://localhost:3000/public/index.html';
        } catch (error) {
            //console.error('Error sending token:', error.response);
            console.error('Error response status: ', error.response.status);
            console.error('Error response data: ', error.response.data);
        }

        res.send({
            token: token,
            msg: "Login successful",
            userId: user.id,
            userEmail: user.email
        });
        console.log("Server response:", JSON.stringify({
            token: token,
            msg: "Login successful",
            userId: user.id,
            userEmail: user.email
        }));
    } catch (error) {
        console.log("Error from routers/user.js post /login function", error);
    }

    //window.location.href = 'http://localhost:3000/public/index.html';
});



router.post('/', async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 12);

        const user = await prisma.users.create({
            data: {
                email: req.body.email,
                name: req.body.name,
                password: hash
            },
        });
        console.log("user created:", user);
        res.send({ msg: 'user created', id: user.id });
    } catch (error) {
        console.error('Error in POST /users:', error);
        res.status(500).send({ msg: 'ERROR', error: 'Internal Server Error' });
    }
});


router.patch('/:id', async (req, res) => {
    try {
        //const userId = parseInt(req.params.id);
        const userId = req.params.id;

        if (userId !== req.authUser) {
            return res.status(403).send({
                msg: 'ERROR',
                error: 'Cannot patch other users'
            });
        }

        let hash = null;
        if (req.body.password) {
            hash = await bcrypt.hash(req.body.password, 12);
        }

        const updatedUser = await prisma.users.update({
            where: {
                id: userId,
            },
            data: {
                password: hash,
                name: req.body.name, // Use req.body.name for the user's name
                updatedAt: new Date(),
            },
        });

        res.send({
            msg: 'patch',
            id: userId,
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error in PATCH /users/:id:', error);
        res.status(500).send({ msg: 'ERROR', error: 'Internal Server Error' });
    }
});

router.delete('/:id', async (req, res) => {

    //const userId = parseInt(req.params.id);

    const userId = req.params.id;

    try {
        const user = await prisma.users.delete({
            where: {
                id: userId,
            }
        })
        res.send({
            msg: 'deleted',
            id: userId,
            user: user
        })
    } catch (err) {
        console.log(err)
        res.send({
            msg: 'ERROR',
            error: err
        })
    }
})


module.exports = router