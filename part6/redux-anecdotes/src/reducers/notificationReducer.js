import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    notify(state, action) {
      return action.payload
    },
    clear(state, action) {
      return null
    }
  },
})


export const setNotification = (message, timeout = 5) => {
  return dispatch => {
    dispatch(notify(message))
    setTimeout(() => dispatch(clear()), timeout * 1000)
  }
}

export const { notify, clear } = notificationSlice.actions
export default notificationSlice.reducer