require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())
//morgan.token('body', (req) => JSON.stringify(req.body))
app.use(cors())

// Tehtävä 3.8: kustomoitu morgan token
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


app.use(express.static('build'))

// Hae kaikki tietokannassa olevat henkilöt
app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people.map(p => p.toJSON()))
  });
});

// Hae yksittäisen henkilön tiedot
app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id).then(p => {
    if (p) {
      res.json(p.toJSON())
    }else{
      res.status(404).end()
    }
  }).catch(error => next(error))
})


// Tilasto tietokannassa olevista henkilöistä
app.get("/info", (req, res) => {
  const date = new Date()
  Person.find({}).then(people => {
    res.send(`<p>Phonebook has info for ${people.length} people </p>
      <p> ${date}</p>`)
  })
})


// Henkilön poisto: delete pyyntö /api/persons/:id
app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})


// henkilön lisääminen tietokantaan
app.post("/api/persons", (req, response, next) => {
  const body = req.body
  //console.log(body)
  if (!body.name) {
    return response.status(400).json({
      error: 'Name missing'
    })
  }
  else if (!body.number){
    return response.status(400).json({
      error: 'Number missing'
    })
  }

  const name = body.name
  Person.find({name: name}).then(people => {
    if (people.find(p => p.name === name)) {
      return response.status(400).json({
        error: 'Name must be unique'
      })
    }
  }).catch(error => next(error))

  const person = new Person({
    name: body.name,
    number: body.number,
    //id: generate_id()
  })
  person.save().then(saved => {response.json(saved.toJSON())}).catch(error => next(error))
})


// Henkilön tietojen päivittäminen: put pyyntö /api/persons/:id
app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
      if (updatedPerson) {
        res.json(updatedPerson.toJSON())
      } else{
        res.status(404).end()
      }

    })
    .catch(error => next(error))
})


// Pyyntö olemattomaan endpointtiin
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


// Virheiden käsittelijä
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
