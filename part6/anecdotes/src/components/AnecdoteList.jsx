import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'
import PropTypes from 'prop-types'

const Anecdote = ({ anecdote, onClick }) => {
  return (
    <div>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={onClick}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  const anecdotes = useSelector(state => 
    state.anecdotes
      .filter(a => a.content.includes(state.filter))
      .sort((a, b) => b.votes > a.votes)
  )
  
  const dispatch = useDispatch()

  const vote = id => {
    dispatch(addVote(id))
    const votedAnecdote = anecdotes.find(a => a.id === id)
    dispatch(setNotification(`you voted '${votedAnecdote.content}'`))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }

  return anecdotes.map(anecdote => <Anecdote
      key={anecdote.id}
      anecdote={anecdote} 
      onClick={() => vote(anecdote.id)}
    />
  )
}

Anecdote.propTypes = {
  anecdote: PropTypes.shape({
    content: PropTypes.string,
    votes: PropTypes.number
  }),
  onClick: PropTypes.func
}

export default AnecdoteList