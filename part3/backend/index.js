const express = require('express')
const cors = require('cors')

const morgan = require('morgan')
morgan.token('body', req => JSON.stringify(req.body))

const app = express()
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

require('dotenv').config()

const Person = require('./models/Person')

app.get('/info', (req, res) => {
    Person.find({}).then(persons => {
        const date = new Date().toDateString()
        res.send(`
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${date}</p>
        `)  
    })
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person
        .findById(req.params.id)
        .then(person => {
            if (person) {
                return res.send(person)
            }
            return res.status(404).json({
                error: 'person not found'
            })
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person
        .findByIdAndDelete(req.params.id)
        .then(result => {
            if (result) {
                return res.status(204).end()
            }
            res.status(404).json({
                error: 'person not found'
            })
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    Person
        .find({ name: body.name })
        .then((duplicates) => {
            if (duplicates.length) {
                return res.status(409).json({
                    error: 'name already exists'
                })
            }

            const newPerson = new Person({
                name: body.name,
                number: body.number,
            })

            newPerson
                .save()
                .then((savedPerson) => {
                    res.send(savedPerson).end()
                })
                .catch(error => next(error))
        })
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({
            error: 'no name provided'
        })
    }

    if (!body.number) {
        return res.status(400).json({
            error: 'no number provided'
        })
    }

    Person
        .findByIdAndUpdate(
            req.params.id, 
            {
                name: body.name,
                number: body.number
            },
            { 
                new: true,
                runValidators: true,
                context: 'query' 
            })
        .then(updatedPerson => {
            res.json(updatedPerson).end()
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.errors)
  
    if (error.name === 'CastError') {
        return response.status(400).send({
            error: 'malformatted id',
            type: error.name
        })
    }

    if (error.name === 'ValidationError') {
        return response.status(400).send({ 
            error: error.message,
            type: error.name
        })
    }
  
    next(error)
}
  
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)