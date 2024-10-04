const asyncLocalStorage = require('./als.service')
const logger = require('./logger.service')

let gIo = null

let connectedUsers = []

function connectSockets(http, session) {
  gIo = require('socket.io')(http, {
    cors: {
      origin: '*',
    },
  })
  gIo.on('connection', (socket) => {
    console.log('New socket', socket.id)

    socket.emit('add-connected-users', connectedUsers) /////////////////////////////////////

    socket.on('disconnect', (socket) => {
      console.log('Someone disconnected')
      connectedUsers = connectedUsers.filter((u) => u.userId !== socket.userId) /////////////
      // todo? emit connected users
    })

    socket.on('setUserSocket', async (userId) => {
      socket.userId = userId

      if (!connectedUsers.includes(userId)) connectedUsers.push(userId) ////////////////////
      // socket.emit('add-connected-users', connectedUsers) /////////////////////////////////////
      // const sockets = await _getAllSockets()
      // sockets.forEach((socket) =>
      //   socket.broadcast.emit('add-connected-users', connectedUsers)
      // )
    })

    socket.on('post-updated', (post) => {
      socket.broadcast.emit('update-post', post)
    })
    socket.on('post-added', (post) => {
      socket.broadcast.emit('add-post', post)
    })
    socket.on('post-removed', (postId) => {
      socket.broadcast.emit('remove-post', postId)
    })

    socket.on('chat-updated', async (chat) => {
      const userSocket = await _getUserSocket(chat.userId)
      const userSocket2 = await _getUserSocket(chat.userId2)
      console.log({ userSocket2, userSocket })
      if (userSocket) {
        // if (userSocket && socket.userId !== userSocket.userId) {
        userSocket.emit('update-chat', chat)
      }
      if (userSocket2) {
        // if (userSocket2 && socket.userId !== userSocket2.userId) {
        userSocket2.emit('update-chat', chat)
      }

      // socket.broadcast.emit('update-chat', chat)
    })
    socket.on('chat-added', (chat) => {
      socket.broadcast.emit('add-chat', chat)
    })

    socket.on('comment-updated', (comment) => {
      socket.broadcast.emit('update-comment', comment)
    })
    socket.on('comment-added', (comment) => {
      socket.broadcast.emit('add-comment', comment)
    })
    socket.on('comment-removed', (comment) => {
      socket.broadcast.emit('remove-comment', comment)
    })

    // socket.on('chat topic', (topic) => {
    //   if (socket.myTopic === topic) return
    //   if (socket.myTopic) {
    //     socket.leave(socket.myTopic)
    //   }
    //   socket.join(topic)
    //   socket.myTopic = topic
    // })

    // socket.on('chat newMsg', (msg) => {
    //   console.log('Emitting Chat msg', msg)
    //   // emits to all sockets:
    //   // gIo.emit('chat addMsg', msg)
    //   // emits only to sockets in the same room
    //   gIo.to(socket.myTopic).emit('chat addMsg', msg)
    // })

    // socket.on('user-watch', (userId) => {
    //   socket.join('watching:' + userId)
    // })

    // socket.on('set-user-socket', (userId) => {
    //   logger.debug(`Setting (${socket.id}) socket.userId = ${userId}`)
    //   socket.userId = userId
    // })
    // socket.on('unset-user-socket', () => {
    //   delete socket.userId
    // })
  })
}

function emitTo({ type, data, label }) {
  if (label) gIo.to('watching:' + label).emit(type, data)
  else gIo.emit(type, data)
}

async function emitToUser({ type, data, userId }) {
  logger.debug('Emiting to user socket: ' + userId)
  const socket = await _getUserSocket(userId)
  if (socket) socket.emit(type, data)
  else {
    console.log('User socket not found')
    _printSockets()
  }
}

// Send to all sockets BUT not the current socket
async function broadcast({ type, data, room = null, userId }) {
  console.log('BROADCASTING', JSON.stringify(arguments))
  const excludedSocket = await _getUserSocket(userId)
  if (!excludedSocket) {
    // logger.debug('Shouldnt happen, socket not found')
    // _printSockets();
    return
  }
  logger.debug('broadcast to all but user: ', userId)
  if (room) {
    excludedSocket.broadcast.to(room).emit(type, data)
  } else {
    excludedSocket.broadcast.emit(type, data)
  }
}

async function _getUserSocket(userId) {
  const sockets = await _getAllSockets()
  const socket = sockets.find((s) => s.userId == userId)
  return socket
}
async function _getAllSockets() {
  // return all Socket instances
  const sockets = await gIo.fetchSockets()
  return sockets
}

async function _printSockets() {
  const sockets = await _getAllSockets()
  console.log(`Sockets: (count: ${sockets.length}):`)
  sockets.forEach(_printSocket)
}
function _printSocket(socket) {
  console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}`)
}

module.exports = {
  connectSockets,
  emitTo,
  emitToUser,
  broadcast,
}
