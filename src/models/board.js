const mongoose = require('mongoose')
const Note = require('../models/note')

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

module.exports = Board
