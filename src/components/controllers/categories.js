const Category = require('../models/Category')
const Item = require('../models/Item')

exports.getCategory = async (req, res) => {
    try {
        const doc = await Category.findById(req.params.id)

        if(!doc) {
            return res.status(404).json({ message: 'Unknown id! recheck' })
        }

        res.json(doc)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.getCategories = async (req, res) => {
    try {
        const docs = await Category.find()
        res.json(docs)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.getCategoryItems = async (req, res) => {
    try {
        // Verify
        const doc = await User.findById(req.params.id)

        if(!doc) {
            return res.status(404).json({ message: 'Unknown id! recheck' })
        }

        // Get items by category
        const docs = await Category.find({ 'category.name': doc.name })
        res.json(docs)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.createCategory = async (req, res) => {
    try {
        // Verify        
        if(req.user.username !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized!' })
        }

        const category = await Category.findOne({ name: req.body.name })
        if(category) {
            return res.status(400).json({ message: 'Category already exists!' })
        }

        const newCategory = new Category(req.body)
        await newCategory.save()
        res.json(newCategory)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.updateCategory = async (req, res) => {
    try {
        res.json({ message: "Function not implemented yet" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        // Verify
        const doc = await Item.findById(req.params.id)

        if(!doc) {
            return res.status(404).json({ message: 'Unknown id! recheck' })
        }
      
        if(req.user.username !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized!' })
        }

        await Category.findByIdAndDelete(req.params.id)
        res.json('Category deleted!')
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.deleteCategories = async (req, res) => {
    try {
        // Verify        
        if(req.user.username !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized!' })
        }

        await Category.deleteMany()
        res.json('All categories deleted!')
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}