import { useQuery } from "@apollo/client"
import { useState } from "react"
import { ALL_BOOKS } from "../queries"

const Books = (props) => {
  const [filter, setFilter] = useState(null)
  const result = useQuery(ALL_BOOKS, {
    variables: { genre: filter },
    fetchPolicy: "network-only"
  })
  const books = result.loading ? [] : result.data.allBooks
  if (!props.show) {
    return null
  }
  let genres = books.reduce((genres, book) => {
    for (let key in book.genres) {
      genres.add(book.genres[key])
    }
    return genres
  }, new Set())
  genres = [...genres]

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map(genre => (
          <button key={genre} className={filter === genre ? 'btn-primary' : 'btn-secondary'} onClick={() => setFilter(genre)}>{genre}</button>
        ))}
        <button className={filter ? 'btn-secondary' : 'btn-primary'} onClick={() => setFilter(null)}>All genres</button>
      </div>
    </div>
  )
}

export default Books
