const Board = require('../models/board')
const express = require('express')
const sharp = require('sharp')
const auth = require('../middleware/auth')
const upload = require('../middleware/upload')

const router = new express.Router()

// Create new user board
router.post('/user/board', auth, async (req, res) => {
    const board = new Board({
        ...req.body,
        owner: req.user._id
    })
    try {
        await board.save()
        res.status(201).send(board)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Get all user boards
router.get('/user/boards', auth, async (req, res) => {
    try {
        const boards = await Board.find({owner: req.user._id})
        res.send(boards)
    } catch (error) {
        res.status(404).send(error)
    }
})

// Get user board by its id
router.get('/user/board/:id', auth, async (req, res) => {
    try {
        const board = await Board.findById({_id: req.params.id})
        if (!board) {
            return res.status(404).send({error: 'Board not found.'})
        }
        res.send(board)
    } catch (e) {
        res.status(500).send()
    }
})

// Delete user board by id
router.delete('/user/boards/:id', auth, async (req, res) => {
    try {
        const board = await Board.findById({_id: req.params.id})
        if (!board) {
            return res.status(404).send({error: 'Board not found.'})
        }
        board.remove()
        res.status(200).send({message: 'Board was successfully deleted.'})
    } catch (e) {
        res.status(400).send(e)
    }
})


// Upload background
router.post('/user/board/background/:id', auth, upload.single('background'), async (req, res) => {
    const buffer = await sharp(req.file.buffer)
        .png().toBuffer()
    console.log(req)
    try {
        const board = await Board.findById(req.params.id)
        if (!board) {
            return res.status(404).send({error: 'Board not found'})
        }
        board.background = buffer
        await board.save()
        res.send({message: 'Successfully upload.'})
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

// Delete board background
router.delete('/user/board/background/:id', auth, async (req, res) => {
    try {
        const board = await Board.findById(req.params.id)
        if (!board) {
            return res.status(404).send({error: 'Board not found'})
        }
        board.background = undefined
        await board.save()
        res.send({message: 'Background was deleted.'})

    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

// Get board background
router.get('/user/board/background/:id', auth, async(req, res)=>{
    try{
        const board = await Board.findById(req.params.id)
        if(!board){
            res.status(404).send({error: 'Board not found.'})
        }
        if(board.background){
            res.set('Content-Type', 'image/png')
            res.send(board.background)
        }
    }catch(e){
        res.status(500).send({error: e.message})
    }
})

module.exports = router
