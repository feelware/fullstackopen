import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification: (state, action) => {
      return action.payload
    },
    clearNotification: () => {
      return ''
    }
  }
})

export default notificationSlice.reducer

const actions = notificationSlice.actions

export const setNotification = (message, timeout) => (
  dispatch => {
    dispatch(actions.setNotification(message))
    setTimeout(() => {
      dispatch(actions.clearNotification())
    }, timeout);
  }
)