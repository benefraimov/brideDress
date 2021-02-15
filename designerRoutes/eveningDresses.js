// Import Router
const router = require('express').Router();
// Import Authentication Check
const auth = require('../middleware/auth')
// Import SchemaModel
const EveningDress = require('../designerModels/eveningDressModel');
// Import Cloudinary
const Cloudinary = require('../utils/cloudinary');
// Import Multer
const upload = require('../utils/multer')

router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const result = await Cloudinary.uploader.upload(req.file.path)

        // Create instance of Image
        const imageSchema = new EveningDress({
            image: result.secure_url,
            cloudinary_id: result.public_id,
            userId: req.user,
        })

        // Save User
        const saveImage = await imageSchema.save()
        res.json(saveImage)

    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

router.get('/all', auth, async (req, res) => {
    try {
        const images = await EveningDress.find({
            userId: req.user
        });
        res.json(images)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        let imageSchema = await EveningDress.findById(req.params.id);
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
        imageSchema = await EveningDress.findByIdAndUpdate(req.params.id, data, { new: true });
        res.json(imageSchema)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        let image = await EveningDress.findOne({
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
        image = await EveningDress.findById(req.params.id);
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