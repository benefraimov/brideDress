const jwt = require('jsonwebtoken');
//"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMWE1NWQxZDlmODY1MDFiMDdiMDBlMCIsImlhdCI6MTYxMjgxMDg5Mn0.IDJUjLxxp9erfjWwW9YsCOwRM3dtO7worR6zOtanJH0"
const auth = (req, res, next) => {
    try {
        const token = req.header("x-auth-token");

        //req.header("x-auth-token");
        if (!token) return res.status(401).json({ msg: "Unauthorized." });

        const validatedUser = jwt.verify(token, process.env.JWT_SECRET);
        req.user = validatedUser.id;

        next();
    } catch (err) {
        return res.status(401).json({ msg: "Unauthorized." });
    }
};

module.exports = auth;
