import React from 'react'
import Person from './Person'

const Persons = ({persons, remover}) => {
  const rows = () => persons.map(person =>
    <Person
    key={person.name}
    name={person.name}
    number={person.number}
    removeHandler={() => remover(person.id)}
    />
  )

  return (
    <div>
    {rows()}
    </div>
  )
}

export default Persons
