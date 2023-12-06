import { createContext, ReactNode, useContext, useState, useEffect } from "react"
import { signOut, onAuthStateChanged, User } from "firebase/auth"
import { auth, colRefUsers } from "./firebase"
import { doc, onSnapshot, getDoc } from "firebase/firestore"

interface UserLearnedVerses {
  id: string
  translation: string
  learned: boolean
  category: string
  timeStamp: {
    seconds: number
    nanoseconds: number
  }
}

interface UserData {
  uid: string // needs to be hidden or partial so that other's can't abuse it. Displayname + # + last 5 of UID?
  displayName: string
  createdOn: {
    seconds: number
    nanoseconds: number
  }
  learnedVerses: UserLearnedVerses[]
  friends: UserData[]
  experience: number
  userName: string
}

interface UserContextType {
  logOut: () => void
  userData: UserData
  userFriends: UserData[]
  selectedFriend: UserData
  getFriendData: () => void
  saveSelectedFriend: (friendData: UserData) => void
  getUpdatedFriendData: (friendData: UserData) => void
  photo: string
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<any>(() => {
    const saved = localStorage.getItem("userData")
    // if (saved === undefined) {
    //   return null
    // }
    const initialValue = saved ? JSON.parse(saved) : null
    return initialValue
  })
  const [photo, setPhoto] = useState("")
  const [userFriends, setUserFriends] = useState<UserData[]>(() => {
    const saved = localStorage.getItem("userFriends")
    const initialValue = saved ? JSON.parse(saved) : []
    return initialValue
  })
  const [selectedFriend, setSelectedFriend] = useState<UserData>(() => {
    const saved = localStorage.getItem("selectedFriend")
    const initialValue = saved ? JSON.parse(saved) : {}
    return initialValue
  })

  const saveSelectedFriend = (friendData: UserData) => {
    setSelectedFriend(friendData)
    saveToLocalStorage("selectedFriend", selectedFriend)
  }

  const getUpdatedFriendData = async (oldFriendData: UserData) => {
    const friendDocRef = doc(colRefUsers, oldFriendData.uid)
    try {
      console.log(`Getting Data for ${oldFriendData.displayName}`, oldFriendData.uid)
      const friendDoc = await getDoc(friendDocRef)
      const friendData = friendDoc.data()

      if (friendData) {
        // Ensure that the data exists before using it
        const updatedUserFriends = userFriends.map((friend) => {
          if (friend.uid === friendData.uid) {
            return {
              uid: friendData.uid,
              userName: friendData.userName,
              displayName: friendData.displayName,
              createdOn: friendData.createdOn,
              learnedVerses: friendData.learnedVerses,
              friends: friendData.friends,
              experience: friendData.experience || 0,
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
      const updatedFriendData: UserData[] = []
      const existingFriendUIDs = new Set(userFriends.map((userFriend) => userFriend.uid))

      for (const friend of userData.friends) {
        if (existingFriendUIDs.has(friend.uid)) {
          // Friend is already in userFriends, so add them to updatedFriendData
          const existingFriend = userFriends.find((userFriend) => userFriend.uid === friend.uid)
          if (existingFriend) {
            updatedFriendData.push(existingFriend)
          }
        } else {
          console.log(`Getting Document Reads for ${friend.displayName}`, friend.uid)
          const friendUid = friend.uid
          const friendDocRef = doc(colRefUsers, friendUid)

          try {
            const friendDoc = await getDoc(friendDocRef)
            const friendData = friendDoc.data()

            if (friendData) {
              const userFriendData: UserData = {
                uid: friendUid,
                userName: friendData.userName,
                displayName: friendData.displayName,
                createdOn: friendData.createdOn,
                learnedVerses: friendData.learnedVerses,
                friends: friendData.friends,
                experience: friendData.experience || 0,
              }

              updatedFriendData.push(userFriendData)
              console.log("Friend Data Read;", friendData.displayName)
            }
          } catch (error) {
            console.error(error)
          }
        }
      }

      // Update the state with the new friend data while preserving existing friends
      setUserFriends(updatedFriendData)
      // Also, update the userFriends data in local storage
      saveToLocalStorage("userFriends", updatedFriendData)
    }
  }

  useEffect(() => {
    getFriendData()
  }, [userData])

  //listeners for when user signs in; will check for changes in userFriends + learnedVerses and update.
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser: User | null) => {
      if (currentUser) {
        // User is signed in, you can fetch their learned verses
        console.log(currentUser)
        const userUid = currentUser.uid
        setPhoto(currentUser.photoURL || "")
        const currentUserRef = doc(colRefUsers, userUid)

        const unsubscribeUser = onSnapshot(currentUserRef, (snapshot) => {
          // The callback function is called whenever the learnedVerses document changes
          const userData = snapshot.data()
          // Process the data and update your state
          // Convert the data object into an array of UserLearnedVerses
          if (userData?.userName) {
            setUserData({
              uid: userData?.uid,
              email: userData?.email,
              displayName: userData?.displayName,
              createdOn: userData?.createdOn,
              learnedVerses: userData?.learnedVerses,
              friends: userData?.friends,
              experience: userData?.experience,
              userName: userData.userName,
            })

            saveToLocalStorage("userData", userData)
          } else {
            return
          }
        })

        // Clean up the learnedVerses listener when the component unmounts
        return () => {
          console.log("Unsubscribing")
          unsubscribeUser()
        }
      }
    })
    // Clean up the authentication listener when the component unmounts
    return () => {
      unsubscribeAuth()
    }
  }, [])

  const logOut = async () => {
    try {
      await signOut(auth)
      console.log("You have been signed out!")
      setUserData(null)
      setUserFriends([])
      localStorage.clear()
      removeFromLocalStorage("userData")
      removeFromLocalStorage("userFriends")
      removeFromLocalStorage("currentCategory")
      removeFromLocalStorage("selectedVerse")
      removeFromLocalStorage("selectedFriend")
    } catch (error) {
      console.log(error)
    }
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
        photo,
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
