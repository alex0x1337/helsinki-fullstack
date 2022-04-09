import { useDispatch } from 'react-redux'
import blogService from '../services/blogs'
import { updateBlog } from '../reducers/blogReducer'

const Comments = ({ blog }) => {
    const dispatch = useDispatch()

    const add = async (event) => {
        event.preventDefault()
        console.log('adding comment ', event.target.text.value)
        let newBlog = { ...blog }
        newBlog.comments = (newBlog.comments ? newBlog.comments : []).concat({ text : event.target.text.value })
        await blogService.addComment(blog.id, newBlog.comments[newBlog.comments.length-1])
        dispatch(updateBlog(newBlog))
        event.target.text.value=''
    }
    return <div className="comments">
        <h3>Comments</h3>
        <form onSubmit={add}>
            <input type="text" name="text" required /><button type="submit">add comment</button>
        </form>
        <ul>
            {(blog.comments ? blog.comments : []).map((comment, id) => <li key={id}>{comment.text}</li>)}
        </ul>
    </div>
}

export default Comments