const express = require('express')
const auth = require("../middleware/auth");
const Comment = require("../models/comment");

const router = new express.Router()

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

// like comment by id
router.post('/comments/likes/:id', auth, async (req, res) => {
    try {
        const comment = await Comment.findById({_id: req.params.id})
        if (!comment) {
            return res.status(404).send({error: 'Comment not found.'})
        }
        const like = comment.likes.find(_id => _id.equals(req.user._id))
        if (!like) {
            comment.likes.push(req.user._id)
            const dislike = comment.dislikes.indexOf(req.user._id)
            if (dislike !== -1) {
                comment.dislikes.splice(dislike, 1)
            }
            await comment.save()
        }
        res.send(comment)
    } catch (e) {
        res.status(500).send(e)
    }
})

// dislike comment by id

router.post('/comments/dislikes/:id', auth, async (req, res) => {
    try {
        const comment = await Comment.findById({_id: req.params.id})
        if (!comment) {
            return res.status(404).send({error: 'Comment not found.'})
        }
        const dislike = comment.dislikes.find(_id => _id.equals(req.user._id))
        if (!dislike) {
            comment.dislikes.push(req.user._id)
            const like = comment.likes.indexOf(req.user._id)
            if (like !== -1) {
                comment.likes.splice(like, 1)
            }
            await comment.save()
        }
        res.send(comment)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router
