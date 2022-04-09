const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('../utils/test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

jest.setTimeout(20000)

let api = null

beforeEach(async () => {
    await User.deleteMany({})
    let user = new User({
        username : 'mluukkai',
        password: 'salainen'
    })
    await user.save()
    let blogs = helper.initialBlogs.map(blog => ({ ...blog, user: user._id }))

    await Blog.deleteMany({})
    blogs = blogs.map(blog => new Blog(blog))
    for(let blog of blogs) {
        await blog.save()
    }

    const TOKEN = jwt.sign({
        username: 'mluukkai',
        id: user._id
    }, process.env.SECRET)

    const hook = (method) => (args) =>
        supertest(app)[method](args)
            .set('Authorization', `Bearer ${TOKEN}`)

    api = {
        post: hook('post'),
        get: hook('get'),
        put: hook('put'),
        delete: hook('delete'),
    }
})

describe('when there is initially some blogs saved', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })


    test('correct amount of blog posts are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('unique identifier property of the blog posts is named id', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })
})


describe('addition of a new blog post', () => {

    test('if token is missing, server returns 401 Unauthorized', async () => {
        const newBlog = {
            title: 'Fullstack part4',
            author: 'fullstackopen',
            url: 'https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-8-4-12'
        }
        await supertest(app)
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
    })

    test('making an HTTP POST request to the /api/blogs url successfully creates a new blog post', async () => {
        const newBlog = {
            title: 'Fullstack part4',
            author: 'fullstackopen',
            url: 'https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-8-4-12',
            likes: 1,
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        const titles = response.body.map(r => r.title)

        expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
        expect(titles).toContain(newBlog.title)
    })


    test('if the likes property is missing from the request, it will default to the value 0', async () => {
        const newBlog = {
            title: 'Fullstack part4',
            author: 'fullstackopen',
            url: 'https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-8-4-12'
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
        const response = await api.get('/api/blogs')
        const blog = response.body.find(r => r.title === newBlog.title)

        expect(blog.likes).toBe(0)
    })

    test('if the title and url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request', async () => {
        const newBlog = {
            author: 'fullstackopen'
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })
})


describe('deletion of blog posts works as expected', () => {
    test('if token is missing, server returns 401 Unauthorized', async () => {
        await supertest(app)
            .delete(`/api/blogs/${helper.initialBlogs[0]._id}`)
            .expect(401)
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('deleting blog posts of another user returns 400 Bad request', async () => {
        const user = {
            'username': 'mluukkai2',
            'password': 'salainen'
        }
        await supertest(app)
            .post('/api/users')
            .send(user)
        const response = await supertest(app)
            .post('/api/login')
            .send(user)
        expect(response.body.token).toBeDefined()
        await supertest(app)
            .delete(`/api/blogs/${helper.initialBlogs[0]._id}`)
            .set('Authorization', `Bearer ${response.body.token}`)
            .expect(400)
    })

    test('blog posts could be deleted', async () => {
        await api
            .delete(`/api/blogs/${helper.initialBlogs[0]._id}`)
            .expect(204)

        const response = await api.get('/api/blogs')

        const titles = response.body.map(r => r.title)

        expect(response.body).toHaveLength(helper.initialBlogs.length - 1)
        expect(titles).toEqual(expect.not.arrayContaining([helper.initialBlogs[0].title]))
    })
    test('deleting blog posts with non-existing id returns 404 Not found', async () => {
        const nonExistingId = await helper.nonExistingId()
        await api
            .delete(`/api/blogs/${nonExistingId}`)
            .expect(404)
    })
})

describe('update of blog posts works as expected', () => {
    test('if token is missing, server returns 401 Unauthorized', async () => {
        let blog = { ...helper.initialBlogs[0] }
        blog.title = '[Updated] '+blog.title
        await supertest(app)
            .put(`/api/blogs/${helper.initialBlogs[0]._id}`)
            .send(blog)
            .expect(401)
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('blog posts could be updated', async () => {
        let blog = { ...helper.initialBlogs[0] }
        blog.title = '[Updated] '+blog.title
        await api
            .put(`/api/blogs/${helper.initialBlogs[0]._id}`)
            .send(blog)
            .expect(200)

        const response = await api.get('/api/blogs')

        const titles = response.body.map(r => r.title)

        expect(response.body).toHaveLength(helper.initialBlogs.length)
        expect(titles).toContain(blog.title)
    })
    test('updating blog post with non-existing id returns 404 Not found', async () => {
        let blog = { ...helper.initialBlogs[0] }
        const nonExistingId = await helper.nonExistingId()
        blog.title = '[Updated] '+blog.title
        await api
            .put(`/api/blogs/${nonExistingId}`)
            .send(blog)
            .expect(404)

        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})
