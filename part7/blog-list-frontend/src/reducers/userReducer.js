import { createSlice } from '@reduxjs/toolkit'
import blogsService from '../services/blogs'

const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        setUser(state, action) {
            return action.payload
        }
    }
})

export const initializeUser = () => {
    return async dispatch => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            dispatch(setUser(user))
            blogsService.setToken(user.token)
        }
    }
}

export const { setUser } = userSlice.actions
export default userSlice.reducer