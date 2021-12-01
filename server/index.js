require('dotenv').config()
const express = require('express')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const router = require('./routes')
const apiError = require('./middlewares/error')

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use('/static/images', express.static(__dirname + '/static/images'))
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL

}))
app.use('/api', router)
app.use(apiError)

const startServer = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => console.log(`Auth app has been started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

startServer()