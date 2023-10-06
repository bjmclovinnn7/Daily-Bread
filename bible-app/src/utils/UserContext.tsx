import { createContext, ReactNode, useContext, useState, useEffect } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth"
import { auth, colRefUsers } from "./firebase"
import { getDoc, setDoc, doc, collection } from "firebase/firestore"

interface UserContextType {
  createUser: (firstName: string, lastName: string, userName: string, email: string, password: string) => void
  logOut: () => void
  signIn: (email: string, password: string) => void
  userData: any
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<any>(() => {
    const saved = localStorage.getItem("userData")
    const initialValue = saved ? JSON.parse(saved) : ""
    return initialValue
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      if (currentUser) {
        console.log(currentUser)
        // Fetch user data when a user logs in or signs up
      } else {
        // Set user data to null when the user signs out
        setUserData(null)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const createUser = async (firstName: string, lastName: string, userName: string, email: string, password: string) => {
    try {
      const currentUser = await createUserWithEmailAndPassword(auth, email, password)
      const user = currentUser.user
      const userId = user.uid
      const userDocRef = doc(colRefUsers, userId)

      // Set the user document with initial values
      await setDoc(userDocRef, {
        firstName: firstName,
        lastName: lastName,
        userName: userName,
      })

      // Create subcollections with initial documents
      const favoritesColRef = collection(userDocRef, "favorites")
      const learnedColRef = collection(userDocRef, "learned")

      // Add initial documents to subcollections
      const favoriteDocRef = doc(favoritesColRef) // Firestore will auto-generate a document ID
      await setDoc(favoriteDocRef, { data: "initial data for favorites" })

      const learnedDocRef = doc(learnedColRef) // Firestore will auto-generate a document ID
      await setDoc(learnedDocRef, { data: "initial data for learned" })

      // Fetch user data after successful creation
      fetchUserData(userId)
    } catch (error) {
      console.error("Error creating user:", error)
    }
  }

  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData))
    } else {
      localStorage.removeItem("userData")
    }
  }, [userData])

  const signIn = async (email: string, password: string) => {
    console.log("Signing In.")
    try {
      const currentUser = await signInWithEmailAndPassword(auth, email, password)
      const user = currentUser.user
      const userUid = user.uid
      fetchUserData(userUid)
    } catch (error) {
      console.error("Error creating user:", error)
    }
  }

  const fetchUserData = async (userId: string) => {
    const userDocRef = doc(colRefUsers, userId)

    try {
      const userDocSnap = await getDoc(userDocRef)
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data()
        setUserData(userData)
      } else {
        console.log("User document does not exist.")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const logOut = () => {
    return signOut(auth)
      .then(() => {
        console.log("You have been signed out!")
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return <UserContext.Provider value={{ createUser, userData, logOut, signIn }}>{children}</UserContext.Provider>
}

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUserContext must be used within the provider")
  }
  return context
}
