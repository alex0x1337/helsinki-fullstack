import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    notify(state, action) {
      return { ...state, message: action.payload }
    },
    setTimeoutID(state, action) {
      if(state.timeout) {
        clearTimeout(state.timeout)
      }
      return { ...state, timeout: action.payload }
    },
    clear(state, action) {
      return {}
    }
  },
})

export const setNotification = (message, timeout = 5) => {
  return dispatch => {
    dispatch(notify(message))
    dispatch(setTimeoutID(setTimeout(() => dispatch(clear()), timeout * 1000)))
  }
}

export const { notify, clear, setTimeoutID } = notificationSlice.actions
export default notificationSlice.reducer