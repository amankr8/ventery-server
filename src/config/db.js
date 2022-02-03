const mongoose = require('mongoose')

const connect = async () => {
    try {
        mongoose.connect(process.env.ATLAS_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connected to database!')
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Database Connection Error" })
    }
}

module.exports = connect