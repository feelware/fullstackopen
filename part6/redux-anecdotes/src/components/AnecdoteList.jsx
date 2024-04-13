import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
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

  const vote = anecdote => {
    dispatch(addVote(anecdote))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
  }

  return anecdotes.map(anecdote => <Anecdote
      key={anecdote.id}
      anecdote={anecdote} 
      onClick={() => vote(anecdote)}
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