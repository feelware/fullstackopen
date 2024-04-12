import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import anecdoteService from './services/anecdoteService'
import { useNotifDispatch } from './NotifContext'

const App = () => {
  const queryClient = useQueryClient()

  const notifDispatch = useNotifDispatch()

  const updateMut = useMutation({
    mutationFn: anecdoteService.update,
    onSuccess: updated => {
      const oldAnecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(
        ['anecdotes'],
        oldAnecdotes.map(a => a.id === updated.id
          ? updated
          : a
        )
      )
    }
  })
  
  const handleVote = (anecdote) => {
    updateMut.mutate({
      id: anecdote.id,
      update: { votes: anecdote.votes + 1 }
    })
    notifDispatch({
      type: 'CREATE',
      payload: `anecdote '${anecdote.content}' voted`
    })
    setTimeout(() => {
      notifDispatch({ type: 'RESET' })
    }, 5000);
  }

  const queryObj = useQuery({
    queryKey: ['anecdotes'],
    queryFn: anecdoteService.getAll,
    retry: 1
  })

  if (queryObj.isLoading) {
    return <div>loading data...</div>
  }

  if (queryObj.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = queryObj.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
