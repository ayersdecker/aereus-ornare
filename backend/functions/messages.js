const express = require('express')
const admin = require('firebase-admin')

const router = express.Router()
const db = admin.firestore()

/**
 * Validate required fields in request body.
 * @param {Record<string, unknown>} body
 * @param {string[]} fields
 * @returns {string | null}
 */
function getMissingField(body, fields) {
  return fields.find((field) => !body[field]) || null
}

router.post('/send', async (req, res, next) => {
  try {
    const { fromAgent, toAgent, projectId, content, type } = req.body
    const missingField = getMissingField(req.body, ['fromAgent', 'toAgent', 'projectId', 'content', 'type'])

    if (missingField) {
      return res.status(400).json({ error: `${missingField} is required` })
    }

    if (!['message', 'query', 'result'].includes(type)) {
      return res.status(400).json({ error: 'type must be message, query, or result' })
    }

    const messageRef = await db.collection(`projects/${projectId}/messages`).add({
      fromAgent,
      toAgent,
      projectId,
      content,
      type,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    return res.status(201).json({
      messageId: messageRef.id,
      timestamp: new Date().toISOString(),
      status: 'queued',
    })
  } catch (error) {
    return next(error)
  }
})

router.get('/:projectId/agent/:agentId', async (req, res, next) => {
  try {
    const { projectId, agentId } = req.params
    const snapshot = await db
      .collection(`projects/${projectId}/messages`)
      .where('toAgent', '==', agentId)
      .where('read', '==', false)
      .get()

    const unreadMessages = snapshot.docs.map((messageDoc) => ({
      id: messageDoc.id,
      ...messageDoc.data(),
    }))

    await Promise.all(snapshot.docs.map((messageDoc) => messageDoc.ref.update({ read: true })))

    return res.status(200).json({ messages: unreadMessages })
  } catch (error) {
    return next(error)
  }
})

router.get('/:projectId/message/:messageId', async (req, res, next) => {
  try {
    const { projectId, messageId } = req.params
    const messageDoc = await db.doc(`projects/${projectId}/messages/${messageId}`).get()

    if (!messageDoc.exists) {
      return res.status(404).json({ error: 'Message not found' })
    }

    return res.status(200).json({ id: messageDoc.id, ...messageDoc.data() })
  } catch (error) {
    return next(error)
  }
})

router.get('/:projectId/:resourceId', async (req, res, next) => {
  try {
    const { projectId, resourceId } = req.params

    const unread = await db
      .collection(`projects/${projectId}/messages`)
      .where('toAgent', '==', resourceId)
      .where('read', '==', false)
      .get()

    if (!unread.empty) {
      const unreadMessages = unread.docs.map((messageDoc) => ({ id: messageDoc.id, ...messageDoc.data() }))
      await Promise.all(unread.docs.map((messageDoc) => messageDoc.ref.update({ read: true })))
      return res.status(200).json({ messages: unreadMessages })
    }

    const messageDoc = await db.doc(`projects/${projectId}/messages/${resourceId}`).get()
    if (!messageDoc.exists) {
      return res.status(404).json({ error: 'Message or agent inbox not found' })
    }

    return res.status(200).json({ id: messageDoc.id, ...messageDoc.data() })
  } catch (error) {
    return next(error)
  }
})

module.exports = router
