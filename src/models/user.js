const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Board = require('./board')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email format is invalid.')
            }
        }
    },
    password: {
        type: String,
        require: true,
        trim: true,
        minLength: 8,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw Error('Not a strong password.')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('board', {
    ref: 'Board',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.tokens
    delete userObject.password
    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findUser = async (email, password) => {
    const user = await User.findOne({email}).exec()
    if (!user) {
        throw new Error('User not found.')
    }

    const isPassMatch = await bcrypt.compare(password, user.password)

    if (!isPassMatch) {
        throw new Error('Wrong password')
    }
    return user
}


// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// Delete user board when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Board.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model('User', userSchema)
module.exports = User
