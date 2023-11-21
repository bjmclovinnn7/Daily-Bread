import { AnimatePresence, motion, useAnimate } from "framer-motion"
import { FormEvent, useEffect, ChangeEvent } from "react"
import { BiSearchAlt } from "react-icons/bi"
import { doc, getDocs, getDoc, query, where, updateDoc } from "firebase/firestore"
import { colRefUsers } from "../utils/firebase"
import { useUserContext } from "../utils/UserContext"
import { useState } from "react"
import { IoMdPersonAdd } from "react-icons/io"

function useDisplayAnimation(open: boolean) {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    animate(".searchbox", open ? { transform: "translateY(0%)" } : { transform: "translateY(100%)" }, {
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

interface UserData {
  uid: string
  email: string
  displayName: string
  createdOn: string
}

const SearchFriends = ({ open, setOpen }: Props) => {
  const scope = useDisplayAnimation(!open)
  const { userData } = useUserContext()
  const [userInput, setUserInput] = useState("")
  const [friendData, setFriendData] = useState<UserData | null>(null)

  const handleSearchFriend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Check if the friend is already added based on their email
    try {
      const userEmail = userInput.trim()
      if (userEmail === userData.email) {
        return alert("You cannot add your own account.")
      }
      const querySnapshot = await getDocs(query(colRefUsers, where("email", "==", userEmail)))
      if (!querySnapshot.empty) {
        // Check if the querySnapshot has documents
        // User with the given email found
        const userDoc = querySnapshot.docs[0]
        const friendInfo = userDoc.data()

        setFriendData({
          uid: friendInfo.uid,
          email: friendInfo.email,
          displayName: friendInfo.displayName,
          createdOn: friendInfo.createdOn,
        })

        console.log(friendData)
      } else {
        alert("User not found")
      }
    } catch (error) {
      console.error("Error searching for user:", error)
    }
  }

  const handleAddFriend = async () => {
    if (friendData) {
      const userId = userData?.uid
      const userFriendRef = doc(colRefUsers, userId)
      try {
        const userDoc = await getDoc(userFriendRef)
        if (userDoc.exists()) {
          const userData = userDoc.data()
          const friends = userData?.friends || []
          const friendExists = friends.some((friend: UserData) => friend.email === friendData.email)
          if (!friendExists) {
            friends.push({
              uid: friendData.uid,
              email: friendData.email,
              displayName: friendData.displayName,
              createdOn: friendData.createdOn,
            })
            await updateDoc(userFriendRef, {
              friends,
            })
            console.log("Friend successfully added")

            setOpen(!open)
            setUserInput("")
            setFriendData(null)
          } else {
            console.log("Friend already added.")
          }
        }
      } catch (error) {
        console.log("Error saving or updating friend:", error)
      }
    }
  }

  const handleDone = () => {
    setOpen(!open)
    setUserInput("")
    setFriendData(null)
  }

  return (
    <>
      <AnimatePresence>
        <motion.div ref={scope} className={`absolute top-[15vh] inset-0  ${open ? "pointer-events-none" : ""}`}>
          <motion.div
            initial={{ transform: "translateY(100%)" }}
            className="searchbox h-screen w-screen bg-white border-2 p-4 rounded-3xl max-w-2xl mx-auto"
          >
            <div className="flex items-center">
              <button className="w-1/3 p-2 font-bold text-start text-lg text-black" onClick={handleDone}>
                Done
              </button>
              <span className="w-2/3 p-2 font-bold text-lg">Add Friends</span>
            </div>
            <form onSubmit={handleSearchFriend}>
              <div className="p-3 bg-gray-200 rounded text-center flex items-center justify-center gap-2">
                <BiSearchAlt className="text-2xl text-gray-500" />
                <input
                  placeholder="Friend's email"
                  type="text"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setUserInput(e.target.value)
                  }}
                  value={userInput} // Set the value of the input field
                  required
                  className="w-full h-10 text-xl bg-gray-200 text-black"
                ></input>
              </div>
              <div className="p-4">
                <button className="bg-gray-500 w-full rounded-3xl text-xl">Search</button>
              </div>
            </form>
            <div>
              {friendData && (
                <div className="flex justify-between items-center border-2 text-black rounded-xl">
                  <div className="p-2 rounded-3xl text-2xl">
                    <div className="font-bold grid">
                      <span>{friendData.displayName}</span>
                    </div>
                  </div>
                  <div className="grid place-items-center p-2 w-1/4">
                    <button onClick={handleAddFriend} className="bg-blue-400 p-2 rounded-xl">
                      <IoMdPersonAdd className="w-8 h-8 text-white" />
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
