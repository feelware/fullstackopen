const express = require('express')
const cors = require('cors')

const morgan = require('morgan')
morgan.token('body', req => JSON.stringify(req.body))

const app = express()
app.use(express.json())
app.use(express.static('dist'))
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

app.get('/api/persons/:id', (req, res) => {
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
        .catch(error => {
            console.log(error)
            res.status(400).json({
                error: 'malformatted id'
            })
        })
})

app.delete('/api/persons/:id', (req, res) => {
    Person
        .findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => {
            console.log(error)
            res.status(400).json({
                error: 'malformatted id'
            })
        })
})

app.post('/api/persons', (req, res) => {
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
        })
})

app.put('/api/persons/:id', (req, res) => {
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
        .findByIdAndUpdate(req.params.id, {
            name: body.name,
            number: body.number
        }, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson).end()
        })
        .catch(error => {
            console.log(error)
            res.status(500).end()
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)