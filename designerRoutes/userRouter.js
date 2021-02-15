const router = require("express").Router()
const User = require('../designerModels/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const auth = require("../middleware/auth")


router.post("/register", async (req, res) => {
    try {
        let { email, password, passwordCheck, name, phone, site, address } = req.body;

        // validation
        const existingUser = await User.findOne({ email })
        if (existingUser)
            return res.status(400).json({ msg: "An account with this email already exists." });
        if (password !== passwordCheck)
            return res.status(400).json({ msg: "Passwords are not match." });

        if (!name) name = email

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        //res.json(saveImage)
        let newUser = new User({
            email: email,
            password: passwordHash,
            name: name,
            phone: phone,
            site: site || "No Site",
            address: address
        });

        // Save User
        const saveUser = await newUser.save()

        res.json(saveUser)

    } catch (err) {
        res.status(500).json({ msg: err });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        // validation

        if (!email || !password)
            return res.status(400).json({ msg: "Fill in the required fields." });

        const existingUser = await User.findOne({ email })
        if (!existingUser)
            return res
                .status(401)
                .json({ msg: "Wrong email or password." });

        const correctPassword = await bcrypt.compare(password, existingUser.password);
        if (!correctPassword)
            return res
                .status(401)
                .json({ msg: "Wrong email or password." })

        const token = jwt.sign(
            {
                id: existingUser._id,
                email: existingUser.email,
                name: existingUser.name,
                phone: existingUser.phone,
                site: existingUser.site,
                address: existingUser.address
            }, process.env.JWT_SECRET);

        res.json(token);
    } catch (err) {
        res.status(500).json({ msg: 'Problem with request to server!!' })
    }
})

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.find(req.user);
        res.json(user)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})


router.put('/update', auth, async (req, res) => {
    try {
        let { name, phone, site, address } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.user,
            {
                name, phone, site, address
            })
        res.json(updatedUser)
    }
    catch (err) {
        res.status(500).json({ msg: 'Problem with request to server!!' });
    }
})

// Delete Works Fine
router.delete('/delete', auth, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user)
        res.json(deletedUser)
    } catch (err) {
        res.status(500).json({ msg: 'Problem with request to server!!' })
    }
})

router.post('/tokenIsValid', async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false)

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) return res.json(false)

        const user = await User.findById(verified.id);
        if (!user) return res.json(false)

        return res.json(true);
    } catch (err) {
        res.status(500).json({ msg: 'Problem with request to server!!' })
    }
})

router.get('/', auth, async (req, res) => {
    try {
        console.log(req.user);

        const user = await User.findById(req.user);
        res.json({
            name: user.name,
            id: user._id,
        })
    } catch (err) {
        res.status(500).json({ msg: 'Problem with request to server!!' })
    }
})

module.exports = router



// router.post("/registernotverify", async (req, res) => {
//     let { email } = req.body;

//     // validation

//     if (!email)
//         return res.status(406).json({ msg: "Fill the email field." });

//     const existingUser = await User.findOne({ email })
//     if (existingUser)
//         return res.status(401).json({ msg: "An account with this email already exists." });

//     const { valid, reason, validators } = await isEmailValid(email);

//     if (valid) {
//         const newUser = new User({
//             email
//         });
//         const savedUser = await newUser.save();
//         res.json(savedUser)
//     }

//     if (!valid) {
//         return res.status(403).send({
//             message: "Please provide a valid email adrress.",
//             reason: validators[reason].reason
//         })
//     }
// })


// const emailValidator = require('deep-email-validator')

// async function isEmailValid(email) {
//     return emailValidator.validate(email)
// }