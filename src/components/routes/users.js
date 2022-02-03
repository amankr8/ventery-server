const express = require('express')
const router = express.Router()

// Controller methods
const user = require('../controllers/users')

// File upload utils
const multer  = require('multer')
const upload = multer({ dest: 'public/uploads/profiles' })

// Authorization middleware
const auth = require('../../middleware/auth')

// {{baseURL}}/users
router.get('/', user.getUsers) 
router.post('/signup', upload.single('image'), user.signUp)                      // Signup a new user
router.post('/signin', user.signIn)                                              // Signin a user
router.get('/:id', user.getUser)                                                 // Get a user
router.get('/:id/items', user.getUserItems)                                      // Get items of a user

// Auth routes
router.put('/:id', auth, upload.single('image'), user.updateUser)                // Update user's image
router.put('/:id/pass', auth, user.updatePass)                                   // Update user's password
router.delete('/:id', auth, user.deleteUser)                                     // Delete user and their items
router.delete('/:id/items', auth, user.deleteUserItems)                          // Delete items of a user
router.delete('/', auth, user.deleteUsers)                                       // Delete all users

module.exports = router