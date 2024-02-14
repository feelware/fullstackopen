const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const favindex = blogs.reduce(
    (favindex, blog, index) => blog.likes > blogs[favindex].likes
      ? index
      : favindex
    , 0)

  const favblog = blogs[favindex]

  if (!favblog) {
    return null
  }

  return {
    title: favblog.title,
    author: favblog.author,
    likes: favblog.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authors = blogs.map(blog => blog.author)
  authors.sort()

  let maxCount = 0; let currCount = 0; let mostAuthorIndex = 0

  for (let i = 0; i < authors.length; i++) {
    if (authors[i - 1] === authors[i]) {
      currCount++
    } else {
      currCount = 1
    }

    if (currCount > maxCount) {
      maxCount = currCount
      mostAuthorIndex = i
    }
  }

  return {
    author: authors[mostAuthorIndex],
    blogs: maxCount
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const rel = new Map()

  blogs.forEach(blog => {
    const author = blog.author
    if (rel.has(author)) {
      rel.set(author, rel.get(author) + blog.likes)
    } else {
      rel.set(author, blog.likes)
    }
  })

  let mostLikes = 0
  let favAuthor

  rel.forEach((likes, author) => {
    if (likes > mostLikes) {
      mostLikes = likes
      favAuthor = author
    }
  })

  return {
    author: favAuthor,
    likes: mostLikes
  }
}

const blogsInDb = async () => {
  const Blog = require('../models/blog')
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const User = require('../models/user')
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  blogsInDb,
  usersInDb
}
