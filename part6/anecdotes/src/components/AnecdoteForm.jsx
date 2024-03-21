import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const submit = e => {
    e.preventDefault()
    dispatch(createAnecdote(e.target[0].value))
    e.target[0].value = ''
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={submit}>
        <div>
          <input />
        </div>
        <button type='submit'>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm