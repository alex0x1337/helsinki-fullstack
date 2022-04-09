import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { initializeUsers } from '../reducers/usersReducer'

const UserPage = () => {
    const users = useSelector(state => state.users)
    const id = useParams().id
    if(users.length === 0) {
        return null
    }
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(initializeUsers())
    }, [dispatch])
    const user = users.find(n => n.id === id)
    if(user === undefined) {
        return null
    }
    return <>
        <h1>{user.name}</h1>
        <h3>added blogs</h3>
        <div>
            <ul>
                {user.blogs.map((blog) => <li key={blog.id}>{blog.title}</li> )}
            </ul>
        </div>
    </>
}


export default UserPage