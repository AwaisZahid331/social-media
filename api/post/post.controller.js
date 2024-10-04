const logger = require('../../services/logger.service')
const postService = require('./post.service')

module.exports = {
  getPosts,
  getPostById,
  addPost,
  updatePost,
  removePost,
  getPostsLength,
}

// LIST
async function getPosts(req, res) {
  try {
    const filterBy = req.query
    const posts = await postService.query(filterBy)
    res.json(posts)
  } catch (err) {
    logger.error('Failed to get posts', err)
    res.status(500).send({ err: 'Failed to get posts' })
  }
}

async function getPostsLength(req, res) {
  try {
    const filterBy = req.query
    const postsLength = await postService.getLength(filterBy)
    res.json(postsLength)
  } catch (err) {
    logger.error('Failed to get posts', err)
    res.status(500).send({ err: 'Failed to get posts' })
  }
}

// READ
async function getPostById(req, res) {
  try {
    const { id } = req.params
    const post = await postService.getById(id)
    res.json(post)
  } catch (err) {
    logger.error('Failed to get post', err)
    res.status(500).send({ err: 'Failed to get post' })
  }
}

// CREATE
async function addPost(req, res) {
  try {
    // console.log(' req.body:', req.body)
    const post = req.body
    const addedPost = await postService.add(post)
    res.json(addedPost)
  } catch (err) {
    logger.error('Failed to add post', err)
    res.status(500).send({ err: 'Failed to add post' })
  }
}

// UPDATE
async function updatePost(req, res) {
  try {
    const post = req.body
    const updatedPost = await postService.update(post)
    res.json(updatedPost)
  } catch (err) {
    logger.error('Failed to update post', err)
    res.status(500).send({ err: 'Failed to update post' })
  }
}

// DELETE
async function removePost(req, res) {
  try {
    const { id } = req.params
    const removedId = await postService.remove(id)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove post', err)
    res.status(500).send({ err: 'Failed to remove post' })
  }
}
