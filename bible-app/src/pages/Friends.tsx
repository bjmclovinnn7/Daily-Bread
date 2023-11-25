import { useNavigate } from "react-router"
import { useUserContext } from "../utils/UserContext"
import SearchFriends from "../comps/SearchFriend"
import { useState } from "react"
import { FaTrophy, FaXmark, FaPlus } from "react-icons/fa6"

const Friends = () => {
  const navigate = useNavigate()
  const { saveSelectedFriend, userFriends, getUpdatedFriendData } = useUserContext()
  const [open, setOpen] = useState(true)

  interface UserLearnedVerses {
    id: string
    translations: string
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

  const handleNavigateToFriend = (friendData: UserData) => {
    console.log(friendData.displayName)
    saveSelectedFriend(friendData)
    getUpdatedFriendData(friendData)
    navigate("/friendProfile")
  }

  const sortedFriends = userFriends
    ? [...userFriends].sort((friendA, friendB) => friendB.learnedVerses.length - friendA.learnedVerses.length)
    : []

  return (
    <>
      <div
        className={`h-screen w-full relative overflow-hidden bg-[#444444] text-white ${
          open ? "" : " bg-black bg-clip-padding backdrop-filter bg-opacity-30"
        } transition-all duration-500 p-4`}
      >
        <div className="relative block text-center text-3xl md:text-4xl lg:text-5xl">
          <button onClick={() => navigate("/")} className="absolute inset-0">
            <FaXmark className="" />
          </button>
          <span className=" text-white text-center font-header">Friends</span>
        </div>

        <div className="grid p-4 max-w-2xl mx-auto">
          <button
            onClick={() => setOpen(!open)}
            className="flex h-8 justify-center items-center gap-2 bg-white text-black rounded-full text-xl"
          >
            <FaPlus />
            <span>Add Friends</span>
          </button>
        </div>

        <div className="flex items-center gap-2 pl-2 max-w-2xl mx-auto">
          <span className="text-2xl font-bold">{userFriends ? userFriends?.length : 0}</span>
          <span className="text-2xl font-bold">{userFriends?.length === 1 ? "Friend" : "Friends"}</span>
        </div>

        <div className="grid sm:grid-cols-2 max-w-2xl mx-auto">
          {sortedFriends ? (
            sortedFriends.map((friend, index) => (
              <div key={index} className="p-2 ">
                <button
                  onClick={() => handleNavigateToFriend(friend)}
                  className=" text-center flex items-center justify-between gap-8 px-4 text-2xl border-2 w-full rounded-3xl p-4"
                >
                  <span>{friend.displayName}</span>
                  <div className="flex gap-2 items-center">
                    <span>{friend.learnedVerses.length}</span>
                    <FaTrophy className="text-orange-500 h-6 w-6" />
                  </div>
                </button>
              </div>
            ))
          ) : (
            <div className="text-black text-center p-2">You haven't added any friends.</div>
          )}
        </div>
        <SearchFriends open={open} setOpen={setOpen} />
      </div>
    </>
  )
}

export default Friends
