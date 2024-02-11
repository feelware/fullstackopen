const bloglistRouter = require('express').Router()

const Blog = require('../models/blog')

bloglistRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

bloglistRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  blog
    ? res.json(blog)
    : res.status(404).json({ error: 'blog post not found' })
})

bloglistRouter.post('/', async (req, res) => {
  const blog = new Blog(req.body)
  const result = await blog.save()
  res.status(201).json(result)
})

bloglistRouter.delete('/:id', async (req, res) => {
  const result = await Blog.findByIdAndDelete(req.params.id)
  result
    ? res.status(204).end()
    : res.status(404).json({
      error: 'blog post not found'
    })
})

bloglistRouter.put('/:id', async (req, res) => {
  const blog = new Blog(req.body)
  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    blog,
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  )
  updatedBlog
    ? res.status(201).json(updatedBlog)
    : res.status(404).json({
      error: 'blog post not found'
    })
})

module.exports = bloglistRouter
