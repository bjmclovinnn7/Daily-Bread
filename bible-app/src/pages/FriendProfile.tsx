import { useUserContext } from "../utils/UserContext"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { FaFlask, FaShield, FaTrophy } from "react-icons/fa6"
import Achievements from "../comps/Achievements"
import achievementData from "../utils/AchievementData.json" // Assuming you have an Achievements component
import { FaArrowLeft, FaClock, FaMinus, FaUserFriends } from "react-icons/fa"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { colRefUsers } from "../utils/firebase"
import { cn } from "../utils/utils"

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
  uid: string
  email: string
  displayName: string
  createdOn: {
    seconds: number
    nanoseconds: number
  }
  learnedVerses: UserLearnedVerses[]
  friends: UserData[]
}

const FriendProfile = () => {
  const { selectedFriend, userData } = useUserContext()
  const navigate = useNavigate()
  const [seeAchievements, setSeeAchievements] = useState(false)
  const [rankColor, setRankColor] = useState("")
  const [userRank, setUserRank] = useState("")

  interface timeStamp {
    seconds: number
    nanoseconds: number
  }

  const handleTimeStamp = (timeStamp: timeStamp) => {
    if (timeStamp) {
      const date = new Date(timeStamp.seconds * 1000 + timeStamp.nanoseconds / 1000000)
      const readableDate = date.toLocaleDateString()
      return readableDate
    } else {
      return "No Date."
    }
  }

  const removeFriend = async (selectedFriend: UserData) => {
    // Assuming you have access to the Firebase Auth instance and the user's ID

    try {
      // Get the reference to the user's document in Firestore
      const userDocRef = doc(colRefUsers, userData.uid)
      const userDoc = await getDoc(userDocRef)

      if (userDoc.exists()) {
        const userData = userDoc.data()
        const friends = userData.friends || []

        // Find the index of the friend to remove
        const friendIndex = friends.findIndex((friend: UserData) => friend.uid === selectedFriend.uid)

        if (friendIndex !== -1) {
          // Remove the friend from the array
          friends.splice(friendIndex, 1)

          // Update the Firestore document with the modified friends array
          await updateDoc(userDocRef, { friends })

          console.log("Friend successfully removed")
        } else {
          console.log("Friend not found in the list")
        }
      }
    } catch (error) {
      console.error("Error removing friend:", error)
    }
  }

  const handleRemoveFriend = () => {
    navigate("/friends")
    removeFriend(selectedFriend)
  }

  useEffect(() => {
    let newRankColor = ""
    let rankTitle = ""

    if (selectedFriend?.experience) {
    }
    if (selectedFriend?.experience >= 50 && userData?.experience < 200) {
      newRankColor = "text-[#c0c0c0]"
      rankTitle = "Silver"
    } else if (selectedFriend?.experience >= 200) {
      newRankColor = "text-[#FFD700]"
      rankTitle = "Gold"
    } else {
      newRankColor = "text-[#CD7F32]"
      rankTitle = "Bronze"

      setRankColor(newRankColor)
      setUserRank(rankTitle)
    }
    // No return statement is necessary here
  }, []) // Add userData?.experience to the dependency array

  return (
    <>
      <div className="bg-black h-full w-full text-white p-4 overflow-auto font-Inter">
        <div className="relative block text-center">
          <button onClick={() => navigate("/friends")} className="absolute inset-0">
            <FaArrowLeft className="text-3xl md:text-4xl lg:text-5xl" />
          </button>
          <span className="text-3xl md:text-4xl lg:text-5xl text-white text-center">Friend</span>
        </div>

        <section className="text-white py-4 max-w-2xl mx-auto">
          <div className="flex justify-between">
            <div className="profile">
              <div className="flex justify-between items-center w-full">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold">{selectedFriend.displayName}</div>
              </div>
              <div className="flex justify-start gap-2 items-center">
                <span>
                  <FaClock className="" />
                </span>
                <span>Joined {handleTimeStamp(selectedFriend.createdOn)}</span>
              </div>
            </div>
          </div>
          <div className="grid p-4">
            <button
              onClick={handleRemoveFriend}
              className="flex h-8 justify-center items-center gap-2 bg-red-400 text-black rounded-full text-xl"
            >
              <FaMinus />
              <span>Remove Friend</span>
            </button>
          </div>
          {/* <div className="grid pt-4">
            <button
              onClick={() => navigate("/friends")}
              className="flex h-8 justify-center items-center gap-2 bg-white text-black rounded-full"
            >
              <span>Add Friends</span>
            </button>
          </div> */}
        </section>
        <section className="text-white py-4 border-t-2 max-w-2xl mx-auto">
          <div className="Statistics">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold pb-2">Statistics</h1>
            <div className="grid grid-cols-2 place-content-center gap-4 px-4">
              <div className="">
                <div className="flex items-center justify-center bg-[#696969] rounded-xl">
                  <div className="grid place-content-center w-1/4">
                    <FaUserFriends className="text-blue-700 text-2xl" />
                  </div>
                  <div className="grid w-3/4">
                    <span className="font-bold">{selectedFriend.friends.length || 0}</span>
                    <span>Following</span>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="flex items-center justify-center bg-[#696969] rounded-xl">
                  <div className="grid place-content-center w-1/4">
                    <FaTrophy className="text-yellow-500 text-2xl" />
                  </div>
                  <div className="grid w-3/4">
                    <span className="font-bold">{selectedFriend.learnedVerses.length || 0}</span>
                    <span>Learned </span>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="flex items-center justify-center bg-[#696969] rounded-xl">
                  <div className="grid place-content-center w-1/4">
                    <FaFlask className="text-green-500 text-2xl" />
                  </div>

                  <div className="grid w-3/4">
                    <span className="font-bold">{selectedFriend?.experience || 0}</span>
                    <span>Total XP</span>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="flex items-center justify-center bg-[#696969] rounded-xl">
                  <div className="grid place-content-center w-1/4">
                    <FaShield className={cn(`text-2xl ${rankColor}`)} />
                  </div>

                  <div className="grid w-3/4">
                    <div className={`font-bold ${rankColor}`}>{userRank}</div>
                    <span>Rank</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="text-white py-4 border-t-2 max-w-2xl mx-auto">
          <div className="Acheivements">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold pb-2">Achievements</h1>
              <button onClick={() => setSeeAchievements(true)}>View All</button>
            </div>
            <div className="max-h-[440px] overflow-hidden">
              <Achievements
                learnedVerses={selectedFriend.learnedVerses}
                achievements={achievementData}
                seeAchievements={seeAchievements}
                setSeeAchievements={setSeeAchievements}
                experience={selectedFriend?.experience}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default FriendProfile
