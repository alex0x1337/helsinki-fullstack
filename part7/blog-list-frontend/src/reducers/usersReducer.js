import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const usersSlice = createSlice({
    name: 'users',
    initialState: [],
    reducers: {
        setUsers(state, action) {
            return action.payload
        }
    }
})

export const initializeUsers = () => {
    return async dispatch => {
        const users = await axios.get('http://localhost:3003/api/users')
        dispatch(setUsers(users.data))
    }
}

export const { setUsers } = usersSlice.actions
export default usersSlice.reducer