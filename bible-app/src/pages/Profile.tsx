import { useUserContext } from "../utils/UserContext"
import { useNavigate } from "react-router"
import { Button } from "../comps/Button"
import { HiChevronLeft } from "react-icons/Hi"

const Profile = () => {
  const { userData, userFriends, logOut } = useUserContext()
  const navigate = useNavigate()

  const handleLogOut = async () => {
    try {
      await logOut()
      navigate("/login")
      console.log("You are logged out. ")
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message)
      }
    }
  }

  return (
    <>
      <div className="h-screen w-full ">
        <div className=" flex justify-center items-center p-4">
          <button onClick={() => navigate("/")} className="w-1/4 flex justify-center items-center ">
            <HiChevronLeft className="text-4xl" /> <span className="text-2xl">Home</span>
          </button>

          <div className="text-2xl text-center w-1/2">Profile</div>
          <button className="text-2xl w-1/4">Edit</button>
        </div>
        <div className="grid place-content-start gap-5 p-5 w-full">
          <div className="">
            <div className="text-3xl font-bold">{userData?.data?.userName}</div>
            <div className="text-black">
              {userData ? (userData?.data?.firstName + " " + userData?.data?.lastName).toUpperCase() : ""}
            </div>
            <div className="text-lg">{userData?.data?.email}</div>
          </div>

          <div className="">
            <span className="text-3xl font-bold">Friends</span>
            {userFriends ? (
              userFriends.map((friend, index) => (
                <div key={index} className="text-black">
                  {friend.data.firstName} {friend.data.lastName}
                </div>
              ))
            ) : (
              <div className="text-black">You haven't added any friends.</div>
            )}
          </div>

          <Button variant={"glass3"} className="w-full border rounded-2xl" onClick={() => handleLogOut()}>
            Log out
          </Button>
        </div>
      </div>
    </>
  )
}
export default Profile
