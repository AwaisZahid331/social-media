const logger = require('../../services/logger.service')
const chatService = require('./chat.service')

module.exports = {
  getChats,
  getChatById,
  addChat,
  updateChat,
  // removeChat,
}

// LIST
async function getChats(req, res) {
  try {
    const filterBy = req.query
    const chats = await chatService.query(filterBy)
    res.json(chats)
  } catch (err) {
    logger.error('Failed to get chats', err)
    res.status(500).send({ err: 'Failed to get chats' })
  }
}

// READ
async function getChatById(req, res) {
  try {
    const { id } = req.params
    const chat = await chatService.getById(id)
    res.json(chat)
  } catch (err) {
    logger.error('Failed to get chat', err)
    res.status(500).send({ err: 'Failed to get chat' })
  }
}

// // CREATE
async function addChat(req, res) {
  try {
    const chat = req.body
    const addedChat = await chatService.add(chat)
    res.json(addedChat)
  } catch (err) {
    logger.error('Failed to add chat', err)
    res.status(500).send({ err: 'Failed to add chat' })
  }
}

// // UPDATE
async function updateChat(req, res) {
  try {
    const chat = req.body
    const updatedChat = await chatService.update(chat)
    res.json(updatedChat)
  } catch (err) {
    logger.error('Failed to update chat', err)
    res.status(500).send({ err: 'Failed to update chat' })
  }
}

// // DELETE
// async function removeChat(req, res) {
//   try {
//     const { id } = req.params
//     const removedId = await chatService.remove(id)
//     res.send(removedId)
//   } catch (err) {
//     logger.error('Failed to remove chat', err)
//     res.status(500).send({ err: 'Failed to remove chat' })
//   }
// }
