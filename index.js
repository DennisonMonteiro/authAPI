const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')

//Import Routes
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

dotenv.config()

//connect to db 
mongoose.connect(process.env.DB_CONNECT, () => console.log('connected to db'))

//middlewares
app.use(express.json())
//Route middlewares
app.use('/api/user', authRoute)
app.use('/api/posts', postRoute)

app.listen(3000, () => console.log("Server Up and running..."))