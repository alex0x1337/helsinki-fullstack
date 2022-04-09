import { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form } from 'react-bootstrap'

const CreateBlogForm = ({ createBlog }) => {
    const [author, setAuthor] = useState('')
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')

    const handleCreateBlog = async (event) => {
        event.preventDefault()
        if (createBlog({ title, author, url })) {
            setTitle('')
            setUrl('')
            setAuthor('')
        }
    }

    return (
        <Form onSubmit={handleCreateBlog}>
            <div>
        title
                <Form.Control
                    type="text"
                    value={title}
                    name="title"
                    onChange={({ target }) => setTitle(target.value)}
                    required
                />
            </div>
            <div>
        author
                <Form.Control
                    type="text"
                    value={author}
                    name="author"
                    onChange={({ target }) => setAuthor(target.value)}
                    required
                />
            </div>
            <div>
        url
                <Form.Control
                    type="text"
                    value={url}
                    name="url"
                    onChange={({ target }) => setUrl(target.value)}
                    required
                />
            </div>
            <Button type="submit">create</Button>
        </Form>
    )
}

CreateBlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired,
}

export default CreateBlogForm
