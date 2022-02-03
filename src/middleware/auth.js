const jwt = require('jsonwebtoken')
const User = require('../components/models/User')

const auth = async (req, res, next) => {
    try {
        // Check if token exists
        const token = req.headers.authorization
        if (!token) {
            return res.status(401).json({
                message: 'Authorization denied! Token does not exist.'
            })
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await User.findById(decoded?.id)
        if (!user) {
            return res.status(401).json({
                message: 'Authorization denied! Invalid token.'
            })
        }
        req.user = user

        next()
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

module.exports = auth