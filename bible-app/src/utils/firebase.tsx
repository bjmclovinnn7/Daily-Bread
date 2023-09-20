import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore, collection } from "firebase/firestore"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREABASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREABASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREABASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREABASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREABASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREABASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

//initialize db
export const db = getFirestore()

//collection ref users
export const colRefUsers = collection(db, "users")
//collection ref categories
export const colRefCategories = collection(db, "categories")
//collection ref verses
export const colRefVerses = collection(db, "verses")
//add user with Authentication
export const auth = getAuth(app)

export default app
