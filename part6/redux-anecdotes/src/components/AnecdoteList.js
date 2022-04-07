import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => { 
    const anecdotes = useSelector(state => state.anecdote.filter(anecdote => 
        anecdote.content.toLowerCase().indexOf(state.filter.toLowerCase()) !== -1))
    const dispatch = useDispatch()
    const voteHandler = (anecdote) => {
        dispatch(voteAnecdote(anecdote))
        dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
    }
    return <>
        {anecdotes.map(anecdote =>
            <div key={anecdote.id}>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={() => voteHandler(anecdote)}>vote</button>
            </div>
            </div>
        )}
    </>
}
export default AnecdoteList