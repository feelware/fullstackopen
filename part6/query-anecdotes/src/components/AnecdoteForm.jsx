import { useMutation, useQueryClient } from '@tanstack/react-query'
import anecdoteService from '../services/anecdoteService'
import { useNotifDispatch } from '../NotifContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const notifDispatch = useNotifDispatch()

  const creationMut = useMutation({
    mutationFn: anecdoteService.create,
    onSuccess: created => {
      const oldAnecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(
        ['anecdotes'],
        oldAnecdotes.concat(created)
      )
    },
    onError: error => {
      notifDispatch({
        type: 'CREATE',
        payload: 'too short anecdote, must have length 5 or more'
      })
      setTimeout(() => {
        notifDispatch({ type: 'RESET' })
      }, 5000);
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    creationMut.mutate({
      content,
      votes: 0
    })
    notifDispatch({
      type: 'CREATE',
      payload: `anecdote '${content}' created`
    })
    setTimeout(() => {
      notifDispatch({ type: 'RESET' })
    }, 5000);
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
