import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore, collection } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAt6cKC9EcJ71Pe3Fz87UG9HtF8G8KA-yw",
  authDomain: "bible-app-production.firebaseapp.com",
  projectId: "bible-app-production",
  storageBucket: "bible-app-production.appspot.com",
  messagingSenderId: "104523985989",
  appId: "1:104523985989:web:51ffe78590173303639f2c",
}

const app = initializeApp(firebaseConfig)

//initialize db
export const db = getFirestore()
//collection ref users
export const colRefUsers = collection(db, "users")
//add user with Authentication
export const auth = getAuth(app)

export default app
