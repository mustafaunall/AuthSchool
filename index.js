const express = require("express")
const mongoose = require("mongoose")
const authRouter = require("./router/authRouter")
require('dotenv').config()
app = express()
app.use(express.json())

app.use('auth', authRouter)

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        app.listen(3000, () => {
            console.log("server running...")
        })
    } catch (error) {
        console.log(error);
    }
}

start()