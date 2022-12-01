const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    message: {
        type: String,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Board'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId
    }]
}, {
    timestamps: true
})

const boardSchema = new mongoose.Schema({
    description: {
        type: String,
        require: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

boardSchema.virtual('notes', {
    ref: 'Note',
    localField: '_id',
    foreignField: 'owner'
})

boardSchema.pre('remove', async function (next) {
    const board = this
    await Note.deleteMany({owner: board._id})
    next()
})

const Board = mongoose.model('Board', boardSchema)
const Note = mongoose.model('Note', noteSchema)

module.exports = {Board, Note}
