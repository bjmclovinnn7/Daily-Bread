import { createContext, ReactNode, useContext, useState, useEffect } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth"
import { auth, colRefUsers } from "./firebase"
import { getDoc, setDoc, doc, collection, getDocs } from "firebase/firestore"

interface UserLearnedVerses {
  id: string
  data: {
    learned: boolean
    timeStamp: string
  }
}

interface UserFriends {
  id: string
  data: {
    firstName: string
    lastName: string
    userName: string
    email: string
    learnedVerses: []
  }
}

interface UserData {
  uid: string
  data: {
    email: string
    firstName: string
    lastName: string
    userName: string
  }
}

interface UserContextType {
  createUser: (firstName: string, lastName: string, userName: string, email: string, password: string) => void
  logOut: () => void
  signIn: (email: string, password: string) => void
  fetchLearnedVerses: (userUid: string) => void
  userData: UserData
  userFriends: UserFriends[]
  userLearnedVerses: UserLearnedVerses[]
  fetchUserData: (userUid: string) => void
  fetchUserFriends: (userUid: string) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<any>(() => {
    const saved = localStorage.getItem("userData")
    const initialValue = saved ? JSON.parse(saved) : ""
    return initialValue
  })
  const [userLearnedVerses, setUserLearnedVerses] = useState<UserLearnedVerses[]>(() => {
    const saved = localStorage.getItem("userLearnedVerses")
    const initialValue = saved ? JSON.parse(saved) : ""
    return initialValue
  })
  const [userFriends, setUserFriends] = useState<UserFriends[]>(() => {
    const saved = localStorage.getItem("userFriends")
    const initialValue = saved ? JSON.parse(saved) : ""
    return initialValue
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      if (currentUser) {
        console.log("Welcome")
      } else {
        // Set user data to null when the user signs out
        setUserData(null)
        console.log("Goodbye!")
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
        email: email,
        uid: userId,
      })

      // Fetch user data after successful creation
      fetchUserData(userId)
    } catch (error) {
      console.error("Error creating user:", error)
    }
  }

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

  const fetchUserData = async (userUid: string) => {
    const userDocRef = doc(colRefUsers, userUid)
    try {
      const userDocSnap = await getDoc(userDocRef)
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data()
        setUserData({
          uid: userData.uid,
          data: {
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            userName: userData.userName,
          },
        })
        saveToLocalStorage("userData", userData)
        fetchLearnedVerses(userData.uid)
        fetchUserFriends(userData.uid)
      } else {
        console.log("User document does not exist.")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchLearnedVerses = async (userUid: string) => {
    const userDocRef = doc(colRefUsers, userUid)
    const learnedVersesRef = collection(userDocRef, "learnedVerses")
    console.log("Fetch Learned Verses Initiated.")

    try {
      const querySnapshot = await getDocs(learnedVersesRef)
      const learnedVerses: UserLearnedVerses[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data() as UserLearnedVerses["data"]
        learnedVerses.push({
          id: doc.id,
          data,
        })
      })

      // Update the state using a function to correctly merge the new data
      setUserLearnedVerses(learnedVerses)
      saveToLocalStorage("userLearnedVerses", learnedVerses)
    } catch (error) {
      console.error("Error retrieving learned verses:", error)
    }
  }

  const fetchUserFriends = async (userUid: string) => {
    const userDocRef = doc(colRefUsers, userUid)
    const userFriendsRef = collection(userDocRef, "friends")
    console.log("Fetch user friends initiated.")

    try {
      const querySnapshot = await getDocs(userFriendsRef)
      const friends: UserFriends[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data() as UserFriends["data"]
        friends.push({ id: doc.id, data })
      })

      // Update the user data with the retrieved friends
      setUserFriends(friends)
      saveToLocalStorage("userFriends", friends)
    } catch (error) {
      console.error("Error retrieving user friends:", error)
    }
  }

  const logOut = () => {
    return signOut(auth)
      .then(() => {
        console.log("You have been signed out!")
        setUserData(null)
        removeFromLocalStorage("userData")
        removeFromLocalStorage("userLearnedVerses")
        removeFromLocalStorage("userFriends")
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const saveToLocalStorage = (name: string, item: any) => {
    localStorage.setItem(name, JSON.stringify(item))
  }

  const removeFromLocalStorage = (name: string) => {
    localStorage.removeItem(name)
  }

  return (
    <UserContext.Provider
      value={{
        createUser,
        userData,
        userFriends,
        userLearnedVerses,
        logOut,
        signIn,
        fetchLearnedVerses,
        fetchUserData,
        fetchUserFriends,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUserContext must be used within the provider")
  }
  return context
}
