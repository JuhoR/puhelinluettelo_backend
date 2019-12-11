const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
//morgan.token('body', (req) => JSON.stringify(req.body))
app.use(cors())
app.use(bodyParser.json())
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
let people=[
  {name: "Petteri",
  number:"123-45678",
  id:1},
  {name: "Juho",
  number: "222-2222",
  id:2}
]

app.get("/api/persons", (req, res) => {
  res.json(people)
})

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  const person = people.find(p => p.id === id)

  if (person){
      res.json(person)
  }
  else {
    res.status(404).end()
  }

})

app.get("/info", (req, res) => {
  const date = new Date()
  res.send(`<p>Phonebook has info for ${people.length} people </p>
    <p> ${date}</p>`)
})

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  people = people.filter(p => p.id !== id)
  res.status(204).end()
})

const generate_id = () => {
  return Math.floor(Math.random() * Math.floor(100))
}

app.post("/api/persons", (req, res) => {
  const body = req.body
  console.log(body)
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
  console.log(people.find(p => p.name === 'dhfdh'))
  if (people.find(p => p.name === name)) {
    return response.status(400).json({
      error: 'Name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generate_id()
  }
  people = people.concat(person)
  res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
