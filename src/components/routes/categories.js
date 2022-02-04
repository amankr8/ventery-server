const express = require('express')
const router = express.Router()

// Controller methods
const categories = require('../controllers/categories')

// Authorization middleware
const auth = require('../../middleware/auth')

// {{baseURL}}/categories
router.get('/:id', categories.getCategory)
router.get('/', categories.getCategories)

// Auth routes
router.post('/', auth, categories.createCategory)
router.put('/:id', auth, categories.updateCategory)
router.delete('/:id', auth, categories.deleteCategory)
router.delete('/', auth, categories.deleteCategories)

module.exports = router