const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  blog
    ? res.json(blog)
    : res.status(404).json({
      error: 'blog post not found'
    })
})

blogsRouter.post('/', userExtractor, async (req, res) => {
  const user = req.user

  const blog = new Blog(req.body)
  blog.user = user._id
  const result = await blog.save()

  user.blogs = user.blogs.concat(result._id)
  await user.save()

  res.status(201).json(result)
})

blogsRouter.delete('/:id', userExtractor, async (req, res) => {
  const blogToDelete = await Blog.findById(req.params.id)

  if (!blogToDelete) {
    return res.status(404).json({
      error: 'blog post not found'
    })
  }

  const user = req.user

  if (blogToDelete.user.toString() !== user._id.toString()) {
    return res.status(401).json({
      error: 'unauthorized user'
    })
  }

  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

blogsRouter.put('/:id', userExtractor, async (req, res) => {
  const blogToUpdate = await Blog.findById(req.params.id)

  if (!blogToUpdate) {
    return res.status(404).json({
      error: 'blog post not found'
    })
  }

  const user = req.user

  if (blogToUpdate.user.toString() !== user._id.toString()) {
    return res.status(401).json({
      error: 'unauthorized user'
    })
  }

  const blog = req.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    blog,
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  )

  res.status(201).json(updatedBlog)
})

module.exports = blogsRouter
