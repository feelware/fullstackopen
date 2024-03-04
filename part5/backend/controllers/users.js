const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const { userExtractor } = require('../utils/middleware')
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
    .populate('blogs', { url: 1, title: 1, author: 1 })
  res.json(users)
})

usersRouter.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate('blogs', { url: 1, title: 1, author: 1 })
  user
    ? res.json(user)
    : res.status(404).json({ error: 'user not found' })
})

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (password.length < 3) {
    res.status(400).json({
      error: 'password must be at least 3 characters long'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  res.status(201).json(savedUser)
})

usersRouter.put('/:id', userExtractor, async (req, res) => {
  const userToUpdate = await User.findById(req.params.id)

  if (!userToUpdate) {
    res.status(404).json({
      error: 'user not found'
    })
  }

  const currUser = req.user

  if (userToUpdate._id.toString() !== currUser._id.toString()) {
    return res.status(401).json({
      error: 'unauthorized user'
    })
  }

  const update = req.body

  const options = {
    new: true,
    runValidators: true,
    context: 'query'
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    update,
    options
  )

  res.status(201).json(updatedUser)
})

module.exports = usersRouter
