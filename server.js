const express = require('express')
const cors = require('cors')
const path = require('path')
const expressSession = require('express-session')
const logger = require('./services/logger.service')

const app = express()
const http = require('http').createServer(app)

require('dotenv').config()

const session = expressSession({
  secret: 'secret session',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
})

app.use(session)
app.use(express.json())
app.use(express.static('public'))

if (process.env.NODE_ENV === 'production') {
  // Express serve static files on production environment
  app.use(express.static(path.resolve(__dirname, 'public')))

} else {
  // Configuring CORS
  const corsOptions = {
    // Make sure origin contains the url your frontend is running on
    origin: [
      'http://127.0.0.1:3000',
      'http://localhost:3000',
      'http://localhost:19006',
      'https://travelsdin-react.vercel.app',
    ],
    credentials: true,
  }
  app.use(cors(corsOptions))
}

const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')
const postRoutes = require('./api/post/post.routes')
const commentRoutes = require('./api/comment/comment.routes')
const chatRoutes = require('./api/chat/chat.routes')
const activityRoutes = require('./api/activity/activity.routes')
const { connectSockets } = require('./services/socket.service')

// routes
const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware')

app.all('*', setupAsyncLocalStorage)

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/post', postRoutes)
app.use('/api/comment', commentRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/activity', activityRoutes)

connectSockets(http, session)

// Make every server-side-route to match the index.html
// so when requesting http://localhost:3030/index.html/car/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow vue-router to take it from there

app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const PORT = process.env.PORT || 3030
http.listen(PORT, () => {
  logger.info(`Server is running on port: ${PORT}`)
})
