const listHelper = require('../utils/test_helper')
const testBlogs = require('./blogs_for_testing')

describe('helper', () => {
  test('dummy returns one', () => {
    const result = listHelper.dummy(testBlogs)
    expect(result).toBe(1)
  })

  describe('total likes', () => {
    test('of empty list is zero', () => {
      expect(listHelper.totalLikes([])).toBe(0)
    })

    test('when list has only one blog equals the likes of that', () => {
      expect(listHelper.totalLikes([testBlogs[0]])).toBe(7)
    })

    test('of a bigger list is calculated right', () => {
      expect(listHelper.totalLikes(testBlogs)).toBe(36)
    })
  })

  describe('favorite blog', () => {
    test('of empty list is null', () => {
      expect(listHelper.favoriteBlog([])).toBe(null)
    })

    test('when list has only one blog equals that blog', () => {
      expect(listHelper.favoriteBlog([testBlogs[0]])).toEqual({
        title: 'React patterns',
        author: 'Michael Chan',
        likes: 7
      })
    })

    test('of a bigger list is calculated right', () => {
      expect(listHelper.favoriteBlog(testBlogs)).toEqual({
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12
      })
    })
  })

  describe('most blogs', () => {
    test('of empty list is null', () => {
      expect(listHelper.mostBlogs([])).toBe(null)
    })

    test('when list has only one blog equals the author of that blog', () => {
      expect(listHelper.mostBlogs([testBlogs[0]])).toEqual({
        author: 'Michael Chan',
        blogs: 1
      })
    })

    test('of a bigger list is calculated right', () => {
      expect(listHelper.mostBlogs(testBlogs)).toEqual({
        author: 'Robert C. Martin',
        blogs: 3
      })
    })
  })

  describe('most likes', () => {
    test('of empty list is null', () => {
      expect(listHelper.mostLikes([])).toBe(null)
    })

    test('when list has only one blog equals the author of that blog', () => {
      expect(listHelper.mostLikes([testBlogs[0]])).toEqual({
        author: 'Michael Chan',
        likes: 7
      })
    })

    test('of a bigger list is calculated right', () => {
      expect(listHelper.mostLikes(testBlogs)).toEqual({
        author: 'Edsger W. Dijkstra',
        likes: 17
      })
    })
  })
})
