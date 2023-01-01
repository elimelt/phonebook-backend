const express = require("express")
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
morgan.token('content', function getId (req) {
    return JSON.stringify(req.body)
})
const format = ':method :url :status :total-time[2] :content'
app.use(express.json())
app.use(morgan(format))

let persons = [
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

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.get('/info', (req, res) => {
    
    res.send(`
        <div>Phonebook has info for ${persons.length} people</div> 
        <br> 
        <div>${new Date()}</div>
    `)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

const generateId = () => Math.floor(Math.random()*10000)

app.post('/api/persons', (req, res) => {
    const body = req.body
    console.log('req.body', req.body)

    if (!body) 
        return res.status(400).json({error:'content missing'})
    if (!body.name || !body.number) 
        return res.status(400).json({error: 'missing info'})
    
    let isUnique = true    
    persons.forEach(person => {
        if (person.name === body.name) isUnique = false
    })

    if (!isUnique) 
        return res.status(400).json({error: `${body.name} already in phonebook`})

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    res.json(person)
})



const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)



PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})