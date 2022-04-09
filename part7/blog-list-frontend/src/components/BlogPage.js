import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import blogService from '../services/blogs'
import { initializeBlogs, setBlogs } from '../reducers/blogReducer'
import { createNotification } from '../reducers/notificationReducer'
import { useEffect } from 'react'
import Comments from './Comments'

const BlogPage = () => {
    const user = useSelector(state => state.user)
    const blogs = useSelector(state => state.blogs)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(initializeBlogs())
    }, [dispatch])
    if (blogs === null) {
        return null
    }
    const id = useParams().id
    const blog = blogs.find(blog => blog.id === id)
    if (blog === undefined) {
        return null
    }

    const onRemove = async () => {
        if (!window.confirm(`Remove blog ${blog.title}?`)) {
            return
        }
        const blogId = blog.id
        try {
            await blogService.remove(blog.id)
            dispatch(setBlogs(blogs.filter((blog) => blog.id !== blogId)))
            navigate('/')
            notify(`removed blog ${blog.title}`, true)
        } catch (error) {
            notify('failed to remove blog')
        }
    }
    const notify = (message, success) => {
        dispatch(createNotification({ success: success, message: message }))
    }

    const handleLikeBlog = async (blogId) => {
        const blog = blogs.find((blog) => blog.id === blogId)
        if (blog) {
            try {
                const blogObject = {
                    user: blog.user.id,
                    likes: blog.likes+1,
                    author: blog.author,
                    title: blog.title,
                    url: blog.url,
                }
                const updatedBlog = await blogService.update(blogId, blogObject)
                dispatch(setBlogs(
                    blogs.map((blog) => blog.id !== blogId ? blog : updatedBlog)
                ))
                notify(`liked the post ${blog.title}`, true)
            } catch (error) {
                notify('failed to add like')
            }
        }
    }
    return (
        <div>
            <h1>{blog.title} {blog.author}</h1>
            <div className='blogUrl'>{blog.url}</div>
            <div className='blogLikes'>
                {blog.likes} <button onClick={() => handleLikeBlog(blog.id)}>like</button>
            </div>
            {blog.user && blog.user.username === user.username && (
                <div>
                    <button
                        onClick={onRemove}
                        style={{ backgroundColor: '#4085f6', borderRadius: 7 }}
                    >remove</button>
                </div>
            )}
            <Comments blog={blog} />
        </div>
    )
}

export default BlogPage