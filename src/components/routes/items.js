const express = require('express')
const router = express.Router()

// Controller methods
const item = require('../controllers/items')

// File upload utils
const multer  = require('multer')
const upload = multer({ dest: 'public/uploads/items' })

// Authorization middleware
const auth = require('../../middleware/auth')

// {{baseURL}}/items
router.get('/:id', item.getItem)                                                    // Get a single item
router.get('/', item.getItems)                                                   // Get all items from the inventory

// Auth routes
router.delete('/', auth, item.deleteItems)                                       // Delete all items from the inventory
router.post('/', auth, upload.array('images', 3), item.createItem)               // Add an item to the inventory
router.put('/:id', auth, upload.array('images', 3), item.updateItem)                                        // Update an item in the inventory
router.delete('/:id', auth, item.deleteItem)                                     // Delete an item from the inventory

module.exports = router