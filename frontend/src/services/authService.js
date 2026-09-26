import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth } from './firebaseConfig'

/**
 * Sign in with a Google account.
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  return signInWithPopup(auth, provider)
}

/**
 * Sign out the current user.
 * @returns {Promise<void>}
 */
export async function signOut() {
  return firebaseSignOut(auth)
}

/**
 * Get the currently authenticated user.
 * @returns {import('firebase/auth').User | null}
 */
export function getCurrentUser() {
  return auth.currentUser
}

/**
 * Generate a random agent connection code.
 * @returns {string}
 */
export function generateAgentConnectionCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const codeLength = Math.floor(Math.random() * 3) + 6

  return Array.from({ length: codeLength }, () => {
    const index = Math.floor(Math.random() * characters.length)
    return characters[index]
  }).join('')
}
