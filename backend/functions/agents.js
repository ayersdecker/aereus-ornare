const crypto = require('crypto')
const express = require('express')
const admin = require('firebase-admin')

const router = express.Router()
const db = admin.firestore()

/**
 * Generate a random uppercase alphanumeric code.
 * @param {number} length
 * @returns {string}
 */
function generateCode(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('')
}

/**
 * Validate required fields in request body.
 * @param {Record<string, unknown>} body
 * @param {string[]} fields
 * @returns {string | null}
 */
function getMissingField(body, fields) {
  return fields.find((field) => !body[field]) || null
}

router.post('/register', async (req, res, next) => {
  try {
    const { projectId, agentId, agentName, metadata = {} } = req.body
    const missingField = getMissingField(req.body, ['projectId', 'agentId', 'agentName'])

    if (missingField) {
      return res.status(400).json({ error: `${missingField} is required` })
    }

    const connectionCode = generateCode(8)
    const authToken = crypto.randomBytes(24).toString('hex')
    const connectionUrl = `${req.protocol}://${req.get('host')}/agents/verify`

    await db.doc(`projects/${projectId}/agents/${agentId}`).set({
      agentId,
      agentName,
      metadata,
      connectionCode,
      authToken,
      status: 'online',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    return res.status(201).json({ connectionCode, connectionUrl, authToken })
  } catch (error) {
    return next(error)
  }
})

router.get('/:projectId', async (req, res, next) => {
  try {
    const { projectId } = req.params
    const snapshot = await db.collection(`projects/${projectId}/agents`).get()
    const agents = snapshot.docs.map((agentDoc) => ({ id: agentDoc.id, ...agentDoc.data() }))
    return res.status(200).json({ agents })
  } catch (error) {
    return next(error)
  }
})

router.post('/verify', async (req, res, next) => {
  try {
    const { projectId, connectionCode } = req.body
    const missingField = getMissingField(req.body, ['projectId', 'connectionCode'])

    if (missingField) {
      return res.status(400).json({ error: `${missingField} is required` })
    }

    const querySnapshot = await db
      .collection(`projects/${projectId}/agents`)
      .where('connectionCode', '==', connectionCode)
      .limit(1)
      .get()

    if (querySnapshot.empty) {
      return res.status(200).json({ valid: false, projectId })
    }

    const [agentDoc] = querySnapshot.docs
    const authToken = agentDoc.data().authToken

    return res.status(200).json({ valid: true, projectId, authToken })
  } catch (error) {
    return next(error)
  }
})

router.delete('/:projectId/:agentId', async (req, res, next) => {
  try {
    const { projectId, agentId } = req.params
    await db.doc(`projects/${projectId}/agents/${agentId}`).delete()
    return res.status(204).send()
  } catch (error) {
    return next(error)
  }
})

module.exports = router
