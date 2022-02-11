var cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CN_CLOUD_NAME, 
    api_key: process.env.CN_API_KEY, 
    api_secret: process.env.CN_SECRET_KEY
})

module.exports = cloudinary