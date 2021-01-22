const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();
const path = require('path')

// set up express
const app = express();

app.use(cors());

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
app.use(express.json());

// set up routes
app.use("/users", require("./routes/userRouter"));
app.use("/todos", require("./routes/todoRouter"));
app.use("/brideDresses", require("./routes/brideDresses"));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    });
}

const PORT = process.env.PORT || 5001

app.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
