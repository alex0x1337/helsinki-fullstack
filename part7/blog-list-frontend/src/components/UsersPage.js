import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { initializeUsers } from '../reducers/usersReducer'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const UsersPage = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(initializeUsers())
    }, [dispatch])
    const users = useSelector(state => state.users)
    console.log('users', users)
    if(users.length === 0) {
        return null
    }
    console.log(users)
    return <>
        <h2>Users</h2>
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>User name</th>
                        <th>Blogs created</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) =>
                        <tr key={user.id}>
                            <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
                            <td>{user.blogs.length}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    </>
}


export default UsersPage