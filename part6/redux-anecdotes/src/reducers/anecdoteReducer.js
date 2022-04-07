import anecdoteService from '../services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

export const create = (anecdote) => ({ type: 'CREATE', data: asObject(anecdote) })

export const vote = (id) => ({ type: 'VOTE', data: { id: id } })

export const setAnecdotes = (anecdotes) => ({ type: 'SET_ANECDOTES', data: anecdotes })

export const appendAnecdote = (anecdote) => ({ type: 'APPEND_ANECDOTE', data: anecdote })

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}


export const createAnecdote = content => {
  return async dispatch => {
    const newNote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newNote))
}}


export const voteAnecdote = anecdote => {
  return async dispatch => {
    await anecdoteService.update(anecdote.id, { ...anecdote, votes: anecdote.votes + 1 })
    dispatch(vote(anecdote.id))
}}

const initialState = []

const byVote = (a, b) => b.votes - a.votes

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE':
      return state.concat(action.data).sort(byVote)
    case 'VOTE':
      return state.map(anecdote => anecdote.id !== action.data.id ? anecdote : { ...anecdote, votes: anecdote.votes + 1 }).sort(byVote)
    case 'SET_ANECDOTES':
      return [...action.data].sort(byVote)
    case 'APPEND_ANECDOTE':
      return [ ...state, action.data ].sort(byVote)
    default:
      return state
  }

}

export default reducer