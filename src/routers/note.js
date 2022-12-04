const auth = require("../middleware/auth");
const Comment = require("../models/comment");
const Note = require("../models/note");
const express = require("express");
const Board = require("../models/board");

const router = new express.Router()

// Create new note on board by its id
router.post('/board/notes/:id', auth, async (req, res) => {
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
router.patch('/board/notes/:id', auth, async (req, res) => {
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
router.get('/board/notes/:id', auth, async (req, res) => {
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

// delete note by its id
router.delete('/board/notes/:id', auth, async (req, res) => {
    try {
        const note = await Note.findById({_id: req.params.id})
        if (!note) {
            return res.status(404).send({error: 'Note not found'})
        }
        note.remove()
        res.status(200).send({message: "Note was successfully deleted!"})
    } catch (e) {
        res.status(500).send(e)
    }
})

// like note by its id
router.post('/board/notes/likes/:id', auth, async (req, res) => {
    try {
        const note = await Note.findById({_id: req.params.id})
        if (!note) {
            return res.status(404).send({error: 'Note not found'})
        }
        const like = note.likes.find(_id => _id.equals(req.user._id))
        if (!like) {
            note.likes.push(req.user._id)
            const dislikeIndex = note.dislikes.indexOf(req.user._id)
            if (dislikeIndex !== -1) {
                note.dislikes.splice(dislikeIndex, 1)
            }
            await note.save()
        }
        res.send(note)
    } catch (e) {
        res.status(500).send(e)
    }
})

// dislike note by its id
router.post('/board/notes/dislikes/:id', auth, async (req, res) => {
    try {
        const note = await Note.findById({_id: req.params.id})
        if (!note) {
            return res.status(404).send({error: 'Note not found'})
        }
        const dislike = note.dislikes.find(_id => _id.equals(req.user._id))
        if (!dislike) {
            note.dislikes.push(req.user._id)
            const likeIndex = note.likes.indexOf(req.user._id)
            if (likeIndex !== -1) {
                note.likes.splice(likeIndex, 1)
            }
            await note.save()
        }

        res.send(note)
    } catch (e) {
        res.status(500).send(e)
    }
})

// add comment for note by it's id
router.post('/board/notes/comments/:id', auth, async (req, res) => {
    const comment = req.body.comment

    if (!comment) {
        return res.status(400).send({error: 'Empty comment'})
    }
    try {
        const commentObj = new Comment({comment, note: req.params.id, owner: req.user._id})
        await commentObj.save()
        res.send(commentObj)
    } catch (e) {
        res.status(500).send(e)
    }

})

module.exports = router
