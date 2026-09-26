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

router.post('/create', async (req, res, next) => {
  try {
    const { projectId, targetAgent, instruction, priority = 'normal' } = req.body
    const missingField = getMissingField(req.body, ['projectId', 'targetAgent', 'instruction'])

    if (missingField) {
      return res.status(400).json({ error: `${missingField} is required` })
    }

    const directiveRef = db.collection(`projects/${projectId}/directives`).doc()
    await directiveRef.set({
      directiveId: directiveRef.id,
      projectId,
      targetAgent,
      instruction,
      priority,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    return res.status(201).json({ directiveId: directiveRef.id, status: 'pending' })
  } catch (error) {
    return next(error)
  }
})

router.get('/:projectId/:agentId', async (req, res, next) => {
  try {
    const { projectId, agentId } = req.params
    const snapshot = await db
      .collection(`projects/${projectId}/directives`)
      .where('targetAgent', '==', agentId)
      .where('status', '==', 'pending')
      .get()

    const directives = snapshot.docs.map((directiveDoc) => ({
      id: directiveDoc.id,
      ...directiveDoc.data(),
    }))

    return res.status(200).json({ directives })
  } catch (error) {
    return next(error)
  }
})

router.post('/:directiveId/acknowledge', async (req, res, next) => {
  try {
    const { directiveId } = req.params
    const { agentId, status } = req.body
    const missingField = getMissingField(req.body, ['agentId', 'status'])

    if (missingField) {
      return res.status(400).json({ error: `${missingField} is required` })
    }

    const snapshot = await db
      .collectionGroup('directives')
      .where('directiveId', '==', directiveId)
      .limit(1)
      .get()

    if (snapshot.empty) {
      return res.status(404).json({ error: 'Directive not found' })
    }

    const [directiveDoc] = snapshot.docs
    await directiveDoc.ref.update({
      acknowledgedBy: agentId,
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    return res.status(200).json({ directiveId, status })
  } catch (error) {
    return next(error)
  }
})

module.exports = router
