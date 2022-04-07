import { connect } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {
    const createNew = async (event) => {
        event.preventDefault()
        const content = event.target.content.value
        event.target.content.value = ''
        props.createAnecdote(content)
        props.setNotification(`created new anecdote '${content}'`, 5)
    }
    return (
        <form onSubmit={createNew}>
            <div><input name="content" /></div>
            <button>create</button>
        </form>
    )
}
export default connect(null, { createAnecdote, setNotification })(AnecdoteForm)