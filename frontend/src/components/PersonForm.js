import React from 'react'

const PersonForm = (props) => {
  return (
    <form onSubmit={props.submitHandler}>
      <div>
        name: <input value={props.newName} onChange={props.nameChangeHandler} />
      </div>
      <div>
        number: <input value={props.newNumber} onChange={props.numberChangeHandler} />
      </div>
      <div>
        <button type="submit"> add </button>
      </div>
    </form>
  )
}

export default PersonForm
