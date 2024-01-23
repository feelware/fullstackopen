const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('dist'))

const cors = require('cors')
app.use(cors())

const morgan = require('morgan')
morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let data = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]

app.get('/info', (req, res) => {
    const date = new Date().toDateString()
    res.send(`
        <p>Phonebook has info for ${data.length} people</p>
        <p>${date}</p>
    `)
})

app.get('/api/persons', (req, res) => {
    res.json(data)
})

app.get('/api/persons/:id', (req, res) => {
    const person = data.find(person => person.id.toString() === req.params.id)
    if (person) {
        return res.send(person)
    }
    res.status(404).send('person not found')
})

app.delete('/api/persons/:id', (req, res) => {
    data = data.filter(person => person.id.toString() !== req.params.id)
    res.status(204).end()
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

    if (data.map(p => p.name).includes(body.name)) {
        return res.status(409).json({
            error: 'name already exists'
        })
    }

    const new_note = {
        id: Math.floor(Math.random() * 1000000),
        name: body.name,
        number: body.number,
    }
    
    data = data.concat(new_note)

    res.send(new_note)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)