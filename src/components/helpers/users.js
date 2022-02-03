var fs = require('fs')
var path = require('path')
const cloudinary = require('../../utils/cloudinary')

exports.uploadImage = async (file) => {
    try {
        // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'buyandsell/profiles'
        })
        fs.unlinkSync(file.path)

        const image = {
            name: result.public_id,
            url: result.secure_url
        }
        return image
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.deleteImage = async (file) => {
    try {
        // Delete image in cloudinary
        await cloudinary.uploader.destroy(file.name)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.deleteAllImages = async () => {
    try {
        // Delete local files
        const files = fs.readdirSync('public/uploads/profiles')
        for(const file of files) {
            fs.unlinkSync(path.join('public/uploads/profiles', file))
        }

        // Delete images from cloudinary
        await cloudinary.api.delete_resources_by_prefix('buyandsell/profiles')
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}