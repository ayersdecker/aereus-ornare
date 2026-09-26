const cors = require('cors')
const dotenv = require('dotenv')
const express = require('express')
const admin = require('firebase-admin')
const { onRequest } = require('firebase-functions/v2/https')

dotenv.config()

if (!admin.apps.length) {
  admin.initializeApp()
}

const agentsRouter = require('./agents')
const messagesRouter = require('./messages')
const directivesRouter = require('./directives')

const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)

const app = express()

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }
      callback(new Error('Origin not allowed by CORS policy'))
    },
  }),
)
app.use(express.json())

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true })
})

app.use('/agents', agentsRouter)
app.use('/messages', messagesRouter)
app.use('/directives', directivesRouter)

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal server error',
  })
  next()
})

exports.api = onRequest(app)
