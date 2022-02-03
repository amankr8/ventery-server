var fs = require('fs')
var path = require('path')
const cloudinary = require('../../utils/cloudinary')

exports.uploadImages = async (files) => {
    try {
        var images = []
        // Upload images to cloudinary
        for(const file of files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'buyandsell/items',
            })
            
            images.push({
                name: result.public_id,
                url: result.secure_url
            })
            fs.unlinkSync(file.path)
        }
        return images
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.deleteImages = async (files) => {
    try {
        // Delete images in cloudinary
        for(const file of files) {
            await cloudinary.uploader.destroy(file.name)
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.deleteAllImages = async () => {
    try {
        // Delete local files
        const files = fs.readdirSync('public/uploads/items')
        for(const file of files) {
            fs.unlinkSync(path.join('public/uploads/items', file))
        }

        // Delete images from cloudinary
        await cloudinary.api.delete_resources_by_prefix('buyandsell/items')
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}