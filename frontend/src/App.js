import React, { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import FilterForm from './components/FilterForm'
import PersonService from './services/PersonService'
import Notification from './components/Notification'

const App = () => {
  const [ persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter] = useState('')
  const [ successMessage, setSuccess ] = useState(null)
  const [ errorMessage, setError ] = useState(null)

  const successStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }
  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  // Haetaan henkilöt json palvelimelta
  useEffect(() => {
    PersonService
      .getAll()
      .then(p => {
        setPersons(p)
      })
  }, [])

  // persons taulukkoon henkilön lisäävä funktio (tapahtumakäsittelijä)
  const addPerson = (event) => {
      event.preventDefault()
      const person = {
        name: newName,
        number: newNumber
      }
      const filt = persons.filter(p => p.name === person.name)
      filt.length > 0
        ? changeNumber(person, filt[0].id)
        : PersonService
            .create(person)
            .then(returned => {
              setPersons(persons.concat(returned))
              setSuccess(`Added ${person.name}`)
              setTimeout(() => setSuccess(null), 5000)
            }).catch(error =>{
              //console.log(error.response.data.error)
              setError(`${error.response.data.error}`)
              setTimeout(() => setError(null), 5000)
            });
      setNewName('')
      setNewNumber('')
  }

  const changeNumber = (person, id) => {
    if (window.confirm(`${person.name} is already added to phonebook, replace the old number with the new?`)) {
      PersonService
        .update(id, person)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== id ? p : returnedPerson))
          setSuccess(`Changed number for ${person.name}`)
          setTimeout(() => setSuccess(null), 5000)
        })
        .catch(error => {
          setError(`Information of ${person.name} has already been removed from the server`)
          setTimeout(() => setError(null), 5000)
        })
    }
  }

  // Nimikentän muutoksen havaitseva tapahtumakäsittelijä
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  // Numerokentän muutoksen havaitseva tapahtumakäsittelijä
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  // filtterin muutoksen havaitseva tapahtumakäsittelijä
  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const personRemover = (id) => {
    if (window.confirm(`Delete ${persons.find(p => p.id === id).name}?`)) {
      PersonService
        .removePerson(id)
        .then(r => setPersons(persons.filter(p => p.id !== id )))
    }
  }
  // renderöitävät henkilöt sisältävä lista
  const shownPersons = persons.filter(p => p.name.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} style={errorStyle} />
      <Notification message={successMessage} style={successStyle} />
      <FilterForm filter={newFilter} handler={handleFilterChange} />
      <h3>Add new</h3>
      <PersonForm submitHandler={addPerson} newName={newName} newNumber={newNumber} nameChangeHandler={handleNameChange} numberChangeHandler={handleNumberChange}/>
      <h3>Numbers</h3>
      <Persons persons={shownPersons} remover={personRemover} />
    </div>
  )

}

export default App
