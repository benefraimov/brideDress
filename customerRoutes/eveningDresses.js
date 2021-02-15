// Import Router
const router = require('express').Router();
// Import Authentication Check
const auth = require('../middleware/auth')
// Import SchemaModel
const EveningDress = require('../customerModels/eveningDressModel');


router.post('/', auth, async (req, res) => {
    try {
        const {imageHttp} = req.body

        // Create instance of Image
        const imageSchema = new EveningDress({
            image: imageHttp,
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
        // Delete image from mongodb
        const deletedImage = await image.remove();
        res.json(deletedImage);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router