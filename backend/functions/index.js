const cors = require('cors')
const dotenv = require('dotenv')
const express = require('express')
const admin = require('firebase-admin')
const { onRequest } = require('firebase-functions/v2/https')

const agentsRouter = require('./agents')
const messagesRouter = require('./messages')
const directivesRouter = require('./directives')

dotenv.config()

if (!admin.apps.length) {
  admin.initializeApp()
}

const app = express()

app.use(cors({ origin: true }))
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
