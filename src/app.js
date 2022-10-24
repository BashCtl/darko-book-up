const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const boardRouter = require('./routers/board')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(boardRouter)

module.exports = app
