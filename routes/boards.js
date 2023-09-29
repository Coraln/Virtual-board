const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Import your authentication middleware
const authMiddleware = require('../middleware/auth')

// Apply the authentication middleware to this route
router.use(authMiddleware)

// Define the endpoint for getting boards accessible to the user
router.get('/', async (req, res) => {
    try {
        // Extract the user's ID from the authenticated user information
        const userId = req.authUser.sub;
    
        console.log('User ID:', userId);
    
        // Fetch boards accessible to the user from your database
        const boards = await prisma.board.findMany({
            where: {
                members: {
                    some: {
                        userId: userId // This is the ID of the authenticated user
                    }
                }
            }
        });
    
        console.log('Accessible Boards:', boards);
    
        res.status(200).json({ boards });
    } catch (error) {
        console.error('Error fetching boards:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
