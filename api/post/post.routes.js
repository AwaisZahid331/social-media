const express = require('express')
const {
  requireAuth,
  requireAdmin,
} = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const {
  getPosts,
  getPostById,
  addPost,
  updatePost,
  removePost,
  getPostsLength,
} = require('./post.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getPosts)
router.get('/length', log, getPostsLength)
router.get('/:id', getPostById)
router.post('/', addPost)
router.put('/:id', updatePost)
router.delete('/:id', removePost)
// router.post('/', requireAuth, requireAdmin, addPost)
// router.put('/:id', requireAuth, requireAdmin, updatePost)
// router.delete('/:id', requireAuth, requireAdmin, removePost)

module.exports = router
