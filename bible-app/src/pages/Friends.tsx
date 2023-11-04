import { useNavigate } from "react-router"
import { useUserContext } from "../utils/UserContext"
import SearchFriends from "../comps/SearchFriend"
import { useState } from "react"
import { FaTrophy } from "react-icons/fa6"

const Friends = () => {
  const navigate = useNavigate()
  const { saveSelectedFriend, userFriends } = useUserContext()
  const [open, setOpen] = useState(true)

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

  const handleNavigateToFriend = (friendData: UserData) => {
    console.log(friendData.displayName)
    saveSelectedFriend(friendData)
    navigate("/friendProfile")
  }

  const sortedFriends = userFriends
    ? [...userFriends].sort((friendA, friendB) => friendB.learnedVerses.length - friendA.learnedVerses.length)
    : []

  return (
    <>
      <div
        className={`h-screen w-full relative overflow-hidden ${
          open ? "" : " bg-black bg-clip-padding backdrop-filter bg-opacity-30"
        } transition-all duration-500`}
      >
        <div className=" flex justify-center items-center p-4">
          <button onClick={() => navigate("/")} className="w-1/4 flex justify-center items-center text-black">
            <span className="text-2xl">Home</span>
          </button>

          <div className="text-2xl text-black text-center w-1/2">Friends</div>
          <button>Refresh</button>
        </div>
        <div className="p-5">
          <button onClick={() => setOpen(!open)} className="block bg-slate-300 w-full rounded-3xl text-xl">
            Add Friends
          </button>
        </div>
        <SearchFriends open={open} setOpen={setOpen} />

        <div className=" text-black">
          <div className="flex items-center gap-2 pl-2">
            <span className="text-3xl font-bold">{userFriends ? userFriends?.length : 0}</span>
            <span className="text-3xl font-bold">Friend(s)</span>
          </div>
          {sortedFriends ? (
            sortedFriends.map((friend, index) => (
              <div key={index} className="p-2">
                <button
                  onClick={() => handleNavigateToFriend(friend)}
                  className="text-black text-center flex items-center justify-between px-8 text-3xl border-2 w-full rounded-3xl p-4"
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
      </div>
    </>
  )
}

export default Friends
