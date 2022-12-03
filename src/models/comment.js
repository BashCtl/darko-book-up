const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        trim: true,
        require: true
    },
    note: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Note'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment
