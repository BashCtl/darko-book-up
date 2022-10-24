const {Board, Note} = require('../models/board')
const express = require('express')
const auth = require('../middleware/auth')

const router = new express.Router()

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

router.post('/user/board/notes/:id', auth, async (req, res) => {
    const message = req.body.message

    if (!message) {
        return res.status(400).send({error: 'Empty note'})
    }
    try {
        const board = await Board.findOne({_id: req.params.id})
        const note = new Note({message})
        board.notes.push(note)
        await board.save()
        res.send(board)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/user/boards', auth, async (req, res) => {
    try {
        const boards = await Board.find({owner: req.user._id})
        res.send(boards)
    } catch (error) {
        res.status(404).send(error)
    }
})

router.delete('/user/boards/:id', auth, async (req, res) => {
    try {
        await Board.findByIdAndDelete({_id: req.params.id})
        res.sendStatus(200)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/user/boards', auth, async (req, res) => {
    try {
        await Board.deleteMany({owner: req.user._id})
        res.sendStatus(200)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router
