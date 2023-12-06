import { AnimatePresence, motion } from "framer-motion"
import { FormEvent, ChangeEvent } from "react"
import { BiSearchAlt } from "react-icons/bi"
import { doc, getDocs, getDoc, query, where, updateDoc } from "firebase/firestore"
import { colRefUsers } from "../utils/firebase"
import { useUserContext } from "../utils/UserContext"
import { useState } from "react"
import { IoMdPersonAdd } from "react-icons/io"
import { Button } from "./Button"
import { FaXmark } from "react-icons/fa6"

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
}

interface UserData {
  uid: string
  displayName: string
  createdOn: string
}

const SearchFriends = ({ open, setOpen }: Props) => {
  const { userData } = useUserContext()
  const [userInput, setUserInput] = useState("")
  const [friendData, setFriendData] = useState<UserData[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleSearchFriend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const userInputForFriend = userInput.trim()

    try {
      await searchFriend(userInputForFriend)
    } catch (error) {
      setError("Error searching for user. Please try again.")
      setFriendData([])
    }
  }

  const searchFriend = async (userInputForFriend: string) => {
    const nameMatch = await queryByName(userInputForFriend)

    if (!nameMatch) {
      setError("User not found")
      setFriendData([])
    } else {
      setError(null)
    }
  }

  const queryByName = async (userInputForFriend: string): Promise<boolean> => {
    try {
      const querySnapshot = await getDocs(query(colRefUsers, where("displayName", "==", userInputForFriend)))

      if (!querySnapshot.empty) {
        const matchingUsers = querySnapshot.docs.map((doc) => {
          const userData = doc.data() as UserData
          return {
            uid: userData.uid,
            displayName: userData.displayName,
            createdOn: userData.createdOn,
          }
        })
        setFriendData(matchingUsers)
        console.log(matchingUsers)
        console.log("Query by name successful")
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error("Error querying by displayName:", error)
      throw error
    }
  }

  const handleAddFriend = async (friend: UserData) => {
    const userDocRef = doc(colRefUsers, userData?.uid)

    try {
      const userDoc = await getDoc(userDocRef)
      if (userDoc.exists()) {
        const userData = userDoc.data()
        const friends = userData?.friends || []
        const friendExists = friends.some((frnd: UserData) => frnd.uid === friend.uid)

        if (!friendExists) {
          friends.push({
            uid: friend.uid,
            displayName: friend.displayName,
            createdOn: friend.createdOn, // Assuming friend's creation date is when they registered or something similar
            befriended: new Date(), // Adding befriended date
          })

          await updateDoc(userDocRef, {
            friends,
          })

          console.log("Friend successfully added")
          setOpen(!open)
          setUserInput("")
          setFriendData([]) // Clear friend data after adding
        } else {
          console.log("Friend already added.")
        }
      }
    } catch (error) {
      console.log("Error saving or updating friend:", error)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const handleDone = () => {
    setOpen(!open)
    setUserInput("")
    setFriendData([])
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial="hidden"
          animate={`${open ? "hidden" : "visible"}`}
          exit="hidden"
          variants={{
            visible: { opacity: 1, y: 0, x: 0 },
            hidden: { opacity: 0, y: 500 },
          }}
          transition={{ duration: 0.3 }}
          className={`fixed top-0 inset-0  ${open ? "pointer-events-none" : ""} font-Inter`}
        >
          <div className="searchbox h-screen w-screen bg-white p-4 max-w-2xl mx-auto font-Inter">
            <div className="flex items-center">
              <button className="w-1/3 p-2 text-start text-lg text-black" onClick={handleDone}>
                Done
              </button>
              <span className="w-2/3 p-2 text-lg text-black">Add Friends</span>
            </div>
            <form onSubmit={handleSearchFriend}>
              {/* <label className="text-black font-bold text-2xl">Name or Email</label> */}
              <div className="p-3 bg-gray-200 rounded text-center flex items-center justify-center gap-2">
                <BiSearchAlt className="text-2xl text-gray-500" />
                <input
                  placeholder="Ex. John Doe or johndoe@gmail.com"
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
              {error && (
                <div className="text-red-500 text-xl md:text-2xl lg:text-3xl w-full text-center flex justify-center items-center gap-4">
                  <p>{error}!</p>
                  <Button variant={"glass2"} className="text-white" onClick={clearError}>
                    <FaXmark />
                  </Button>
                </div>
              )}
            </form>
            <div className="grid gap-4">
              {friendData &&
                friendData.map((friend, index) => (
                  <div key={index} className="flex justify-between items-center border-2 text-black rounded-xl">
                    <div className="p-2 rounded-3xl text-2xl">
                      <div className="grid">
                        <span className="font-bold ">{friend.displayName}</span>
                        {/* <span className="text-[#696969]">{friend.uid}</span> */}
                      </div>
                    </div>
                    <div className="grid place-items-center p-2 w-1/4">
                      <button onClick={() => handleAddFriend(friend)} className="bg-blue-400 p-2 rounded-xl">
                        <IoMdPersonAdd className="w-8 h-8 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default SearchFriends
