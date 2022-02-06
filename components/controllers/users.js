const User = require('../models/User')
const Item = require('../models/Item')

// helpers
const helper = require('../helpers/users')
const { deleteImages } = require('../helpers/items')

// Authentication utils
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Reusable function
const deleteItemsbyUser = async(user_id) => {
    const items = await Item.find({ 'owner._id': user_id })

    for(const item of items) {
        await Item.findByIdAndDelete(item._id)
        item.images && await deleteImages(item.images)
    }
}

exports.signUp = async (req, res) => {
    try {
        // Check if user already exists
        const user = await User.findOne({ email: req.body.email })
        if(user) {
            return res.status(400).json({ message: 'User already exists!' })
        }
        const username = await User.findOne({ username: req.body.username.toLowerCase() })
        if(username) {
            return res.status(400).json({ message: 'Username unavailable! try another one' })
        }

        // Upload image
        const image = req.file ? await helper.uploadImage(req.file) : null

        // Encrypt password
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const newUser = new User({ ...req.body, image, password: hashedPassword })
        await newUser.save()
        res.json(newUser)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.signIn = async (req, res) => {
    try {
        // Verify
        const user = await User.findOne({ username: req.body.username.toLowerCase() })
        if(!user) {
            return res.status(400).json({ message: 'Invalid credentials!' })
        }
        const match = await bcrypt.compare(req.body.password, user.password)
        if(!match) {
            return res.status(400).json({ message: 'Invalid credentials!' })
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' })

        res.json({ user: user.username, token })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.getUser = async (req, res) => {
    try {
        // Verify
        const doc = await User.findById(req.params.id)

        if(!doc) {
            return res.status(404).json({ message: 'Unknown id! recheck' })
        }

        res.json(doc)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.getUsers = async (req, res) => {
    try {
        const docs = await User.find()
        res.json(docs)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.getUserItems = async (req, res) => {
    try {
        // Verify
        const doc = await User.findById(req.params.id)

        if(!doc) {
            return res.status(404).json({ message: 'Unknown id! recheck' })
        }

        const docs = await Item.find({ 'owner._id': doc._id })
        res.json(docs)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.updateUser = async (req, res) => {
    try {
        // Verify
        const doc = await User.findById(req.params.id)
        
        if(!doc) {
            return res.status(404).json({ message: 'Unknown id! recheck' })
        }

        if(req.user.email !== doc.email && req.user.username !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized!' })
        }

        // Check valid username
        if(req.body?.username) {
            const username = await User.findOne({ username: req.body.username.toLowerCase() })
            if(username) {
                return res.status(400).json({ message: 'Username unavailable! try another one' })
            }
        }

        // Update image
        const image = doc.image
        if(req.file) {
            doc.image && await helper.deleteImage(doc.image)
            image = await helper.uploadImage(req.file)
        }

        req.body.password = undefined
        const update = { ...req.body, image }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, update, { new: true })
        console.log(updatedUser)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.updatePass = async (req, res) => {
    try {
        // Verify
        const doc = await User.findById(req.params.id)
        
        if(!doc) {
            return res.status(404).json({ message: 'Unknown id! recheck' })
        }

        if(req.user.email !== doc.email && req.user.username !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized!' })
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const updatedUser = await User.findByIdAndUpdate(req.params.id, { password: hashedPassword }, { new: true })
        res.json(updatedUser)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        // Verify
        const doc = await User.findById(req.params.id)
        
        if(!doc) {
            return res.status(404).json({ message: 'Unknown id! recheck' })
        }

        if(req.user.email !== doc.email && req.user.username !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized!' })
        }

        // Delete user
        await User.findByIdAndDelete(req.params.id)

        // Delete user image
        doc.image && await helper.deleteImage(doc.image)

        // Delete related user items
        await deleteItemsbyUser(doc._id)

        res.json('User and their items deleted successfully!')
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.deleteUserItems = async (req, res) => {
    try {
        // Verify
        const doc = await User.findById(req.params.id)
        
        if(!doc) {
            return res.status(404).json({ message: 'Unknown id! recheck' })
        }

        if(req.user.email !== doc.email && req.user.username !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized!' })
        }

        await deleteItemsbyUser(doc._id)

        res.json('User items deleted successfully!')
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.deleteUsers = async (req, res) => {
    try {
        // Verify
        if(req.user.username !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized!' })
        }

        await User.deleteMany()
        
        // Delete all user images
        await helper.deleteAllImages()
        res.json('All users deleted successfully!')
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}