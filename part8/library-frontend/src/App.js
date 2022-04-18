import { useApolloClient, useSubscription } from '@apollo/client'
import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import Notification from './components/Notification'
import Recommend from './components/Recommend'
import { ALL_BOOKS, BOOK_ADDED } from './queries'

const updateCache = (cache, query, addedBook) => {
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }
  cache.updateQuery(query, data => {
    return {
      allBooks: uniqByTitle(data.allBooks.concat(addedBook)),
    }
  })
}


const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('user-token'))
  const [notification, setNotification] = useState({})
  const client = useApolloClient()

  const setError = (error, variant = 'danger') => {
    setNotification({ message: error, variant })
    setTimeout(() => setNotification({}), 5000)
  }
  
  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData, client }) => {
      const bookAdded = subscriptionData.data.bookAdded
      setError(`${bookAdded.title} added`, 'info')
      updateCache(client.cache, { query: ALL_BOOKS, variables: { genre: null } }, bookAdded)
    }
  })

  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && <button onClick={() => setPage('recommend')}>recommend</button>}
        {token ? <button onClick={onLogout}>Log out</button> : <button onClick={() => setPage('login')}>login</button>}
      </div>
      <Notification message={notification.message} variant={notification.variant} />

      <Authors show={page === 'authors'} loggedIn={!!token} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add' && token} setError={setError} />
      <Recommend show={page === 'recommend'} />
      <LoginForm show={page === 'login' && !token} setError={setError} setToken={setToken} />

    </div>
  )
}

export default App
