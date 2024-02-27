import { useState } from 'react'

const Submit = ({ submitBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmitBlog = async (event) => {
    event.preventDefault()
    await submitBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={handleSubmitBlog}>
        <div>
          title
          <input
            name='title'
            type='text'
            placeholder='Enter the title of the post'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            name='author'
            type='text'
            placeholder='Enter the author'
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url
          <input
            name='url'
            type='url'
            placeholder='Enter the url'
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default Submit
