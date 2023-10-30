import { AnimatePresence, motion, useAnimate } from "framer-motion"
import { FormEvent, useEffect, ChangeEvent } from "react"
import { BiSearchAlt } from "react-icons/bi"
import { collection, doc, getDocs, getDoc, query, where, setDoc } from "firebase/firestore"
import { colRefUsers } from "../utils/firebase"
import { useUserContext } from "../utils/UserContext"
import { useState } from "react"

function useDisplayAnimation(open: boolean) {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    animate(".searchbox", open ? { transform: "translateY(-15%)" } : { transform: "translateY(100%)" }, {
      type: "spring",
      stiffness: 70,
      damping: 15,
    })
  }, [open])

  return scope
}

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
}

interface FriendData {
  email: string
  firstName: string
  lastName: string
  userName: string
  uid: string
}

const SearchFriends = ({ open, setOpen }: Props) => {
  const scope = useDisplayAnimation(!open)
  const { userData, userFriends, fetchUserFriends } = useUserContext()
  const [userInput, setUserInput] = useState("")
  const [friendData, setFriendData] = useState<FriendData | null>(null)
  const [alreadyFriend, setAlreadyFriends] = useState(false)

  const handleSearchFriend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Check if the friend is already added based on their email
    if (userFriends.some((friend) => friend.data.email === userInput.trim())) {
      console.log("Friend with this email is already added.")
      setAlreadyFriends(true)
      return
    } else {
      setAlreadyFriends(false)
      const mapFriendInfoToFriendData = (friendInfo: any): FriendData => {
        return {
          email: friendInfo.email || "",
          firstName: friendInfo.firstName || "",
          lastName: friendInfo.lastName || "",
          userName: friendInfo.userName || "",
          uid: friendInfo.uid || "",
        }
      }

      try {
        const userEmail = userInput.trim()

        const querySnapshot = await getDocs(query(colRefUsers, where("email", "==", userEmail)))

        if (!querySnapshot.empty) {
          // User with the given email found
          const userDoc = querySnapshot.docs[0]
          const friendInfo = userDoc.data()
          const friendData = mapFriendInfoToFriendData(friendInfo)
          setFriendData(friendData)
          // Display or handle the found user data, and allow the user to add them as a friend
          console.log("User found:", friendData)

          // You can call your own function to add this friend to the current user's "friends" subcollection here.
        } else {
          console.log("User not found")
        }
      } catch (error) {
        console.error("Error searching for user:", error)
      }
    }
  }

  const handleAddFriend = async () => {
    const userId = userData?.uid
    const friendUid = friendData?.uid // Assuming that the friend's UID is available in friendData

    // Create a reference to the user's "friends" subcollection
    const userDocRef = doc(colRefUsers, userId)
    const friendsCollection = collection(userDocRef, "friends")

    // Check if the friend already exists in the "friends" subcollection
    const friendDocRef = doc(friendsCollection, friendUid)

    try {
      // Get the friend document
      const friendDoc = await getDoc(friendDocRef)

      if (friendDoc.exists()) {
        // Friend already exists
        console.log("Friend already added.")
      } else {
        // Friend does not exist, so add them
        await setDoc(friendDocRef, friendData)
        fetchUserFriends(userData.uid)
        console.log("Friend added successfully")
      }
    } catch (error) {
      console.log("Error adding friend:", error)
    }
  }

  const handleDone = () => {
    setOpen(!open)
    setUserInput("")
    setFriendData(null)
    setAlreadyFriends(false)
  }

  return (
    <>
      <AnimatePresence>
        <motion.div ref={scope}>
          <motion.div
            initial={{ transform: "translateY(100%)" }}
            className="searchbox h-screen w-screen bg-white border-2 p-4 rounded-3xl "
          >
            <div className="flex items-center">
              <button className="w-1/3 p-2 font-bold text-start text-lg" onClick={handleDone}>
                Done
              </button>
              <span className="w-2/3 p-2 font-bold text-lg">Add Friends</span>
            </div>
            <form onSubmit={handleSearchFriend}>
              <div className="p-3 bg-gray-200 rounded text-center flex items-center justify-center gap-2">
                <BiSearchAlt className="text-2xl" />
                <input
                  placeholder="Username or email"
                  type="text"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setUserInput(e.target.value)
                  }}
                  value={userInput} // Set the value of the input field
                  required
                  className="w-full h-10 text-xl bg-gray-200"
                ></input>
              </div>
              <div className="p-4">
                <button className="bg-slate-300 w-full rounded-3xl text-xl">Search</button>
              </div>
            </form>
            <div>
              {alreadyFriend && <span className="text-black">You've already added this user.</span>}
              {friendData && (
                <div className="flex justify-between items-center border-2 ">
                  <div className="p-2 rounded-3xl text-xl">
                    <div className="flex w-3/4 gap-2 font-bold">
                      <span>{friendData.firstName}</span>
                      <span>{friendData.lastName}</span>
                    </div>
                    <p>User Name: {friendData.userName}</p>
                  </div>
                  <div className="grid place-items-center p-2">
                    <button onClick={handleAddFriend} className="border-2 rounded-full text-2xl w-16 h-16 bg-green-100">
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default SearchFriends
