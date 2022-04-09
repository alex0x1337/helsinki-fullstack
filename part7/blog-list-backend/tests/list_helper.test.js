const listHelper = require('../utils/list_helper')
const helper = require('../utils/test_helper')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        }
    ]

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })


    test('when list has many blog, equals the sum of likes of them', () => {
        const result = listHelper.totalLikes(helper.initialBlogs)
        expect(result).toBe(36)
    })

    test('when list has one blog, returns the first entry', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        expect(result).toEqual(listWithOneBlog[0])
    })

    test('when list has many blogs, returns blog with most likes', () => {
        const result = listHelper.favoriteBlog(helper.initialBlogs)
        expect(result).toEqual(helper.initialBlogs[2])
    })

    test('when list has one  blog, returns first blog author', () => {
        const result = listHelper.mostBlogs(listWithOneBlog)
        expect(result).toEqual({ author: listWithOneBlog[0].author, blogs: 1 })
    })

    test('when list has many blogs, returns blog author with most blogs', () => {
        const result = listHelper.mostBlogs(helper.initialBlogs)
        expect(result).toEqual({ author: 'Robert C. Martin', blogs: 3 })
    })

    test('when list has one blog, returns first blog author', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        expect(result).toEqual({ author: listWithOneBlog[0].author, likes: listWithOneBlog[0].likes })
    })

    test('when list has many blogs, returns author whose blogs have most likes', () => {
        const result = listHelper.mostLikes(helper.initialBlogs)
        expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 })
    })
})
