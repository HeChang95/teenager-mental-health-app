import { auth } from '@/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'

export function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

export async function signupWithEmail(email, password, displayName = '') {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  if (displayName) await updateProfile(cred.user, { displayName })
  return cred
}

export function logoutFirebase() {
  return signOut(auth)
}

export function watchAuthState(cb) {
  return onAuthStateChanged(auth, cb)
}
