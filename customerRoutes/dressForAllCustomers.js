// Import Router
const router = require('express').Router();
// Import SchemaModel
const CustomersAllDresses = require('../customerModels/dressForAllCustomersModel');


router.post('/', async (req, res) => {
    try {
        const { imageHttp, title, price, description, phone, address, site, email, name } = req.body

        // Create instance of Image
        const imageSchema = new CustomersAllDresses({
            image: imageHttp,
            title: title,
            price: price,
            description: description,
            phone: phone,
            address: address,
            site: site,
            email: email,
            name: name,
        })

        // Save User
        const saveImage = await imageSchema.save()
        res.json(saveImage)

    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

router.get('/', async (req, res) => {
    try {
        let flag = false
        const { userID } = req.body
        const images = await CustomersAllDresses.find({});
        let newImages = [];
        for (let i = 0; i < images.length; i++) {
            for (let j = 0; j < images[i].likeArr.length; j++) {
                if (images[i].likeArr[j] == userID) {
                    flag = true;
                }
            }
            for (let j = 0; j < images[i].unlikeArr.length; j++) {
                if (images[i].unlikeArr[j] == userID) {
                    flag = true;
                }
            }
            if (flag == false) {
                newImages.push(images[i]);
            }
        }

        res.json(newImages)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get('/likedresses', async (req, res) => {
    try {
        const { userID } = req.body
        const images = await CustomersAllDresses.find({});

        let likedImages = [];
        for (let i = 0; i < images.length; i++) {
            if (images[i].likeArr.indexOf(userID)) {
                likedImages.push(images[i])
            }
        }

        res.json(likedImages)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.put('/like/:id', async (req, res) => {
    try {
        const { userID } = req.body
        let imageSchema = await CustomersAllDresses.findById(req.params.id);

        if (!imageSchema)
            return res.status(400).json({
                msg:
                    "No image with thid ID was found. Please refresh the list and try again.",
            })

        // then do all the update
        const index = imageSchema.unlikeArr.indexOf(userID);
        if (index > -1) {
            imageSchema.unlikeArr.splice(index, 1)
        }

        imageSchema.likeArr.push(userID)

        // Update instance of Image
        let data = {
            name: imageSchema.name,
            image: imageSchema.image,
            title: imageSchema.title,
            price: imageSchema.price,
            description: imageSchema.description,
            phone: imageSchema.phone,
            address: imageSchema.address,
            site: imageSchema.site,
            email: imageSchema.email,
            likeArr: imageSchema.likeArr,
            unlikeArr: imageSchema.unlikeArr,
        }
        imageSchema = await CustomersAllDresses.findByIdAndUpdate(req.params.id, data, { new: true });
        res.json(imageSchema)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.put('/unlike/:id', async (req, res) => {
    try {
        const { userID } = req.body
        let imageSchema = await CustomersAllDresses.findById(req.params.id);

        if (!imageSchema)
            return res.status(400).json({
                msg:
                    "No image with thid ID was found. Please refresh the list and try again.",
            })

        // then do all the update
        const index = imageSchema.likeArr.indexOf(userID);
        if (index > -1) {
            imageSchema.likeArr.splice(index, 1)
        }

        imageSchema.unlikeArr.push(userID)

        // Update instance of Image
        let data = {
            name: imageSchema.name,
            image: imageSchema.image,
            title: imageSchema.title,
            price: imageSchema.price,
            description: imageSchema.description,
            phone: imageSchema.phone,
            address: imageSchema.address,
            site: imageSchema.site,
            email: imageSchema.email,
            likeArr: imageSchema.likeArr,
            unlikeArr: imageSchema.unlikeArr,
        }
        imageSchema = await CustomersAllDresses.findByIdAndUpdate(req.params.id, data, { new: true });
        res.json(imageSchema)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router