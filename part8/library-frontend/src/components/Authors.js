import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import Select from 'react-select'
import { ALL_AUTHORS, SET_BIRTHYEAR } from '../queries'



const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  const [born, setBorn] = useState('')
  const [name, setName] = useState('')
  const authors = result.loading ? [] : result.data.allAuthors
  const [ setBirthYear ] = useMutation(SET_BIRTHYEAR, { refetchQueries: [  {query: ALL_AUTHORS} ]})
  if (!props.show) {
    return null
  }
  const names = authors.map(author => ({ value: author.name, label: author.name }))


  const submit = (event) => {
    event.preventDefault()

    setBirthYear({  variables: { name: name.value, born } })

    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th>name</th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
               { /* <td>{a.bookCount}</td> */ }
            </tr>
          ))}
        </tbody>
      </table>
      { props.loggedIn && <>
          <h2>Set birthyear</h2>
          <form onSubmit={submit}>
            <div>name
              <Select
                defaultValue={name}
                onChange={setName}
                options={names}
              />
            </div>
            <br />
            <div>
              born
              <input
                type="number"
                value={born}
                onChange={({ target }) => setBorn(parseInt(target.value))}
              />
            </div>
            <button type="submit">Set birthyear</button>
          </form>
          </> }
    </div>
  )
}

export default Authors
