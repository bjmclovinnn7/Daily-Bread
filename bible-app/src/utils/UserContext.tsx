import { createContext, ReactNode, useContext, useState, useEffect } from "react"
import { signOut, onAuthStateChanged, User } from "firebase/auth"
import { auth, colRefUsers } from "./firebase"
import { doc, onSnapshot, getDoc } from "firebase/firestore"

interface UserLearnedVerses {
  id: string
  translation: string
  learned: boolean
}

interface UserData {
  uid: string
  email: string
  displayName: string
  createdOn: string
  learnedVerses: UserLearnedVerses[]
  friends: UserData[]
}

interface UserContextType {
  logOut: () => void
  userData: UserData
  userFriends: UserData[]
  selectedFriend: UserData
  getFriendData: () => void
  saveSelectedFriend: (friendData: UserData) => void
  getUpdatedFriendData: (friendData: UserData) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<any>(() => {
    const saved = localStorage.getItem("userData")
    const initialValue = saved ? JSON.parse(saved) : ""
    return initialValue
  })
  const [userFriends, setUserFriends] = useState<UserData[]>(() => {
    const saved = localStorage.getItem("userFriends")
    const initialValue = saved ? JSON.parse(saved) : []
    return initialValue
  })
  const [selectedFriend, setSelectedFriend] = useState<UserData>(() => {
    const saved = localStorage.getItem("userFriends")
    const initialValue = saved ? JSON.parse(saved) : ""
    return initialValue
  })

  const saveSelectedFriend = (friendData: UserData) => {
    removeFromLocalStorage("selectedFriend")
    setSelectedFriend(friendData)
    saveToLocalStorage("selectedFriend", selectedFriend)
  }

  const getUpdatedFriendData = async (oldFriendData: UserData) => {
    const friendDocRef = doc(colRefUsers, oldFriendData.uid)
    try {
      const friendDoc = await getDoc(friendDocRef)
      const friendData = friendDoc.data()

      if (friendData) {
        // Ensure that the data exists before using it
        const updatedUserFriends = userFriends.map((friend) => {
          if (friend.uid === friendData.uid) {
            return {
              uid: friendData.uid,
              email: friendData.email,
              displayName: friendData.displayName,
              createdOn: friendData.createdOn,
              learnedVerses: friendData.learnedVerses,
              friends: friendData.friends,
            }
          } else {
            return friend
          }
        })

        // Update the userFriends state with the modified array
        setUserFriends(updatedUserFriends)
      } else {
        console.log("Friend data not found")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getFriendData = async () => {
    if (userData && userData.friends) {
      let updatedFriendData: UserData[] = []

      for (const friend of userData.friends) {
        const friendUid = friend.uid

        const friendDocRef = doc(colRefUsers, friendUid)
        try {
          const friendDoc = await getDoc(friendDocRef)
          const friendData = friendDoc.data()

          if (friendData) {
            const userFriendData: UserData = {
              uid: friendUid,
              email: friendData.email,
              displayName: friendData.displayName,
              createdOn: friendData.createdOn,
              learnedVerses: friendData.learnedVerses,
              friends: friendData.friends,
            }

            updatedFriendData.push(userFriendData)
          } else {
            console.log("Friend data not found for UID: " + friendUid)
          }
        } catch (error) {
          console.error(error)
        }
      }
      saveToLocalStorage("userFriends", updatedFriendData)
      setUserFriends(updatedFriendData) // Update the state with the new friend data
    }
  }
  useEffect(() => {
    if (userData?.friends) {
      getFriendData()
    }
  }, [userData?.friends])

  //listeners for when user signs in; will check for changes in userFriends + learnedVerses and update.
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser: User | null) => {
      if (currentUser?.uid) {
        // User is signed in, you can fetch their learned verses
        console.log("listeners engaged.")
        const userUid = currentUser.uid
        const currentUserRef = doc(colRefUsers, userUid)

        const unsubscribeUser = onSnapshot(currentUserRef, (snapshot) => {
          // The callback function is called whenever the learnedVerses document changes
          const userData = snapshot.data()
          // Process the data and update your state
          // Convert the data object into an array of UserLearnedVerses
          setUserData({
            uid: userData?.uid,
            email: userData?.email,
            displayName: userData?.displayName,
            createdOn: {
              seconds: userData?.createdOn.seconds,
              nanoseconds: userData?.createdOn.nanoseconds,
            },
            learnedVerses: userData?.learnedVerses,
            friends: userData?.friends,
          })

          saveToLocalStorage("userData", userData)
        })

        // Clean up the learnedVerses listener when the component unmounts
        return () => {
          console.log("Unsubscribing")
          unsubscribeUser
        }
      } else {
        setUserData(null)
      }
    })
    // Clean up the authentication listener when the component unmounts
    return () => {
      unsubscribeAuth()
    }
  }, [])

  const logOut = () => {
    return signOut(auth)
      .then(() => {
        console.log("You have been signed out!")
        setUserData(null)
        setUserFriends([])
        removeFromLocalStorage("userData")
        removeFromLocalStorage("userFriends")
        removeFromLocalStorage("currentCategory")
        removeFromLocalStorage("selectedVerse")
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
        userData,
        userFriends,
        logOut,
        selectedFriend,
        getFriendData,
        saveSelectedFriend,
        getUpdatedFriendData,
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
