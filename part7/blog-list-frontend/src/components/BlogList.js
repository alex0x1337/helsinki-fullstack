import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const BlogList = () => {
    const blogs = useSelector(state => state.blogs)
    return (
        <div className="blogList">
            {blogs.map((blog) => {
                return <div key={blog.id} style={{
                    paddingTop: 10,
                    paddingLeft: 2,
                    border: 'solid',
                    borderWidth: 2,
                    marginBottom: 5,
                }}>
                    <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
                </div>
            })}
        </div>
    )
}

export default BlogList