import { useUserContext } from "../utils/UserContext"
import { useNavigate } from "react-router"
import { Button } from "../comps/Button"

const Profile = () => {
  const { userData, logOut } = useUserContext()
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
            <span className="text-2xl">Home</span>
          </button>

          <div className="text-2xl text-center w-1/2">Profile</div>
          <button className="text-2xl w-1/4">Edit</button>
        </div>
        <div className="grid place-content-start gap-5 p-5 w-full">
          <div className="">
            <div className="text-3xl font-bold">{userData?.displayName}</div>
            <div className="text-black">{userData ? userData.displayName : ""}</div>
            <div className="text-lg">{userData?.email}</div>
          </div>

          <div className="">
            <span className="text-3xl font-bold">Friends</span>
            {userData.friends ? (
              userData?.friends.map((friend, index) => (
                <div key={index} className="text-black">
                  {friend.displayName}
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
