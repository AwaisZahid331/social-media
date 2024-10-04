const logger = require('../../services/logger.service')
const activityService = require('./activty.service')

module.exports = {
  getActivties,
  addActivity,
  updateActivity,
  getActivitiesLength,
}

async function getActivties(req, res) {
  try {
    const filterBy = req.query
    const activties = await activityService.query(filterBy)
    res.json(activties)
  } catch (err) {
    logger.error('Failed to get activties', err)
    res.status(500).send({ err: 'Failed to get activties' })
  }
}

// CREATE
async function addActivity(req, res) {
  try {
    const activity = req.body
    const addedActivity = await activityService.add(activity)
    res.json(addedActivity)
  } catch (err) {
    logger.error('Failed to add activity', err)
    res.status(500).send({ err: 'Failed to add activity' })
  }
}

// UPDATE
async function updateActivity(req, res) {
  try {
    const activity = req.body
    const updatedActivity = await activityService.update(activity)
    res.json(updatedActivity)
  } catch (err) {
    logger.error('Failed to update activity', err)
    res.status(500).send({ err: 'Failed to update activity' })
  }
}

async function getActivitiesLength(req, res) {
  try {
    const filterBy = req.query
    const activitiesLength = await activityService.getLength(filterBy)
    res.json(activitiesLength)
  } catch (err) {
    logger.error('Failed to get activities', err)
    res.status(500).send({ err: 'Failed to get activities' })
  }
}
