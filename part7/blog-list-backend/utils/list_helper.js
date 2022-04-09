var _ = require('lodash')

const dummy = () => {
    return 1
}

const totalLikes = (lists) => {
    return lists.reduce((sum, list) => sum + list.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((favorite, current) => favorite === null ? current
        : (favorite.likes > current.likes ? favorite : current)
    , null)
}

const mostBlogs = (blogs) => {
    return _.reduce(
        _.countBy(blogs, blog => blog.author), (max, value, key) =>
            max !== null && max.blogs > value
                ? max : { author: key, blogs: value }
        , null)
}

const mostLikes = (blogs) => {
    let group = _.groupBy(blogs, blog => blog.author)
    group = _.map(group, (authorBlogs) => ({
        author: authorBlogs[0].author,
        likes : _.reduce(authorBlogs, (result, authorBlog) => result + authorBlog.likes, 0)
    }))
    return _.reduce(group, (max, value) =>
        max !== null && max.likes > value.likes
            ? max : value, null)
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}