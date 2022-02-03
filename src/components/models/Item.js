const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    details: {
        type: String
    },
    price: {
        type: Number
    },
    category: {
        type: String
    },
    owner: {
        type: Object,
        required: true,
        immutable: true
    },
    images: {
        type: [{
            name: String,
            url: String,
            setDelete: {
                type: String,
                default: false
            }
        }],
        maxItems: 3
    },
    date: {
        type: Date,
        default: new Date(),
        immutable: true
    }
})

const Item = mongoose.model('Item', itemSchema)

module.exports = Item