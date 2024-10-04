const express = require('express')
const {
  requireAuth,
  requireAdmin,
} = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const {
  // getComments,
  // getCommentsByPostId,
  addComment,
  updateComment,
  removeComment,
} = require('./comment.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

// router.get('/', log, getComments)
// router.get('/:id', getCommentsByPostId)
router.post('/', addComment)
router.put('/:id', updateComment)
router.delete('/:id', removeComment)
// router.post('/', requireAuth, requireAdmin, addComment)
// router.put('/:id', requireAuth, requireAdmin, updateComment)
// router.delete('/:id', requireAuth, requireAdmin, removeComment)

module.exports = router
