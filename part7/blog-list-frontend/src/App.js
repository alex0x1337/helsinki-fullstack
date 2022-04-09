import { useEffect, useRef } from 'react'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { createNotification } from './reducers/notificationReducer'
import { initializeBlogs, setBlogs } from './reducers/blogReducer'
import { useDispatch, useSelector } from 'react-redux'
import './index.css'
import { initializeUser, setUser } from './reducers/userReducer'
import UsersPage from './components/UsersPage'
import UserPage from './components/UserPage'
import BlogPage from './components/BlogPage'
import {
    BrowserRouter as Router,
    Routes, Route, Link
} from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'
import BlogList from './components/BlogList'

const App = () => {
    const blogFormRef = useRef()
    const dispatch = useDispatch()
    const blogs = useSelector(state => state.blogs)
    const user = useSelector(state => state.user)

    useEffect(() => {
        dispatch(initializeBlogs())
    }, [dispatch])

    useEffect(() => {
        dispatch(initializeUser())
    }, [dispatch])

    const notify = (message, success) => {
        dispatch(createNotification({ success: success, message: message }))
    }
    const handleLogin = async ({ username, password }) => {
        try {
            const user = await loginService.login({ username, password })
            window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
            blogService.setToken(user.token)
            dispatch(setUser(user))
            notify('logging in', true)
        } catch (exception) {
            notify('Wrong username or password')
            return false
        }
        return true
    }

    const handleLogout = () => {
        window.localStorage.clear()
        dispatch(setUser(null))
        notify('logged out', true)
    }

    const handleCreateBlog = async (blogObject) => {
        try {
            const blog = await blogService.create(blogObject)
            blogFormRef.current.toggleVisibility()
            dispatch(setBlogs(blogs.concat(blog)))
            notify(`created blog ${blogObject.title}`, true)
        } catch (error) {
            notify('failed to create blog')
            return false
        }
        return true
    }

    const loginForm = () => (
        <Togglable buttonLabel="log in">
            <LoginForm login={handleLogin} />
        </Togglable>
    )

    const createBlogForm = () => (
        <Togglable buttonLabel="create blog" ref={blogFormRef}>
            <CreateBlogForm createBlog={handleCreateBlog} />
        </Togglable>
    )

    if(user === null) {
        return <div>
            <h2>blogs</h2>
            <Notification />
            {loginForm()}
        </div>
    }
    const padding = { padding: '1em' }

    return (
        <Router>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#" as="span">
                            <Link style={padding} to="/">blogs</Link>
                        </Nav.Link>
                        <Nav.Link href="#" as="span">
                            <Link style={padding} to="/users">users</Link>
                        </Nav.Link>
                        <Nav.Link href="#" as="span">
                            {user
                                ? <em style={padding}>{user.name} logged in <button onClick={handleLogout}>logout</button></em>
                                : <Link style={padding} to="/login">login</Link>
                            }
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <div className="container">
                <Notification />
                <Routes>
                    <Route path="/users/:id" element={<UserPage />} />
                    <Route path="/blogs/:id" element={<BlogPage />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/" element={<>
                        <h2>blog app</h2>
                        <h2>create new</h2>
                        <div>{createBlogForm()}</div>
                        <BlogList />
                    </>} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
