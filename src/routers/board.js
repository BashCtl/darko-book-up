const {Board, Note} = require('../models/board')
const express = require('express')
const auth = require('../middleware/auth')

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

// Create new note on board by its id
router.post('/user/board/notes/:id', auth, async (req, res) => {
    const message = req.body.message

    if (!message) {
        return res.status(400).send({error: 'Empty note'})
    }
    try {
        const note = new Note({message, owner: req.params.id})
        await note.save()
        res.send(note)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Update note by its id
router.patch('/user/board/notes/:id', auth, async (req, res) => {
    try {
        const board = await Board.findOne({owner: req.user._id})
        const note = await Note.findOne({_id: req.params.id, owner: board._id})
        if (!board) {
            return res.status(404).send({error: 'Board not found'})
        }
        if (!note) {
            return res.status(404).send({error: 'Note not found'})
        }

        if (!req.body.message) {
            return res.status(400).send({error: 'Message field must be provided.'})
        }
        const message = req.body.message
        note.message = message
        await note.save()
        res.send(note)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Get all user notes for board (by board id)
router.get('/user/board/notes/:id', auth, async (req, res) => {
    try {
        const notes = await Note.find({owner: req.params.id}).exec()
        if (!notes) {
            return res.status(404).send({error: 'Notes was not found.'})
        }
        res.send(notes)
    } catch (e) {
        res.status(500).send(e)
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
        res.status(500).sende
    }
})

// Delete user board by id
router.delete('/user/boards/:id', auth, async (req, res) => {
    try {
        const board = await Board.findById({_id: req.params.id})
        if(!board){
            return res.status(404).send({error: 'Board not found.'})
        }
        board.remove()
        res.status(200).send({message: 'Board was successfully deleted.'})
    } catch (e) {
        res.status(400).send(e)
    }
})


module.exports = router
