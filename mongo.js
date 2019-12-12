const mongoose = require('mongoose')
mongoose.set('useUnifiedTopology', true);

if ( process.argv.length<3 ) {
  console.log('password required as an argument')
  process.exit(1)
}
const password = process.argv[2]

const url = `mongodb+srv://JR:${password}@cluster0-i6vk3.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length<5) {
  console.log('Phonebook:')
  Person.find({}).then(result => {
  result.forEach(person => {
    console.log(`${person.name} ${person.number}`)
  })
  mongoose.connection.close()
})
}
else {
  newName = process.argv[3]
  newNumber = process.argv[4]

  const person = new Person({
    name: newName,
    number: newNumber
  })

  person.save().then(response => {
    console.log(`added ${newName} number ${newNumber} to phonebook`);
    mongoose.connection.close();
  })
}
