import { useEffect } from "react"
import { useUserContext } from "../utils/UserContext"
import { useNavigate } from "react-router"
import { FaTrophy } from "react-icons/fa"

const FriendProfile = () => {
  const { selectedFriend, getUpdatedFriendData } = useUserContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (selectedFriend) {
      getUpdatedFriendData(selectedFriend) // Call getUpdatedFriendData with the selected friend's UID
    }
  }, [])

  return (
    <>
      <button onClick={() => navigate("/friends")}>Back</button>
      <div className="h-full w-full p-4">
        <span className="text-3xl text-black block text-center">{selectedFriend.displayName}</span>
        <span className="text-xl text-black block">Email: {selectedFriend.email}</span> {/* Display friend's email */}
        <span className="text-xl text-black block">{}</span>
        <div className="text-xl text-black flex gap-2">
          <span>Friends:</span>
          {selectedFriend.friends.map((friend, index) => (
            <div key={index}>
              <span>{friend.displayName}</span>
            </div>
          )) || "No friends"}
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-xl">Verses Learned:</h1>
          <div className="flex justify-center items-center gap-2">
            <span className="text-2xl">{selectedFriend.learnedVerses.length}</span>
            <FaTrophy className="h-6 w-6 text-orange-500" />
          </div>
        </div>
        <div className="border-2 mt-4">
          {selectedFriend.learnedVerses.map((verse, index) => (
            <div key={index} className=" flex justify-between items-center text-center w-full p-2 text-2xl">
              <span>{verse.id}</span>
              <span>{verse.translation}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default FriendProfile
