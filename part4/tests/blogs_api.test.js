const mongoose = require('mongoose')
const supertest = require('supertest')
const api = supertest(require('../app'))
const testBlogs = require('./blogs_for_testing')
const Blog = require('../models/blog')

describe('when fetching all blog posts from api', () => {
  test('correct amount of posts is returned', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(testBlogs.length)
  }, 100000)

  test('all posts have an id property', async () => {
    const blogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    blogs.body.forEach(blog => expect(blog.id).toBeDefined())
  }, 100000)
})

describe('when sending a new blog post to api', () => {
  test('it is saved correctly if correctly formatted', async () => {
    const blogsAtStart = await api.get('/api/blogs')

    const newBlog = {
      title: 'Test blog',
      author: 'Test Author',
      url: 'http://test.url',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(blogsAtStart.length + 1)

    const titles = response.body.map(blog => blog.title)
    expect(titles).toContain('Test blog')
  }, 100000)

  test('likes property defaults to 0 when not specified', async () => {
    const blogNoLikes = {
      title: 'Test blog',
      author: 'Test Author',
      url: 'http://test.url'
    }

    const response = await api
      .post('/api/blogs')
      .send(blogNoLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(0)
  })

  test('400 is returned if title or url is missing', async () => {
    const blogNoTitle = {
      author: 'Test Author',
      url: 'http://test.url'
    }

    const blogNoUrl = {
      title: 'Test blog',
      author: 'Test Author'
    }

    await api
      .post('/api/blogs')
      .send(blogNoTitle)
      .expect(400)

    await api
      .post('/api/blogs')
      .send(blogNoUrl)
      .expect(400)
  })
})

describe('when deleting a blog post from api', () => {
  test('it is removed correctly if it exists', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(testBlogs.length - 1)

    const titles = blogsAtEnd.body.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
  }, 100000)

  test('404 is returned if post does not exist', async () => {
    await api
      .delete('/api/blogs/65c2b48888ff916be20e8909')
      .expect(404)
  })

  test('400 is returned if id is invalid', async () => {
    await api
      .delete('/api/blogs/invalid_id')
      .expect(400)
  })
})

describe('when updating a blog post from api', () => {
  test('it is updated correctly if it exists', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]

    const blogToPut = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToPut)
      .expect(201)

    const updatedBlog = await api.get(`/api/blogs/${blogToUpdate.id}`)
    expect(updatedBlog.body.likes).toBe(blogToUpdate.likes + 1)
  }, 100000)

  test('404 is returned if post does not exist', async () => {
    const blogToUpdate = {
      title: 'nonexistent blog',
      author: 'nonexistent author',
      url: 'nonexistent.url',
      likes: 0
    }

    await api
      .put('/api/blogs/65c2b48888ff916be20e8909')
      .send(blogToUpdate)
      .expect(404)
  })

  test('400 is returned if id is invalid', async () => {
    const blogToUpdate = {
      title: 'nonexistent blog',
      author: 'nonexistent author',
      url: 'nonexistent.url',
      likes: 0
    }

    await api
      .put('/api/blogs/invalid_id')
      .send(blogToUpdate)
      .expect(400)
  })
})

// test('a specific blog post can be viewed', async () => {
//   const blogsInDb = await api
//     .get('/api/blogs')
//     .expect(200)
//     .expect('Content-Type', /application\/json/)

//   const blogToView = blogsInDb.body[0]

//   const response = await api
//     .get(`/api/blogs/${blogToView.id}`)
//     .expect(200)
//     .expect('Content-Type', /application\/json/)

//   expect(response.body).toEqual(blogToView)
// }, 100000)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogPromises = testBlogs.map(testBlog => {
    const newBlog = new Blog(testBlog)
    return newBlog.save()
  })

  await Promise.all(blogPromises)
})

afterAll(async () => {
  await mongoose.connection.close()
})
