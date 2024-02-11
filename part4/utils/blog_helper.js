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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
