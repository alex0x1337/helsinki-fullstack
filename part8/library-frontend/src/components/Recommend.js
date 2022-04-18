import { useQuery } from "@apollo/client"
import { useEffect } from "react"
import { ALL_BOOKS, ME } from "../queries"

const Recommend = (props) => {
  const user = useQuery(ME)
  const result = useQuery(ALL_BOOKS, {
    variables: { genre: user.data?.me?.favoriteGenre },
    fetchPolicy: "network-only",
    skip: user.loading
  })
  useEffect(() => {
    result.refetch()
  }, [props.show]) // eslint-disable-line
  const books = (result.loading || user.loading) ? [] : result.data.allBooks
  if (!props.show) {
    return null
  }
  console.log('data', user.data)
  return (
    <div>
      <h1><b>recommendations</b></h1>
      <h2>books in your favorite genre <b>{user.data?.me?.favoriteGenre}</b></h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th><b>author</b></th>
            <th><b>published</b></th>
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
    </div>
  )
}

export default Recommend
