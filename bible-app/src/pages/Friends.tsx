import { useNavigate } from "react-router"
import { HiChevronLeft, HiOutlineRefresh } from "react-icons/Hi"
import { useUserContext } from "../utils/UserContext"
import SearchFriends from "../comps/SearchFriend"
import { useState } from "react"

const Friends = () => {
  const navigate = useNavigate()
  const { userData, userFriends, fetchUserFriends } = useUserContext()
  const [open, setOpen] = useState(true)

  const handleNavigateToFriend = (friend: string) => {
    console.log(friend)
    navigate("/friendProfile")
  }

  return (
    <>
      <div
        className={`h-screen w-full relative overflow-hidden ${
          open ? "" : " bg-black bg-clip-padding backdrop-filter bg-opacity-30"
        } transition-all duration-500`}
      >
        <div className=" flex justify-center items-center p-4">
          <button onClick={() => navigate("/")} className="w-1/4 flex justify-center items-center text-black">
            <HiChevronLeft className="text-4xl" /> <span className="text-2xl">Home</span>
          </button>

          <div className="text-2xl text-black text-center w-1/2">Friends</div>
          <button
            onClick={() => fetchUserFriends(userData.uid)}
            className="text-3xl text-black w-1/4 flex justify-center"
          >
            <HiOutlineRefresh />
          </button>
        </div>
        <div className="p-5">
          <button onClick={() => setOpen(!open)} className="block bg-slate-300 w-full rounded-3xl text-xl">
            Add Friends
          </button>
        </div>

        <div className=" text-black">
          <div className="flex items-center gap-2 pl-2">
            <span className="text-3xl font-bold">{userFriends ? userFriends.length : 0}</span>
            <span className="text-3xl font-bold">Friend(s)</span>
          </div>
          {userFriends ? (
            userFriends.map((friend, index) => (
              <div key={index} className="p-2">
                <button
                  onClick={() => handleNavigateToFriend(friend.data.userName)}
                  className="text-black text-center text-2xl grid place-content-center border-2 w-full rounded-3xl"
                >
                  <span>
                    {friend.data.firstName} {friend.data.lastName}
                  </span>
                  <span>{friend.data.userName}</span>
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
