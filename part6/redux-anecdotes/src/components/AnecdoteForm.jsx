import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const submit = async e => {
    e.preventDefault()
    const content = e.target.note.value
    e.target.note.value = ''
    dispatch(createAnecdote(content))
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={submit}>
        <div>
          <input name='note' />
        </div>
        <button type='submit'>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm