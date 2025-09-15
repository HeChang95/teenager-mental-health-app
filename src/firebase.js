import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCMjW4_aSsV-BXiYiG2tggg1tAudDZJFHE',
  authDomain: 'teenager-mental-health-app.firebaseapp.com',
  projectId: 'teenager-mental-health-app',
  storageBucket: 'teenager-mental-health-app.firebasestorage.app',
  messagingSenderId: '155287440931',
  appId: '1:155287440931:web:bbdf58c582626f5cb66b96',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
