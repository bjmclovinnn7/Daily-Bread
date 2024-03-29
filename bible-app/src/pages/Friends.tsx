import { useNavigate } from "react-router"
import { useUserContext } from "../utils/UserContext"
import SearchFriends from "../comps/SearchFriend"
import { useState } from "react"
import { FaTrophy, FaPlus } from "react-icons/fa6"
import { FaArrowLeft } from "react-icons/fa"
import { Button } from "../comps/Button"

const Friends = () => {
  const navigate = useNavigate()
  const { saveSelectedFriend, userFriends, getUpdatedFriendData } = useUserContext()
  const [open, setOpen] = useState(true)

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

  interface UserFriendData {
    uid: string
    displayName: string
    createdOn: {
      seconds: number
      nanoseconds: number
    }
    learnedVerses: UserLearnedVerses[]
    friends: UserFriendData[]
    experience: number
    userName: string
  }

  const handleNavigateToFriend = (friendData: UserFriendData) => {
    console.log(friendData.displayName)
    saveSelectedFriend(friendData)
    getUpdatedFriendData(friendData)
    navigate("/friendProfile")
  }

  // const sortedFriends = userFriends
  //   ? [...userFriends].sort((friendA, friendB) => friendB.learnedVerses.length - friendA.learnedVerses.length)
  //   : []

  return (
    <>
      <div
        className={`h-screen w-full relative overflow-auto bg-black text-white font-Inter${
          open ? "" : " bg-black bg-clip-padding backdrop-filter bg-opacity-70"
        } transition-all duration-500 p-4`}
      >
        <div className="relative block text-center text-3xl md:text-4xl lg:text-5xl">
          <button onClick={() => navigate("/")} className="absolute inset-0">
            <FaArrowLeft className="" />
          </button>
          <span className=" text-white text-center">Friends</span>
        </div>

        <div className="grid p-4 max-w-2xl mx-auto">
          <Button onClick={() => setOpen(!open)} variant={"primary"}>
            <FaPlus />
            <span>Add Friends</span>
          </Button>
        </div>

        <div className="flex items-center gap-2 pl-2 max-w-2xl mx-auto">
          <span className="text-2xl font-bold">{userFriends ? userFriends?.length : 0}</span>
          <span className="text-2xl font-bold">{userFriends?.length === 1 ? "Friend" : "Friends"}</span>
        </div>

        <div className="grid sm:grid-cols-2 max-w-2xl mx-auto">
          {userFriends ? (
            userFriends.map((friend, index) => (
              <div key={index} className="p-2 ">
                <button
                  onClick={() => handleNavigateToFriend(friend)}
                  className=" text-center flex items-center justify-between gap-8 px-4 text-2xl w-full rounded-lg p-4 bg-[#444444]"
                >
                  <span>{friend.displayName}</span>
                  <div className="flex gap-2 items-center">
                    <span>{friend.learnedVerses.length}</span>
                    <FaTrophy className="text-yellow-500 h-6 w-6" />
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
