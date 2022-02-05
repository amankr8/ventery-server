const Item = require('../models/Item')
const Category = require('../models/Category')

// helpers
const helper = require('../helpers/items')

exports.getItem = async (req, res) => {
    try {
        const doc = await Item.findById(req.params.id)

        if(!doc) {
            return res.status(404).json({ message: 'Unknown id! recheck' })
        }

        res.json(doc)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.getItems = async (req, res) => {
    try {
        const docs = await Item.find().sort({ date: -1 })
        res.json(docs)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.createItem = async (req, res) => {
    try {
        // Owner object
        const { _id, email, ...rest } = req.user
        const owner = { _id, email }

        // Upload images
        const images = req.files ? await helper.uploadImages(req.files) : []

        // Set Category
        let category = await Category.findOne({ name: req.body.category })
        if(!category) {
            category = await Category.findOne({ name: 'Others' })
        }

        const newItem = new Item({ ...req.body, images, category, owner })
        await newItem.save()
        res.json(newItem)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.updateItem = async (req, res) => {
    try {
        // Verify
        const doc = await Item.findById(req.params.id)

        if(!doc) {
            return res.status(404).json({ message: 'Unknown id! recheck' })
        }

        if(req.user.email !== doc.owner.email && req.user.username !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized!' })
        }

        // Set category
        const category = doc.category
        if(req.user.category) {
            category = await Category.findOne({ name: req.body.category })
        }

        // Delete images
        

        // Update images


        const update = { ...req.body, category, date: new Date() }
        const updatedDoc = await Item.findByIdAndUpdate(req.params.id, update, { new: true })
        res.json(updatedDoc)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.deleteItem = async (req, res) => {
    try {
        // Verify
        const doc = await Item.findById(req.params.id)

        if(!doc) {
            return res.status(404).json({ message: 'Unknown id! recheck' })
        }

        if(req.user.email !== doc.owner.email && req.user.username !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized!' })
        }

        // Delete item
        await Item.findByIdAndDelete(req.params.id)

        // Delete images
        doc.images && await helper.deleteImages(doc.images)
        res.json('Item deleted successfully!')
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.deleteItems = async (req, res) => {
    try {
        if(req.user.username !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized!' })
        }

        await Item.deleteMany()
        
        // Delete all item images
        await helper.deleteAllImages()
        res.json('All items deleted successfully!')
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}