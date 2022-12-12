const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const boardRouter = require('./routers/board')
const noteRouter = require('./routers/note')
const commentRouter = require('./routers/comment')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(boardRouter)
app.use(noteRouter)
app.use(commentRouter)

module.exports = app
