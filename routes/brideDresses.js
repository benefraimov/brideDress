// Import Router
const router = require('express').Router();
// Import Authentication Check
const auth = require('../middleware/auth')
// Import SchemaModel
const BrideDress = require('../models/brideDressModel');
// Import Cloudinary
const Cloudinary = require('../utils/cloudinary');
// Import Multer
const upload = require('../utils/multer')

router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const { name } = req.body
        const result = await Cloudinary.uploader.upload(req.file.path)

        // validation
        if (!name)
            return res.status(400).json({ msg: "Not all fields have been entered." })

        // Create instance of Image
        const imageSchema = new BrideDress({
            name,
            image: result.secure_url,
            cloudinary_id: result.public_id,
            userId: req.user,
        })

        // Save User
        const saveImage = await imageSchema.save()
        res.json(saveImage)

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get('/all', auth, async (req, res) => {
    try {
        const images = await BrideDress.find({
            userId: req.user
        });
        res.json(images)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        let imageSchema = await BrideDresses.findById(req.params.id);
        await Cloudinary.uploader.destroy(imageSchema.cloudinary_id);
        const result = await Cloudinary.uploader.upload(req.file.path)
        // Update instance of Image
        let data = {
            name: req.body.name || imageSchema.name,
            image: result.secure_url || imageSchema.image,
            cloudinary_id: result.public_id || imageSchema.cloudinary_id,
            userId: imageSchema.userId
        }
        imageSchema = await BrideDresses.findByIdAndUpdate(req.params.id, data, { new: true });
        res.json(imageSchema)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        let image = await BrideDress.findOne({
            userId: req.user,
            _id: req.params.id
        })
        // validate
        if (!image)
            return res
                .status(400)
                .json({ msg: "No image found with this ID that belongs to this user" })
        // Find user by id
        image = await BrideDress.findById(req.params.id);
        // Delete image from cloudinary
        await Cloudinary.uploader.destroy(image.cloudinary_id);
        // Delete image from mongodb
        const deletedImage = await imageSchema.remove();
        res.json(deletedImage);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router