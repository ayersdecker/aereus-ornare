import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore'
import { db } from './firebaseConfig'
import { generateAgentConnectionCode } from './authService'

/**
 * Create a project for a user.
 * @param {string} projectName
 * @param {string} userId
 * @returns {Promise<string>}
 */
export async function createProject(projectName, userId) {
  const projectsRef = collection(db, 'projects')
  const projectDoc = await addDoc(projectsRef, {
    projectName,
    ownerId: userId,
    createdAt: serverTimestamp(),
  })
  return projectDoc.id
}

/**
 * Retrieve all projects for a user.
 * @param {string} userId
 * @returns {Promise<Array<{id: string, projectName: string, ownerId: string}>>}
 */
export async function getProjects(userId) {
  const projectsRef = collection(db, 'projects')
  const projectsQuery = query(projectsRef, where('ownerId', '==', userId))
  const snapshot = await getDocs(projectsQuery)

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }))
}

/**
 * Generate and persist a unique agent connection code for a project.
 * @param {string} projectId
 * @returns {Promise<string>}
 */
export async function generateAgentCode(projectId) {
  const code = generateAgentConnectionCode()
  const codeRef = doc(db, 'projects', projectId, 'connectionCodes', code)
  await setDoc(codeRef, {
    code,
    projectId,
    createdAt: serverTimestamp(),
  })
  return code
}

/**
 * Get all connected agents for a project.
 * @param {string} projectId
 * @returns {Promise<Array<{id: string}>>}
 */
export async function getAgentsByProject(projectId) {
  const agentsRef = collection(db, 'projects', projectId, 'agents')
  const snapshot = await getDocs(agentsRef)

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }))
}

/**
 * Store or update metadata for a project agent.
 * @param {string} projectId
 * @param {string} agentId
 * @param {Record<string, unknown>} metadata
 * @returns {Promise<void>}
 */
export async function storeAgentMetadata(projectId, agentId, metadata) {
  const agentRef = doc(db, 'projects', projectId, 'agents', agentId)
  await setDoc(
    agentRef,
    {
      agentId,
      ...metadata,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

/**
 * Remove an agent from a project.
 * @param {string} projectId
 * @param {string} agentId
 * @returns {Promise<void>}
 */
export async function removeAgent(projectId, agentId) {
  const agentRef = doc(db, 'projects', projectId, 'agents', agentId)
  await deleteDoc(agentRef)
}
