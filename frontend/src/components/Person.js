import React from 'react'

const Person = ({name, number, removeHandler}) =>{
  return <p> {name} {number} <button onClick={removeHandler}>delete</button></p>
}

export default Person
