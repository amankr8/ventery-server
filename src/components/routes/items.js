const express = require('express')
const router = express.Router()

// Controller methods
const items = require('../controllers/items')

// File upload utils
const multer  = require('multer')
const upload = multer({ dest: 'public/uploads/items' })

// Authorization middleware
const auth = require('../middleware/auth')

// Route --> {{baseURL}}/items
router.get('/:id', items.getItem)                                                 // Get a single item
router.get('/', items.getItems)                                                   // Get all items from the inventory

// Auth routes
router.post('/', auth, upload.array('images', 3), items.createItem)               // Add an item to the inventory
router.put('/:id', auth, upload.array('images', 3), items.updateItem)             // Update an item in the inventory
router.delete('/:id', auth, items.deleteItem)                                     // Delete an item from the inventory
router.delete('/', auth, items.deleteItems)                                       // Delete all items from the inventory

module.exports = router