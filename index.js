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

/*app.use(morgan((tokens, req, res) => {
  const method = tokens.method(req, res)
  if (method === 'POST') {
    return [
      method,
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.body(req)
    ].join(' ')
  }
  else {
    return [
      method,
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
  }
}))*/
app.use(morgan('tiny'))
app.use(express.static('build'))
/*let people=[
  {name: "Petteri",
  number:"123-45678",
  id:1},
  {name: "Juho",
  number: "222-2222",
  id:2}
]*/

/*app.get("/api/persons", (req, res) => {
  res.json(people)
})*/
app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people.map(p => p.toJSON()))
  });
});

/*app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  const person = people.find(p => p.id === id)

  if (person){
      res.json(person)
  }
  else {
    res.status(404).end()
  }

})*/
app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id).then(p => {
    if (p) {
      res.json(p.toJSON())
    }else{
      res.status(404).end()
    }
  }).catch(error => next(error))
})

app.get("/info", (req, res) => {
  const date = new Date()
  Person.find({}).then(people => {
    res.send(`<p>Phonebook has info for ${people.length} people </p>
      <p> ${date}</p>`)
  })
})

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post("/api/persons", (req, res, next) => {
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
  person.save().then(saved => {res.json(saved.toJSON())}).catch(error => next(error))
})


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

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

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

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
