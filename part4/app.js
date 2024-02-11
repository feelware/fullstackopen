const { MONGODB_URI } = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const middleware = require('./utils/middleware')
const { info, error } = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
info('connecting to', MONGODB_URI)
mongoose.connect(MONGODB_URI)
  .then(() => {
    info('connected to MongoDB')
  })
  .catch((err) => {
    error('error connecting to MongoDB:', err.message)
  })

app.use(require('cors')())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs', require('./controllers/bloglist'))
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
