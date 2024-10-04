const express = require('express')
const {
  requireAuth,
  requireAdmin,
} = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const {
  getActivties,
  addActivity,
  updateActivity,
  getActivitiesLength,
} = require('./activity.controller')
const router = express.Router()

router.get('/', log, getActivties)
router.post('/', addActivity)
router.put('/:id', updateActivity)
router.get('/length', log, getActivitiesLength)

module.exports = router
