const express = require('express')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const upload = require('../middleware/upload')

const router = new express.Router()

// User signup
router.post('/signup', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send({error: 'Empty body'})
    }
    const user = new User(req.body)
    if (await User.findOne({username: user.username})) {
        return res.status(400).json({error: 'User already exist.'})
    }
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (error) {
        res.status(500).send({error:error.message})
    }
})

// User login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findUser(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }
})

// Logout from current session
router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

// Logout from all sessions
router.post('/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

// Delete user
router.delete('/user/delete', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})



// Upload user avatar
router.post('/user/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer)
        .resize({width: 250, height: 250})
        .png().toBuffer()

    req.user.avatar = buffer
    await req.user.save()
    res.send({message: 'Successfully uploaded.'})
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

// Delete user avatar
router.delete('/user/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send({message: 'Avatar was deleted.'})
})

// Get user avatar
router.get('/user/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error('User not found.')
        }
        if (!user.avatar) {
            throw new Error('User avatar not found.')
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (err) {
        res.status(404).send(err.message)
    }
})
module.exports = router
