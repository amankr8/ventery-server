const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        immutable: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: {
            name: String,
            url: String,
            setDelete: {
                type: String,
                default: false
            }
        }
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User