// Import Router
const router = require('express').Router();
// Import Authentication Check
const auth = require('../middleware/auth')
// Import SchemaModel
const BrideDress = require('../designerModels/brideDressModel');
// Import Cloudinary
const Cloudinary = require('../utils/cloudinary');
// Import Multer
const multer = require("multer")

const upload = multer();

// const upload = multer({
//     limits: { fieldSize: 25 * 1024 * 1024 },
// });

router.post('/', auth, async (req, res) => {
    try {
        const { title, price, description, secure_url, public_id } = req.body;

        // Create instance of Image
        const imageSchema = new BrideDress({
            image: secure_url,
            cloudinary_id: public_id,
            title: title,
            price: parseFloat(price),
            description: description,
            userId: req.user,
        })

        // Save User
        const saveImage = await imageSchema.save()
        res.json(saveImage)

    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

router.get('/', auth, async (req, res) => {
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
        let imageSchema = await BrideDress.findById(req.params.id);
        if (!imageSchema)
            return res.status(400).json({
                errorMessage:
                    "No image with thid ID was found. Please contact the developer.",
            })

        if (imageSchema.userId.toString() !== req.user)
            return res.status(401).json({ errorMessage: "Unauthorized." });

        // then do all the update    
        await Cloudinary.uploader.destroy(imageSchema.cloudinary_id);
        const result = await Cloudinary.uploader.upload(req.file.path)

        // Update instance of Image
        let data = {
            name: req.body.name || imageSchema.name,
            image: result.secure_url || imageSchema.image,
            cloudinary_id: result.public_id || imageSchema.cloudinary_id,
            userId: imageSchema.userId
        }
        imageSchema = await BrideDress.findByIdAndUpdate(req.params.id, data, { new: true });
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

        if (image.userId.toString() !== req.user)
            return res.status(401).json({ errorMessage: "Unauthorized." });
        // Find user by id
        image = await BrideDress.findById(req.params.id);
        // Delete image from cloudinary
        await Cloudinary.uploader.destroy(image.cloudinary_id);
        // Delete image from mongodb
        const deletedImage = await image.remove();
        res.json(deletedImage);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router