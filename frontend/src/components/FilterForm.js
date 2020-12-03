import React from 'react'

const FilterForm = ({filter, handler}) => {
  return (
    <form>
    filter shown with <input value={filter} onChange={handler}/>
    </form>
  )
}

export default FilterForm
