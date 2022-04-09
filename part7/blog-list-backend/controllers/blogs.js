
const router = require('express').Router()
const Blog = require('../models/blog')

router.get('/', async (request, response) => {
    let blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

router.post('/', async (request, response) => {
    if(!request.user) {
        return response.status(401).end()
    }
    const user = request.user
    let body = request.body
    if(!body.title || !body.url) {
        return response.status(400).end()
    }
    if(!body.likes) {
        body.likes = 0
    }

    body.user = user._id

    const blog = new Blog(body)
    let savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

router.put('/:id', async (request, response) => {
    if(!request.user) {
        return response.status(401).end()
    }
    const body = request.body
    if(!body.title || !body.url) {
        return response.status(400).end()
    }
    if(!body.likes) {
        body.likes = 0
    }
    let blog = await Blog.findById(request.params.id)
    if(!blog) {
        return response.status(404).end()
    }
    /*
    if ( blog.user._id.toString() !== request.user._id.toString() ) {
        return response.status(400).end()
    }
    */
    let updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, { new: true, runValidators: true, context: 'query' })
    response.json(updatedBlog)
})

router.delete('/:id', async (request, response) => {
    if(!request.user) {
        return response.status(401).end()
    }
    const blog = await Blog.findById(request.params.id)
    if(!blog) {
        return response.status(404).end()
    }
    if ( blog.user.toString() === request.user._id.toString() ) {
        await blog.remove()
    } else {
        return response.status(400).end()
    }
    response.status(204).end()
})

router.get('/:id/comments', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if(!blog) {
        return response.status(404).end()
    }
    response.json(blog.comments ? blog.comments : [])
})

router.post('/:id/comments', async (request, response) => {
    if(!request.user) {
        return response.status(401).end()
    }
    const blog = await Blog.findById(request.params.id)
    if(!blog) {
        return response.status(404).end()
    }
    blog.comments = (blog.comments ? blog.comments : []).concat(request.body)
    await blog.save()
    response.json(blog.comments)
})

module.exports = router