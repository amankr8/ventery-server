const User = require('../models/User')
const Item = require('../models/Item')

// helpers
const helper = require('../helpers/users')
const { deleteImages } = require('../helpers/items')

// Authentication utils
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.signUp = async (req, res) => {
    try {
        // Check if user already exists
        const isUser = await User.findOne({ email: req.body.email })
        if(isUser) {
            return res.status(400).json({ message: 'User already exists!' })
        }
        const isUsername = await User.findOne({ username: req.body.username.toLowerCase() })
        if(isUsername) {
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
        // Check if input is valid
        const isUser = await User.findOne({ username: req.body.username.toLowerCase() })
        if(!isUser) {
            return res.status(400).json({ message: 'Invalid credentials!' })
        }
        const isMatch = await bcrypt.compare(req.body.password, isUser.password)
        if(!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials!' })
        }

        // Generate token
        const token = jwt.sign({ id: isUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })

        res.json({
            user: isUser.username,
            token: token
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.getUser = async (req, res) => {
    try {
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
        // Authorization
        const doc = await User.findById(req.params.id)
        
        if(!doc) {
            return res.status(404).json({ message: 'Unknown id! recheck' })
        }

        if(req.user.email !== doc.email && req.user.username !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized!' })
        }

        // Check valid username
        const isUsername = await User.findOne({ username: req.body?.username?.toLowerCase() })
        if(isUsername) {
            return res.status(400).json({ message: 'Username unavailable! try another one' })
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
        // Authorization
        const doc = await User.findById(req.params.id)
        
        if(!doc) {
            return res.status(404).json({ message: 'Unknown id! recheck' })
        }

        if(req.user.email !== doc.email && req.user.username !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized!' })
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const update = { ...req.body, password: hashedPassword }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, update, { new: true })
        res.json(updatedUser)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        // Authorization
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
        const items = await Item.find({ 'owner._id': doc._id })

        for(const item of items) {
            await Item.findByIdAndDelete(item._id)
            item.images && await deleteImages(item.images)
        }

        res.json('User deleted successfully!')
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.deleteUserItems = async (req, res) => {
    try {
        // Authorization
        const doc = await User.findById(req.params.id)
        
        if(!doc) {
            return res.status(404).json({ message: 'Unknown id! recheck' })
        }

        if(req.user.email !== doc.email && req.user.username !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized!' })
        }

        const items = await Item.find({ owner_id: doc._id })

        for(const item of items) {
            await Item.findByIdAndDelete(item._id)
            item.images && await deleteImages(item.images)
        }

        res.json('User items deleted successfully!')
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.deleteUsers = async (req, res) => {
    try {
        //Authorization
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