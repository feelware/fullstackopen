import { createSlice } from '@reduxjs/toolkit'
import anecdotesService from '../services/anecdotesService'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote: (state, action) => {
      state.push(action.payload)
    },
    addVote: (state, action) => {
      const id = action.payload
      return state.map(a => a.id === id
        ? { ...a, votes: a.votes + 1 }  
        : a
      )
    },
    setAnecdotes: (state, action) => {
      return action.payload
    }
  }
})


const sliceActions = anecdoteSlice.actions

export const initializeAnecdotes = () => (
  async dispatch => {
    const initialAnecdotes = await anecdotesService.getAll()
    dispatch(sliceActions.setAnecdotes(initialAnecdotes))
  }
)

export const createAnecdote = (content) => (
  async dispatch => {
    const newAnecdote = await anecdotesService.createNew(content)
    dispatch(sliceActions.appendAnecdote(newAnecdote))
  }
)

export const addVote = anecdote => (
  async dispatch => {
    await anecdotesService.addVote(anecdote)
    dispatch(sliceActions.addVote(anecdote.id))
  }
)

export default anecdoteSlice.reducer