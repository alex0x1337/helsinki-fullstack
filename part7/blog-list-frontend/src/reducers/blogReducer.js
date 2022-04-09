import { createSlice } from '@reduxjs/toolkit'
import blogsService from '../services/blogs'

const blogsSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        setBlogs(state, action) {
            return [...action.payload].sort(sortByLikes)
        },
        updateBlog(state, action) {
            return [...state].map(blog => blog.id !== action.payload.id ? blog : action.payload).sort(sortByLikes)
        }
    }
})

const sortByLikes = (a, b) => b.likes - a.likes

export const initializeBlogs = () => {
    return async dispatch => {
        const blogs = await blogsService.getAll()
        dispatch(setBlogs(blogs))
    }
}

export const { setBlogs, updateBlog } = blogsSlice.actions
export default blogsSlice.reducer