const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    message: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
})

const boardSchema = new mongoose.Schema({
    description: {
        type: String,
        require: true,
        trim: true
    },
    notes: {
        type: [noteSchema],
        require: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Board = mongoose.model('Board', boardSchema)
const Note = mongoose.model('Note', noteSchema)

module.exports = {Board, Note}
