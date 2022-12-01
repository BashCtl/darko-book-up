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
const Note = mongoose.model('Note', noteSchema)
module.exports = Note
