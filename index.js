const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();
const path = require('path')
const helmet = require("helmet");
const config = require('config');
const compression = require("compression");

// set up express
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(helmet());
app.use(compression());



// set up mongoose
mongoose.connect(
    process.env.MONGODB_CON_STR,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    },
    (err) => {
        if (err) throw err;
        console.log("MongoDB connection establish");
    }
);


// set up routes

// designers routes
app.use("/designeruser", require("./designerRoutes/userRouter"));
app.use("/designerdress", require("./designerRoutes/brideDresses"));
// customers routes
app.use("/customeruser", require("./customerRoutes/userRouter"));
app.use("/customerDress", require("./customerRoutes/brideDresses"));
app.use("/customeralldresses", require("./customerRoutes/dressForAllCustomers"));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    });
}

const PORT = process.env.PORT || config.get("port");

app.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
