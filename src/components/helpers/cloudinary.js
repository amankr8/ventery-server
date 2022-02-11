var fs = require('fs')
var path = require('path')
const cloudinary = require('../utils/cloudinary')

exports.uploadSingle = async (file, model) => {
    try {
        // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
            folder: `ventery/${model}`
        })
        fs.unlinkSync(file.path)

        const image = {
            name: result.public_id,
            url: result.secure_url
        }
        return image
    } catch (error) {
        console.error(error)
    }
}

exports.uploadArray = async (files, model) => {
    try {
        var images = []
        // Upload images to cloudinary
        for(const file of files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: `ventery/${model}`,
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
    }
}

exports.deleteSingle = async (file, model) => {
    try {
        // Delete image in cloudinary
        await cloudinary.uploader.destroy(file.name)
    } catch (error) {
        console.error(error)
    }
}

exports.deleteArray = async (files, model) => {
    try {
        // Delete images in cloudinary
        for(const file of files) {
            await cloudinary.uploader.destroy(file.name)
        }
    } catch (error) {
        console.error(error)
    }
}

exports.deleteAll = async (model) => {
    try {
        // Delete local files
        const files = fs.readdirSync(`public/uploads/${model}`)
        for(const file of files) {
            fs.unlinkSync(path.join(`public/uploads/${model}`, file))
        }

        // Delete images from cloudinary
        await cloudinary.api.delete_resources_by_prefix(`ventery/${model}`)
    } catch (error) {
        console.error(error)
    }
}