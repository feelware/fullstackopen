import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, liked, isowner, handleLike, handleDel }) => {
  const [expanded, setExpanded] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div className='blog' style={blogStyle}>
      <div className='heading'>
        {blog.title} {blog.author}
        <button className='viewBlog' onClick={() => { setExpanded(!expanded) }}>
          {expanded ? 'hide' : 'view'}
        </button>
      </div>
      {
        expanded &&
        <div className='details'>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes.length}
            <button onClick={() => handleLike(liked, blog)}>
              { liked ? 'liked' : 'like' }
            </button>
          </div>
          <div>{blog.user.name || blog.user.username}</div>
          {
            isowner &&
            <button onClick={handleDel(blog.id)}>remove</button>
          }
        </div>
      }
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    likes: PropTypes.array.isRequired,
    url: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      name: PropTypes.string
    })
  }),
  liked: PropTypes.bool.isRequired,
  isowner: PropTypes.bool.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDel: PropTypes.func.isRequired
}

export default Blog
