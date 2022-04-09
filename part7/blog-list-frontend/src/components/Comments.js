import { useDispatch } from 'react-redux'
import blogService from '../services/blogs'
import { updateBlog } from '../reducers/blogReducer'
import { createNotification } from '../reducers/notificationReducer'
import { Button, Form, Table } from 'react-bootstrap'

const Comments = ({ blog }) => {
    const dispatch = useDispatch()

    const notify = (message, success) => {
        dispatch(createNotification({ success: success, message: message }))
    }
    const add = async (event) => {
        event.preventDefault()
        console.log('adding comment ', event.target.text.value)
        let newBlog = { ...blog }
        newBlog.comments = (newBlog.comments ? newBlog.comments : []).concat({ text : event.target.text.value })
        await blogService.addComment(blog.id, newBlog.comments[newBlog.comments.length-1])
        dispatch(updateBlog(newBlog))
        notify(`added comment '${event.target.text.value}'`, true)
        event.target.text.value=''
    }
    return <div className="comments">
        <h3>Comments</h3>
        <Form onSubmit={add}>
            <Form.Control type="text" name="text" required /><br />
            <Button type="submit">add comment</Button>
        </Form>
        <br />
        <Table striped bordered hover>
            <tbody>
                {(blog.comments ? blog.comments : []).map((comment, id) => <tr key={id}>{comment.text}</tr>)}
            </tbody>
        </Table>
    </div>
}

export default Comments