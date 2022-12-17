const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const boardRouter = require('./routers/board')
const noteRouter = require('./routers/note')
const commentRouter = require('./routers/comment')

const app = express()

app.use((req,res,next)=> {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})
app.use(express.json())
app.use(userRouter)
app.use(boardRouter)
app.use(noteRouter)
app.use(commentRouter)

module.exports = app
