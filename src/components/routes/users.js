const express = require('express')
const router = express.Router()

// Controller methods
const users = require('../controllers/users')

// File upload utils
const multer  = require('multer')
const upload = multer({ dest: 'public/uploads/profiles' })

// Authorization middleware
const auth = require('../middleware/auth')

// Route --> {{baseURL}}/users
router.post('/signup', upload.single('image'), users.signUp)                      // Signup a new user
router.post('/signin', users.signIn)                                              // Signin a user
router.get('/:id', users.getUser)                                                 // Get a user
router.get('/:id/items', users.getUserItems)                                      // Get items of a user
router.get('/', users.getUsers)                                                   // Get all users

// Auth routes
router.put('/:id', auth, upload.single('image'), users.updateUser)                // Update user's image
router.put('/:id/pass', auth, users.updatePass)                                   // Update user's password
router.delete('/:id', auth, users.deleteUser)                                     // Delete user and their items
router.delete('/:id/items', auth, users.deleteUserItems)                          // Delete items of a user
router.delete('/', auth, users.deleteUsers)                                       // Delete all users

module.exports = router